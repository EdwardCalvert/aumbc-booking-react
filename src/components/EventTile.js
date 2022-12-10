import React, {Component} from 'react'
import AUMBCPhoto from './AUMBCPhoto';
import StaticMap from './StaticMap';


class EventTile extends Component{
    render(){
      const event = this.props.event;
     const style = String(this.getStyleKeyword(event.eventState)) ;
  return <div className="col"  >
          <div className="card" >
            <ImageSelector event={event}/>
            <div className="card-body">
              <h5 className="card-title">{event.name} <div className="badge text-bg-light"><i className="bi bi-tag-fill"></i> {event.type}</div></h5>
              <h6>{event.date}</h6>
              <p>{event.description}</p>
              
              <a href="#" className={"btn btn-"+style}>{this.getButtonText(event.eventState)}</a>
            </div>
            </div>
          </div>

    

    }
    getStyleKeyword(eventState){
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
    getButtonText(eventState){
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