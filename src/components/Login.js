import authenticationService from "../services/authentication.service";
import React, { useState} from 'react'
import { useNavigate, Link } from "react-router-dom";
import RegtisterFormRow from "../_helpers/RegtisterFormRow";
import LoginFormRow from "../_helpers/LoginFormRow";



function Login(){
  function onChangeEmailAddress(e) {
    setEmail(e.target.value);
  }

  async function handleEmailProvided(e){
    e.preventDefault();
    setSendingOtp(true);
   await authenticationService.sendOtp(emailAddress).then( () => {setotpFailedToSend(false); setOtpSent(true); setRateLimitExceeded(false); setSendingOtp(false);}
      ,error=>{
      if(error.response.status === 429){
        setRateLimitExceeded(true);
        setotpFailedToSend(false);
      }
      else{
        setErrorMessage(error.response.data);
        setotpFailedToSend(true);
      }
      setSendingOtp(false);
    });
  }

  function onChangeOtp(e) {
    setOtp( e.target.value);
    setOtpSent(false);
  }
  
  async function handleLogin(e) {
    setProcessingLogin(true);
    if(e){
    e.preventDefault();
    }
    await authenticationService.login(emailAddress, otp).then(
      user => {
        const queryString = window.location.href.split("?")[1];
        const urlParams = new URLSearchParams(queryString);
        if (urlParams.has('redirect')) {
          let redirect = decodeURI(urlParams.get('redirect'))
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
  setProcessingLogin(false);
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
  const [sendingOtp, setSendingOtp] = useState (false);

  const [processingLogin, setProcessingLogin] = useState(false);

  const [attemptedAutomaticLogin,setAttemptedAutomaticLogin] = useState(false);
  const [errorWhileLoggingIn, setErrorWhileLoggingIn] = useState(false);
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
  const [errorMessage,setErrorMessage] = useState("");
  const [processingRegistration, setProcessingRegistration] = useState(false);

 
  ///Registration data
  const [registerEmailAddress, setReigisterEmailAddress] = useState("");
  const [registrationFirstName, setRegistrationFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerNewsletterSubscribe, setRegisterNewsletterSubscribe] = useState(false);
  const [registrationSubmited, setRegistrationSubmitted] = useState(false);
  const [registrationSuccessfull, setRegistrationSuccessful] = useState(true);

  if(urlParams.has('email') && urlParams.has('otp') && !attemptedAutomaticLogin){
    setAttemptedAutomaticLogin(true);
    handleLogin();
  }
  return <React.Fragment>
    {!authenticationService.currentUserValue &&
      <React.Fragment> 
            <form className='mb-3' onSubmit={handleEmailProvided} >
            <h2>Login</h2>
            <LoginFormRow label="Email">
             <div className="col-sm-6">
                        <input type="email" className="form-control" id="inputEmail3" placeholder='gwen@livet.com' disabled={otpSent} value={emailAddress}
                onChange={onChangeEmailAddress} required/> 
                    </div>
                    <div className='col-sm-2'><button type="submit"  disabled={!(validEmail(emailAddress) && !otpSent && !sendingOtp)} className="btn btn-primary">
                    <span class={sendingOtp? "spinner-border spinner-border-sm" :""} role="status" aria-hidden="true"></span>Send OTP</button></div>
                    <label className='form-text offset-sm-2'>A one-time-passcode will be sent to your email address</label>
            </LoginFormRow>
                {otpSent &&
                  <p className="alert alert-success">OTP sent to {emailAddress}</p>
                }
                {rateLimitExceeded &&
                    <p className="alert alert-warning">You must wait 1 minute before requesting another OTP. In the meantime, please check your spam folder!</p>
                }
                {otpFailedToSend && 
                  <p className="alert alert-danger">{errorMessage}</p>
                }
                </form>
                <form className='mb-3' onSubmit={handleLogin} >
                  <LoginFormRow label="OTP">
                  <div className="col-sm-6">
                        <input type="text" className="form-control" id="inputEmail3" placeholder='12345678'  disabled={!validEmail(emailAddress)} value={otp} onChange={onChangeOtp} required/>
                    </div>
                    <div className='col-sm-2'><button type="submit" disabled={!(otp.length >=6 && validEmail(emailAddress) && !processingLogin) } className="btn btn-primary">
                    <span class={processingLogin? "spinner-border spinner-border-sm" :""} role="status" aria-hidden="true"></span>Login</button></div>
                  </LoginFormRow>
                
                {errorWhileLoggingIn &&
                  <p className=" alert alert-danger">Error while logging in. Likely your emailAddress or OTP was incorrect. </p>
                }

                </form>
                {!registrationSubmited &&
                  <form className='mb-3' onSubmit={handleRegister}>
                  <h2>Register Account</h2>
                      <p>Registration is open for any member of UoA, RGU, NESCOL. </p>
                      <RegtisterFormRow label="First Name">
                      <input type="text" className="form-control" value={registrationFirstName} onChange={(e) => setRegistrationFirstName(e.target.value)} id="specificSizeInputName" placeholder="Gwen" minLength={2} required/>
                              <span className="validity"></span>
                      </RegtisterFormRow>
                      <RegtisterFormRow label="Last Name">
                        <input type="text" className="form-control"value={registerLastName} onChange={(e)=> setRegisterLastName(e.target.value)} id="specificSizeInputName" placeholder="Livet" minLength={2} required/>
                              <span className="validity"></span>
                      </RegtisterFormRow>
                      <RegtisterFormRow label="Email">
                      <input type="email" className="form-control"  value={registerEmailAddress} onChange={(e) => setReigisterEmailAddress(e.target.value)} placeholder='gwen@livet.com' required/>
                          <p className='form-text'>Login codes & booking confirmations are sent to your email. </p>
                          <span className="validity"></span>
                      </RegtisterFormRow>
                      <RegtisterFormRow label="Newsletter">
                        <input type="checkbox" className="form-check-input" checked={registerNewsletterSubscribe} onChange={(e) => setRegisterNewsletterSubscribe(e.target.checked)} placeholder='gwen@livet.com' />
                          <label className='orm-check-label'>We'll send you a notification when a new ride created.</label>
                          <span className="validity"></span>
                      </RegtisterFormRow>

                      <button type="submit"className="btn btn-primary offset-sm-2"> 
                      <span class={processingRegistration? "spinner-border spinner-border-sm" :""} role="status" aria-hidden="true" disabled={processingRegistration}></span>
                      Register account & send OTP</button>
                      
                      
                      {!registrationSuccessfull && 
                        <p className="alert alert-danger">Couldn't save your details.- most likely an account already exists with the same email.</p>
                      }
                    
                  </form>
                }
                
            </React.Fragment>
    }
    { authenticationService.currentUserValue &&
    <div><h2>Hello, {authenticationService.currentUserValue.firstName}  {authenticationService.currentUserValue.lastName} </h2>
    <p>You are now logged in as a {authenticationService.currentUserValue.role}.</p>
    
    <Link to={"/logout"} className="btn btn-primary">Logout</Link>
    </div>
      
    }
    
        
                </React.Fragment>

}

export default Login;