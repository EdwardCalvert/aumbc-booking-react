import CreateNewEvent from "./CreateNewEvent";
import { useParams ,useNavigate} from 'react-router-dom';
import api from './../services/api'
import { useState, useEffect } from "react";

function EditEventPage(props){
    const [errorWhileLoading, setErrorWhileLoading]=useState(false);
    const [errorWhileSubmitting, setErrorWhileSubmitting] = useState(false);
    const [mtbEvent, setMtbEvent] = useState(null);
    const params = useParams()
    const id = useParams().id;
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
            id: id,
            visible: true,

        };
        console.log(eventToSave);
        api.patch("MtbEvent", eventToSave).then(success =>{
            console.log(success);
            setErrorWhileSubmitting(false);

            navigate(`/event/${id}`,{ replace: true });
        }, error => {
            setErrorWhileSubmitting(true);
            console.log(error)
        });
       
    }

    useEffect(()=>{
        api.get("MtbEvent/get", {params:{eventId : id}}).then(success => {
            setErrorWhileLoading(false);
            setMtbEvent(success.data);
        }, error => {
            console.log(error); 
            setErrorWhileLoading(true)})

    },[])
// yuo can find all params from here
 
   if(errorWhileLoading){
    return <p className="alert alert-danger">Unable to get the event from the database. Does an event whith that id really exist? </p>
   }
   else{
    if(mtbEvent){
        return <div>
            <h1>Edit</h1>
          <CreateNewEvent onChange={handleFormSubmit} mtbEvent={mtbEvent}/>
          {errorWhileSubmitting && 
            <p className="alert alert-danger">An error occured while attempting to save the event. Please check all fields are considered valid and try again.</p>
          }
        </div>
    }
   }
}
export default EditEventPage;