import { useEffect, useState } from "react";
import api from "../services/api";
import {Link }from 'react-router-dom';
import CreateNewSemester from "./CreateNewSemester";
import LoadingSpinner from "./LoadingSpinner";

function RidesAttendedPage (){
    const [rides, setRides ]= useState([]);
    const [semesterId, setSemesterId] = useState();
    const [loading, setLoading] = useState(true);
    const [errorLoadingInvoice, setErrorLoadingInvoice] = useState(false);
    useEffect(()=>{ 
        if(semesterId){
        api.get("Finance/invoice-by-semester",{params:{semesterId: semesterId}}).then(success => {
        if(success.status === 200){
            setRides(success.data);
        }
        else{
            setRides([]);
        }
        setLoading(false);
        
    }, errror => {
        setErrorLoadingInvoice(true);
       
    })
     }
    },[semesterId])

    function semesterChanged(event){
        setSemesterId(event.target.value);
    }
    async function markRidePaid(indexOfEvent){
        
        let copyOfRides = rides;
        await api.post("Finance/mark-cost-as-paid", copyOfRides[indexOfEvent].eventId ).then(success => {
        })

        copyOfRides[indexOfEvent].markedAsPaidDate = true;
        setRides([...copyOfRides]);
    }

    if(errorLoadingInvoice){
        return <p className="alert alert-danger">Unable to load invoices.</p>
    }
    return <div>
        <h2>Rides you have attended</h2>
        <CreateNewSemester allowCreatingNewSemesters={false} value={semesterId} onChange={semesterChanged}></CreateNewSemester>
        {!loading && rides.length >0 && 
             <table className="table">
             <thead>
                 <tr>
                     <th scope="col">Ride Name</th>
                     <th scope="col">Date</th>
                     <th scope="col">Cost</th>
                     <th scope="col">Payout</th>    
                     <th scope="col">Actions</th>
             </tr>
             </thead>
             <tbody>
         {rides.map((item,key)=> <tr scope="row" key={item.eventId}>
             <td>{item.name}</td>
             <td>{new Date(item.startDateTime).toLocaleDateString("en-GB")}</td>
             <td className={item.markedAsPaidDate  || item.paymentDue ==0? "text-success": "text-danger"}>£{item.paymentDue.toFixed(2)}</td>
             <td className={item.payoutSent || item.payoutDue == 0 ? "text-success": "text-danger" }>£{item.payoutDue.toFixed(2)}</td>
             <td>
                <Link className="btn btn-primary" to={"/event/"+item.eventId} >View</Link>
                {!item.markedAsPaidDate  && item.paymentDue !==0 && 
                    <button type="button" className="ms-1 btn btn-primary" onClick={() =>markRidePaid(key)}>Mark cost as paid</button>
                }
             </td>
             </tr>)}
         </tbody>
         </table>

        }
            <LoadingSpinner show={loading}>
                We're peddaling like Murdo to process your request... 
            </LoadingSpinner> 
        
        {!loading && rides.length == 0&&
            <p>You attended no rides for the selected period. </p>
        }
       
    </div>



}
export default RidesAttendedPage;