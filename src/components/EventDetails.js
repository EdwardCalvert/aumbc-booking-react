import React, { Component } from "react";
import SignUpForm from "./SignUpForm-v2";
import StaticMap from "./StaticMap";
import OpenInGoogleMps from "./OpenInGoogleMaps";
import { useParams, Link } from "react-router-dom";
import CopyWhat3Words from "./CopyWhat3Words";
import authenticationService from "../services/authentication.service";
import api from './../services/api';
import EventAcceptanceRow from "./EventAcceptanceRow";
import transportState from "../_helpers/transportState";

class EventDetailsRenderer extends Component {


  constructor(props) {
    super(props);
    const id = props.id.id
    this.state = {
        id : id,
      dataFetched : false,
      errorWhileFetching: false,
      signUpFormObject : null
    };
    this.cancelEvent = this.cancelEvent.bind(this)
    
  }

  cancelEvent(e){

     api.delete("/mtbEvent/"+this.state.id).then(success =>{}, error =>{ this.setState({errorWhileFetching : true})})
    const newEvent = this.state.event
    newEvent.visible = false
    this.setState({
      event: newEvent
    })
  }

  componentDidMount(){
        api.get("EventAcceptance/get-signup-form-object", { params: {eventId: this.state.id}}).then(response => {
      this.setState({signUpFormObject: response.data})});
    
      api.get("MtbEvent/get", {params: {eventId :this.state.id}})
                    .then((response) => {
                        this.setState({
                            event: response.data,
                            dataFetched: true
                        });
                    }, error=> {
                      if(error.status === 404){
                        this.setState({dataFetched:true, errorWhileFetching : true});
                      }
                      else{
                        this.setState({dataFetched:true, errorWhileFetching :  true});
                      }
                      
                    });


    this.updateAttendees();
  }

  updateAttendees(){
          api.get("MtbEvent/get-people-on-ride",{params:{eventId : this.state.id }}).then(success => {
              if(success.status === 200){
                let results = success.data.map(x =>  {return  { ...x, processing: false, editPayout: false, newPayoutValue : x.payoutTotal}} );
                  this.setState({ attendees:  results})
              }
          }, error=>{
             // setErrorWhileLoading(true);
          })
          //setLoadingData(false);
  }

  editDataRow(accountId, propName, newValue){
    let copyOfRows = this.state.attendees
    const indexToRemove = copyOfRows.findIndex(x => x.accountId === accountId)
    copyOfRows[indexToRemove][propName] = newValue ;
    this.setState({attendees:copyOfRows})
  }


  async saveCustomPayoutTotal(accountId){
    this.processingRecord(accountId)
    let copyOfRows = this.state.attendees
  const indexToRemove = copyOfRows.findIndex(x => x.accountId === accountId)
  copyOfRows[indexToRemove].payoutTotal = parseFloat(copyOfRows[indexToRemove].newPayoutValue) ;
  await api.post("EventAcceptance/update-payout-total",{ accountId: accountId,eventId: this.state.id, payoutTotal : copyOfRows[indexToRemove].payoutTotal })
  copyOfRows[indexToRemove].editPayout = false;
  copyOfRows[indexToRemove].customPayoutTotal = true;
  this.setState({attendees:copyOfRows})
  this.processingRecord(accountId);
  }



async processingRecord(accountId, state){
  this.editDataRow(accountId,"processing",state);
}

  async deleteEventAcceptance(accountId){
    this.processingRecord(accountId,true)
    await api.delete("finance/cancel-acceptance",{params:{eventId: this.state.id ,accountId:accountId }})
    if(authenticationService.currentUserValue.accountId === accountId){
      window.location.reload();
    }
    else{
     let copyOfRows = this.state.attendees
     const indexToRemove = copyOfRows.findIndex(x => x.accountId === accountId)
     copyOfRows.splice(indexToRemove,1);
     this.setState({attendees:copyOfRows});
     this.processingRecord(accountId,false)
    }
     
  }

