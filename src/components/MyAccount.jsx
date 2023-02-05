import { useEffect, useState } from "react";
import api from "./../services/api";
import {Link }from 'react-router-dom';
import CreateNewSemester from "./CreateNewSemester";

function MyAccount (){
    const [rides, setRides ]= useState([]);
    const [semesterId, setSemesterId] = useState();
    const [loading, setLoading] = useState(true);
    useEffect(()=>{ 
        if(semesterId){
        api.get("Finance/invoice-by-semester",{params:{semesterId: semesterId}}).then(success => {
        console.log(success);
        if(success.status === 200){
            setRides(success.data);
        }
        setLoading(false);
        
    }, errror => {
        console.log(errror);
    })

   
        }

    },[semesterId])

    function semesterChanged(event){
        console.log(event);
        setSemesterId(event.target.value);
         console.log("called");
        api.get("Finance/invoice-by-semester",{params:{semesterId: event.target.value}}).then(success => {
            console.log(success);
            if(success.status === 200){
                setRides(success.data);
            }
        }, errror => {
            console.log(errror);
        })

    }
    return <div>
        <CreateNewSemester allowCreatingNewSemesters={false} value={semesterId} onChange={semesterChanged}></CreateNewSemester>
        {!loading && 
             <table className="table">
             <thead>
                 <tr>
                     <th scope="col">Ride Name</th>
                     <th scope="col">Date</th>
                     <th scope="col">Cost</th>
                     <th scope="col">Paid?</th>
                     <th scope="col">Payout</th>
                     <th scope="col">Payout sent?</th>
                     <th scope="col">View</th>
             </tr>
             </thead>
             <tbody>
         {rides.map((item,key)=> <tr scope="row">
             <td>{item.name}</td>
             <td>{new Date(item.startDateTime).toLocaleDateString("en-GB")}</td>
             <td>£{item.costToPay.toFixed(2)}</td>
             <td>{item.paymentSent? "Yes": "No"}</td>
             <td>£{item.payoutRequired.toFixed(2)}</td>
             <td>{item.payoutSent ? "Yes" : "No"}</td>
             <td><Link className="btn btn-primary" to={"/event/"+item.eventId}>View</Link></td>
             </tr>)}
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
       
    </div>



}
export default MyAccount;