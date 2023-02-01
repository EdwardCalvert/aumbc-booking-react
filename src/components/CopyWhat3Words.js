import React from "react";
import { Button } from "react-bootstrap";

function CopyWhat3Words({what3Words}){
    console.log(what3Words)
    return  <Button className='btn btn-primary ml-3 mt-3' onClick={() => {navigator.clipboard.writeText(what3Words)}}>Copy What3Words </Button> }
    
export default CopyWhat3Words;