import axios from "axios";

const API_URL = "https://localhost:7260/auth/";
const tokenKey = "user";

class AuthService {

    constructor(){
        var token = window.localStorage.getItem(tokenKey);
        if (token) {
            token = JSON.parse(window.localStorage.getItem(tokenKey));
        }

        setInterval(
            () => this.checkTokenExpiry(this)
            , 60000
        );
    }
    async sendOtp(emailAddress){
        return await axios
      .get(API_URL + "sendOTP", {
        params :{emailAddress}
      });
    }
  async login(email, otp) {
    const response = await axios
          .post(API_URL + "login", {
              email,
              otp
          });

      if (response.data.accessToken) {
          localStorage.setItem(tokenKey, JSON.stringify(response.data));


         
      }
      return response.data;
  }

  logout() {
    localStorage.removeItem(tokenKey);
  }

  register(firstName, lastName, emailAddress) {
    return axios.post(API_URL + "signup", {
        firstName, lastName, emailAddress
    });
  }

  async checkTokenExpiry(_this) {
    if (!_this) {
        _this = this;
    }

        let  token = JSON.parse(localStorage.getItem(tokenKey));
        console.log(token.accessTokenExpiry)
        let expired = token.accessTokenExpiry < (Date.now() - 1000 * 60 * 5) / 1000;
        console.log(`The token has expired:  ${expired}  `)
        const refreshToken = token.refreshToken;
        const accessToken = token.accessToken;
        if (expired) {
           const response =  await axios.post(API_URL + "refresh-token", {
            accessToken,
            refreshToken
            });

            if (response.data.accessToken) {
                localStorage.setItem(tokenKey, JSON.stringify(response.data));
      
      
                
            }
            return response.data;
        
    }
    return Promise.resolve();
}

  getCurrentUserEmail() {
    return JSON.parse(localStorage.getItem(tokenKey).emailAddress);;
  }

  isUserAuthenticated(){
    return localStorage.getItem(tokenKey);
  }

  getCurrentUserAuthLevel(){
    return JSON.parse(localStorage.getItem(tokenKey).role)
  }
  getBearerToken(){
    return JSON.parse(localStorage.getItem(tokenKey).accessToken)
  }
}

export default new AuthService();