 async onDemoteToPassenger(accountId){
  this.processingRecord(accountId,true)
     await  api.delete("finance/demote-acceptance-to-passenger",{params:{eventId: this.state.id ,accountId:accountId }})
    if(authenticationService.currentUserValue.accountId === accountId){
      window.location.reload();
    }
    else{
      this.editDataRow(accountId,"transportState",transportState.AttendingPassenger);
      this.processingRecord(accountId,false)
    }
    
  }


  render() {
    if(!this.state.dataFetched){
        return <div>
                 <h4>Loading</h4>
                <div className="spinner-border"></div>
            </div>
    }
   
    else{
      if(this.state.errorWhileFetching){
        return <p className="alert-danger alert">An error occured while loading the event. Possilby, the event id you supplied doesn't exist.  <Link to={"/"} className="btn btn-primary">Take me home</Link></p>
      }
      else{
        const event = this.state.event;
        if(event && event.visible){
          return (
            <div>
              <h2>
                {event.name}
              </h2>
              <p style={{whiteSpace: 'pre-line'}}>{event.description}</p>

              <SignUpForm event={event} onChange={()=> this.updateAttendees()} signUpObject={this.state.signUpFormObject} />
              <h4>Riders attending event</h4>
              <EventAcceptanceRow 
              rows={this.state.attendees}
               onDelete={(accountId,eventId) => this.deleteEventAcceptance(accountId)} 
               onDemoteToPassenger={(accountId,eventId) =>this.onDemoteToPassenger(accountId)} 
               togglePayoutEdit={(accountId,eventId,newValue) => this.editDataRow(accountId,"editPayout",newValue)} 
               setCustomPayoutTotal={(accountId,eventId, newValue) =>   this.editDataRow(accountId,"newPayoutValue",newValue)}
               saveCustomPayoutTotal={(accountId,eventId)=> this.saveCustomPayoutTotal(accountId)}/>
              <h4>Ride details</h4>
              <div className="row mb-3 gx-3 gy-2">
                  <label className="col-sm-2">Lift share at</label>
                  
                  <div className="col-sm-6">
                  <h5>{event.liftShareName} - <a href={"https://what3words.com/" + event.liftShareW3W} target="_blank" rel="noreferrer">///{event.liftShareW3W}</a> @{  new Date(event.startDateTime).toLocaleDateString("en-GB") +" "+ new Date(event.startDateTime).toLocaleTimeString("en-GB",{timeStyle: "short"})}</h5>
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
                  <h5>{event.rideStartName} - <a href={"https://what3words.com/" + event.rideStartW3W} rel="noreferrer" target="_blank">///{event.rideStartW3W}</a></h5>
                    <StaticMap
                      lat={event.rideStartLat}
                      lng={event.rideStartLng}
                      zoom={14}
                    ></StaticMap>
                    <OpenInGoogleMps position={{lat: event.rideStartLat, lng: event.rideStartLng}} /> <CopyWhat3Words what3Words={event.rideStartW3W}/>
                  </div>
                </div>
                  <div className="row mb-3 gx-3 gy-2 mb-3 pb-3">
                    <label className="col-sm-2">Possible finish</label>
                      <div className="col-sm-10">
                        { new Date(event.endDateTime).toLocaleDateString("en-GB")} { new Date(event.startDateTime).toLocaleTimeString("en-GB",{timeStyle: "short"})} (This is simply a guess)
                      </div>
                </div>
                {authenticationService.currentUserValue&&
                <React.Fragment>
                <div className="row mb-3 gx-3 gy-2">
                <label className="col-sm-2">Admin Controls</label>
                  <div className="col-sm-10">
                  
                  <Link to={"/event/edit/"+this.state.id} ><button className="btn btn-primary btn-block mb-3 me-1 ">Ammend ride</button></Link><button onClick={this.cancelEvent} className="btn btn-danger  mb-3 btn-block ">Cancel ride</button>
                  </div>
                  </div>
                  
                  </React.Fragment>
                }
            </div>
          );
        }
        else{
          if(!event.visible){
            return <h2>This ride has been cancelled. </h2>
          }
          else{
            return <h2>The requested ride could not be found.</h2>
          }
        }
      }
    }
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
