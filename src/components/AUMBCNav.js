import React, { useState } from "react"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import AUMBCPhoto from "./AUMBCPhoto";
import { Link } from "react-router-dom";
import authenticationService from "../services/authentication.service";
import Role from "../_helpers/role";
import { NavDropdown } from "react-bootstrap";

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
          <AdminControls onClick={() => setExpanded(false)}/>
          <LoginLogout onClick={() => setExpanded(false)}/>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>)

}

function AdminControls({onClick}){
  const currentUser = authenticationService.currentUserValue
  if( currentUser && currentUser.role.indexOf(Role.Admin) !== -1){
    return <React.Fragment> 
       <NavDropdown title="Admin Controls" id="basic-nav-dropdown"> 
       <NavDropdown.Item  onClick={onClick} href="/#/admin/new-event" className="dropdown-item">New event</NavDropdown.Item>
       <NavDropdown.Item  onClick={onClick} href="/#/admin/unpaid-drivers" className="dropdown-item">Outstanding pay-outs</NavDropdown.Item>
       <NavDropdown.Item onClick={onClick} href="/#/admin/paid-drivers" className="dropdown-item">Receipts for pay-outs</NavDropdown.Item>
       <NavDropdown.Item onClick={onClick} href="/#/admin/list-events" className="dropdown-item">Rides this semester</NavDropdown.Item>
       <NavDropdown.Item  onClick={onClick} href="/#/admin/manage" className="dropdown-item" >Manage users</NavDropdown.Item>
            </NavDropdown>
    </React.Fragment>
  }
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