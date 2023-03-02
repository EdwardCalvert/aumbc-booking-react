import { BehaviorSubject } from 'rxjs';
import api from "./api";
import tokenService from "./token.service";

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')));

export const authenticationService = {
    login,
    logout,
    register,
    sendOtp,
    updateToken,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return tokenService.getApiTokenResponse() }
};

function sendOtp(emailAddress){
  return api.get("auth/sendOTP", {
  params :{emailAddress}});
}
async function login(email, otp) {
  return  await api
    .post("/auth/login", {
      email,
      otp
    })
    .then(response => {
      if (response.data.accessToken) {
        const data = response.data;
        tokenService.saveApiTokenResponse(data);
       
        currentUserSubject.next(data);
            }
      return response.data;
    });
}

function updateToken(token){
  currentUserSubject.next(token);
}


function logout() {
  tokenService.removeUser();
  currentUserSubject.next(null);
}

function register(firstName, lastName, emailAddress, notifyNewEvents) {
return api.post( "auth/register", {
 firstName:  firstName, lastName: lastName, emailAddress: emailAddress, notifyNewEvents  :notifyNewEvents
});
}

export default authenticationService;
