import React, {Component} from 'react'
import PropTypes from 'prop-types'
import api from './../services/api';
import authenticationService from '../services/authentication.service';
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
        
        this.state = {
            errorWhileAddingVehicle: false,
            showAddCarForm: false,
            driving: "-1",
            newCarPetrol: true,
            capacityForNewPassengers: 0,
            newCarMpg: 47.6,
            alreadyBooked: false,
            borrowClubBike: false,
            giveItAGo:false,
            inQueue: false,
            myVehicles : [],
            event: props.event,
            loading: true

            }
            }       

            componentDidMount(){
                api.get("Vehicle/get-my-vehicles").then(response2 => {
                    if(response2.status === 200){
                        this.setState( {myVehicles: response2.data,errorWhileAddingVehicle: false});
                    }
                    else{
                        this.setState({errorWhileAddingVehicle: false});
                    }
                }, error=> {
                    this.setState({errorWhileAddingVehicle:true});
                })
                api.get("EventAcceptance/get-acceptance", { params: {eventId: this.state.event.id}}).then(response => {
                    this.setState({alreadyBooked:true, inQueue:response.data.inQueue, driving: response.data.vehicleId === null ? "-1": response.data.vehicleId }) ;
                }, error => {
                    if(error.response.status === 404) // No event aceptance exists. 
                    {
                        this.setState({alreadyBooked: false});
                        api.get("EventAcceptance/get-remaining-capacity", { params: {eventId: this.state.event.id}}).then(response1 => {
                            this.setState({capacityForNewPassengers: response1.data});
                        }, error => {
                            console.log(error)
                        })
                       
                    }
                })
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

            handleNewCarAdded(event){
                 event.preventDefault();
                 const newVehicle = {
                    mpg: this.state.newCarMpg,
                    numberOfBikeSpaces: this.state.newCarNumberOfBikeSpaces,
                    numberOfSeats: this.state.newCarNumberOfSeats,
                    petrol: this.state.newCarPetrol,
                };
                api.post("Vehicle",{...newVehicle}).then(response => {
                    let vehicles = this.state.myVehicles;
                    vehicles.push(response.data);
                    this.setState({myVehicles : vehicles,
                        showAddCarForm: false})
                },
                error =>{
                    console.log(error);
                });
            }
        
  handleEventAcceptance(event) {
    event.preventDefault();
    api.post("EventAcceptance/accept-event",{eventId : this.state.event.id,vehicleId : this.state.driving === "-1" ? null  : this.state.driving , borrowClubBike: this.state.borrowClubBike, giveItAGo : this.state.giveItAGo})
    .then(success => {this.setState({alreadyBooked: true, inQueue: success.data.inQueue})})
    
  }

  handleEventCancellation(){
    if(this.state.driving != "-1"){
         this.removeCurrentCarFromCapcity(this.state.driving);
    }
    this.setState({
        driving: "-1",
        alreadyBooked: false,
    })
    api.delete("EventAcceptance/cancel-acceptance",{params:{eventId : this.state.event.id}})
    api.get("EventAcceptance/get-remaining-capacity", { params: {eventId: this.state.event.id}}).then(response1 => {
        this.setState({capacityForNewPassengers: response1.data});
    }, error => {
        console.log(error)
    })

  }
    updateDrivingSelector(event){
        //Update the capacity for people on the event.
        const currentVehicleId = this.state.driving
        const newVehicleId = event.target.value;
        if(currentVehicleId === "-1" && newVehicleId !== "-1") // Go from no car to a car
        {
           this.addNewCarToCapacity(newVehicleId)
        }
        else if(currentVehicleId !== "-1" && newVehicleId === "-1")// Person  was driving, but now not!
        { 
             this.removeCurrentCarFromCapcity(currentVehicleId)
        }
        else //Person has 'switched' cars
        {
            this.removeCurrentCarFromCapcity(currentVehicleId)
            this.addNewCarToCapacity(newVehicleId)
        }
        this.setState({ driving: event.target.value});
    }


    removeCarFromMyVehicles(){

        //Get vehicle, update visibility. Append to new list & save
        const currentVehicleId = this.state.driving
        const carToUpdate = this.state.myVehicles.find((item) => item.vehicleId === currentVehicleId)
        carToUpdate.carVisible = false;
        const otherCars = this.state.myVehicles.filter((item )=>item.vehicleId !== currentVehicleId)
        otherCars.concat(carToUpdate)

        api.delete("Vehicle", {params:{currentVehicleId}});
        //Now change the currently selected vehicle!
        this.removeCurrentCarFromCapcity(currentVehicleId);
            
        this.setState({myVehicles : otherCars,
            driving :"-1",
        }); 
    }
    
    //Imagine the worst possible bodge that you can think of, but it is fine, due to server side calcs!
    addNewCarToCapacity( idToAdd){
        const currentVehicle = this.state.myVehicles.filter(item => item.vehicleId === idToAdd)[0]
        let minValue = Math.min(currentVehicle.numberOfBikeSpaces,currentVehicle.numberOfSeats)  ; 
        this.setState({capacityForNewPassengers: this.state.capacityForNewPassengers + minValue});
    }

    removeCurrentCarFromCapcity(idToRemove){
        const currentVehicle = this.state.myVehicles.filter(item => item.vehicleId === idToRemove)[0]
        console.log(currentVehicle);
        let minValue = Math.min(currentVehicle.numberOfBikeSpaces,currentVehicle.numberOfSeats);
        this.setState({capacityForNewPassengers: this.state.capacityForNewPassengers - minValue});
    }

    toggleAddCarForm(){
        this.setState({showAddCarForm: true})
    }
    render(){
        const event = this.state.event
        const myVehicles = this.state.myVehicles
        if(this.shouldSignUpFormBeShown()){
        return <div className='sign-up-form-container'>
            <h2>Sign up for {event.name}</h2>

        <form className='mb-3 mt-3' onSubmit={this.handleEventAcceptance}>
                <p>Fill in this form as a passenger or as a driver who took passengers (so you can be reimbursed for your fuel costs). Please view the important information for loading <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">bikes with mudguards</a>.</p>
                    <div className="row mb-3 gx-3 gy-2">
                        <label className='col-sm-2'>Will you drive?</label>
                        <div className="col-sm-8">
                            <select className="form-select"  onChange={this.updateDrivingSelector} value={this.state.driving}>
                                <option value="-1" >No</option>
                                {myVehicles.filter((item) => item.carVisible).map((item,key)=> (<option value={item.vehicleId} key={item.vehicleId}>{item.numberOfBikeSpaces }x🚲/{item.numberOfSeats}x💺 ({item.petrol? "petrol" : "diesel"}, {item.mpg} mpg)</option>) )}
                            </select>
                            <div className="col-auto">
                            <button className="btn btn-outline-secondary mt-3 mr-3"  type="button" onClick={this.toggleAddCarForm} >Add a new car?</button>
                            {this.state.driving !=="-1" &&
                                <button className="btn btn-outline-danger mt-3 ml-3 "  type="button" onClick={this.removeCarFromMyVehicles} >Delete current car</button>
                            }
                        </div>
                     </div>
                       
                    </div>
                    {this.state.showAddCarForm &&
                    <div className='row gx-3 gy-2 align-items-center mb-3 offset-sm-2'>
                        <div className="col-sm-4">
                            <div className="input-group">
                                <input type="number" className="form-control" id="specificSizeInputGroupUsername" placeholder="45" name="newCarMpg" value={this.state.newCarMpg} onChange={this.handleFormInputChange}/>
                                <div className="input-group-text">mpg</div>
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
                        <div className="col-sm-4">
                            <div className="input-group">
                                <div className="input-group-text">💺</div>
                                <select className="form-select" name="newCarNumberOfSeats" value={this.state.newCarNumberOfSeats} onChange={this.handleFormInputChange}>
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
                    </div>
                    }
                    <div className="row mb-3  gy-2">
                        <label className='col-sm-2'>Cost for you</label>
                        <div className="col-sm-8">
                            
                        {this.state.vehicleId!==-1? "£"+event.costForPassenger.toFixed(2): "£" + event.costForDriver.toFixed(2)}
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
                    <this.submitButton state={this.state}/>
                </form>
            
         
            </div>
    }
    else{
        if(!event.visible){
            return <div><h2>Sign up is unavailable.</h2>
                <p>You can't sign up, since this ride was cancelled!</p>
            </div>
        }
        else if(Date.parse(event.startDateTime) < Date.now()){
            return <div><h2>Sign up is unavailable.</h2>
             <p>You can't sign up, since this ride has happened!</p>
             </div>
        }
        else{
            if(this.state.driving !=="-1"){
                const drivingVehicle = this.state.myVehicles.find((item) => item.vehicleId === this.state.driving)
                return <div>
                     <p>Thanks for driving, taking {drivingVehicle.numberOfSeats} passengers with {drivingVehicle.numberOfBikeSpaces} bikes. Have a great ride. </p> 
                     <p>To make an ammendment, please  <button type='button' onClick={this.handleEventCancellation} className='btn btn-outline-danger'>cancel current booking</button></p>
                     <this.paymentHelpMessage paymentAmmount={event.costForDriver}></this.paymentHelpMessage>
                     </div>
            }
            else{
                if(this.state.inQueue){
                    return <div>
                        <p>You are queueing for the ride, we'll let you know by email if a space becomes available</p>
                        <p>To make an ammendment, please  <button type='button' onClick={this.handleEventCancellation} className='btn btn-outline-danger'>cancel current booking</button></p>

                    </div>
                }
                else{
                    return <div>
                        <p>You are attending the ride as a passenger! Have fun!</p>
                        <p>To make an ammendment, please <button type='button' onClick={this.handleEventCancellation} className='btn btn-outline-danger'>cancel current booking</button></p>
                        <this.paymentHelpMessage paymentAmmount={ event.costForPassenger}></this.paymentHelpMessage>
                    </div>
                }
            }
        }
    }
}

    paymentHelpMessage({paymentAmmount}){

        if(paymentAmmount>0){
            return <React.Fragment>
                <a href="https://settleup.starlingbank.com/glenncharlton" target="_blank" className='btn btn-primary'>Don't forget to pay £{paymentAmmount.toFixed(2)} to cover our costs here. </a><br/>
        <label className='form-text'>Please include a descriptive refrence like "{authenticationService.currentUserValue.firstName} xx/yy/zzz   "</label> 
        </React.Fragment>
        
        }

    }

    shouldSignUpFormBeShown(){
        return !this.state.alreadyBooked && this.state.event.visible && Date.parse(this.state.event.startDateTime) > Date.now();
    }

    submitButton({state}){
        if( state.driving === "-1" && state.capacityForNewPassengers  ===0){
            return <div><button type="submit" className="btn btn-warning offset-sm-2">Join wating list</button>
            <p className='form-text offset-sm-2'>Upon submission, your queue position is recorded and we'll send you confirmation message. You will be notified by email if a space becomes available for you.</p>
            </div>
        }
        else{
            return <button type="submit" className="btn btn-success offset-sm-2">Submit</button>
        }
    }
  }
  SignUpForm.propTypes = {
    event: PropTypes.object
  }

  export default SignUpForm