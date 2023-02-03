import api from "./../services/api";
import { useEffect , useState} from "react";
import AutoTextArea from "./AutoTextArea";
import SelectLocation from "./SelectLocation";

function CreateNewEvent(){
    const [rideStartLocation, setRideStartLocation ] = useState();
    const [liftShareLocation, setLiftShareLocation] = useState();
    const [rideName, setRideName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    function onRideStartLocationChanged(event){
        if(event !== null){
        setRideStartLocation(event.what3WordsAddress)
        }
        else{
            setRideStartLocation(null);
        }
    }

    function onLiftShareLocationChanged(event){
        if(event !== null){
        setLiftShareLocation(event.what3WordsAddress);
    }
    else{
        setLiftShareLocation(null);
    }
    }


    return <div>
        <p>Please note: the system claims to be 'clever', so will calculate the distance between the start and end location to work out how much to compensate drivers. Therefore, it is vital to provide correct data.</p>
        <div className="row mb-3 gx-3 gy-2 form-group">
            <label className="col-sm-2">Name</label>
            <div className="col-sm-10">
                <input className=" form-control" value={rideName} onChange={(e)=>{ setRideName(e.target.value)}} type="text"/>
            </div>
        </div>
        <div className="row mb-3 gx-3 gy-2 form-group">
            <label className="col-sm-2">Description</label>
            <div className="col-sm-10">
                <AutoTextArea />
            </div>
        </div>
        <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">Lift share location</label>
            <div className="col-sm-10">
                <SelectLocation onLocationChanged={onLiftShareLocationChanged}  />
                You selected:  {liftShareLocation}
            </div>
        </div>
        <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">Ride Start Location</label>
            <div className="col-sm-10">
                <SelectLocation onLocationChanged={onRideStartLocationChanged}  />
                You selected:  {rideStartLocation}
            </div>
        </div>
       
        <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">Start date & time</label>
            <div className="col-sm-3">
                <input type="datetime-local" className="form-control"/>
            </div>
        </div>
        <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">End date & time</label>
            <div className="col-sm-3">
                <input type="datetime-local" className="form-control"/>
            </div>
        </div>

        <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">Cost for passenger</label>
            <div className="col-sm-3 ">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">£</span>
                    </div>
                    <input className="form-control" type="number"/>
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
                    <input className="form-control" type="number"/>
                </div>
            </div>
        </div>

    </div>
}

export default CreateNewEvent;

