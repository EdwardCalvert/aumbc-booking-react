import React, {Component} from 'react'
import AUMBCPhoto from './AUMBCPhoto';
import StaticMap from './StaticMap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function EventTile(props) {

      
      const event = props.event;
     const style = String(getStyleKeyword(event.eventState));
  return <Link to={"/event/" +event.id } className="NoDecoration"><div className="col"  >
          <div className="card" >
            <ImageSelector event={event}/>
            <div className="card-body">
              <h5 className="card-title">{event.name} </h5>
              <h6>{getDisplayDate(event.startDateTime, event.endDateTime)}</h6>
              <p>{event.description}</p>
              
              {/* <Link to={"/event/" +event.id } className={"btn btn-primary"}>View</Link> */}
            </div>
            </div>
          </div>
          </Link>

    
            }
    
function getDisplayDate(startDateTime, endDateTime){
  if(new Date(startDateTime).toLocaleDateString("en-GB") == new Date(endDateTime).toLocaleDateString("en-GB") ){
    return  new Date(startDateTime).toLocaleDateString("en-GB") + " "  + new Date(startDateTime).toLocaleTimeString("en-GB",{timeStyle: "short"})
  }
  else{
    return new Date(startDateTime).toLocaleDateString("en-GB") + " - "+ new Date(endDateTime).toLocaleDateString("en-GB") 
  }
}

   function getStyleKeyword(eventState){
      switch(eventState){
        case "cancelled":
          return "light";
        case "full":
          return "warning";
        case "booked":
          return "success";
        default:
          return "primary";
      }
    }
  function  getButtonText(eventState){
      switch(eventState){
        case "cancelled":
          return "View";
        case "full":
          return "Join waiting list"
        case "booked":
          return "Edit booking";
        default:
          return "Sign Up";
      }
    }

    


EventTile.propTypes ={
  event: PropTypes.object.isRequired
}

function ImageSelector({event}){
  
  if(event.imageURL != null && event.imageURL.length >10){
    return <img src={event.imageURL} className="card-img-top EventTile-image" alt="..."/>
  }
  else{
    if( event.rideStartLocation !=null  &&event.rideStartLocation.lat != null &&event.rideStartLocation.lng != null){
    return( <div className='card-img-top EventTile-image'>
      <StaticMap lat={event.rideStartLocation.lat} lng={event.rideStartLocation.lng} zoom={13}/>
    </div>)
    }
    else{
      return(<AUMBCPhoto size={5} classStyle={"card-img-top EventTile-image"}/>)
    }
  }
}



  export default EventTile