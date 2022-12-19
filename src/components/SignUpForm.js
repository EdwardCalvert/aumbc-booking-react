import React, {Component} from 'react'

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
            showAddCarForm: false,
            driving: "-1",
            vehicleId: -1,
            newCarPetrol: true,
            newCarNumberOfSeats: 0,
            newCarNumberOfBikeSpaces: 0,
            newCarMpg: 47.6,
            alreadyBooked: false,
            borrowClubBike: false,
            giveItAGo:false,
            myVehicles: [
                {
            vehicleId :20,
            mpg: 47.6,
            numberOfBikeSpaces: 2,
            numberOfSeats: 2,
            petrol: true,
            carVisible: true
        },
            {
            vehicleId :21,
            mpg: 47.9,
            numberOfBikeSpaces: 4,
            numberOfSeats: 2,
            petrol: true,
            carVisible: true}
        ],

            event: {id: 6,
                name: "Glentress",
              startdDate: "12/12/2023",
              endDate : "13/12/2023",
              imageURL: "",
              rideStartLocation : {
                lat: 55.647368,
                lng: -3.139119
              },
              costForPassenger: 5,
              costForDriver: 10,
              numberOfCars: 0,
              numberOfBikeSpaces: 0,
              numberOfSeats: 0,
              eventState: "active",
              type : "Trip",
              distanceForLiftShare: 150
             }

            }
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
                alert('A car with stupidly programmed key 27: ' );
    event.preventDefault();
    const newVehicle= this.state.myVehicles;
    newVehicle.push({
        mpg: this.state.newCarMpg,
        numberOfBikeSpaces: this.state.newCarNumberOfBikeSpaces,
        numberOfSeats: this.state.newCarNumberOfSeats,
        vehicleId : 27,
        petrol: this.state.newCarPetrol,
        carVisible: true
    });
    this.setState({myVehicles : newVehicle,
    showAddCarForm: false});
            }
        
  handleEventAcceptance(event) {
    // alert('A name was submitted: ' + this.state.event.name);
    // event.preventDefault();
    this.setState({alreadyBooked: true})
    event.preventDefault();
  }

  handleEventCancellation(){
    let aumbcEvent = this.state.event
    if(this.state.driving != "-1"){
        aumbcEvent = this.removeCurrentCarFromCapcity(aumbcEvent,this.state.vehicleId)
    }
    this.setState({
        driving: "-1",
        vehicleId: -1,
        event: aumbcEvent,
        alreadyBooked: false,
    })

  }
    updateDrivingSelector(event){
        //Update the capacity for people on the event.
        let selectedVehicle 
         
        const currentVehicleId = this.state.vehicleId
        
        let aumbcEvent =  this.state.event
        let newVehicleId = -1;
        if(event.target.value !== "-1" ){
            selectedVehicle = this.state.myVehicles.filter((item)=>item.carVisible)[parseInt(event.target.value)]
            newVehicleId = selectedVehicle.vehicleId; // Select the correct car. 
        }
        if(currentVehicleId === -1 && newVehicleId !== -1) // Go from no car to a car
        {
            aumbcEvent = this.addNewCarToCapacity(aumbcEvent,selectedVehicle)
        }
        else if(currentVehicleId !== -1 && newVehicleId === -1)// Person  was driving, but now not!
        { 
            aumbcEvent = this.removeCurrentCarFromCapcity(aumbcEvent,currentVehicleId)
        }
        else //Person has 'switched' cars
        {
            aumbcEvent = this.removeCurrentCarFromCapcity(aumbcEvent,currentVehicleId)
            aumbcEvent = this.addNewCarToCapacity(aumbcEvent,selectedVehicle)
        }
        this.setState({
            vehicleId: newVehicleId,
            event: aumbcEvent,
            driving: event.target.value,
            
        })
        
    }
    //this.setState({driving: (myVehicles !=null && myVehicles.length >0)? 1 : 0 })

    removeCarFromMyVehicles(){
        const currentVehicleId = this.state.vehicleId

        const carToUpdate = this.state.myVehicles.find((item) => item.vehicleId === currentVehicleId)
        carToUpdate.carVisible = false;
        const otherCars = this.state.myVehicles.filter((item )=>item.vehicleId !== currentVehicleId)
        otherCars.concat(carToUpdate)
        
        //Now change the currently selected vehicle!
       const aumbcEvent =  this.removeCurrentCarFromCapcity(this.state.event, currentVehicleId)
            
            this.setState({myVehicles : otherCars,
            driving :-1,
        vehicleId : -1,
    event: aumbcEvent}); 


        alert("Need to hide car with id (currently removed)  " + currentVehicleId)
        
        
    }
    
    addNewCarToCapacity(aumbcEvent,  vehicle){
            if(vehicle.numberOfBikeSpaces >1)// Someone may turn up in a 7 seater, but only fit one bike etc...
            {
                aumbcEvent.numberOfBikeSpaces += vehicle.numberOfBikeSpaces -1 //Assume person uses 1
            }
            
            if(vehicle.numberOfSeats >1) // Someone may turn up in a van etc
            {
                aumbcEvent.numberOfSeats += vehicle.numberOfSeats - 1 
            }
            aumbcEvent.numberOfCars +=1

        return aumbcEvent
    }

    removeCurrentCarFromCapcity(aumbcEvent, currentVehicleId){
        const currentVehicle = this.state.myVehicles.filter(item => item.vehicleId === currentVehicleId)[0]
        if(currentVehicle.numberOfBikeSpaces >1)// Someone may turn up in a 7 seater, but only fit one bike etc...
        {
            aumbcEvent.numberOfBikeSpaces -= currentVehicle.numberOfBikeSpaces -  1 //Assume person uses 1
        }
        if(currentVehicle.numberOfSeats >1) // Someone may turn up in a van etc
        {
            aumbcEvent.numberOfSeats -= currentVehicle.numberOfSeats - 1 
        }
        aumbcEvent.numberOfCars -=1 
        return aumbcEvent

    }

    toggleAddCarForm(){
        this.setState({showAddCarForm: true})
    }
    render(){


        const event = this.state.event
        const myVehicles = this.state.myVehicles
        return <div className='sign-up-form-container'>
            <h2>Sign up for {event.name}</h2>
            {this.shouldSignUpFormBeShown(this.state) &&
        <form className='mb-3' onSubmit={this.handleEventAcceptance}>
            
                
                <p>You only need to fill in this form as a passenger or as a driver who took passengers (so you can be reimbursed for your fuel costs). Please view the important information for loading <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">bikes with mudguards</a>.</p>
                    <div className='row mb-3 gx-3 gy-2'>
                        <label className='col-sm-2'>Remaining passenger capacity </label>
                        <div className="col-sm-6">
                            <label>{event.numberOfBikeSpaces} 🚲 {event.numberOfSeats} 💺 </label>
                            <p className='form-text'>Result from {event.numberOfCars}🚗 (Excludes drivers)</p>
                        </div>
                    </div>
                    <div className="row mb-3 gx-3 gy-2">
                        <label className='col-sm-2'>Will you drive?</label>
                        <div className="col-sm-6">
                            <select className="form-select"  onChange={this.updateDrivingSelector} value={this.state.driving}>
                                <option value="-1" >No</option>
                                {myVehicles.filter((item) => item.carVisible).map((item,key)=> (<option value={key} key={key}>{item.numberOfBikeSpaces }x🚲/{item.numberOfSeats}x💺 ({item.petrol? "petrol" : "diesel"}, {item.mpg} mpg)</option>) )}
                            </select>
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-outline-secondary "  type="button" onClick={this.toggleAddCarForm} >Add a new car?</button>
                        </div>
                        {this.state.driving !=="-1" &&
                        <div className="col-auto">
                            <button className="btn btn-outline-danger "  type="button" onClick={this.removeCarFromMyVehicles} >Remove Car</button>
                        </div>
    }
                    </div>
                    {this.state.showAddCarForm &&
                    <div className='row gx-3 gy-2 align-items-center mb-3 offset-sm-2'>
                        <div className="col-sm-3">
                            <label className="visually-hidden" for="specificSizeInputGroupUsername">Mpg</label>
                            <div className="input-group">
                                <input type="number" className="form-control" id="specificSizeInputGroupUsername" placeholder="45" name="newCarMpg" value={this.state.newCarMpg} onChange={this.handleFormInputChange}/>
                                <div className="input-group-text">mpg</div>
                            </div>
                        </div>
                        
                        <div className="col-sm-2">
                            <div className="input-group">
                                <div className="input-group-text">🚲</div>
                                <select className="form-select" id="specificSizeSelect" name="newCarNumberOfBikeSpaces" value={this.state.newCarNumberOfBikeSpaces} onChange={this.handleFormInputChange}>
                                {[...Array(11).keys()].map((count, index) => <option value={index} key={index}>{count}</option>)}
                            </select>
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div className="input-group">
                                <div className="input-group-text">💺</div>
                                <select className="form-select" id="specificSizeSelect" name="newCarNumberOfSeats" value={this.state.newCarNumberOfSeats} onChange={this.handleFormInputChange}>
                                {[...Array(11).keys()].map((count, index) => <option value={index} key={index}>{count}</option>)}
                            </select>
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox"  name="newCarPetrol" checked={this.state.newCarPetrol} onChange={this.handleFormInputChange}/>
                                <label className="form-check-label" for="gridCheck1">Petrol</label>
                        </div>
                    </div>
                        <div className="col-auto">
                            <button  className="btn btn-success"  type="button" onClick={this.handleNewCarAdded}>Add Car</button>
                        </div>
                    </div>
                    }
                    <div className="row mb-3  gy-2">
                        <label className='col-sm-2'>Cost</label>
                        <div className="col-sm-8">
                            
                        {this.state.vehicleId!==-1? "£"+event.costForPassenger: "£" + event.costForDriver}
                        </div>
                    </div>
                    
                    <div className="row mb-3">
                        <div className="col-sm-10 offset-sm-2">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="gridCheck1" name="borrowClubBike" checked={this.state.borrowClubBike} onChange={this.handleFormInputChange}/>
                                <label className="form-check-label" for="gridCheck1">Borrow a club bike</label>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-sm-10 offset-sm-2">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="gridCheck1" name="giveItAGo" checked={this.state.giveItAGo} onChange={this.handleFormInputChange}/>
                                <label className="form-check-label" for="gridCheck1">This is my give it a go ride</label>
                            </div>
                        </div>
                    </div>
                    <this.submitButton state={this.state}/>
                   
                </form>
            }
            {this.state.alreadyBooked&&
                <p>You are booked as {this.state.driving !== "-1"? "a driver, taking "+ this.state.myVehicles.find((item) => item.vehicleId == this.state.vehicleId).numberOfBikeSpaces + "🚲 and "+ this.state.myVehicles.find((item) => item.vehicleId == this.state.vehicleId).numberOfSeats +"💺" : "a passenger (proably should confirm if there is space for them)" }. To edit your booking, please <button type='button' onClick={this.handleEventCancellation} className='btn btn-outline-danger'>cancel</button> your existnig one.  </p>
            }

            {event.eventState === "occured" &&
                <p>You can't sign up, since this ride has happened!</p>
            }
            {event.eventState === "cancelled" &&
                <p>You can't sign up, since this ride was cancelled!</p>
            }
            </div>
    }

    shouldSignUpFormBeShown(event){
        let eventState = event.eventState
        return (eventState !== "cancelled" & eventState !== "occured" ) & !event.alreadyBooked
    }

    submitButton({state}){
        if( state.vehicleId === -1 && (state.event.numberOfBikeSpaces == 0 || state.event.numberOfSeats ==0 )){
            return <div><button type="submit" className="btn btn-warning offset-sm-2">Join wating list</button>
            <p className='form-text offset-sm-2'>Upon submission, your queue position is recorded. You will be notified by email if a space becomes available for you.</p>
            </div>
        }
        else{
            return <button type="submit" className="btn btn-success offset-sm-2">Submit</button>
        }
    
            
        
        
    }
  }

  export default SignUpForm