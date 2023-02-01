import axios from "axios";
import { BehaviorSubject } from 'rxjs';
import api from "./api";
import tokenService from "./token.service";

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')));

export const authenticationService = {
    login,
    logout,
    register,
    sendOtp,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return JSON.parse(currentUserSubject.value) }
};

function sendOtp(emailAddress){
  return api.get("auth/sendOTP", {
  params :{emailAddress}});
}
function login(email, otp) {
  return api
    .post("/auth/login", {
      email,
      otp
    })
    .then(response => {
      if (response.data.accessToken) {
        const data = JSON.stringify(response.data);
        tokenService.saveApiTokenResponse(data);
        console.log(response.data)
        currentUserSubject.next(response.data);
            }
      return response.data;
    });
}


function logout() {
  tokenService.removeUser();
  currentUserSubject.next(null);
}

function register(firstName, lastName, emailAddress) {
return api.post( "auth/register", {
  firstName, lastName, emailAddress
});
}

export default authenticationService;
