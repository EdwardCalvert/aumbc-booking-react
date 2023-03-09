const LoadingSpinner =  (props)=>{ 
    if(props.show ){
    return <div>
    <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
    </div>
</div>
<p>{props.children}</p>
</div>}}

export default LoadingSpinner