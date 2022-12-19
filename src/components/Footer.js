import { Component } from "react";
import Navbar from "./AUMBCNav";
import { Link } from "react-router-dom";

class Footer extends Component{
    render(){
        return (
            <div className="container">
  <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
    <div className="col-md-4 d-flex align-items-center">
      <span className="mb-3 mb-md-0 text-muted">©AUMBC</span>
    </div>

    <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
      <li className="ms-3"><Link className="text-muted" to="/admin/newEvent">Admin</Link></li>
      <li className="ms-3"><a className="text-muted" href="https://github.com/EdwardCalvert/aumbc-booking-react">Source</a></li>
      <li className="ms-3"><a className="text-muted" href="#"></a></li>
    </ul>
  </footer>
</div>
        )
    }
}

export default Footer