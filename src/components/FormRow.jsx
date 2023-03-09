const FormRow = (props) => {
    return   <div className="row mb-3 gx-3 gy-2">
    <label className="col-sm-2">{props.label}</label>
    <div className="col-sm-10">
       {props.children}
    </div>
</div>
}

export default FormRow;