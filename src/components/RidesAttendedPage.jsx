import { useEffect, useState } from "react";
import api from "../services/api";
import {Link }from 'react-router-dom';
import CreateNewSemester from "./CreateNewSemester";
import LoadingSpinner from "./LoadingSpinner";
import EventAcceptanceRow from "./EventAcceptanceRow";
import authenticationService from "../services/authentication.service";

function RidesAttendedPage (){
    const [rides, setRides ]= useState([]);
    const [semesterId, setSemesterId] = useState();
    const [loading, setLoading] = useState(true);
    const [errorLoadingInvoice, setErrorLoadingInvoice] = useState(false);
    useEffect(()=>{ 
        if(semesterId){
        api.get("MtbEvent/get-rides-attended",{params:{semesterId: semesterId}}).then(success => {
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
    async function markRidePaid(accountId,eventId){
        
        var copyOfRides = rides;

        const indexToRemove = copyOfRides.findIndex( x=> x.eventId === eventId);
        copyOfRides[indexToRemove].processing = true;
        setRides([...copyOfRides]);
        // var copyOfRides = rides;

        await api.post("Finance/mark-event-costs-paid", eventId,{params:{accountId: authenticationService.currentUserValue.accountId}} ).then(success => {
            copyOfRides[indexToRemove].eventCostsPaidDate = success.data;
            copyOfRides[indexToRemove].processing = false;
             setRides([...copyOfRides]);
        }, error =>{
            copyOfRides[indexToRemove].processing = false;
        setRides([...copyOfRides]);
        })
        

        
    }

    if(errorLoadingInvoice){
        return <p className="alert alert-danger">Unable to load invoices.</p>
    }
    return <div>
        <h2>Rides you have attended</h2>
        <CreateNewSemester allowCreatingNewSemesters={false} value={semesterId} onChange={semesterChanged}></CreateNewSemester>
        {!loading && rides.length >0 && 

<EventAcceptanceRow 
rows={rides} invocing={true} showPayoutAll={false} showPayEventCosts={true}
onPayEventCosts={(accountId,eventId)=>markRidePaid(accountId,eventId)}
>
 </EventAcceptanceRow>
           

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