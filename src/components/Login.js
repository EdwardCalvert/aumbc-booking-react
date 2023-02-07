import authenticationService from "../services/authentication.service";
import React, { useState} from 'react'
import { useNavigate, Link } from "react-router-dom";




function Login(){
  function onChangeEmailAddress(e) {
    setEmail(e.target.value);
  }

  async function handleEmailProvided(e){
    e.preventDefault();
    setSendingOtp(true);
   await authenticationService.sendOtp(emailAddress).then( () => {setotpFailedToSend(false); setOtpSent(true);}
      ,()=>setotpFailedToSend(true));
      setSendingOtp(false);
    
  }

  function onChangeOtp(e) {
    setOtp( e.target.value);
    setOtpSent(false);
  }
  
  async function handleLogin(e) {
    if(e){
    e.preventDefault();
    }
    authenticationService.login(emailAddress, otp).then(
      user => {
        const queryString = window.location.href.split("?")[1];
        const urlParams = new URLSearchParams(queryString);
        if (urlParams.has('redirect')) {
          let redirect = decodeURI(urlParams.get('redirect'))
          console.log(redirect)
          if(redirect.startsWith("/")) // Assumed local redirect. 
          {
            navigate(redirect,{ replace: true });
          }
          else{
            navigate("/",{ replace: true });
          }
      
        }
        else{
          navigate("/login",{ replace:true });
        }
          
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

  async function handleRegister(event){
    event.preventDefault();
    setProcessingRegistration(true);
    await authenticationService.register(registrationFirstName,registerLastName,registerEmailAddress,registerNewsletterSubscribe).then(success =>{
      setRegistrationSubmitted(true);
      setEmail(registerEmailAddress);
      setOtpSent(true);
    }, 
    error => {
      console.log(error)
      setRegistrationSuccessful(false);
    })
    setProcessingRegistration(false);
  }
  
  
  
  const queryString = window.location.href.split("?")[1];
  const urlParams = new URLSearchParams(queryString);
  const defaultEmail = urlParams.has('email') ?  decodeURI(urlParams.get('email')) : "";
  const defaultOTP = urlParams.has('otp') ? decodeURI(urlParams.get('otp')) : "";

  let navigate = useNavigate();
  const [emailAddress, setEmail] = useState(defaultEmail);
  const [otp, setOtp] = useState(defaultOTP);
  const [otpFailedToSend, setotpFailedToSend] = useState(false);
  const [otpSent ,setOtpSent] = useState(false);
  const [errorWhileLoggingIn, setErrorWhileLoggingIn] = useState(false);
  const [processingRegistration, setProcessingRegistration] = useState(false);
  const [sendingOtp, setSendingOtp] = useState (false);
 
  ///Registration data
  const [registerEmailAddress, setReigisterEmailAddress] = useState("");
  const [registrationFirstName, setRegistrationFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerNewsletterSubscribe, setRegisterNewsletterSubscribe] = useState(false);
  const [registrationSubmited, setRegistrationSubmitted] = useState(false);
  const [registrationSuccessfull, setRegistrationSuccessful] = useState(true);

  if(urlParams.has('email') && urlParams.has('otp')){
    handleLogin();
  }
  return <React.Fragment>
    {!authenticationService.currentUserValue &&
      <React.Fragment> 
            <form className='mb-3' onSubmit={handleEmailProvided} >
            <h2>Login</h2>
                <div className="row mb-3">
                    <label className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-6">
                        <input type="email" className="form-control" id="inputEmail3" placeholder='gwen@livet.com' disabled={otpSent} value={emailAddress}
                onChange={onChangeEmailAddress} required/> 
                    </div>
                    <div className='col-sm-2'><button type="submit"  disabled={!(validEmail(emailAddress) && !otpSent)} className="btn btn-primary">Send OTP</button></div>
                    <label className='form-text offset-sm-2'>A one-time-passcode will be sent to your email address</label>
                </div>
                {sendingOtp&&
                <div>
                <h3>We're sending your OTP faster than royal mail...</h3>
               <div className="spinner-border"></div>
           </div>

                }
                {otpSent &&
                  <p className="alert alert-success">OTP sent to {emailAddress}</p>
                }
                {otpFailedToSend && 
                  <p className="alert alert-danger">Unable to send OTP to  {emailAddress}. You can only request a second token after 1 minute.</p>
                }
                </form>
                <form className='mb-3' onSubmit={handleLogin} >
                <div className="row mb-3">
                    <label  className="col-sm-2 col-form-label">OTP</label>
                    <div className="col-sm-6">
                        <input type="text" className="form-control" id="inputEmail3" placeholder='12345678'  disabled={!validEmail(emailAddress)} value={otp} onChange={onChangeOtp} required/>
                    </div>
                    <div className='col-sm-2'><button type="submit" disabled={!(otp.length >=6 && validEmail(emailAddress))} className="btn btn-primary">Login</button></div>
                </div>
                {errorWhileLoggingIn &&
                  <p class=" alert alert-danger">Error while logging in. Likely your emailAddress or OTP was incorrect. </p>
                }

                </form>
                {!registrationSubmited &&
                  <form className='mb-3' onSubmit={handleRegister}>
                  <h2>Register Account</h2>
                      <p>Registration is open for any member of UoA, RGU, NESCOL. </p>
                      <div  className="row mb-3">
                          <label className="col-sm-2 col-form-label">First Name</label>
                          <div className="col-sm-10 col-md-8 col-lg-6">
                              <input type="text" className="form-control" value={registrationFirstName} onChange={(e) => setRegistrationFirstName(e.target.value)} id="specificSizeInputName" placeholder="Gwen" minLength={2} required/>
                              <span className="validity"></span>
                          </div>
                      </div >
                      <div  className="row mb-3">
                          <label className="col-sm-2 col-form-label" >Last Name</label>
                          <div className="col-sm-10 col-md-8 col-lg-6">
                              <input type="text" className="form-control"value={registerLastName} onChange={(e)=> setRegisterLastName(e.target.value)} id="specificSizeInputName" placeholder="Livet" minLength={2} required/>
                              <span className="validity"></span>
                          </div>
                      </div >
                      <div className="row mb-3">
                      <label  className="col-sm-2 col-form-label">Email</label>
                      <div className="col-sm-10 col-md-8 col-lg-6">
                          <input type="email" className="form-control"  value={registerEmailAddress} onChange={(e) => setReigisterEmailAddress(e.target.value)} placeholder='gwen@livet.com' required/>
                          <p className='form-text'>Login codes & booking confirmations are sent to your email. </p>
                          <span className="validity"></span>
                      </div>
                      </div>
                      <div className="row mb-3">
                      <label  className="col-sm-2 col-form-label">Newsletter</label>
                      <div className="col-sm-10 col-md-8 col-lg-6">
                          <input type="checkbox" className="form-check-input" checked={registerNewsletterSubscribe} onChange={(e) => setRegisterNewsletterSubscribe(e.target.checked)} placeholder='gwen@livet.com' />
                          <label className='orm-check-label'>We'll send you a notification when a new ride created.</label>
                          <span className="validity"></span>
                      </div>
                      </div>
                      {processingRegistration && 
                        <div>
                        <h4>We're processing your request faster than you can blink.</h4>
                       <div className="spinner-border"></div>
                   </div>
                      }{!processingRegistration &&
                        <button type="submit"className="btn btn-primary offset-sm-2">Register account & send OTP</button>
                      }
                      
                      {!registrationSuccessfull && 
                        <p className="alert alert-danger">Couldn't save your details.- most likely an account already exists with the same email.</p>
                      }
                    
                  </form>
                }
                
            </React.Fragment>
    }
    { authenticationService.currentUserValue &&
    <div><h2>Hello, {authenticationService.currentUserValue.firstName} </h2>
    <p>You are now logged in as a {authenticationService.currentUserValue.role}.</p>
    
    <Link to={"/logout"} className="btn btn-primary">Logout</Link>
    </div>
      
    }
    
        
                </React.Fragment>

}

export default Login;