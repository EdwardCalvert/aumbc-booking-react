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
import RequireAuth from './components/RequireAuth';
import Logout from './components/Logout';
import EditEventPage from './components/EditEventPage';
import CreateNewEventPage from './components/CreateNewEventPage';
import RidesAttendedPage from './components/RidesAttendedPage';
import UserManagementPage from './components/UserManagementPage';
import PeopleAttendingRidePage from './components/EventAcceptanceRow';
import ScrollToTop from './_helpers/ScrollToTop';
import { TreasurerPage } from './components/TreasurerPage';

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
        <ScrollToTop />
        <div className='m-2'>
          <div className='alert alert-warning text-center'>The site is in Beta, please let us know of any issues <a href='https://github.com/EdwardCalvert/aumbc-booking-react/issues/new' target="_blank"> here</a></div>
          <Navbar/>
          <div className='container div-body'>
            <Routes>
              <Route path="/login" element={<Login/>}/>
              <Route path="/event/:id" element={<RequireAuth><EventDetails/></RequireAuth>}/>
              <Route path="/event/edit/:id" element={<RequireAuth role={Role.Admin}><EditEventPage/></RequireAuth>}/>
              <Route path="/event/riders/:id" element={<RequireAuth role={Role.Admin}><PeopleAttendingRidePage/></RequireAuth>}/>
              <Route path="/" element={<RequireAuth><EventList /></RequireAuth>}/>
              <Route path="/my-account" element={<RequireAuth><RidesAttendedPage /></RequireAuth>}/>
              <Route path="/logout" element={<Logout/>}/>

              {/* Admin related components */}
              <Route path="/admin/manage" element={<UserManagementPage/>}></Route>
              <Route path="/admin/new-event/" element={<RequireAuth roles={Role.Admin}><CreateNewEventPage/></RequireAuth>}/>
              <Route path="/admin/treasurer/" element={<RequireAuth roles={Role.Admin}><TreasurerPage/></RequireAuth>}/>
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
