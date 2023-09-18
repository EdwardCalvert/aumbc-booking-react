import { useEffect, useState } from "react";
import api from "../services/api";
import React from "react";
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

    // async function markAllClubDebtPaid(e){
    //     rides.filter(x => !x.eventCostsPaidDate ).forEach(x => markRidePaid(null,x))
    //             await api.post("finance/mark-as-paid-out",rides.filter(x => !x.eventCostsPaidDate ).map(x=> x.eventId),{params: {accountId: authenticationService.currentUserValue.accountId}}).then( success => {
    
    //                 const copyOfUsersRow = rows[accountId]
    
    //              rowsToBePaid.forEach( row => {
    //                 copyOfUsersRow[copyOfUsersRow.findIndex(x => x.eventId === row.eventId)].payoutSentDate = success.data;
    //              })
                
    //              const copyOfRows = rows;
    //              copyOfRows[accountId] = copyOfUsersRow;
    //              setRows({...copyOfRows});
    //             })
                 
    //         }
    if(errorLoadingInvoice){
        return <p className="alert alert-danger">Unable to load invoices.</p>
    }
    // if(loading &&  !semesterId ){
    //     return <p>No semesters</p>
    // }
    const totalYouOweClub = rides.filter(x => !x.eventCostsPaidDate ).map(x => x.eventCostsToPay).reduce((prev,current) => prev += current,0).toFixed(2)
    return <div>
        <h2>Rides you have attended</h2>
        <CreateNewSemester allowCreatingNewSemesters={false} value={semesterId} onChange={semesterChanged}></CreateNewSemester>
        {!loading && rides.length >0 && 
        <React.Fragment>

<EventAcceptanceRow 
rows={rides} invocing={false} showPayoutAll={true} showPayEventCosts={true}
onPayEventCosts={(accountId,eventId)=>markRidePaid(accountId,eventId)}
>
 </EventAcceptanceRow>
 <h1>Totals</h1>
    
        <table className='table' style={{maxWidth:"300px"}}>
            <tbody>
        
        <tr>
        <th scope='row'>Total you owe the club</th>
        <td>£{totalYouOweClub}</td>
        </tr>
        <tr>
        <th scope='row' style={{width:"200px"}}>Total the club owes you</th>
        <td style={{width:"100px"}}>£{rides.filter(x => !x.payoutSentDate ).map(x => x.payoutTotal).reduce((prev,current) => prev += current,0).toFixed(2)}</td>
        </tr>
        </tbody>
    </table>
    {/* {totalYouOweClub >0 &&
    <div >
        <button className="btn btn-primary" onClick={markAllClubDebtPaid}>Click here to indicate you've paid everything you owe the club (£{totalYouOweClub})</button>
        <p className='form-text'>Please add a useful refenece- like your name and the term it relates to 🙏</p>
        </div>
    } */}

</React.Fragment>

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