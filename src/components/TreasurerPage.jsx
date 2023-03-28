import api from './../services/api'
import React, { useEffect,useState } from 'react';
import EventAcceptanceRow from './EventAcceptanceRow';
import transportState from '../_helpers/transportState';
import CreateNewSemester from './CreateNewSemester';
import LoadingSpinner from './LoadingSpinner';

export function TreasurerPage(){
    const [rows,setRows ] = useState();
    const [unpaidRows, setUnpaidRows] = useState();
    const [paidRows, setPaidRows] = useState();
    const [semesterId,setSemesterId] = useState();
    const [errorMessage, setErrorMessage] = useState();
    var groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };

      function semesterChanged(event){
        setSemesterId(event.target.value);
    }
    
        
      useEffect(()=>{
        if(semesterId){
        api.get("mtbevent/get-acceptances",{params:{semesterId: 1}}).then(success=> {
            setRows(groupBy(success.data.map(x => {return {...x, processing: false,editPayout: false, newPayoutValue : x.payoutTotal}}) , "accountId"));
      }, error=>{ setErrorMessage(error.data.message) }
      );
    }
    },[semesterId]);


    useEffect(() =>{
        if(rows){
           
            var unpaid= []
            var paid = []
        
            Object.keys( rows).forEach( item => { 
                var tempUnpaidRow = []
                var tempPaidRow = []
        
                rows[item].forEach(currentValue =>{
                    if(currentValue.payoutTotal >0 && !currentValue.payoutSentDate ){
                        tempUnpaidRow.push(currentValue);
                    }
                    else{
                        tempPaidRow.push(currentValue);
                    }
                })
                //Order by start date
                tempUnpaidRow.sort((date1, date2) => new Date(date1.startDateTime) - new Date(date2.startDateTime));
                tempPaidRow.sort((date1, date2) => new Date(date1.startDateTime) - new Date(date2.startDateTime));
                unpaid.push(tempUnpaidRow);
                paid.push(tempPaidRow);
            }
            )
            setUnpaidRows(unpaid);
            setPaidRows(paid);
        }
        
    }, [rows]);
   
    function updateRow (accountId,eventId, property, newValue){

        let copyOfRows = rows
        const indexToRemove = rows[accountId].findIndex( x=> x.eventId === eventId);
     copyOfRows[accountId][indexToRemove][property] = newValue;
     console.log(copyOfRows);
     setRows({...copyOfRows});
    }
    function processingRecord(accountId, eventId, state){
        updateRow(accountId,eventId,"processing",state)
    }

   async function deleteRow(accountId, eventId){
        processingRecord(accountId,eventId,true);
        const indexToRemove = rows[accountId].findIndex( x=> x.eventId === eventId);

         await api.delete("finance/cancel-acceptance",{params:{eventId: eventId ,accountId:accountId }}).then( success=> {
            let copyOfRows = rows
            console.log(copyOfRows[accountId])
            copyOfRows[accountId].splice(indexToRemove,1);
            console.log(copyOfRows);
            setRows({...copyOfRows});
            
         })
         processingRecord(accountId,eventId,false);
    }

    async function onDemoteToPassenger(accountId, eventId){
        processingRecord(accountId,eventId,true);
        await  api.delete("finance/demote-acceptance-to-passenger",{params:{eventId: this.state.id ,accountId:accountId }}).then( success => {
            updateRow(accountId,eventId,"transportState",success.data.transportState);
            updateRow(accountId,eventId,"payoutTotal",success.data.payoutTotal);
            updateRow(accountId,eventId,"eventCostsToPay",success.data.eventCostsToPay)
        })
        processingRecord(accountId,eventId,false);
    }
    async function saveCustomPayoutTotal(accountId,eventId)
    {
        processingRecord(accountId,eventId,true);

        let copyOfRows = rows;
        const indexToRemove = copyOfRows[accountId].findIndex(x => x.eventId === eventId)
        copyOfRows[accountId][indexToRemove].payoutTotal = parseFloat(copyOfRows[accountId][indexToRemove].newPayoutValue) ;
        await api.post("EventAcceptance/update-payout-total",{ accountId: accountId,eventId: eventId, payoutTotal : copyOfRows[accountId][indexToRemove].payoutTotal }).then( success => {
            copyOfRows[accountId][indexToRemove].editPayout = false;
            copyOfRows[accountId][indexToRemove].customPayoutTotal = true;
            setRows({...copyOfRows});
        });
        processingRecord(accountId,eventId,false);

    }

    async function payoutItem(accountId,eventId){
        processingRecord(accountId,eventId,true);
        await api.post("finance/mark-as-paid-out",[eventId],{params: {accountId: accountId } }).then( success => {
            updateRow(accountId,eventId,"payoutSentDate",success.data);
         })
        processingRecord(accountId,eventId,false);
    }

   async function payoutAllRows(rowsToBePaid){
        if(rowsToBePaid){
            const accountId = rowsToBePaid[0].accountId;
            await api.post("finance/mark-as-paid-out",rowsToBePaid.map(x=> x.eventId),{params: {accountId: accountId}}).then( success => {

                const copyOfUsersRow = rows[accountId]

             rowsToBePaid.forEach( row => {
                copyOfUsersRow[copyOfUsersRow.findIndex(x => x.eventId === row.eventId)].payoutSentDate = success.data;
             })
            
             const copyOfRows = rows;
             copyOfRows[accountId] = copyOfUsersRow;
             setRows({...copyOfRows});
            })
             

        }
    }
    function flattenRows(){
        if(rows){
            var cheese = []
          Object.values(rows).forEach(x => {x.forEach( y=> {  if(y){
            cheese.push(y)
         }
           }) 
        });
        return cheese;
        }
        return []
    }

    let simpleRows =flattenRows() ;
   return <div>
    <CreateNewSemester allowCreatingNewSemesters={false} value={semesterId} onChange={semesterChanged}></CreateNewSemester> 
    <h1>Totals</h1>
    <LoadingSpinner show = {!( simpleRows &&  simpleRows.length > 0)}/>
    {simpleRows &&  simpleRows.length > 0  &&
        <table className='table' style={{maxWidth:"300px"}}>
            <tbody>
        <tr>
        <th scope='row' style={{width:"200px"}}>Total payout (net)</th>
        <td style={{width:"100px"}}>£{simpleRows.map(x => x.payoutTotal).reduce((prev,current) => prev += current,0).toFixed(2)}</td>
        </tr>
        <tr>
        <th scope='row'>Total payout (paid)</th>
        <td>£{simpleRows.filter(x => x.payoutSentDate ).map(x => x.payoutTotal).reduce((prev,current) => prev += current,0).toFixed(2)}</td>
        </tr>
        <tr>
        <th scope='row'>Event costs (net)</th>
        <td>£{simpleRows.map(x => x.eventCostsToPay).reduce((prev,current) => prev += current,0).toFixed(2)}</td>
        
        </tr>
        <tr>
        <th scope='row'>Event costs (recieved)</th>
        <td>£{simpleRows.filter(x => x.eventCostsPaidDate ).map(x => x.eventCostsToPay).reduce((prev,current) => prev += current,0).toFixed(2)}</td>
        </tr>
        </tbody>
    </table>
    }
    

    <h1>Unpaid Drivers</h1>
    <LoadingSpinner show = {!unpaidRows}/>
    

