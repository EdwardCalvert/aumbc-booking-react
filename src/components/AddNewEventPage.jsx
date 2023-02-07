import CreateNewEvent from "./CreateNewEvent";
import { useNavigate} from 'react-router-dom';
import api from './../services/api'
import { useState } from "react";

function AddNewEventPage(){
    const [errorWhileSubmitting, setErrorWhileSubmitting] = useState(false);
    let navigate = useNavigate();

    function handleFormSubmit(e){
        api.post("MtbEvent/insert-event", e).then(success =>{
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