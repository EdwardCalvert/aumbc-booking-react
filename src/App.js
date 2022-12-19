import logo from './logo.svg';
import './App.css';
import EventList from './components/EventList';
import SignUpForm from './components/SignUpForm';
import HelpWidget from './components/HelpWidget';
import Navbar from './components/AUMBCNav';
import Footer from './components/Footer';
import ExternalStateExample from './components/InteractiveMap';
import RegisterAccount from './components/RegisterAccount';
import Login from './components/Login'
import EventDetails from './components/EventDetails';
import { HashRouter, Route, Routes } from 'react-router-dom';

const events = [
  {id: 0,
  name: "Pitfichie",
date: "12/12/2022",
imageURL: "https://www.cyclegrampian.co.uk/imz/pitfichie-img.jpg",
description: "Smashing ride.... ",
eventState: "cancelled",
type : "Ride" },
{id: 2,
  name: "Kirkhill",
date: "12/01/2023",
imageURL: "https://www.cyclegrampian.co.uk/imz/kirkhill-img.jpg",
eventState: "live",
type : "Ride" },
{id: 3,
  name: "Durris",
date: "12/12/2023",
imageURL: "https://www.cyclegrampian.co.uk/imz/fb/durris.png",
eventState: "full",
type : "Ride" },
{id: 0,
  name: "Pitfichie",
date: "12/12/2021",
imageURL: "https://www.cyclegrampian.co.uk/imz/pitfichie-img.jpg",
description: "Really exciting text ....",
eventState: "occured",
type : "Ride" },
{id: 2,
  name: "Kirkhill",
date: "12/01/2023",
imageURL: "https://www.cyclegrampian.co.uk/imz/kirkhill-img.jpg",
eventState: "booked",
type : "Ride" },
{id: 3,
  name: "Durris",
date: "12/12/2023",
eventState: "booked",
type : "Ride" }
,
{id: 6,
  name: "Glentress",
startDate: "12/12/2023",
endDate : "13/12/2023",
imageURL: "",
rideStartLocation : {
  lat: 55.647368,
  lng: -3.139119
},
eventState: "live",
type : "Trip" }
]


function App() {
  return (
    
    <HashRouter>
<div className='m-2'>
      <Navbar/>
      <div className='container-lg '>

    <Routes>
    
    
     
      <Route path="/login" element={<div>
      <Login/>
      <hr/>
      <RegisterAccount/>
      </div>}/>
      
      <Route path="/event/:id" element={<EventDetails></EventDetails>}/>

      <Route path="/events" element={<EventList events={events}></EventList>}/>
      <Route path="/" element={<EventList events={events}></EventList>}/>
      <Route path="/admin/newEvent" element={<ExternalStateExample/>}/>
      <Route path="*" element={<p> There is nothing at this page</p >}/>
      
    
    </Routes>
    <Footer/>
    </div>
    </div>
    </HashRouter>
    
  );
}

export default App;
