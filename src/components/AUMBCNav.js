import { Component } from "react"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import AUMBCPhoto from "./AUMBCPhoto";
import { Link } from "react-router-dom";

class AUMBCNav extends Component{
    render(){
return (
<Navbar bg="white" expand="lg">
      <Container>
      <Navbar.Brand><AUMBCPhoto size="100vh" className="d-inline-block align-top"/></Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="container d-flex">
          <Link to="/events" className="nav-link">Events</Link>
            <Link to="/login" className="nav-link">My Account</Link>
            
           
            
            
             <Nav.Link  className='ms-auto' href="https://www.instagram.com/uoa_mountainbiking" target="_blank"><i className="bi bi-instagram"></i></Nav.Link> 
            <Link to="/login" className="nav-item btn btn-primary">Login</Link>
            {/* <button type="button" className=" nav-item btn btn-primary">Invoices <span className="badge text-bg-secondary">4</span></button> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>)
}
}

export default AUMBCNav