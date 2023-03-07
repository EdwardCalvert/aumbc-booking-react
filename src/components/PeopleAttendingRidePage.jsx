import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import authenticationService from "../services/authentication.service";
import api from './../services/api'
function PeopleAttendingRidePage(){
    const id = useParams().id
    
    const TransportDescriptors = {1: "Making own way there", 2: "Passenger", 4: "Queueing as passenger",8: "Driving"}

    const [errorWhileLoading, setErrorWhileLoading] = useState(false);
    const [rows ,setRows] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(()=>{
        api.get("MtbEvent/get-people-on-ride",{params:{eventId : id }}).then(success => {
            if(success.status === 200){
                setRows(success.data)
            }
        }, error=>{
            setErrorWhileLoading(true);
        })
        setLoadingData(false);
    },[])
    if(errorWhileLoading){
        return <div><h3>Riders attending event</h3><p className="alert alert-danger">Unable to load the data</p></div>
    }
    if(loadingData){
        return <div><h3>Riders attending event</h3><p>Loading</p></div>
    }
    if(rows.length == 0){
        return <div><h3>Riders attending event</h3><p>No submissions have been recieved yet.</p></div>
    }
    return <div><h3>Riders attending event</h3>
    <p>Please note: this does not update. </p>
    {rows.length >0 &&
    <table className="table">
        <thead>
            <tr>
            <th scope="col">Name</th>
            <th scope="col">💺</th>
            <th scope="col">🚲</th>
            <th scope="col">Transport</th>
            <th scope="col">Club bike</th>
            <th scope="col">Give it a Go</th>
            </tr>
        </thead>
        <tbody>
          
            {rows.map((item, index) =>   <React.Fragment  key={index}><tr scope="row" >
                <td>{item.firstName} {item.lastName}</td>
               
                <td>{item.numberOfSeats? item.numberOfSeats :"-"}</td>
                <td>{item.numberOfBikeSpaces ? item.numberOfSeats : "-"}</td>
                <td>{ TransportDescriptors[ item.transportState]}</td>
                <td>{item.borrowClubBike ?"Yes" :"-"}</td>
                <td>{item.giveItAGo?"Yes" : "-"}</td>
            </tr>
            { authenticationService.isAdmin() && item.otherComments &&
                <tr><td  style={{whiteSpace: 'pre-line'}} colSpan={6}>{item.otherComments}</td></tr>
            }
            </React.Fragment>
            )}
            
        </tbody>
    </table>
}

</div>
}
export default PeopleAttendingRidePage;