
import React, { useEffect, useState } from "react";
import api from "../services/api";
import {Link }from 'react-router-dom';
import CreateNewSemester from "./CreateNewSemester";

function PaidDriversPage (){
    const [invoices, setInvoices ]= useState([]);
    const [semesterId, setSemesterId] = useState();
    const [loading, setLoading] = useState(true);
    const [errorLoadingInvoice, setErrorLoadingInvoice] = useState(false);
    useEffect(()=>{ 
        if(semesterId){
        api.get("Finance/get-driver-payouts",{params:{semesterId: semesterId}}).then(success => {
        if(success.status === 200){
            setInvoices(success.data);
        }
        else{
            setInvoices([]);
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

    if(errorLoadingInvoice){
        return <p className="alert alert-danger">Unable to load invoices.</p>
    }
    return <div>
        <h2>Driver payouts</h2>
        <CreateNewSemester allowCreatingNewSemesters={false} value={semesterId} onChange={semesterChanged}></CreateNewSemester>
        {!loading && invoices.length >0 && 
             <table className="table">
             <thead>
                 <tr>
                     <th scope="col">Driver Name</th>
                     <th scope="col">Paid by</th>
                     <th scope="col">Payout Total</th>
                     <th scope="col">Payout Date</th>
                     <th scope="col">Rides Attended</th>    
             </tr>
             </thead>
             <tbody>
         {invoices.map((item,mainIndex)=> item.rideNames.map((rideName,index) => (<tr scope="row" key={item.eventId}> 
         {index === 0&&
         <React.Fragment>
             <td rowSpan={item.rideNames.length}>{item.firstName} {item.lastName}</td>
             <td rowSpan={item.rideNames.length}>{item.adminFirstName} {item.adminLastName}</td>
             <td rowSpan={item.rideNames.length}>£{item.payoutTotal.toFixed(2)}</td>
             <td rowSpan={item.rideNames.length}>{new Date(item.payoutDate).toLocaleDateString("en-GB")}</td>
             </React.Fragment>
         }
         <td>{item.rideNames[index]}</td>

             </tr>)))}
         </tbody>
         </table>

        }{loading &&
            <div>
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                </div>
            </div>
            <p>We're peddaling like Murdo to process your request... </p>
            </div>
            
        }
        {!loading && invoices.length == 0&&
            <p>There are no invoices for the selected period </p>
        }
       
    </div>



}

export default PaidDriversPage;