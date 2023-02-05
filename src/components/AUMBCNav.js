import React, { Component } from "react"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import AUMBCPhoto from "./AUMBCPhoto";
import { Link } from "react-router-dom";
import authenticationService from "../services/authentication.service";
import { NavItem } from "react-bootstrap";

class AUMBCNav extends Component{
    render(){
return (
<Navbar bg="white" expand="lg">
      <Container>
      <Navbar.Brand> <Link to="/" ><AUMBCPhoto size="100vh" className="d-inline-block align-top"/></Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="container d-flex">
          <Link to="/" className="nav-link">Events</Link>
          <Link to="/my-account" className="nav-link">My rides</Link>
          <Link to="/email-settings" className="nav-link">Newsletter preference</Link>
          {/* <Nav.Link   href="https://www.instagram.com/uoa_mountainbiking" target="_blank"><i className="bi bi-instagram"></i></Nav.Link> */}
          <LoginLogout/>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>)
}
}

function LoginLogout(){
  if(!authenticationService.currentUserValue )
  {
    return<Link to="/login" className="ms-auto nav-item btn btn-primary">Login</Link>
  }
  else{
    return<React.Fragment> <div className="ms-auto nav-link">Hello, {authenticationService.currentUserValue.firstName}!</div> <Link to="/logout" className="nav-item btn btn-primary">Logout</Link></React.Fragment>
  }
}

export default AUMBCNav