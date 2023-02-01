import React, { Component } from "react";
import SignUpForm from "./SignUpForm";
import StaticMap from "./StaticMap";
import OpenInGoogleMps from "./OpenInGoogleMaps";
import { useParams } from "react-router-dom";
import CopyWhat3Words from "./CopyWhat3Words";

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
    return (
      <div>
        <h2>
          {event.name}
        </h2>
        <p>{event.description}</p>
        <this.RideDate event={event} />
        <this.MapLocation eventLocationName={event.rideStartName} locationTitle={"Ride Start Location"} eventWhat3Words={event.rideStartW3W} eventLat={event.rideStartLat} eventLng={event.rideStartLng} zoom={13} />
        <this.MapLocation eventLocationName={event.liftShareName} locationTitle={"Lift Share Location "} eventWhat3Words={event.liftShareW3W} eventLat={event.liftShareLat} eventLng={event.liftShareLng} zoom={16} />

        <SignUpForm event={event}/>
      </div>
    );
  }


  MapLocation({eventLocationName,eventWhat3Words, eventLat, eventLng, locationTitle,zoom} ) {
      console.log(eventWhat3Words)
        return (
          <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">{locationTitle}</label>
            
            <div className="col-sm-6">
            <h5>{eventLocationName} - <a href={"https://what3words.com/" + eventWhat3Words} target="_blank">///{eventWhat3Words}</a></h5>
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
