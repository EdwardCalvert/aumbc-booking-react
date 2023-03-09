import { useEffect , useState} from "react";
import AutoTextArea from "./AutoTextArea";
import SelectLocation from "./SelectLocation";
import React from "react";
import CreateNewSemester from "./CreateNewSemester";
import api from "./../services/api"
import FormRow from "./FormRow";

function EventForm({mtbEvent,onChange, newEvent}){
    const [rideStartLocation, setRideStartLocation ] = useState();
    const [liftShareLocation, setLiftShareLocation] = useState();
    const [rideName, setRideName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [costForDriver, setCostForDriver] = useState(0);
    const [costForPassenger, setCostForPassenger] = useState(0);
    const [predictedCost, setPredictedCost] = useState(0.0);
    const [semesterId, setSemesterId] = useState();
    const [submittingResults,setSubmittingResults] = useState(false);

    useEffect(() =>{ 
        if(mtbEvent){
        setRideStartLocation(mtbEvent.rideStartW3W);
        setLiftShareLocation(mtbEvent.liftShareW3W);
        setRideName(mtbEvent.name);
        setDescription(mtbEvent.description);
        const splitStartTime = mtbEvent.startDateTime.split(":");
        setStartDate((splitStartTime.length  === 3?splitStartTime[0]+":"+splitStartTime[1]:mtbEvent.startDateTime ))
        const splitEndTime = mtbEvent.endDateTime.split(":");
        setEndDate((splitEndTime.length ===3? splitEndTime[0]+":"+splitEndTime[1]:mtbEvent.endDateTime));
        setCostForDriver(mtbEvent.costForDriver);
        setCostForPassenger(mtbEvent.costForPassenger);
        setSemesterId(mtbEvent.semesterId);
        getEstimatedCost();
        }

    }, [mtbEvent])
    useEffect(()=> getEstimatedCost(),[semesterId,rideStartLocation,liftShareLocation]);
    function onRideStartLocationChanged(event){
        if(event !== null){
        setRideStartLocation(event.what3WordsAddress)
        }
        else{
            setRideStartLocation(null);
        }
    }

    async function handleFormSubmit(event){
        setSubmittingResults(true);
        event.preventDefault();
        let eventToSave = {
            name: rideName,
            description: description,
            startDateTime: startDate.split(":").length ===2? startDate+":00":startDate,
            endDateTime : endDate.split(":").length ===2? endDate+":00":endDate,
            rideStartW3W : rideStartLocation,
            liftShareW3W: liftShareLocation,
            costForDriver : costForDriver,
            costForPassenger : costForPassenger,
            id: event.id,
            visible: true,
            semesterId : semesterId

        };
        await onChange(eventToSave);
        setSubmittingResults(false);
    }

    function onLiftShareLocationChanged(event){
        if(event !== null){
        setLiftShareLocation(event.what3WordsAddress);
    }
    else{
        setLiftShareLocation(null);
    }
    }

     function getEstimatedCost(){

        if(semesterId &&rideStartLocation && liftShareLocation && rideStartLocation !== liftShareLocation) //Data must be correct. 
        {
             api.get("finance/calculate-fuel-cost",{params :{startW3W : rideStartLocation, endW3W: liftShareLocation, semesterId : semesterId}}).then(success => {setPredictedCost(success.data)}, error =>{})
        }
        if(rideStartLocation && liftShareLocation && rideStartLocation === liftShareLocation ){
            setPredictedCost(0.0);
        }
    }

   

    if((mtbEvent &&rideStartLocation ) || newEvent ) // hacks to ensure correct location is shown from start
    {
    return <form onSubmit={handleFormSubmit} >
        <div className="row mb-3 gx-3 gy-2 form-group">
            <label className="col-sm-2">Name</label>
            <div className="col-sm-10">
                <input className=" form-control" required value={rideName} onChange={(e)=>{ setRideName(e.target.value)}} type="text"/>
                {rideName.length ===0 &&
                <React.Fragment>
                <br/>
                <p className="alert alert-danger">Plese define a ride name</p>
                </React.Fragment>
            }
            </div>
          
            

        </div>
        <FormRow label="Semester" narrow={true}>
            <CreateNewSemester value={semesterId} onChange={(e)=> {setSemesterId(e.target.value); }} allowCreatingNewSemesters={true}/>
        </FormRow>
        <FormRow label="Description" >  
            <AutoTextArea value={description} onChange={(e)=>{ setDescription(e.target.value); }} />
        </FormRow >
        <FormRow label="Lift share location">
            <SelectLocation startLocation={liftShareLocation} onLocationChanged={(e)=>{ onLiftShareLocationChanged(e); }}  />
        </FormRow>
        <FormRow label="Ride Start Location">
            <SelectLocation startLocation={rideStartLocation} onLocationChanged={ (e) => {onRideStartLocationChanged(e); }}  />
            {rideStartLocation === liftShareLocation&&
                <p className="alert alert-danger">Please choose different starting & ending locations</p>
            }
        </FormRow>
        <FormRow label="Start date & time">
            <input type="datetime-local" value={startDate} onChange={(e)  => {setStartDate(e.target.value)}} className="form-control" required/>
            <span className="validity"></span>
        </FormRow>
        <FormRow label="End date & time">
            <input type="datetime-local" value={endDate}  onChange={(e) => {setEndDate(e.target.value)}}className="form-control" required/>
            <span className="validity"></span>
            {endDate <= startDate &&
                <p className="alert alert-danger">The event must end later than it starts! </p>
            }
        </FormRow>
        <FormRow label="Predicted cost">
          £{predictedCost.toFixed(2)}
            <p className="form-text">We've calculated the distance between the lift share location and the ride start location
            and multiplied by the average cost per mile defined for this semester.
            We divided the cost by the "car to seat ratio", to get an approximation for the costs for a single person. This assumes all cars are 'full'.</p>
        </FormRow>
        <FormRow label="Cost for passenger">
         <div className="input-group">
            <div className="input-group-prepend">
                        <span className="input-group-text">£</span>
                    </div>
                    <input step={0.01}  min={0} max={500} type='number' className="form-control" value={costForPassenger} onChange={(e)=>setCostForPassenger(e.target.value)} />
                    <span className="validity"></span>
            </div>
        </FormRow>
        <FormRow label="Cost for driver">
        <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">£</span>
                    </div>
                    <input  step={0.01}  min={0} max={500} type='number' className="form-control" value={costForDriver} onChange={(e)=> setCostForDriver(e.target.value)} />
                    <span className="validity"></span>
                </div>
        </FormRow>

{/* 
        <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">Cost for passenger</label>
            <div className="col-sm-3 ">
                <div className="input-group">
                    
                </div>
            </div>
        </div> */}
        <button type="submit" disabled={!((costForPassenger>=0 && costForPassenger >= 0 && Date.parse(endDate) > Date.parse(startDate)  &&rideStartLocation !== liftShareLocation ))||submittingResults} className="btn btn-primary">
        <span class={submittingResults? "spinner-border spinner-border-sm" :""} role="status" aria-hidden="true"></span>Submit</button>
        

    </form>}
    else{
        return <h2>Loading...</h2>
    }
}

export default EventForm;

