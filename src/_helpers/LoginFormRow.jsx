const LoginFormRow = (props)=> { return  <div className="row mb-3">
<label className="col-sm-2 col-form-label">{props.label}</label>

   {props.children}
</div>} 

export default LoginFormRow;