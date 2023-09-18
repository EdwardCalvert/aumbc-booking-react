import React, {useEffect,useState} from 'react'
import PropTypes from 'prop-types'
import api from './../services/api';
import authenticationService from '../services/authentication.service';
import AutoTextArea from './AutoTextArea';
import OpenInW3W from './OpenInW3W';
import TransportState, { transportState } from './../_helpers/transportState'
import LoadingSpinner from './LoadingSpinner';
const Driving = String(transportState.Driving);
const QueuingPassenger =  String(transportState.QueuingPassenger) ;
const AttendingPassenger = String(transportState.AttendingPassenger);
const MakingOwnWayThere = String(transportState.MakingOwnWayThere);


function SignUpForm(props){
    const[showAddCarForm,setShowAddCarForm]= useState(false);
    const[newCar, setNewCar] = useState({
        petrol: true,
        mpg: 47.6,
        numberOfBikeSpaces: 0 ,
        numberOfSeats : 1

    });
    const [eventAcceptance, setEventAcceptance] = useState({
        borrowClubBike: false,
        giveItAGo: false,
        otherComments: "",
        eventCostsToPay : 0
    });
    const [alreadyBooked, setAlreadyBooked] = useState(false);
    const event = props.event;
    const [loadingNewCar,setLoadingNewCar] = useState(false);
    const [loading,setLoading] = useState(false);
    const [errorWhileLoading,setErrorWhileLoading] = useState( false);
    const [errorWhileSubmittingNewVehicle,setErrorWhileSubmittingNewVehicle ] = useState(false);
    const [processingSubmission, setProcessingSubmission] = useState(false);
    const [errorProcessingSubmission, setErrorProcessingSubmission] = useState(false);
    const [transportSelectorValue,setTransportSelectorValue] = useState(QueuingPassenger);
    const [transportState,setTransportState] = useState(QueuingPassenger);
    const [myVehicles,setMyVehicles] = useState([]);
    const [capacityForNewPassengers,setCapacityForNewPassengers] = useState(0);
     

    useEffect(()=>{
        const data = props.signUpObject;
        if(data){
            if(data.eventAcceptance ){
                setAlreadyBooked(true);
                setTransportSelectorValue(data.eventAcceptance.vehicleId);
                setTransportState(String(data.eventAcceptance.transportState));
                setEventAcceptance(data.eventAcceptance)

            }
            else{
                setAlreadyBooked(false);
            }
            setLoading(false);
            setMyVehicles(data.vehicles ? data.vehicles : []); //Empty array if no vehicles are present
            setCapacityForNewPassengers(data.maxCapacity);
        }
        
         },[props.signUpObject])


        
   function PaymentHelpMessage(){
    if(eventAcceptance.eventCostsToPay&& eventAcceptance.eventCostsToPay>0 && eventAcceptance.eventCostsPaidDate === null){
        return <React.Fragment>
            <button  className='btn btn-primary' onClick={() => payEventCosts()}>I've paid £{eventAcceptance.eventCostsToPay.toFixed(2)} to the club, to cover costs. </button><br/>
    <label className='form-text'>Please include a descriptive refrence like "{authenticationService.currentUserValue.firstName} {authenticationService.currentUserValue.lastName}  {event.name} { new Date(event.startDateTime).toLocaleDateString("en-gb")}  "</label> 
    </React.Fragment>
    }
}

async function payEventCosts(){
    await api.post("Finance/mark-event-costs-paid", event.id,{params:{accountId: authenticationService.currentUserValue.accountId}}).then(success =>{
        setEventAcceptance({...eventAcceptance, eventCostsPaidDate:success.data });
        props.onChange();
    });
}


function shouldSignUpFormBeShown(){
    return !alreadyBooked && event.visible && Date.parse(event.startDateTime) > Date.now();
}

function  SubmitButton(){
    if( transportSelectorValue === QueuingPassenger && capacityForNewPassengers  ===0){
        return <div><button type="submit" className="btn btn-warning offset-sm-2" disabled={processingSubmission}><span className={processingSubmission? "spinner-border spinner-border-sm":""} role="status" aria-hidden="true"></span>
Join wating list</button>
        <p className='form-text offset-sm-2'>Upon submission, your queue position is recorded and we'll send you confirmation message. You will be notified by email if a space becomes available for you.</p>
        </div>
    }
    else{
        return <button type="submit"  disabled={processingSubmission} className="btn btn-success offset-sm-2"><span className={processingSubmission? "spinner-border spinner-border-sm":""} role="status" aria-hidden="true"></span> Submit</button>
    }
}

    async function handleNewCarAdded(event){
        event.preventDefault();
        setLoadingNewCar(true);
        await api.post("Vehicle",{...newCar}).then(response => {
            let vehicles = myVehicles;
            console.log(vehicles)
            vehicles.push(response.data);
            setMyVehicles(vehicles);
            setShowAddCarForm(false);
            setLoading(false);
            setTransportState(Driving);
            setTransportSelectorValue(response.data.vehicleId);
        },
        error =>{
            setErrorWhileSubmittingNewVehicle(true);
        });
        setLoadingNewCar(false);
    }
        
  async function handleEventAcceptance(e) {
    e.preventDefault();
    setProcessingSubmission(true);
    console.log(transportState)
   await api.post("EventAcceptance/accept-event",
   {eventId : event.id, 
    vehicleId : transportState === Driving ? transportSelectorValue: null   , 
    transportState: transportState, 
    borrowClubBike: eventAcceptance.borrowClubBike, 
    giveItAGo : eventAcceptance.giveItAGo,
    otherComments: eventAcceptance.otherComments})
    .then(success =>
         {
            setAlreadyBooked(true);
            setEventAcceptance({...success.data, transportState: String(success.data.transportState)});
            setProcessingSubmission(false);
            setErrorProcessingSubmission(false);
        },
        errror=>
        {
            setErrorProcessingSubmission(true);
            setProcessingSubmission(false);
        })
    props.onChange();
  }

  async function handleEventCancellation(){
    if(!eventAcceptance.payoutSentDate){
        setLoading(true);
        await api.delete("EventAcceptance/cancel-acceptance",{params:{eventId : event.id}}).then( success => {
             api.get("EventAcceptance/get-remaining-capacity", { params: {eventId: event.id}}).then(response1 => {
                setCapacityForNewPassengers(response1.data);
                setTransportSelectorValue(QueuingPassenger);
                setTransportState(QueuingPassenger);
                setAlreadyBooked(false);
                setLoading(false);
            }, error => {
                console.log(error)
                errorProcessingSubmission(true);
            })
        }, error => { })
         
        setLoading(false);
        props.onChange();
    }
  }
    function updateDrivingSelector(event){
        let newTransportState
        if(event.target.value === MakingOwnWayThere){
           newTransportState= MakingOwnWayThere;
        }
        else if( event.target.value === QueuingPassenger){
            newTransportState = QueuingPassenger
        }
        else  { // Must be driving
             newTransportState = Driving;
        }
        setTransportSelectorValue(event.target.value);
        setTransportState(newTransportState);
    }


    function removeCarFromMyVehicles(){
        //Get vehicle, update visibility. Append to new list & save
        const currentVehicleId = transportSelectorValue
        const carToUpdate = myVehicles.find((item) => item.vehicleId === currentVehicleId)
        carToUpdate.carVisible = false;
        const otherCars = myVehicles.filter((item )=>item.vehicleId !== currentVehicleId)
        otherCars.concat(carToUpdate)

        api.delete("Vehicle", {params:{currentVehicleId}});  
        setTransportSelectorValue(QueuingPassenger);
        setTransportState(QueuingPassenger);
        setMyVehicles({ ...otherCars}); 
    }

    function toggleAddCarForm(){
        setShowAddCarForm(true);
    }

    function CancelButton(){
        if(!eventAcceptance.payoutSentDate){
            return <p> To make an ammendment, please <button type='button' onClick={handleEventCancellation} className='btn btn-outline-danger btn-sm'>cancel current booking</button></p>
        }
    }
  

    if(errorWhileLoading){
        return <p alert="alert alert-primary">Unable to load required data for the sign up form.</p>
    }
    if(loading){
        return <div className='sign-up-form-container'>
        <h3>Loading...</h3>
        <div className="spinner-border"></div>
        <p>Hold on while we pump up the tyres</p>
    </div>
    }

    if(event && shouldSignUpFormBeShown()){
    return <div className='sign-up-form-container mb-3'>
        <h4>Sign up </h4>

    <form className='mb-3 mt-3' onSubmit={handleEventAcceptance}>
            <p>Please view the important information for loading <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">bikes with mudguards</a>.</p>
                <div className="row mb-3 gx-3 gy-2">
                    <label className='col-sm-2'>How will you get there?</label>
                    <div className="col-sm-8">
                        <select className="form-select"  onChange={updateDrivingSelector} value={transportSelectorValue}>
                            <option value={String(QueuingPassenger)} >I'll use the lift share</option>
                            <option value={String(MakingOwnWayThere)} >I'll make my own way there </option>
                            {myVehicles?.filter((item) => item.carVisible).map((item,key)=> (<option value={item.vehicleId} key={item.vehicleId}>I'll drive, with a total of  {item.numberOfSeats}x💺/{item.numberOfBikeSpaces }x🚲 ({item.petrol? "petrol" : "diesel"}, {item.mpg} mpg)</option>) )}
                        </select>
                        <div className="col-auto">
                        <button className="btn btn-outline-secondary mt-3 mr-3"  type="button" onClick={toggleAddCarForm} >Add a new car?</button>
                        {transportState === Driving &&
                            <button className="btn btn-outline-danger mt-3 ml-3 "  type="button" onClick={removeCarFromMyVehicles} >Delete current car</button>
                        }
                    </div>
                    </div>
                    
                </div>
                {showAddCarForm &&
                <div className='row gx-3 gy-2 align-items-center mb-3 offset-sm-2'>
                    <label>The number of seats and bike spaces are total (including you)</label>
                    <div className="col-sm-4">
                        <div className="input-group">
                            <input type="number" className="form-control"  value={newCar.mpg} onChange={(e)=> setNewCar({...newCar, mpg: e.target.value})}/>
                            <div className="input-group-text">mpg</div>
                        </div>
                    </div>
                    
                    
                    <div className="col-sm-4">
                        <div className="input-group">
                            <div className="input-group-text">💺</div>
                            <select className="form-select" name="newCarNumberOfSeats" value={newCar.numberOfSeats} onChange={(e)=> setNewCar({...newCar, numberOfSeats: e.target.value})}>
                            {[...Array(11).keys()].map((count, index) => <option value={index+1} key={index}>{count+1}</option>)}
                        </select>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="input-group">
                            <div className="input-group-text">🚲</div>
                            <select className="form-select"  name="newCarNumberOfBikeSpaces" value={newCar.numberOfBikeSpaces} onChange={(e)=> setNewCar({...newCar, numberOfBikeSpaces: e.target.value})}>
                            {[...Array(11).keys()].map((count, index) => <option value={index} key={index}>{count}</option>)}
                        </select>
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox"  name="newCarPetrol" checked={newCar.petrol} onChange={(e)=> setNewCar({...newCar, petrol: e.target.checked})}/>
                            <label className="form-check-label">Petrol</label>
                    </div>
                </div>
                    <div className="col-auto">
                        <button  className="btn btn-success"  type="button" onClick={handleNewCarAdded}>Add Car</button>
                    </div>
                    {errorWhileSubmittingNewVehicle &&
                    <p className='alert alert-danger'>Unable to submit your vehicle. Please ensure you have at least one seat</p>
                }
                {loadingNewCar&&
                    
                    <LoadingSpinner >
                            <p>Inserting...</p>
                    </LoadingSpinner>
                }
                </div>
                }
                
                <div className="row mb-3  gy-2">
                    <label className='col-sm-2'>Cost</label>
                    <div className="col-sm-8">
                        
                    {transportState === Driving? "£"+event.costForDriver.toFixed(2): (transportState === QueuingPassenger ?"£" + event.costForPassenger.toFixed(2) : "£0.00") }
                    </div>
                </div>
                
                <div className="row mb-3">
                    <div className="col-sm-10 offset-sm-2">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox"  checked={eventAcceptance.borrowClubBike} onChange={(e)=> setEventAcceptance({...eventAcceptance, borrowClubBike: e.target.checked})}/>
                            <label className="form-check-label" >Borrow a club bike</label>
                        </div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-10 offset-sm-2">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox"  checked={eventAcceptance.giveItAGo} onChange={(e) => setEventAcceptance({ ...eventAcceptance, giveItAGo : e.target.checked})}/>
                            <label className="form-check-label" >This is my give it a go ride</label>
                        </div>
                    </div>
                </div>

                <div className="row mb-3  gy-2">
                    <label className='col-sm-2'>Other comments</label>
                    <div className="col-sm-8">
                        
                    <AutoTextArea value={eventAcceptance.otherComments} onChange={(e)=>setEventAcceptance({ ...eventAcceptance, otherComments : e.target.value})}/>
                    </div>
                </div>
                <SubmitButton />
                {errorProcessingSubmission &&
                    <p className='alert alert-danger'>An error occured while processing your submission. please check all fields are valid.</p>
                }
            </form>
        
        
        </div>
    }
    if(!event.visible){
            return <div className='sign-up-form-container'><h4>Sign up is unavailable.</h4>
                <p>You can't sign up, since this ride was cancelled!</p>
            </div>
        }
    if(Date.parse(event.startDateTime ) < Date.now() && !alreadyBooked){
        return <div className='sign-up-form-container'><h4>Sign up is unavailable.</h4>
            <p>You can't sign up, since this ride has started</p>
            </div>
    }

    if(transportState === Driving){
        const drivingVehicle = myVehicles.find((item) => item.vehicleId === transportSelectorValue)
        if(drivingVehicle){
        return <div className='sign-up-form-container'>
            <h4>You are booked as a driver</h4>
                <p>Thanks for driving, taking {drivingVehicle.numberOfSeats} passengers with {drivingVehicle.numberOfBikeSpaces} bikes. Make sure to be at <OpenInW3W location={event.liftShareW3W}/> {new Date(event.startDateTime).toLocaleDateString("en-gb")} at { new Date(event.startDateTime).toLocaleTimeString("en-GB",{timeStyle: "short"})} </p>
                <CancelButton/>
                <PaymentHelpMessage />
                </div>
        }
    }
    if(transportState === QueuingPassenger){
        return <div className='sign-up-form-container'>
            <h4>You've booked, and are waiting for a space</h4>
            <p>You are queueing for the ride, we'll let you know by email if a space becomes available </p>
            <CancelButton/>

        </div>
    }
    if (transportState === AttendingPassenger){
        return <div className='sign-up-form-container'>
            <h4>You've booked as a passenger.</h4>
            <p>You are attending the ride as a passenger! Make sure to be at <OpenInW3W location={event.liftShareW3W}/> {new Date(event.startDateTime).toLocaleDateString("en-gb")} at { new Date(event.startDateTime).toLocaleTimeString("en-GB",{timeStyle: "short"})}</p>
            <CancelButton/>
            <PaymentHelpMessage/>
        </div>
    }
    if (transportState === MakingOwnWayThere){
        return <div className='sign-up-form-container'>
            <h4>You are making your own way there</h4>
            <p>You are attending the ride, and making your own way there! We look forward to seeing you on the trails at <OpenInW3W location={event.rideStartW3W}/>,   on the {new Date(event.startDateTime).toLocaleDateString("en-gb")} some time after { new Date(event.startDateTime).toLocaleTimeString("en-GB",{timeStyle: "short"})}  (We'll need to drive from ASV)!</p>
           <CancelButton/>
        </div>
    }
    return <p>Very confused as to what should show here- send me a message if you can answer!</p>
        



}

export default SignUpForm;