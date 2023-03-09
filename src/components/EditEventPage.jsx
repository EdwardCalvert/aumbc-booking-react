import { useParams ,useNavigate} from 'react-router-dom';
import api from './../services/api'
import { useState, useEffect } from "react";
import EventForm from "./EventForm";

function EditEventPage(props){
    const [errorWhileLoading, setErrorWhileLoading]=useState(false);
    const [errorWhileSubmitting, setErrorWhileSubmitting] = useState(false);
    const [mtbEvent, setMtbEvent] = useState(null);
    const id = useParams().id;
    let navigate = useNavigate();

    async function handleFormSubmit(e){
       await api.patch("MtbEvent", {...e, id: id }).then(success =>{
            setErrorWhileSubmitting(false);

            navigate(`/event/${id}`,{ replace: true });
        }, error => {
            setErrorWhileSubmitting(true);
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
 
   if(errorWhileLoading){
    return <p className="alert alert-danger">Unable to get the event from the database. Does an event whith that id really exist? </p>
   }
   else{
    if(mtbEvent){
        return <div>
            {new Date(mtbEvent.startDateTime) <  Date.now() &&
                <h1 className="text-danger"> This event has happend. Notice, updating details that affect billing will not affect payouts that have already been made, so please use caution when editing the page.</h1>

            }
            <h1>Edit </h1>
          <EventForm onChange={handleFormSubmit} mtbEvent={mtbEvent} newEvent={false}/>
          {errorWhileSubmitting && 
            <p className="alert alert-danger">An error occured while attempting to save the event. Please check all fields are considered valid and try again.</p>
          }
        </div>
    }
   }
}
export default EditEventPage;