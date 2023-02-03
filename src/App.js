import './App.css';
import EventList from './components/EventList';
import Navbar from './components/AUMBCNav';
import Footer from './components/Footer';
import { authenticationService } from './services/authentication.service'
import {  Role } from './_helpers/role';
import Login from './components/Login'
import EventDetails from './components/EventDetails';
import { HashRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import DriverPayouts from './components/DriverPayouts';
import RequireAuth from './components/RequireAuth';
import Logout from './components/Logout';
import CreateNewEvent from './components/CreateNewEvent';
import AdminHomePage from './components/AdminHomePage';


class App extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          currentUser: null,
          isAdmin: false
      };
  }

  componentDidMount() {
      authenticationService.currentUser.subscribe(x => this.setState({
          currentUser: x,
          isAdmin: x && x.role === Role.Admin
      }));
  }

  logout() {
      authenticationService.logout();
  }

  render() {
    return (
      <HashRouter >
        <div className='m-2'>
          <Navbar/>
          <div className='container'>
            <Routes>
              <Route path="/login" element={<Login/>}/>
              <Route path="/event/:id" element={<RequireAuth><EventDetails/></RequireAuth>}/>
              <Route path="/" element={<RequireAuth><EventList /></RequireAuth>}/>
              <Route path="/logout" element={<Logout/>}/>
              <Route path="/admin" element={<RequireAuth roles={Role.Admin}><AdminHomePage/></RequireAuth>}/>
              <Route path="/admin/new-event/" element={<RequireAuth roles={Role.Admin}><CreateNewEvent/></RequireAuth>}/>
              <Route path="*" element={<p> There is nothing at this page</p>}/>
          </Routes>
          <Footer/>
        </div>
      </div>
      </HashRouter>
      
    );
  }
}

export default App;
