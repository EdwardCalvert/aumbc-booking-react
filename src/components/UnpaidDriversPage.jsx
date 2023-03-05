import React, {useEffect, useState } from 'react';
import api from '../services/api.js';
import { Link } from 'react-router-dom';

function UnpaidDriversPage(){
    const [errorWhileLoading, setErrorWhileLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState([]);
    useEffect(()=>{
        console.log("DEV MODE")
        console.log(!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
        api.get("Finance/get-all-unpaid-payouts").then(success => {
            if(success.status === 200){
            setErrorWhileLoading(false);
            setLoading(false);
            console.log(success.data);
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

    return <div><h2>Drivers that have not been paid yet</h2>
    {!loading && rows &&
        <div>
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
                    
                    <td>£{x.payoutDue}</td>
                    <td><Link to={"/event/" + x.eventId} className="btn btn-secondary">View</Link></td>
                </tr>
                )}
                <tr>
                    <td colSpan={3}></td>
                    <td>Total</td>
                    <td><input type='number' value={outerItem[emailAddress].totalPayoutDue} onChange={(e) => UpdatePayout(e,emailAddress,outerIndex) } step={0.01} min={0} max={1000}  required/></td>
                    <td><button type='submit' className='btn btn-primary' onClick={(e) => onFormSumbitted(e,emailAddress,outerIndex)}>Mark as paid</button></td>
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
    {loading &&
        <p>Loading ... </p>
    }
    {errorWhileLoading &&
        <p className='alert alert-danger'> An error occured while processing your request.</p>
    }
    </div>

    // function DoUser(){
    //     for (const [key, value] of Object.entries(object)) {
    //         console.log(key, value);
    //       }
    // }
}

export default UnpaidDriversPage;