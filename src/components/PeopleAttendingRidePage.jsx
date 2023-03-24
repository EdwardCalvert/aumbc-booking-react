import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import authenticationService from "../services/authentication.service";
import api from './../services/api'
import transportState from "../_helpers/transportState";
import LoadingSpinner from "./LoadingSpinner";
import { Link } from "react-router-dom";
function EventAcceptanceRow(props){
    const TransportDescriptors = {1: "Making own way there", 2: "Queueing ", 4: "Passenger",8: "Driving"}
    const rows = props.rows

    function getRowWidth(){
        return authenticationService.isAdmin()? "11.5%":"30%"
    }

    if(rows && rows.length == 0){
        return <div><h4>Riders attending event</h4><p>No submissions have been recieved yet.</p></div>
    }
    return <div>
    {rows && rows.length >0 &&
    <div className="table-responsive">
    <table className="table">
        <thead>
            <tr>
            <th scope="col">Name</th>
            <th scope="col">Transport</th>
            
            {authenticationService.isAdmin() &&
                <React.Fragment>
                    <th scope="col">Club bike</th>
                     <th scope="col">Give it a Go</th>
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
                
                <td style={{width:"31%"}}> {props.invocing?  <Link to={`/event/${item.eventId}`}>{item.name}</Link> : `${item.firstName} ${item.lastName}` }</td>
                {item.transportState == 8 &&
                    <td style={{width:getRowWidth()}}>{item.numberOfSeats}💺&nbsp;&nbsp;{item.numberOfBikeSpaces }🚲</td>
                }
                {item.transportState !== 8 &&
                    <td style={{width:getRowWidth()}}>{ TransportDescriptors[ item.transportState]}</td>
                }

               
                { authenticationService.isAdmin() &&
                    <React.Fragment>
                         <td style={{width:getRowWidth()}}>{item.borrowClubBike ?"Yes" :"-"}</td>
                <td style={{width:getRowWidth()}}>{item.giveItAGo?"Yes" : "-"}</td>
                        <td style={{width:getRowWidth()}}> <div className={(item.eventCostsPaidDate?  " text-success": "")}>{ item.eventCostsToPay !== 0? ("£"+item.eventCostsToPay.toFixed(2)):"-" } </div></td>
                        <td> <div className={"display-flex"  + (item.payoutSentDate?  " text-success": "")}>{ item.payoutTotal !== 0 ?( "£"+item.payoutTotal.toFixed(2)):"-"}{item.customPayoutTotal? <span><i className="bi bi-pencil"></i></span>:""} </div></td>
                        <td style={{width:getRowWidth()}}>
                            {item.processing &&
                                <LoadingSpinner/>
                            }
                            {!item.processing &&
                                <div className="display-flex">
                           
                            { !(item.eventCostsPaidDate || item.payoutSentDate) &&
                            <button title="Delete this payout" className="btn btn-danger btn-sm btn-block me-1" onClick={()=>props.onDelete(item.accountId)}><i className="bi bi-trash"></i></button>
                            } 
                            {item.transportState === transportState.Driving? <React.Fragment> 
                                {!item.payoutSentDate &&  item.payoutTotal >0&&
                                     <button title="Mark the amount due to the driver as paid" className="btn btn-sm btn-primary btn-block me-1" onClick={()=> props.payoutItem(item.accountId, !item.editPayout)}> <i className="bi bi-currency-pound"></i></button> 
                                }
                               
                                <button title="This person attended as a passenger" className="btn btn-sm btn-secondary btn-block me-1" onClick={()=> props.onDemoteToPassenger(item.accountId)}><i className="bi bi-person-down"></i></button> 
                                <button title="Edit the payout cost" className="btn btn-sm btn-secondary btn-block me-1" onClick={()=> props.togglePayoutEdit(item.accountId, !item.editPayout)}> <i className="bi bi-pencil"></i></button> 
                              
                                </React.Fragment>:""}
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
                        <td><input  style={{maxWidth:"90px"}} className="form-control" value={item.newPayoutValue} onChange={(e)=> props.setCustomPayoutTotal(item.accountId,e.target.value) } type="number"></input></td>
                        <td><button disabled={item.processing} className="btn btn-sm btn-primary" onClick={()=> props.saveCustomPayoutTotal(item.accountId)}>Update</button></td>
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
                <td>£{rows.map(x =>x.eventCostsToPay).reduce((prev,current) => prev += current).toFixed(2)}</td>
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
export default EventAcceptanceRow;