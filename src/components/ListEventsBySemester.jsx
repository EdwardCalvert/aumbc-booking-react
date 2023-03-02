import { useEffect, useState } from "react";
import api from "../services/api";
import {Link, Navigate }from 'react-router-dom';
import CreateNewSemester from "./CreateNewSemester";

function ListEventsBySemester (){
    const [rides, setRides ]= useState([]);
    const [semesterId, setSemesterId] = useState();
    const [loading, setLoading] = useState(true);
    const [errorLoadingInvoice, setErrorLoadingInvoice] = useState(false);
    useEffect(()=>{ 
        if(semesterId){
        api.get("MtbEvent/get-all-rides",{params:{semesterId: semesterId}}).then(success => {
        if(success.status === 200){
            setRides(success.data);
            console.log("Return data:")
            console.log(success.data)
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



    if(errorLoadingInvoice){
        return <p className="alert alert-danger">Unable to load rides.</p>
    }
    return <div>
        <h2>Rides this semester</h2>
        <CreateNewSemester allowCreatingNewSemesters={false} value={semesterId} onChange={semesterChanged}></CreateNewSemester>
        {!loading && rides.length >0 && 
             <table className="table">
             <thead>
                 <tr>
                     <th scope="col">Ride Name</th>
                     <th scope="col">Date</th>
                     <th scope="col">View</th>
             </tr>
             </thead>
             <tbody>
         {rides.map((item,key)=> <tr scope="row" key={item.id}>
             <td className={!item.visible? "text-danger":""}>{item.name}</td>
             <td>{new Date(item.startDateTime).toLocaleDateString("en-GB")}</td>
             <td><Link className="btn btn-primary" to={"/event/" + item.id} >View</Link></td>
             </tr>)}
         </tbody>
         </table>

        }{loading &&
            <div>
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                </div>
            </div>
            <p>Loading </p>
            </div>
            
        }
        {!loading && rides.length == 0&&
            <p>There are no rides for the selected period </p>
        }
       
    </div>



}
export default ListEventsBySemester;