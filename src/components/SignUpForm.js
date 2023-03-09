import React, {Component} from 'react'
import PropTypes from 'prop-types'
import api from './../services/api';
import authenticationService from '../services/authentication.service';
import AutoTextArea from './AutoTextArea';
import OpenInW3W from './OpenInW3W';
const Driving = "8";
const QueuingPassenger = "2";
const AttendingPassenger = "4";
const MakingOwnWayThere = "1";

class SignUpForm extends Component{

    constructor(props){
        super(props);
        this.toggleAddCarForm = this.toggleAddCarForm.bind(this)
        this.updateDrivingSelector = this.updateDrivingSelector.bind(this)
        this.handleFormInputChange = this.handleFormInputChange.bind(this)
        this.handleNewCarAdded = this.handleNewCarAdded.bind(this)
        this.handleEventCancellation = this.handleEventCancellation.bind(this)
        this.handleEventAcceptance = this.handleEventAcceptance.bind(this)
        this.removeCarFromMyVehicles = this.removeCarFromMyVehicles.bind(this)
        this.paymentHelpMessage = this.paymentHelpMessage.bind(this);
        this.markPaymentAsRecieved = this.markPaymentAsRecieved.bind(this);
        this.submitButton = this.submitButton.bind(this);
        
        this.state = {
            errorWhileLoading: false,
            showAddCarForm: false,
            transportSelectorValue: QueuingPassenger,
            transportState : QueuingPassenger,
            newCarPetrol: true,
            capacityForNewPassengers: 0,
            newCarMpg: 47.6,
            alreadyBooked: false,
            borrowClubBike: false,
            giveItAGo:false,
            myVehicles : [],
            event: props.event,
            loading: true,
            loadingNewCar: false,
            errorWhileSubmittingNewVehicle :false, 
            markedAsPaidDate : null,
            processingSubmission: false,
            errorProcessingSubmission:  false,
            newCarNumberOfSeats: 1,
            otherComments: "",
            callbackFunction : props.onChange



            }
            }       

            async componentDidMount(){
                await Promise.all([api.get("Vehicle/get-my-vehicles").then(response2 => {
                    if(response2.status === 200){
                        this.setState( {myVehicles: response2.data,errorWhileAddingVehicle: false});
                    }
                    else{
                        this.setState({errorWhileAddingVehicle: false});
                    }
                }, error=> {
                    this.setState({errorWhileAddingVehicle:true});
                }),
                 api.get("EventAcceptance/get-acceptance", { params: {eventId: this.state.event.id}}).then(response => {
                    this.setState({alreadyBooked:true, inQueue:response.data.inQueue, transportSelectorValue: response.data.vehicleId, transportState: String(response.data.transportState) }) ;
                },async  error => {
                    if(error.response.status === 404) // No event aceptance exists. 
                    {
                        this.setState({alreadyBooked: false});
                        await api.get("EventAcceptance/get-remaining-capacity", { params: {eventId: this.state.event.id}}).then(response1 => {
                            this.setState({capacityForNewPassengers: response1.data});
                        }, error => {
                            this.setState({errorWhileLoading: true})
                        })
                       
                    }
                })]); 
                this.setState({loading:false})
            }
            handleFormInputChange(event){
                const target = event.target;
                const value = target.type === 'checkbox' ? target.checked : target.value;
                const name = target.name;
            
                this.setState({
                  [name]: value
                });

            }

            async handleNewCarAdded(event){
                 event.preventDefault();
                 this.setState({loadingNewCar: true})
                 const newVehicle = {
                    mpg: this.state.newCarMpg,
                    numberOfBikeSpaces: this.state.newCarNumberOfBikeSpaces,
                    numberOfSeats: this.state.newCarNumberOfSeats,
                    petrol: this.state.newCarPetrol,
                };
                await api.post("Vehicle",{...newVehicle}).then(response => {
                    let vehicles = this.state.myVehicles;
                    vehicles.push(response.data);
                    this.setState({myVehicles : vehicles,
                        showAddCarForm: false, loading: false, driving: response.data.vehicleId, transportState: Driving})
                },
                error =>{
                    console.log(error);
                    this.setState({errorWhileSubmittingNewVehicle :true})
                });
                this.setState({loadingNewCar: false})
            }
        
