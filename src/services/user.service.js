import axios from 'axios';  
import AuthService from './AuthService';

const API_URL = 'https://localhost:7260/api/';


function client(endpoint, {body, ...customConfig} = {}) {
    const headers = {'content-type': 'application/json'}
    // if (AuthService.isUserAuthenticated()) {
    //   headers.Authorization = `Bearer ${AuthService.getBearerToken()}`
    // }
    const config = {
      method: 'GET',
      ...customConfig,
      headers: {
        ...headers,
        ...customConfig.headers,
      },
    }
    if (body) {
      config.body = JSON.stringify(body)
    }
  
    return window
      .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config)
      .then(async response => {
        // if (response.status === 401) {
        //   logout()
        //   window.location.assign(window.location)
        //   return
        // }
        if (response.ok) {
          return await response.json()
        } else {
          const errorMessage = await response.text()
          return Promise.reject(new Error(errorMessage))
        }
      })
  }
  
class UserService {



    
   getEvents(eventId ) {

    const headers = {'Content-Type': 'application/json'}
  const config = {
    // method: body ? 'POST' : 'GET',
    // ...customConfig,
    headers: {
      ...headers,
    //   ...customConfig.headers,
    },
  }
//   if (body) {
//     config.body = JSON.stringify(body)
//   }

  return window
    .fetch(`${process.env.API_URL}/MtbEvent/get` + new URLSearchParams( {eventId : eventId}), config)
    .then(async response => {
        console.log(await response.json())
      if (response.ok) {
        return await response.json()
      } else {
        const errorMessage = await response.text()
        return Promise.reject(new Error(errorMessage))
      }
    })
    const data  = {}
    return fetch(API_URL + 'MtbEvent/get',{params:{
        eventId
    }}).then(response => response.json())

  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: AuthService.getBearerToken() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: AuthService.getBearerToken() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: AuthService.getBearerToken() });
  }
}

// export default new UserService();
export default client;