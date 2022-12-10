import React, {Component} from 'react'

class RegisterAccount extends Component{
     render(){
        return <form className='mb-3'>
            <h2>Register Account</h2>
                
                <div  className="row mb-3">
                    <label className="col-sm-2 col-form-label" for="specificSizeInputName">First Name</label>
                    <div className="col-sm-10 col-md-8 col-lg-6">
                        <input type="text" className="form-control" id="specificSizeInputName" placeholder="Gwen"/>
                    </div>
                </div >
                <div  className="row mb-3">
                    <label className="col-sm-2 col-form-label" for="specificSizeInputName">Last Name</label>
                    <div className="col-sm-10 col-md-8 col-lg-6">
                        <input type="text" className="form-control" id="specificSizeInputName" placeholder="Livet"/>
                    </div>
                </div >
                <div className="row mb-3">
                <label for="inputEmail3" className="col-sm-2 col-form-label">Email</label>
                <div className="col-sm-10 col-md-8 col-lg-6">
                    <input type="email" className="form-control" id="inputEmail3" placeholder='gwen@livet.com'/>
                    <p className='form-text'>Login codes & booking confirmations are sent to your email. </p>
                </div>
                </div>
                <div className="row ">
                
                </div>
            
                <button type="submit" className="btn btn-primary offset-sm-2">Register account</button>
            </form>
    }
}

export default RegisterAccount
