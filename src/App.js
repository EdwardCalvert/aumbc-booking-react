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
import AdminHomePage from './components/AdminHomePage';
import EditEventPage from './components/EditEventPage';
import NewsletterPage from './components/NewsletterPage';
import UnpaidDriversPage from './components/UnpaidDriversPage';
import CreateNewEventPage from './components/CreateNewEventPage';
import RidesAttendedPage from './components/RidesAttendedPage';
import AdminManagementPage from './components/AdminManagementPage';
import PeopleAttendingRidePage from './components/PeopleAttendingRidePage';


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
              <Route path="/event/edit/:id" element={<RequireAuth role={Role.Admin}><EditEventPage/></RequireAuth>}/>
              <Route path="/event/riders/:id" element={<RequireAuth role={Role.Admin}><PeopleAttendingRidePage/></RequireAuth>}/>
              <Route path="/" element={<RequireAuth><EventList /></RequireAuth>}/>
              <Route path="/email-settings" element={<RequireAuth><NewsletterPage /></RequireAuth>}/>
              <Route path="/my-account" element={<RequireAuth><RidesAttendedPage /></RequireAuth>}/>
              <Route path="/logout" element={<Logout/>}/>

              {/* Admin related components */}
              <Route path="/admin" element={<RequireAuth roles={Role.Admin}><AdminHomePage/></RequireAuth>}/>
              <Route path="/admin/unpaid-drivers" element={<RequireAuth roles={Role.Admin}><UnpaidDriversPage /></RequireAuth>}/>
              <Route path="/admin/manage/uypmwgkdh,lzxupg" element={<AdminManagementPage/>}></Route>
              <Route path="/admin/new-event/" element={<RequireAuth roles={Role.Admin}><CreateNewEventPage/></RequireAuth>}/>
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
