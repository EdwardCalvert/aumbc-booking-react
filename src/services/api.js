import axios from "axios";
import authenticationService from "./authentication.service";
import { useNavigate } from "react-router-dom";
import TokenService from "./token.service";
 ///https://aumbc-api-server-v2-production.up.railway.app/api/
 //https://localhost:7260/api
const instance = axios.create({
  baseURL: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')? "https://localhost:7260/api":  "https://aumbc-api-server-v2-production.up.railway.app/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
      //config.headers["x-access-token"] = token; // for Node.js Express back-end
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
 let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    if(error){
      authenticationService.logout();
    }

    failedQueue = [];
};

instance.interceptors.response.use(
  async (res) => {
    return res;
  },
   async (err) => {
    const originalRequest = err.config;
   if (err.response.status === 401 && !originalRequest._retry) {
       if (isRefreshing) {
           return new Promise(function(resolve, reject) {
               failedQueue.push({ resolve, reject });
           })
               .then(() => {
                   originalRequest.headers['Authorization'] = 'Bearer ' + TokenService.getLocalAccessToken();
                   return axios(originalRequest);
               })
               .catch(err => {
                   return Promise.reject(err);
               });
       }

       originalRequest._retry = true;
       isRefreshing = true;

       return new Promise(function(resolve, reject) {
            TokenService.updateRefreshToken()
               .then(() => {
                   axios.defaults.headers.common['Authorization'] = 'Bearer ' + TokenService.getLocalAccessToken();
                   originalRequest.headers['Authorization'] = 'Bearer ' + TokenService.getLocalAccessToken();
                   processQueue(null,);
                   resolve(axios(originalRequest));
               })
               .catch(err => {
                   processQueue(err, null);
                  //  store.dispatch(showMessage({ message: 'Expired Token' }));
                  console.log("STUPIIDD - failure")

                   reject(err);
               })
               .then(() => {
                   isRefreshing = false;
               });
       });
   }

   return Promise.reject(err);
} 


);

export default instance;