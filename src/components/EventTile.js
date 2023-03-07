import React from 'react'
import AUMBCPhoto from './AUMBCPhoto';
import StaticMap from './StaticMap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function EventTile(props) {

      
      const event = props.event;
  return <Link to={"/event/" +event.id } className="NoDecoration"><div className="col"  >
          <div className="card" >
            <ImageSelector event={event}/>
            <div className="card-body">
              <h5 className="card-title">{event.name} </h5>
              <h6>{getDisplayDate(event.startDateTime, event.endDateTime)}</h6>
              <p style={{whiteSpace: 'pre-line'}}>{event.description.substring(0, 200)}</p>

            </div>
            </div>
          </div>
          </Link>

    
            }
    
function getDisplayDate(startDateTime, endDateTime){
  if(new Date(startDateTime).toLocaleDateString("en-GB") === new Date(endDateTime).toLocaleDateString("en-GB") ){
    return  new Date(startDateTime).toLocaleDateString("en-GB") + " "  + new Date(startDateTime).toLocaleTimeString("en-GB",{timeStyle: "short"})
  }
  else{
    return new Date(startDateTime).toLocaleDateString("en-GB") + " - "+ new Date(endDateTime).toLocaleDateString("en-GB") 
  }
}



    


EventTile.propTypes ={
  event: PropTypes.object.isRequired
}

function ImageSelector({event}){
  

    if( event.rideStartLat !=null  &&event.rideStartLng !== null ){
    return( <div className='card-img-top EventTile-image'>
      <StaticMap lat={event.rideStartLat} lng={event.rideStartLng} zoom={13}/>
    </div>)
    }
    else{
      return(<AUMBCPhoto size={5} classStyle={"card-img-top EventTile-image"}/>)
    }
  
}



  export default EventTile