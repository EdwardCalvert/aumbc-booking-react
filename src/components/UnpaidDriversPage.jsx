import {useEffect, useState } from 'react';
import api from '../services/api.js';
import { Link } from 'react-router-dom';

function UnpaidDriversPage(){
    const [errorWhileLoading, setErrorWhileLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState();
    const [payoutValues ,setPayoutValues ] =useState([]);
    useEffect(()=>{
        console.log("DEV MODE")
        console.log(!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
        api.get("Finance/get-all-unpaid-payouts").then(success => {
            if(success.status === 200){
            setErrorWhileLoading(false);
            setLoading(false);
            console.log(success.data);
            setRows(success.data);
            setPayoutValues(Object.entries(success.data).map(([emailAddress, value]) => value.totalPayoutDue ));
            console.log(Object.entries(success.data).map(([emailAddress, value]) => value.totalPayoutDue ));
            }
        }, 
            error => {
                setErrorWhileLoading(true);
                setLoading(false);
        });
    },[]);

    function UpdatePayout(event, emailAddress){
        console.log(emailAddress);
    }
    function onFormSumbitted(event){
        event.preventDefault();
        console.log(event);
    }

    return <div><h2>Drivers that have not been paid yet</h2>
    {!loading && rows &&
        <div>
        { Object.entries(rows).map(([emailAddress, value])=>
        <form onSubmit={onFormSumbitted}>
            <table className="table" key={emailAddress}>
            <thead> 
                <tr>
                    <th scope='col'>Email Address</th>
                    <th scope="col">Ride Name</th>
                    <th scope="col">Date</th>
                    <th scope="col">Semester</th>
                    <th scope="col">Payout</th>
                    <th scope="col">View</th>
                </tr>
            </thead>
            <tbody> 
                {value.receiptRows.map((x, index)=> <tr>
                    {index === 0&&
                        <td rowSpan={value.receiptRows.length}>{emailAddress}</td>
                    }
                    <td>{x.name}</td>
                    <td>{ new Date(x.startDateTime).toLocaleDateString("en-GB")}</td>
                    <td>{x.semesterName}</td>
                    <td>£{x.payoutDue}</td>
                    <td><Link to={"/event/" + x.eventId} className="btn btn-secondary">View</Link></td>
                </tr>
                )}
                <tr>
                {/* £{value.totalPayoutDue} */}
                    <td colSpan={3}></td>
                    <td>Total</td>
                    <td><input type='number' value={rows[emailAddress].totalPayoutDue} onchange={(e) => UpdatePayout(e,emailAddress) } step={0.01} min={0} max={1000}  required/></td>
                    <td><button type='submit' className='btn btn-primary'>Mark as paid</button></td>
                </tr>
            </tbody>
            </table>
            <p>Please note: the mark as paid button will do absolutely nothing!</p>
            </form>
         )}
         </div>
        
    


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