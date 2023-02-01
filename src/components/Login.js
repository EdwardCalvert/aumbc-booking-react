import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import authenticationService from "../services/authentication.service";
import { isEmail } from "validator";
import React, {Component, useState} from 'react'
import { Navigate, useNavigate } from "react-router-dom";




function Login(){
  function onChangeEmailAddress(e) {
    setEmail(e.target.value);
  }

  function handleEmailProvided(e){
    e.preventDefault();
    authenticationService.sendOtp(emailAddress).then( () => {setotpFailedToSend(false); setOtpSent(true);}
      ,()=>setotpFailedToSend(true));
    
  }

  function onChangeOtp(e) {
    setOtp( e.target.value);
    setOtpSent(false);
  }
  
  async function handleLogin(e) {
    e.preventDefault();
    authenticationService.login(emailAddress, otp).then(
      user => {
          navigate("/",{ replace: true });
      },
      error => {
       setErrorWhileLoggingIn(true);
      }
  );
  }
  
  function validEmail(email){
    var re = /\S+@\S+\.\S+/;
  return re.test(email);
  }

  let navigate = useNavigate();
  const [emailAddress, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpFailedToSend, setotpFailedToSend] = useState(false);
  const [otpSent ,setOtpSent] = useState(false);
  const [errorWhileLoggingIn, setErrorWhileLoggingIn] = useState(false);
          // registerEmailAddress : "",
          // registerFirstName : "",
          // registerLastName: "",
          // registerNewEventNotifcations : false,
          // errorWhileLo
  
  return <React.Fragment>
    {!authenticationService.currentUserValue &&
      <React.Fragment> 
      <h2>You will need to login to veiw this page</h2>
        <p>To protect the privacy of our members, you will have to login to view events & book onto rides. You also need administrative privallages to edit & create events.  We have a very easy to use login system and will only send emails about events you've signed up to, and our optional new event notifier.  </p>
            <form className='mb-3' onSubmit={handleEmailProvided} >
            <h2>Login</h2>
                <div className="row mb-3">
                    <label className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-6">
                        <input type="email" className="form-control" id="inputEmail3" placeholder='gwen@livet.com' disabled={otpSent} value={emailAddress}
                onChange={onChangeEmailAddress}/> 
                    </div>
                    <div className='col-sm-2'><button type="submit"  disabled={!(validEmail(emailAddress) && !otpSent)} className="btn btn-primary">Send OTP</button></div>
                    <label className='form-text offset-sm-2'>A one-time-passcode will be sent to your email address</label>
                </div>
                {otpSent &&
                  <p className="alert alert-success">OTP sent to {emailAddress}</p>
                }
                {otpFailedToSend && 
                  <p className="alert alert-danger">Unable to send OTP to  {emailAddress}- likely our API server is down! Oops! Do drop us a message in the group chat if the error persists. </p>
                }
                </form>
                <form className='mb-3' onSubmit={handleLogin} >
                <div className="row mb-3">
                    <label  className="col-sm-2 col-form-label">OTP</label>
                    <div className="col-sm-6">
                        <input type="number" className="form-control" id="inputEmail3" placeholder='12345678'  disabled={!validEmail(emailAddress)} value={otp} onChange={onChangeOtp}/>
                    </div>
                    <div className='col-sm-2'><button type="submit" disabled={!(otp.length >=6 && validEmail(emailAddress))} className="btn btn-primary">Login</button></div>
                </div>
                {errorWhileLoggingIn &&
                  <p class=" alert alert-danger">Error while logging in. Likely your emailAddress or OTP was incorrect. </p>
                }

                </form>
                {/* <form className='mb-3'>
            <h2>Register Account</h2>
                <p>Registration is open for any member of UoA, RGU, NESCOL ..... </p>
                <div  className="row mb-3">
                    <label className="col-sm-2 col-form-label">First Name</label>
                    <div className="col-sm-10 col-md-8 col-lg-6">
                        <input type="text" className="form-control" id="specificSizeInputName" placeholder="Gwen"/>
                    </div>
                </div >
                <div  className="row mb-3">
                    <label className="col-sm-2 col-form-label" >Last Name</label>
                    <div className="col-sm-10 col-md-8 col-lg-6">
                        <input type="text" className="form-control" id="specificSizeInputName" placeholder="Livet"/>
                    </div>
                </div >
                <div className="row mb-3">
                <label  className="col-sm-2 col-form-label">Email</label>
                <div className="col-sm-10 col-md-8 col-lg-6">
                    <input type="email" className="form-control" id="inputEmail3" placeholder='gwen@livet.com'/>
                    <p className='form-text'>Login codes & booking confirmations are sent to your email. </p>
                </div>
                </div>
                <div className="row ">
                </div>
                <button type="submit" disabled={!(this.validEmail(this.state.registerEmailAddress) && this.state.registerFirstName.length > 0 && this.state.registerLastName.length > 0  )} className="btn btn-primary offset-sm-2">Register account</button>
            </form> */}
            </React.Fragment>
    }
    { authenticationService.currentUserValue &&
    <div><h2>You are already logged in. </h2>
    <p>You may have been redirected here as you don't have sufficient access rights to view a resource. </p>
    <p>You have access rights of: {authenticationService.currentUserValue.role}</p>
    <p>Your email is: {authenticationService.currentUserValue.emailAddress}</p>
    <p>Your access token will expire: {authenticationService.currentUserValue.accessTokenExpiry}</p>
    </div>
      
    }
    
        
                </React.Fragment>

}

export default Login;