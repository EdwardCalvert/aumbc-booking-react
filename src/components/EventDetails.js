import React, {Component} from 'react'
import SignUpForm from './SignUpForm'
import StaticMap from './StaticMap'
import OpenInGoogleMps from './OpenInGoogleMaps'

class EventDetails extends Component{
    constructor(props){
        super(props)
        this.state = {
            event: {id: 6,
                name: "Glentress",
              startDate: "12/12/2023",
              startTime : "13:00",
              endDate : "13/12/2023",
              endTime:"16:00",
              imageURL: "",
              rideStartLocation : {
                lat: 55.647368,
                lng: -3.139119
              },
              liftShareLocation : {
                lat: 57.161953,
                lng:-2.091058
              },
              costForPassenger: 5,
              costForDriver: 10,
              numberOfCars: 0,
              numberOfBikeSpaces: 0,
              numberOfSeats: 0,
              eventState: "live",
              description: `We will most likely be staying at the Glen Tress pods, which have an area for chilling and a kitchen and bike storage. We will be riding at Golfie and Glen Tress trails and it will probably cost around £65. Please only fill in the form if you can definitely come, as once we book the accommodation you will not be able to drop out. 
              The format will be similar to the FW trip - leaving Friday evening and returning Sunday evening. 
              Any questions ask in the Whatsapp :)`,
              type : "Trip" }
        }
    }
    
     render(){
        const event = this.state.event
        return (
            <div>
                <h2>{event.type} at {event.name} </h2>
                <p>{event.description}</p>
                <this.RideDate event={event}/>
                <this.MapRideLocation event={event}/>
                <this.MapLiftShare event={event}/>
                
                <SignUpForm/>
            </div>
        )

       
    }



    MapRideLocation({event}){
        if("rideStartLocation" in event ){
            const start = event.rideStartLocation
            if( "lat" in start && "lng" in start && start.lat !==0 && start.lng !==0 ){
                return(

<div className='row mb-3 gx-3 gy-2'> 

<label className='col-sm-2'> Ride Start Location </label>
<div className="col-sm-6">
<StaticMap lat={event.rideStartLocation.lat} lng={event.rideStartLocation.lng} zoom={13}></StaticMap>
<OpenInGoogleMps position={event.rideStartLocation}/>
</div>



                    
                </div>)
            }
        }

       
    }


    MapLiftShare({event}){
        if("liftShareLocation" in event ){
            const start = event.liftShareLocation
            if( "lat" in start && "lng" in start && start.lat !==0 && start.lng !==0 ){
                return(

<div className='row mb-3 gx-3 gy-2'> 

<label className='col-sm-2'> Lift Share Location </label>
<div className="col-sm-6">
<StaticMap lat={event.liftShareLocation.lat} lng={event.liftShareLocation.lng} zoom={16} ></StaticMap>
<OpenInGoogleMps position={event.liftShareLocation}/>
</div>
</div>)
            }
        }

       
    }

    RideDate({event}){
    
        if(event.startDate === event.endDate){
            return(
                <div className='row mb-3 gx-3 gy-2'> 

                        <label className='col-sm-2'> Date </label>
                        <div className="col-sm-10">
                        {event.startDate}
                        </div>
                    </div>
                
            )
        }
        else{
        return(
           <div>
            <div className='row mb-3 gx-3 gy-2'> 

<label className='col-sm-2'>Start </label>
<div className="col-sm-10">
{event.startTime},  {event.endDate}
</div>
</div>
<div className='row mb-3 gx-3 gy-2'> 

<label className='col-sm-2'>End</label>
<div className="col-sm-10">
 {event.endTime}, {event.endDate}
</div>
</div>
           </div>
        )
        }

    }
}

export default EventDetails