import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from './../services/api'
function PeopleAttendingRidePage(){
    const id = useParams().id
    
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
        return <div><h2>Riders attending event</h2><p className="alert alert-danger">Unable to load the data</p></div>
    }
    if(loadingData){
        return <div><h2>Riders attending event</h2><p>Loading</p></div>
    }
    if(rows.length == 0){
        return <div><h2>Riders attending event</h2><p>No submissions have been recieved yet.</p></div>
    }
    return <div><h2>Riders attending event</h2>
    <p>Please note: this does not update. </p>
    {rows.length >0 &&
    <table className="table">
        <thead>
            <tr>
            <th scope="col">Name</th>
            <th scope="col">💺</th>
            <th scope="col">🚲</th>
            <th scope="col">In Queue</th>
            <th scope="col">Club bike</th>
            <th scope="col">Give it a Go</th>
            </tr>
        </thead>
        <tbody>
            {rows.map((item, index) =><tr scope="row"  key={index}>
                <td>{item.firstName} {item.lastName}</td>
               
                <td>{item.numberOfSeats? item.numberOfSeats :"-"}</td>
                <td>{item.numberOfBikeSpaces ? item.numberOfSeats : "-"}</td>
                <td>{item.inQueue?"Yes":"No"}</td>
                <td>{item.borrowClubBike ?"Yes" :"-"}</td>
                <td>{item.giveItAGo?"Yes" : "-"}</td>
            </tr>)

            }
            
        </tbody>
    </table>
}

</div>
}
export default PeopleAttendingRidePage;