  async handleEventAcceptance(event) {
    event.preventDefault();
    console.log(this.state.otherComments)
    this.setState({processingSubmission:true});
   await api.post("EventAcceptance/accept-event",{eventId : this.state.event.id, vehicleId : this.state.transportState === Driving ? this.state.transportSelectorValue: null   , transportState: this.state.transportState, borrowClubBike: this.state.borrowClubBike, giveItAGo : this.state.giveItAGo,otherComments: this.state.otherComments})
    .then(success => {this.setState({alreadyBooked: true, transportState: String(success.data.transportState), processingSubmission: false, errorProcessingSubmission:false})}, errror=>{
        this.setState({errorProcessingSubmission :true, processingSubmission :false})
    })
    this.state.callbackFunction();
  }

  async handleEventCancellation(){
    this.setState({
        transportSelectorValue: QueuingPassenger,
        transportState : QueuingPassenger,
        alreadyBooked: false,
        loading: true
    })
    await api.delete("EventAcceptance/cancel-acceptance",{params:{eventId : this.state.event.id}})
   await api.get("EventAcceptance/get-remaining-capacity", { params: {eventId: this.state.event.id}}).then(response1 => {
        this.setState({capacityForNewPassengers: response1.data});
    }, error => {
        console.log(error)
    })
    this.setState({loading:false})
    this.state.callbackFunction();

  }
    updateDrivingSelector(event){
        let transportState = QueuingPassenger
        if(event.target.value === String(QueuingPassenger)){
            transportState= QueuingPassenger
        }
        else if(event.target.value === String(MakingOwnWayThere)){
           transportState= MakingOwnWayThere;
        }
        else { // Must be driving
             transportState = Driving;
        }
        this.setState({ transportSelectorValue: event.target.value, transportState : transportState});

    }


    removeCarFromMyVehicles(){
        //Get vehicle, update visibility. Append to new list & save
        const currentVehicleId = this.state.transportSelectorValue
        const carToUpdate = this.state.myVehicles.find((item) => item.vehicleId === currentVehicleId)
        carToUpdate.carVisible = false;
        const otherCars = this.state.myVehicles.filter((item )=>item.vehicleId !== currentVehicleId)
        otherCars.concat(carToUpdate)

        api.delete("Vehicle", {params:{currentVehicleId}});            
        this.setState({myVehicles : otherCars,
            transportSelectorValue : QueuingPassenger,
            transportState: QueuingPassenger
        }); 
    }

