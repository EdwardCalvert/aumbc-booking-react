import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../services/AuthService";
import { isEmail } from "validator";
import React, {Component} from 'react'

const required = value => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          This field is required!
        </div>
      );
    }
  };
  
  const email = value => {
    if (!isEmail(value)) {
      return (
        <div className="alert alert-danger" role="alert">
          This is not a valid email.
        </div>
      );
    }
  };


class Login extends Component{
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleEmailProvided = this.handleEmailProvided.bind(this);
        this.onChangeEmailAddress = this.onChangeEmailAddress.bind(this);
        this.onChangeOtp = this.onChangeOtp.bind(this);
    
        this.state = {
          emailAddress: "",
          otp: "",
          loading: false,
          message: ""
        };
      }

      
  onChangeEmailAddress(e) {
    this.setState({
      emailAddress: e.target.value
    });
  }

  onChangeOtp(e) {
    this.setState({
      otp: e.target.value
    });
  }

  handleEmailProvided(e){
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    AuthService.sendOtp(this.state.emailAddress);

  }

  handleLogin(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });


    AuthService.login(this.state.emailAddress, this.state.otp).then(
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            loading: false,
            message: resMessage
          });
        }
      );
  }



     render(){
        return <React.Fragment>
            <form className='mb-3' onSubmit={this.handleEmailProvided} >
            <h2>Login</h2>
                <div className="row mb-3">
                    <label for="inputEmail3" className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-6">
                        <input type="email" className="form-control" id="inputEmail3" placeholder='gwen@livet.com' value={this.state.emailAddress}
                onChange={this.onChangeEmailAddress}/> 
                    </div>
                    <div className='col-sm-2'><button type="submit" className="btn btn-primary">Send OTP</button></div>
                    <label className='form-text offset-sm-2'>A one-time-passcode will be sent to your email address</label>
                </div>
                </form>
                <form className='mb-3' onSubmit={this.handleLogin} >
                <div className="row mb-3">
                    <label for="inputEmail3" className="col-sm-2 col-form-label">OTP</label>
                    <div className="col-sm-6">
                        <input type="number" className="form-control" id="inputEmail3" placeholder='12345678' value={this.state.otp} onChange={this.onChangeOtp}/>
                    </div>
                    <div className='col-sm-2'><button type="submit" className="btn btn-primary">Login</button></div>
                    

                </div>
                </form>
                </React.Fragment>
            
                
           
    }
}

export default Login
