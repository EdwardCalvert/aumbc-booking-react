const RegtisterFormRow = (props) => {return <div className="row mb-3">
<label className="col-sm-2 col-form-label">{props.label}</label>
<div className="col-sm-10 col-md-8 col-lg-6">
   {props.children}
   </div>
</div>}

export default RegtisterFormRow