    toggleAddCarForm(){
        this.setState({showAddCarForm: true})
    }
    render(){
        const event = this.state.event
        const myVehicles = this.state.myVehicles

        if(this.state.errorWhileLoading){
            return <p alert="alert alert-primary">Unable to load required data for the sign up form.</p>
        }
        if(this.state.loading){
            return <div className='sign-up-form-container'>
            <h3>Loading...</h3>
           <div className="spinner-border"></div>
           <p>Hold on while we pump up the tyres</p>
       </div>
        }
        if(event){
            if(this.shouldSignUpFormBeShown()){
                return <div className='sign-up-form-container'>
                    <h3>Sign up for </h3>
        
                <form className='mb-3 mt-3' onSubmit={this.handleEventAcceptance}>
                        <p>Please view the important information for loading <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">bikes with mudguards</a>.</p>
                            <div className="row mb-3 gx-3 gy-2">
                                <label className='col-sm-2'>How will you get there?</label>
                                <div className="col-sm-8">
                                    <select className="form-select"  onChange={this.updateDrivingSelector} value={this.state.transportSelectorValue}>
                                        <option value={String(QueuingPassenger)} >I'll use the lift share</option>
                                        <option value={String(MakingOwnWayThere)} >I'll make my own way there </option>
                                        {myVehicles.filter((item) => item.carVisible).map((item,key)=> (<option value={item.vehicleId} key={item.vehicleId}>I'll drive, with a total of  {item.numberOfSeats}x💺/{item.numberOfBikeSpaces }x🚲 ({item.petrol? "petrol" : "diesel"}, {item.mpg} mpg)</option>) )}
                                    </select>
                                    <div className="col-auto">
                                    <button className="btn btn-outline-secondary mt-3 mr-3"  type="button" onClick={this.toggleAddCarForm} >Add a new car?</button>
                                    {this.state.transportState === Driving &&
                                        <button className="btn btn-outline-danger mt-3 ml-3 "  type="button" onClick={this.removeCarFromMyVehicles} >Delete current car</button>
                                    }
                                </div>
                             </div>
                               
                            </div>
                            {this.state.showAddCarForm &&
                            <div className='row gx-3 gy-2 align-items-center mb-3 offset-sm-2'>
                                <label>The number of seats and bike spaces are total (including you)</label>
                                <div className="col-sm-4">
                                    <div className="input-group">
                                        <input type="number" className="form-control" id="specificSizeInputGroupUsername" placeholder="45" name="newCarMpg" value={this.state.newCarMpg} onChange={this.handleFormInputChange}/>
                                        <div className="input-group-text">mpg</div>
                                    </div>
                                </div>
                                
                               
                                <div className="col-sm-4">
                                    <div className="input-group">
                                        <div className="input-group-text">💺</div>
                                        <select className="form-select" name="newCarNumberOfSeats" value={this.state.newCarNumberOfSeats} onChange={this.handleFormInputChange}>
                                        {[...Array(11).keys()].map((count, index) => <option value={index+1} key={index}>{count+1}</option>)}
                                    </select>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="input-group">
                                        <div className="input-group-text">🚲</div>
                                        <select className="form-select"  name="newCarNumberOfBikeSpaces" value={this.state.newCarNumberOfBikeSpaces} onChange={this.handleFormInputChange}>
                                        {[...Array(11).keys()].map((count, index) => <option value={index} key={index}>{count}</option>)}
                                    </select>
                                    </div>
                                </div>
                                <div className="col-sm-2">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox"  name="newCarPetrol" checked={this.state.newCarPetrol} onChange={this.handleFormInputChange}/>
                                        <label className="form-check-label">Petrol</label>
                                </div>
                            </div>
                                <div className="col-auto">
                                    <button  className="btn btn-success"  type="button" onClick={this.handleNewCarAdded}>Add Car</button>
                                </div>
                                {this.state.errorWhileSubmittingNewVehicle &&
                                <p className='alert alert-danger'>Unable to submit your vehicle. Please ensure you have at least one seat</p>
                            }
                            {this.state.loadingNewCar&&
                                <p>Inserting...</p>
                            }
                            </div>
                            }
                           
                            <div className="row mb-3  gy-2">
                                <label className='col-sm-2'>Cost</label>
                                <div className="col-sm-8">
                                    
                                {this.state.transportState === Driving? "£"+event.costForDriver.toFixed(2): ( this.state.transportState === QueuingPassenger ?"£" + event.costForPassenger.toFixed(2) : "£0.00") }
                                </div>
                            </div>
                            
                            <div className="row mb-3">
                                <div className="col-sm-10 offset-sm-2">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="gridCheck1" name="borrowClubBike" checked={this.state.borrowClubBike} onChange={this.handleFormInputChange}/>
                                        <label className="form-check-label" >Borrow a club bike</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-sm-10 offset-sm-2">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="gridCheck1" name="giveItAGo" checked={this.state.giveItAGo} onChange={this.handleFormInputChange}/>
                                        <label className="form-check-label" >This is my give it a go ride</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3  gy-2">
                                <label className='col-sm-2'>Other comments</label>
                                <div className="col-sm-8">
                                    
                                <AutoTextArea value={this.state.otherComments} onChange={(e)=>this.setState({otherComments : e.target.value})}/>
                                </div>
                            </div>
                            <this.submitButton state={this.state}/>
                            {this.state.errorProcessingSubmission &&
                                <p className='alert alert-danger'>An error occured while processing your submission. please check all fields are valid.</p>
                            }
                        </form>
                    
                 
                    </div>
            }
            else if(!event.visible){
                    return <div className='sign-up-form-container'><h2>Sign up is unavailable.</h2>
                        <p>You can't sign up, since this ride was cancelled!</p>
                    </div>
                }
                else if(Date.parse(event.startDateTime) < Date.now()){
                    return <div className='sign-up-form-container'><h2>Sign up is unavailable.</h2>
                     <p>You can't sign up, since this ride has started</p>
                     {(this.state.transportState === AttendingPassenger || this.state.transportState === Driving) &&
                            <this.paymentHelpMessage paymentAmmount={ this.state.transportState === AttendingPassenger? event.costForPassenger: event.costForDriver} event={event}></this.paymentHelpMessage>
                     }
                     
                     </div>
                }
              

                else if(this.state.transportState === Driving){
                    const drivingVehicle = this.state.myVehicles.find((item) => item.vehicleId === this.state.transportSelectorValue)
                    return <div className='sign-up-form-container'>
                        <h2>You are booked as a driver</h2>
                            <p>Thanks for driving, taking {drivingVehicle.numberOfSeats} passengers with {drivingVehicle.numberOfBikeSpaces} bikes. Make sure to be at <OpenInW3W location={this.state.event.liftShareW3W}/> {new Date(this.state.event.startDateTime).toLocaleDateString("en-gb")} at { new Date(this.state.event.startDateTime).toLocaleTimeString("en-GB",{timeStyle: "short"})}  <br/>
                            To make an ammendment, please  <button type='button' onClick={this.handleEventCancellation} className='btn btn-outline-danger btn-sm'>cancel current booking</button></p>
                            <this.paymentHelpMessage paymentAmmount={event.costForDriver} event={event}></this.paymentHelpMessage>
                            </div>
                }
                else if(this.state.transportState === QueuingPassenger){
                        return <div className='sign-up-form-container'>
                            <h2>You've booked, and are waiting for a space</h2>
                            <p>You are queueing for the ride, we'll let you know by email if a space becomes available <br/>
                            To make an ammendment, please  <button type='button' onClick={this.handleEventCancellation} className='btn btn-outline-danger btn-sm' event={event}>cancel current booking</button></p>
    
                        </div>
                    }
                    else if (this.state.transportState === AttendingPassenger){
                        return <div className='sign-up-form-container'>
                            <h2>You've booked as a passenger.</h2>
                            <p>You are attending the ride as a passenger! Make sure to be at <OpenInW3W location={this.state.event.liftShareW3W}/> {new Date(this.state.event.startDateTime).toLocaleDateString("en-gb")} at { new Date(this.state.event.startDateTime).toLocaleTimeString("en-GB",{timeStyle: "short"})}<br/>
                            To make an ammendment, please <button type='button' onClick={this.handleEventCancellation} className='btn btn-outline-danger btn-sm'>cancel current booking</button></p>
                            <this.paymentHelpMessage paymentAmmount={ event.costForPassenger} event={event}></this.paymentHelpMessage>
                        </div>
                    }
                    else if (this.state.transportState === MakingOwnWayThere){
                        return <div className='sign-up-form-container'>
                            <h2>You are making your own way there</h2>
                            <p>You are attending the ride, and making your own way there! We look forward to seeing you on the trails at <OpenInW3W location={this.state.event.rideStartW3W}/>,   on the {new Date(this.state.event.startDateTime).toLocaleDateString("en-gb")} some time after { new Date(this.state.event.startDateTime).toLocaleTimeString("en-GB",{timeStyle: "short"})}  (We'll need to drive from ASV)!<br/>
                            To make an ammendment, please <button type='button' onClick={this.handleEventCancellation} className='btn btn-outline-danger btn-sm'>cancel current booking</button></p>
                        </div>
                    }
                    
                
            

        }
        else{
            return <p>Very confused as to what should show here- send me a message if you can answer!</p>
        }
}

    paymentHelpMessage({paymentAmmount,event,}){
        if(paymentAmmount>0 && this.state.markedAsPaidDate === null){
            return <React.Fragment>
                <a href="https://settleup.starlingbank.com/glenncharlton" rel="noreferrer" target="_blank" className='btn btn-primary' onClick={() => this.markPaymentAsRecieved()}>Don't forget to pay £{paymentAmmount.toFixed(2)} to cover our costs here. </a><br/>
        <label className='form-text'>Please include a descriptive refrence like "{authenticationService.currentUserValue.firstName} {authenticationService.currentUserValue.lastName}  {event.name} { new Date(event.startDateTime).toLocaleDateString("en-gb")}  "</label> 
        </React.Fragment>
        
        }

    }

   async markPaymentAsRecieved(){
        console.log("Payment recieved")
        console.log(this.state.event);
        await api.post("Finance/mark-cost-as-paid",this.state.event.id).then(success =>{console.log(success);
            this.setState({markedAsPaidDate: success.data});
        });
    }
    

    shouldSignUpFormBeShown(){
        return !this.state.alreadyBooked && this.state.event.visible && Date.parse(this.state.event.startDateTime) > Date.now();
    }

    submitButton({state}){
        if( state.transportSelectorValue === QueuingPassenger && state.capacityForNewPassengers  ===0){
            return <div><button type="submit" className="btn btn-warning offset-sm-2" disabled={this.state.processingSubmission}><span className={this.state.processingSubmission? "spinner-border spinner-border-sm":""} role="status" aria-hidden="true"></span>
Join wating list</button>
            <p className='form-text offset-sm-2'>Upon submission, your queue position is recorded and we'll send you confirmation message. You will be notified by email if a space becomes available for you.</p>
            </div>
        }
        else{
            return <button type="submit"  disabled={this.state.processingSubmission} className="btn btn-success offset-sm-2"><span className={this.state.processingSubmission? "spinner-border spinner-border-sm":""} role="status" aria-hidden="true"></span> Submit</button>
        }
    }
  }
  SignUpForm.propTypes = {
    event: PropTypes.object
  }

  export default SignUpForm