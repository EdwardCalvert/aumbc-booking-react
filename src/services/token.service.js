import authenticationService from "./authentication.service";
import api from "./api";
class TokenService {
    getLocalRefreshToken() {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.refreshToken;
    }
  
    getLocalAccessToken() {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.accessToken;
    }

  
    getApiTokenResponse() {
      return JSON.parse(localStorage.getItem("user"));
    }
  
    saveApiTokenResponse(user) {
      authenticationService.updateToken(JSON.stringify(user));
      localStorage.setItem("user", JSON.stringify(user));
    }

   async updateRefreshToken(){
      await api.post("/auth/refresh-token", {
        accessToken : this.getLocalAccessToken(),
        refreshToken: this.getLocalRefreshToken()
      }).then(success =>{
        this.saveApiTokenResponse(success.data)
      } )
    }
  
    removeUser() {
      localStorage.removeItem("user");
    }
  }
  
  export default new TokenService();