import React from "react";
import { Button } from "react-bootstrap";
import {useState, useEffect} from 'react';

function CopyWhat3Words({what3Words}){
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
          setClicked(false);
        }, 1000);
        return () => clearTimeout(timer);
      }, [clicked]);

    return  <Button className='btn btn-primary ml-3 mt-3' disabled={clicked} onClick={() => {navigator.clipboard.writeText("///"+what3Words); setClicked(true)}}> {clicked? "Copied to clipboard!" :"Copy What3Words" }</Button> }
    
export default CopyWhat3Words;