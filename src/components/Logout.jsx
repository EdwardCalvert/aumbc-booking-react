import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import authenticationService from "../services/authentication.service";

function Logout(){
    const navigate = useNavigate();
    useEffect(() => {
        authenticationService.logout();
        navigate("/",{replace:true});
      });
    return <p>You are being logged out </p>
}

export default Logout;