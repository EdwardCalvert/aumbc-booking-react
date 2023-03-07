import { useNavigate} from 'react-router-dom';
import api from '../services/api'
import { useState } from "react";
import EventForm from "./EventForm";

function CreateNewEventPage(){
    const [errorWhileSubmitting, setErrorWhileSubmitting] = useState(false);
    let navigate = useNavigate();

    async function handleFormSubmit(e){
        await api.post("MtbEvent/insert-event", e).then(success =>{
            setErrorWhileSubmitting(false);
           
            navigate(`/event/${success.data.id}`,{ replace: true });
        }, error => {
            setErrorWhileSubmitting(true);
        });
       
    }
        return <div>
            <h1>Create new event</h1>
          <EventForm onChange={handleFormSubmit} newEvent={true} />
          {errorWhileSubmitting && 
            <p className="alert alert-danger">An error occured while attempting to save the event. Please check all fields are considered valid and try again.</p>
          }
        </div>
   
}

export default CreateNewEventPage;