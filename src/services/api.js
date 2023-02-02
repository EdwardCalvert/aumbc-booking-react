import axios from "axios";
import authenticationService from "./authentication.service";
import TokenService from "./token.service";

const instance = axios.create({
  baseURL: "https://localhost:7260/api",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    console.log(token);
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

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== "/auth/login" && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const rs = await instance.post("/auth/refresh-token", {

            accessToken : TokenService.getLocalAccessToken(),
            refreshToken: TokenService.getLocalRefreshToken(),
          });

          console.log("Proabably need more casting of types- email etc.")
          console.log(rs.data)
          const { accessToken } = rs.data;
          TokenService.saveApiTokenResponse(accessToken);
          authenticationService.currentUser.next(JSON.stringify(rs.data));

          return instance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default instance;