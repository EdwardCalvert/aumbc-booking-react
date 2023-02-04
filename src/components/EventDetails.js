import React, { Component } from "react";
import SignUpForm from "./SignUpForm";
import StaticMap from "./StaticMap";
import OpenInGoogleMps from "./OpenInGoogleMaps";
import { useParams, Link } from "react-router-dom";
import CopyWhat3Words from "./CopyWhat3Words";
import authenticationService from "../services/authentication.service";

class EventDetailsRenderer extends Component {


  constructor(props) {
    super(props);
    const id = props.id.id
    this.state = {
        id : id,
      dataFetched : false
    };
    
  }

  componentDidMount(){
    const id = this.state.id
    const callURL = "https://localhost:7260/api/MtbEvent/get?" +new URLSearchParams({ eventId :this.state.id})
    window.fetch(callURL,{
      
    } )
                    .then((res) => res.json())
                    .then((json) => {
                        this.setState({
                            event: json,
                            dataFetched: true
                        });
                    })
  }

  render() {
    if(!this.state.dataFetched){
        return <h3>Loading</h3>
    }
    const event = this.state.event;
    if(event.visible){
    return (
      <div>
        <h2>
          {event.name}
        </h2>
        <p style={{whiteSpace: 'pre-line'}}>{event.description}</p>

        <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">Lift share at</label>
            
            <div className="col-sm-6">
            <h5>{event.liftShareName} - <a href={"https://what3words.com/" + event.liftShareW3W} target="_blank">///{event.liftShareW3W}</a> @{  new Date(event.startDateTime).toLocaleDateString("en-GB") +" "+ new Date(event.startDateTime).toLocaleTimeString("en-GB",{timeStyle: "short"})}</h5>
              <StaticMap
                lat={event.liftShareLat}
                lng={event.liftShareLng}
                zoom={16}
              ></StaticMap>
              <OpenInGoogleMps position={{lat: event.liftShareLat, lng: event.liftShareLng}} /> <CopyWhat3Words what3Words={event.liftShareW3W}/>
            </div>
          </div>
          <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">The ride will be at</label>
            
            <div className="col-sm-6">
            <h5>{event.rideStartName} - <a href={"https://what3words.com/" + event.rideStartW3W} target="_blank">///{event.rideStartW3W}</a></h5>
              <StaticMap
                lat={event.rideStartLat}
                lng={event.rideStartLng}
                zoom={17}
              ></StaticMap>
              <OpenInGoogleMps position={{lat: event.rideStartLat, lng: event.rideStartLng}} /> <CopyWhat3Words what3Words={event.rideStartW3W}/>
            </div>
          </div>
          {new Date(event.startDateTime).toLocaleDateString("en-GB") ==  new Date(event.endDateTime).toLocaleDateString("en-GB") &&
            <div className="row mb-3 gx-3 gy-2">
              <label className="col-sm-2">Possible finish</label>
                <div className="col-sm-10">
                  { new Date(event.startDateTime).toLocaleDateString("en-GB")} { new Date(event.startDateTime).toLocaleTimeString("en-GB",{timeStyle: "short"})} - This is only a guess!
                </div>
          </div>
          }
          {authenticationService.currentUserValue&&
           <React.Fragment>
            
            <Link to={"/event/edit/"+this.state.id} ><button className="btn btn-primary">Ammend ride</button></Link><button className="btn btn-danger">Cancel ride</button>
            <label className="form-text">The ride will remain in the database. Users will be notified that the event has been cancelled.</label>
            </React.Fragment>
          }
     
       

        <SignUpForm event={event}/>
      </div>
    );
  }
  else{
    return <h2>This ride has been cancelled. </h2>
  }
}




  MapLocation({eventLocationName,eventWhat3Words, eventLat, eventLng, locationTitle,zoom, dateTime} ) {
        return (
          <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">{locationTitle}</label>
            
            <div className="col-sm-6">
            <h5>{eventLocationName} - <a href={"https://what3words.com/" + eventWhat3Words} target="_blank">///{eventWhat3Words}</a> @{  new Date(dateTime).toLocaleDateString("en-GB") +" "+ new Date(dateTime).toLocaleTimeString("en-GB",{timeStyle: "short"})}</h5>
              <StaticMap
                lat={eventLat}
                lng={eventLng}
                zoom={zoom}
              ></StaticMap>
              <OpenInGoogleMps position={{lat: eventLat, lng: eventLng}} /> <CopyWhat3Words what3Words={eventWhat3Words}/>
            </div>
          </div>
        );
    }
  
    
  

  RideDate({ event }) {

      return (
        <div>
          <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">Start </label>
            <div className="col-sm-10">
            { new Date(event.startDateTime).toLocaleDateString("en-GB")} { new Date(event.startDateTime).toLocaleTimeString("en-GB",{timeStyle: "short"})} 
            </div>
          </div>
          <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">End</label>
            <div className="col-sm-10">
            { new Date(event.endDateTime).toLocaleDateString("en-GB")} { new Date(event.endDateTime).toLocaleTimeString("en-GB",{timeStyle: "short"})} 
            </div>
          </div>
        </div>
      );
    }

}

function EventDetails() {
    const params = useParams();
    return <EventDetailsRenderer id={params}/> ;
  }


export default EventDetails;
