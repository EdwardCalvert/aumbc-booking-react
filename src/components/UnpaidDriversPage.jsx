import React, {useEffect, useState } from 'react';
import api from '../services/api.js';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner.jsx';

function UnpaidDriversPage(){
    const [errorWhileLoading, setErrorWhileLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState([]);
    useEffect(()=>{
        api.get("Finance/get-all-unpaid-payouts").then(success => {
            if(success.status === 200){
            setErrorWhileLoading(false);
            setLoading(false);
            setRows(success.data);
            }
            setLoading(false)
        }, 
            error => {
                setErrorWhileLoading(true);
                setLoading(false);
        });
    },[]);

    function UpdatePayout(event, emailAddress,outerIndex){
        const copyOfRows = rows
        copyOfRows[outerIndex][emailAddress].totalPayoutDue = event.target.value;
        setRows( [...copyOfRows]);
    }
    function onFormSumbitted(event,emailAddress,outerIndex){
        event.preventDefault();
        const semesterId = rows[outerIndex][emailAddress].receiptRows[0].semesterId;
        const eventIds = rows[outerIndex][emailAddress].receiptRows.map(x => x.eventId);
         api.post("finance/payout-driver", { payoutTotal: rows[outerIndex][emailAddress].totalPayoutDue , eventIds: eventIds, recipientEmail: emailAddress, semesterId: semesterId}).then(success => {
            const copyOfRows = rows;
            delete copyOfRows[outerIndex][emailAddress];
            setRows([...copyOfRows]);
        }, error => {})
         

    }

    function RemoveRow(eventId,emailAddress,outerIndex){
        const copyOfRows = rows
        const indexToRemove = copyOfRows[outerIndex][emailAddress].receiptRows.findIndex(x=> x.eventId === eventId);
        const costOfRowToRemove = copyOfRows[outerIndex][emailAddress].receiptRows[indexToRemove].payoutDue

        copyOfRows[outerIndex][emailAddress].receiptRows.splice(indexToRemove,1);
        copyOfRows[outerIndex][emailAddress].totalPayoutDue = copyOfRows[outerIndex][emailAddress].totalPayoutDue - costOfRowToRemove;
        setRows( [...copyOfRows]);
    }

    function CancelAcceptance(eventId,emailAddress,outerIndex){
        api.delete("finance/cancel-acceptance",{params:{eventId: eventId ,emailAddress:emailAddress }})
        RemoveRow(eventId,emailAddress,outerIndex);
        
    }

    function DemoteToPassenger(eventId,emailAddress,outerIndex){
        api.delete("finance/demote-acceptance-to-passenger",{params:{eventId: eventId ,emailAddress:emailAddress }})
        RemoveRow(eventId,emailAddress,outerIndex);
        
    }

    return <div><h2>Drivers that have not been paid yet</h2>
    <h3>A wee technical overview</h3>
    <p>We find the distance between the lift share location and the ride start location, which we double, then multiply by a factor of 1.1 (as the mpg stated is unlikely to be reached).<br/>
     We use the mpg from the event acceptance and the fuel price defined on the semester to calculate the total cost. 
        <br/> Let maxEffectivePeople = number of seats + number of bike spaces. 
    <br/> Since this also includes the driver's costs, we select the maximum of 0.5 or (maxEffectivePeople - 1)/maxEffectivePeople to exclude the drivers costs. 0.5 was chosen as it is invisiged that all cars would have at least two occupants!  </p>
    <p>I am incredibly happy for you to ask all questions you have about how pricing is calculated, it is a computer so it is fallible and there are many edge cases that I won't have thought of, so it is more of a guide and approximation than anything else. Source code for the backend is availble on request! </p>
    <p>Payout- The estimated extra cost to the driver for transporting the other passengers </p>
    <p>Passenger- if more drivers attended that was needed for car space, you may demote someone to a passenger instead</p>
    {!loading && rows &&
        <div className='table-responsive'>
        {rows.map( (outerItem, outerIndex) => Object.entries(outerItem).map(([emailAddress, value])=>
        <form onSubmit={onFormSumbitted} key={outerIndex + emailAddress}>
            <table className="table" >
            <thead> 
                <tr>
                    <th scope='col'>Name</th>
                    <th scope="col">Semester</th>
                    <th scope="col">Ride Name</th>
                    <th scope="col">Date</th>
                    <th scope="col">Payout</th>
                    <th scope="col">View</th>
                    <th scope='col'>Passenger</th>
                    <th scope='col'>Cancel</th>
                </tr>
            </thead>
            <tbody> 
                {value.receiptRows.map((x, index)=> <tr key={emailAddress+index}>
                    {index === 0&&
                    <React.Fragment>
                        <td rowSpan={value.receiptRows.length}>{x.firstName} {x.lastName}</td>
                        <td rowSpan={value.receiptRows.length}>{x.semesterName}</td>
                        </React.Fragment>
                    }
                    <td>{x.name}</td>
                    <td>{ new Date(x.startDateTime).toLocaleDateString("en-GB")}</td>
                    
                    <td>£{x.payoutDue.toFixed(2)}</td>
                    <td>
                        <Link to={"/event/" + x.eventId} className="btn btn-sm btn-secondary  ">View</Link>
                    </td>
                    <td> <button className="btn btn-sm btn-secondary  " onClick={()=>DemoteToPassenger(x.eventId,emailAddress,outerIndex)} >Passenger</button></td>
                    <td><button className="btn btn-sm btn-danger  " onClick={()=>CancelAcceptance(x.eventId,emailAddress,outerIndex)}>Cancel</button></td>
                </tr>
                )}
                <tr>
                    <td colSpan={3}></td>
                    <td>Total</td>
                    <td><input type='number' value={outerItem[emailAddress].totalPayoutDue} onChange={(e) => UpdatePayout(e,emailAddress,outerIndex) } step={0.01} min={0} max={1000}  required/></td>
                    <td colSpan={2}><button type='submit' className='btn btn-primary' onClick={(e) => onFormSumbitted(e,emailAddress,outerIndex)}>Mark as paid</button></td>
                    <td></td>
                </tr>
            </tbody>
            </table>
            </form>
         ))}
         </div>

    }
    {!loading && rows.length === 0  &&
        <p>There are no drivers to pay for the selected period</p>
    }
    <LoadingSpinner show={loading}>
        Loading ...
    </LoadingSpinner>

    {errorWhileLoading &&
        <p className='alert alert-danger'> An error occured while processing your request.</p>
    }
    </div>

}

export default UnpaidDriversPage;