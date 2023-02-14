import React, { useState } from "react"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import AUMBCPhoto from "./AUMBCPhoto";
import { Link } from "react-router-dom";
import authenticationService from "../services/authentication.service";


function AUMBCNav (){
  const [expanded, setExpanded] = useState(false);
return (<Navbar bg="white" expand="lg" expanded={expanded}>
      <Container>
      <Navbar.Brand> <Link to="/" ><AUMBCPhoto size="100vh" className="d-inline-block align-top"/></Link></Navbar.Brand>
        <Navbar.Toggle onClick={() => setExpanded(expanded ? false : "expanded")}  aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="container d-flex">
          <Link onClick={() => setExpanded(false)} to="/" className="nav-link">Events</Link>
          <Link onClick={() => setExpanded(false)} to="/my-account" className="nav-link">My rides</Link>
          <Link onClick={() => setExpanded(false)} to="/email-settings" className="nav-link">Newsletter preference</Link>
          <LoginLogout onClick={() => setExpanded(false)}/>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>)

}

function LoginLogout({onClick}){
  if(!authenticationService.currentUserValue )
  {
    return<Link to="/login" className="ms-auto nav-item btn btn-primary" onClick={onClick}>Login</Link>
  }
  else{
    return<React.Fragment> <div className="ms-auto nav-link">Hello, {authenticationService.currentUserValue.firstName}!</div> <Link to="/logout" onClick={onClick} className="nav-item btn btn-primary">Logout</Link></React.Fragment>
  }
}

export default AUMBCNav