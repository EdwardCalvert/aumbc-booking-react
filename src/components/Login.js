import React, {Component} from 'react'

class Login extends Component{

    constructor(props){
        super(props)
        this.state = {

        }
    }
     render(){
        return <form className='mb-3'>
            <h2>Login</h2>
                <div className="row mb-3">
                    <label for="inputEmail3" className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-6">
                        <input type="email" className="form-control" id="inputEmail3" placeholder='gwen@livet.com'/>
                    </div>
                    <div className='col-sm-2'><button type="button" className="btn btn-primary">Send OTP</button></div>
                    <label className='form-text offset-sm-2'>A one-time-passcode will be sent to your email address</label>
                    

                </div>
                <div className="row mb-3">
                    <label for="inputEmail3" className="col-sm-2 col-form-label">OTP</label>
                    <div className="col-sm-6">
                        <input type="email" className="form-control" id="inputEmail3" placeholder='12345678'/>
                    </div>
                    <div className='col-sm-2'><button type="button" className="btn btn-primary">Login</button></div>
                    

                </div>
            
                
            </form>
    }
}

export default Login
