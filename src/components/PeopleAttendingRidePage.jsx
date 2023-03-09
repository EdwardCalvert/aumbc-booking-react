import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import authenticationService from "../services/authentication.service";
import api from './../services/api'
import LoadingSpinner from "./LoadingSpinner";
function PeopleAttendingRidePage(props){
    const TransportDescriptors = {1: "Making own way there", 2: "Passenger", 4: "Queueing as passenger",8: "Driving"}
    const rows = props.rows
    if(rows && rows.length == 0){
        return <div><h3>Riders attending event</h3><p>No submissions have been recieved yet.</p></div>
    }
    return <div><h3>Riders attending event</h3>
    {rows && rows.length >0 &&
    <table className="table">
        <thead>
            <tr>
            <th scope="col">Name</th>
            <th scope="col">Transport</th>
            <th scope="col">Club bike</th>
            <th scope="col">Give it a Go</th>
            </tr>
        </thead>
        <tbody>

            {rows.map((item, index) =>   <React.Fragment  key={index}><tr scope="row" >
                <td>{item.firstName} {item.lastName}</td>
                {item.transportState == 8 &&
                    <td>{item.numberOfSeats}💺&nbsp;&nbsp;{item.numberOfBikeSpaces }🚲</td>
                }
                {item.transportState !== 8 &&
                    <td>{ TransportDescriptors[ item.transportState]}</td>
                }

                <td>{item.borrowClubBike ?"Yes" :"-"}</td>
                <td>{item.giveItAGo?"Yes" : "-"}</td>
            </tr>
            { authenticationService.isAdmin() && item.otherComments &&
                <tr><th scope="col">Comments:</th>
                    <td  style={{whiteSpace: 'pre-line'}} colSpan={5}>{item.otherComments}</td></tr>
            }
            </React.Fragment>
            )}

        </tbody>
    </table>

}


</div>
}
export default PeopleAttendingRidePage;