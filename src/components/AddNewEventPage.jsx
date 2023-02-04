import CreateNewEvent from "./CreateNewEvent";
import { useParams ,useNavigate} from 'react-router-dom';
import api from './../services/api'
import { useState, useEffect } from "react";

function AddNewEventPage(){
    const [errorWhileSubmitting, setErrorWhileSubmitting] = useState(false);
    let navigate = useNavigate();

    function handleFormSubmit(e){
        let eventToSave = {
            name: e.rideName,
            description: e.description,
            startDateTime: e.startDate.split(":").length ===2? e.startDate+":00":e.startDate,
            endDateTime : e.endDate.split(":").length ==2? e.endDate+":00":e.endDate,
            rideStartW3W : e.rideStartLocation,
            liftShareW3W: e.liftShareLocation,
            costForDriver : e.costForDriver,
            costForPassenger : e.costForPassenger,
            visible: true,

        };
        api.post("MtbEvent/insert-event", eventToSave).then(success =>{
            setErrorWhileSubmitting(false);
           
            navigate(`/event/${success.data.id}`,{ replace: true });
        }, error => {
            setErrorWhileSubmitting(true);
        });
       
    }
        return <div>
            <h1>Create new event</h1>
          <CreateNewEvent onChange={handleFormSubmit} newEvent={true} />
          {errorWhileSubmitting && 
            <p className="alert alert-danger">An error occured while attempting to save the event. Please check all fields are considered valid and try again.</p>
          }
        </div>
   
}

export default AddNewEventPage;