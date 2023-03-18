import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import authenticationService from "../services/authentication.service";
import api from './../services/api'
import transportState from "../_helpers/transportState";
import LoadingSpinner from "./LoadingSpinner";
function PeopleAttendingRidePage(props){
    const TransportDescriptors = {1: "Making own way there", 2: "Queueing ", 4: "Passenger",8: "Driving"}
    const rows = props.rows
    const mtbEvent = props.event
    if(rows && rows.length == 0){
        return <div><h4>Riders attending event</h4><p>No submissions have been recieved yet.</p></div>
    }
    return <div><h4>Riders attending event</h4>
    {rows && rows.length >0 &&
    <div className="table-responsive">
    <table className="table">
        <thead>
            <tr>
            <th scope="col">Name</th>
            <th scope="col">Transport</th>
            <th scope="col">Club bike</th>
            <th scope="col">Give it a Go</th>
            {authenticationService.isAdmin() &&
                <React.Fragment>
                    <th scope="col">In</th>
                    <th scope="col">Out</th>
                    <th scope="col">Controls</th>
                    </React.Fragment>
            }
            </tr>
        </thead>
        <tbody>

            {rows.map((item, index) =>   <React.Fragment  key={index}>
               
                <tr scope="row" >
                
                <td>{item.firstName} {item.lastName}</td>
                {item.transportState == 8 &&
                    <td>{item.numberOfSeats}💺&nbsp;&nbsp;{item.numberOfBikeSpaces }🚲</td>
                }
                {item.transportState !== 8 &&
                    <td>{ TransportDescriptors[ item.transportState]}</td>
                }

                <td>{item.borrowClubBike ?"Yes" :"-"}</td>
                <td>{item.giveItAGo?"Yes" : "-"}</td>
                { authenticationService.isAdmin() &&
                    <React.Fragment>
                        <td>£{DisplayInboundCost(item,mtbEvent).toFixed(2)}</td>
                        <td> <div className="display-flex">{item.transportState ===  transportState.Driving? "£"+item.payoutTotal.toFixed(2):"-"}{item.customPayoutTotal? <span><i className="bi bi-pencil"></i></span>:""} </div></td>
                        <td>
                            {item.processing &&
                                <LoadingSpinner/>
                            }
                            {!item.processing &&
                                <div className="display-flex">
                            <button className="btn btn-danger btn-sm btn-block me-1" onClick={()=>props.onDelete(item.emailAddress)}><i className="bi bi-trash"></i></button>
                            {item.transportState === transportState.Driving? <React.Fragment> 
                                <button className="btn btn-sm btn-secondary btn-block me-1" onClick={()=> props.onDemoteToPassenger(item.emailAddress)}><i className="bi bi-person-down"></i></button> 
                                <button className="btn btn-sm btn-secondary btn-block me-1" onClick={()=> props.togglePayoutEdit(item.emailAddress, !item.editPayout)}> <i class="bi bi-pencil"></i></button> </React.Fragment>:""}
                            </div>
                            }
                            </td>
                        
                    </React.Fragment>
                }
               
            </tr>
            {item.editPayout&&
                    <tr>
                        <td colSpan={4}></td>
                        <th scope="row">New amount</th>
                        <td><input  style={{maxWidth:"90px"}} className="form-control" value={item.newPayoutValue} onChange={(e)=> props.setCustomPayoutTotal(item.emailAddress,e.target.value) } type="number"></input></td>
                        <td><button disabled={item.processing} className="btn btn-sm btn-primary" onClick={()=> props.saveCustomPayoutTotal(item.emailAddress)}>Update</button></td>
                    </tr>
                }
            { authenticationService.isAdmin() && item.otherComments &&
                <tr><th scope="col">Comments:</th>
                    <td  style={{whiteSpace: 'pre-line'}} colSpan={6}>{item.otherComments}</td></tr>
            }
            </React.Fragment>
            )}
            {authenticationService.isAdmin() &&

                <tr>
                    <td colSpan={3}></td>
                    <th scope="col">Totals</th>
                <td>£{rows.map(x => DisplayInboundCost(x,mtbEvent)).reduce((prev,current) => prev += current).toFixed(2)}</td>
                    <td>£{rows.map(x =>x.payoutTotal).reduce((prev,current) => prev += current).toFixed(2)}</td>
                    <td colSpan={1}></td>
                </tr>

            }

        </tbody>
    </table>
    </div>

}


</div>
}

// function DisplayCost(){
//     return <React.Fragment><td className={item.markedAsPaidDate  || item.paymentDue ==0? "text-success": "text-danger"}>£{item.paymentDue.toFixed(2)}</td>
//     <td className={item.payoutSent || item.payoutDue == 0 ? "text-success": "text-danger" }>£{item.payoutDue.toFixed(2)}</td>
//     </React.Fragment>
// }

function DisplayInboundCost(item,mtbEvent){
    switch(item.transportState){
        case transportState.Driving:
        case transportState.MakingOwnWayThere:
            return  mtbEvent.costForDriver;
        default:
            return mtbEvent.costForPassenger
       
            
    }

}
export default PeopleAttendingRidePage;