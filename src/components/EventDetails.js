import React, { Component } from "react";
import SignUpForm from "./SignUpForm";
import StaticMap from "./StaticMap";
import OpenInGoogleMps from "./OpenInGoogleMaps";
import { useParams } from "react-router-dom";

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
    const callURL = "https://localhost:7260/api/MtbEvent/" +this.state.id
    fetch(callURL )
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
          {event.type} at {event.name}{" "} {event.id}
        </h2>
        <p>{event.description}</p>
        <this.RideDate event={event} />
        <this.MapRideLocation event={event} />
        <this.MapLiftShare event={event} />

        <SignUpForm event={event}/>
      </div>
    );
  }


  MapRideLocation({ event }) {
    if ("rideStartLocation" in event) {
      const start = event.rideStartLocation;
      if (
        "lat" in start &&
        "lng" in start &&
        start.lat !== 0 &&
        start.lng !== 0
      ) {
        return (
          <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2"> Ride Start Location </label>
            <div className="col-sm-6">
              <StaticMap
                lat={event.rideStartLocation.lat}
                lng={event.rideStartLocation.lng}
                zoom={13}
              ></StaticMap>
              <OpenInGoogleMps position={event.rideStartLocation} />
            </div>
          </div>
        );
      }
    }
  }

  MapLiftShare({ event }) {
    if ("liftShareLocation" in event) {
      const start = event.liftShareLocation;
      if (
        "lat" in start &&
        "lng" in start &&
        start.lat !== 0 &&
        start.lng !== 0
      ) {
        return (
          <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2"> Lift Share Location </label>
            <div className="col-sm-6">
              <StaticMap
                lat={event.liftShareLocation.lat}
                lng={event.liftShareLocation.lng}
                zoom={16}
              ></StaticMap>
              <OpenInGoogleMps position={event.liftShareLocation} />
            </div>
          </div>
        );
      }
    }
  }

  RideDate({ event }) {
    if (event.startDate === event.endDate) {
      return (
        <div className="row mb-3 gx-3 gy-2">
          <label className="col-sm-2"> Date </label>
          <div className="col-sm-10">{event.startDate}</div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">Start </label>
            <div className="col-sm-10">
              {event.startTime}, {event.endDate}
            </div>
          </div>
          <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">End</label>
            <div className="col-sm-10">
              {event.endTime}, {event.endDate}
            </div>
          </div>
        </div>
      );
    }
  }
}

function EventDetails() {
    const params = useParams();
    return <EventDetailsRenderer id={params}/> ;
  }


export default EventDetails;
