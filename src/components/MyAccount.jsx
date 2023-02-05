import { useEffect, useState } from "react";
import api from "./../services/api";
import {Link }from 'react-router-dom';

function MyAccount (){
    const [rides, setRides ]= useState([])
    useEffect(()=>{ api.get("Invoice").then(success => {
        console.log(success);
        if(success.status === 200){
            setRides(success.data);
        }
    }, errror => {
        console.log(errror);
    })


    },[])
    return <div>
        <table className="table">
            <thead>
            <th scope="col">Ride Name</th>
            <th scope="col">Date</th>
            <th scope="col">Cost</th>
            <th scope="col">Payout</th>
            <th scope="col">View</th>
            </thead>
            <tbody>
        {rides.map((item,key)=> <tr scope="row">
            <td>{item.name}</td>
            <td>{new Date(item.startDateTime).toLocaleDateString("en-GB")}</td>
            <td>£{item.costToPay.toFixed(2)}</td>
            <td>£{item.payoutRequired.toFixed(2)}</td>
            <td><Link className="btn btn-primary" to={"/event/"+item.eventId}>View</Link></td>
            </tr>)}
        </tbody>
        </table>
    </div>



}
export default MyAccount;