{unpaidRows &&

unpaidRows.map(row => row.length > 0 &&
<React.Fragment key={row[0].accountId}> 
    <h4>{row[0].firstName} {row[0].lastName}</h4>
    <EventAcceptanceRow 
                  rows={row} invocing={true} showPayoutAll={true} showAdminControls={true}
                  onDelete={(accountId,eventId) => deleteRow(accountId,eventId)} 
                   onDemoteToPassenger={(accountId,eventId) => onDemoteToPassenger(accountId,eventId)} 
                   togglePayoutEdit={(accountId,eventId,newValue) => updateRow(accountId,eventId,"editPayout",newValue)} 
                   setCustomPayoutTotal={(accountId,eventId, newValue) =>   updateRow(accountId,eventId,"newPayoutValue",newValue)}
                   saveCustomPayoutTotal={(accountId,eventId)=> saveCustomPayoutTotal(accountId,eventId)}
                   payoutItem={(accountId,eventId) => payoutItem(accountId,eventId) }
                   payoutAllRows={(rowsToBePaid) => payoutAllRows(rowsToBePaid) }
                  >
                   </EventAcceptanceRow>
                   </React.Fragment> )}

<hr/>
    <h1>All other responses</h1>
    <LoadingSpinner show = {!paidRows}/>
{paidRows &&
paidRows.map(row => row.length > 0 &&
<React.Fragment key={row[0].accountId}> 
    <h4>{row[0].firstName} {row[0].lastName}</h4>
    <EventAcceptanceRow 
                  rows={row} invocing={true} showAdminControls={true}
                  onDelete={(accountId,eventId) => deleteRow(accountId,eventId)}  > 
                   </EventAcceptanceRow>
                   </React.Fragment> )
}


   </div>
     
   
}
