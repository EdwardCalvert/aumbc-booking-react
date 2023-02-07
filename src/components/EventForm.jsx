import { useEffect , useState} from "react";
import AutoTextArea from "./AutoTextArea";
import SelectLocation from "./SelectLocation";
import React from "react";
import CreateNewSemester from "./CreateNewSemester";

function EventForm({mtbEvent,onChange, newEvent}){
    const [rideStartLocation, setRideStartLocation ] = useState();
    const [liftShareLocation, setLiftShareLocation] = useState();
    const [rideName, setRideName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [costForDriver, setCostForDriver] = useState(0);
    const [costForPassenger, setCostForPassenger] = useState(0);
    const [semesterId, setSemesterId] = useState();

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
        }

    }, [mtbEvent])
    function onRideStartLocationChanged(event){
        if(event !== null){
        setRideStartLocation(event.what3WordsAddress)
        }
        else{
            setRideStartLocation(null);
        }
    }

    function handleFormSubmit(event){
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
        onChange(eventToSave);
    }

    function onLiftShareLocationChanged(event){
        if(event !== null){
        setLiftShareLocation(event.what3WordsAddress);
    }
    else{
        setLiftShareLocation(null);
    }
    }

    if((mtbEvent &&rideStartLocation ) || newEvent ) // hacks to ensure correct location is shown from start
    {
    return <form onSubmit={handleFormSubmit} >
        <p>Please note: the system claims to be 'clever', so will calculate the distance between the start and end location to work out how much to compensate drivers. Therefore, it is vital to provide correct data.</p>
        <div className="row mb-3 gx-3 gy-2 form-group">
            <label className="col-sm-2">Name</label>
            <div className="col-sm-10">
                <input className=" form-control" required value={rideName} onChange={(e)=>{ setRideName(e.target.value)}} type="text"/>
                {/* <span className="validity"></span> */}
                {rideName.length ===0 &&
                <React.Fragment>
                <br/>
                <p className="alert alert-danger">Plese define a ride name</p>
                </React.Fragment>
            }
            </div>
          
            

        </div>

        <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">Semester</label>
            <div className="col-sm-10">
                <CreateNewSemester value={semesterId} onChange={(e)=> setSemesterId(e.target.value)} allowCreatingNewSemesters={true}/>
            </div>
        </div>
        <div className="row mb-3 gx-3 gy-2 form-group">
            <label className="col-sm-2">Description</label>
            <div className="col-sm-10">
                <AutoTextArea value={description} onChange={(e)=>{ setDescription(e.target.value); }} />
            </div>
        </div>
        <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">Lift share location</label>
            <div className="col-sm-10">
                <SelectLocation startLocation={liftShareLocation} onLocationChanged={onLiftShareLocationChanged}  />
            </div>
        </div>
        
        
        <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">Ride Start Location</label>
            <div className="col-sm-10">
                <SelectLocation startLocation={rideStartLocation} onLocationChanged={onRideStartLocationChanged}  />
                {rideStartLocation === liftShareLocation&&
                <p className="alert alert-danger">Please choose different starting & ending locations</p>
            }
            </div>
        </div>
        
       
        <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">Start date & time</label>
            <div className="col-sm-5">
                <input type="datetime-local" value={startDate} onChange={(e)  => {setStartDate(e.target.value)}} className="form-control" required/>
                <span className="validity"></span>
            </div>
        </div>
        <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">End date & time</label>
            <div className="col-sm-5">
                <input type="datetime-local" value={endDate}  onChange={(e) => {setEndDate(e.target.value)}}className="form-control" required/>
                <span class="validity"></span>
                {endDate <= startDate &&
                    <p className="alert alert-danger">The event must end later than it starts!  </p>
                }
            </div>
        </div>
        <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">Cost for passenger</label>
            <div className="col-sm-3 ">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">£</span>
                    </div>
                    <input step={0.01}  min={0} max={500} type='number' className="form-control" value={costForPassenger} onChange={(e)=>setCostForPassenger(e.target.value)} />
                    <span class="validity"></span>
                </div>
            </div>
        </div>
        <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">Cost for driver</label>
            <div className="col-sm-3 ">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">£</span>
                    </div>
                    <input  step={0.01}  min={0} max={500} type='number' className="form-control" value={costForDriver} onChange={(e)=> setCostForDriver(e.target.value)} />
                    <span class="validity"></span>
                </div>
            </div>
        </div>
        <button type="submit" disabled={!(costForPassenger>=0 && costForPassenger >= 0 && Date.parse(endDate) > Date.parse(startDate)  &&rideStartLocation !== liftShareLocation )} className="btn btn-primary">Submit</button>
        {!(costForPassenger>=0 && costForPassenger >= 0 && Date.parse(endDate) > Date.parse(startDate) && rideStartLocation !== liftShareLocation )&&
            <label className="form-text">Please fill out: Name, start date, end date, cost for driver and cost for passenger to continue. P.s. (end date should be greater than start date! and the ride start cannot be the same as the end.)</label>
        }
        

    </form>}
    else{
        return <h2>Loading...</h2>
    }
}

export default EventForm;

