import api from './../services/api'
import React, { useEffect,useState } from 'react';
import EventAcceptanceRow from './PeopleAttendingRidePage';
import transportState from '../_helpers/transportState';

export function TreasurerPage(){

    const [rows,setRows ] = useState();
    const [unpaidRows, setUnpaidRows] = useState();
    const [paidRows, setPaidRows] = useState();
    var groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };

    
      useEffect(()=>{
        api.get("mtbevent/get-acceptances",{params:{semesterId: 1}}).then(success=> {
            var dict = groupBy(success.data , "accountId");
           
            var unpaid= []
            var paid = []

            Object.keys( dict).forEach( item => { 
               
                var tempUnpaidRow = []
                var tempPaidRow = []

                dict[item].forEach(currentValue =>{
                    if(currentValue.payoutTotal >0 && !currentValue.payoutSentDate ){
                        tempUnpaidRow.push(currentValue);
                    }
                    else{
                        tempPaidRow.push(currentValue);
                    }
                })

                unpaid.push(tempUnpaidRow);
                paid.push(tempPaidRow);
                // dict[item ] = dict[item].reduce(([paid,unpaid], currentValue) => {
                //     if(currentValue.payoutTotal >0 && currentValue.payoutDateSent ===null&& currentValue.transportState === transportState.Driving)
                //     {
                //         unpaid.push(currentValue)
                //     }
                //     else{
                //         paid.push(currentValue)
                //     }
                //     return [unpaid,paid]
                //  },[[],[]] )
            
            })
            setRows(dict);
            setUnpaidRows(unpaid);
            setPaidRows(paid);
            

      });
    },[]);

    if(unpaidRows){
   return <div> 
    <h1>Unpaid Drivers</h1>

    {unpaidRows.map(row =><React.Fragment key={row[0].accountId}> 
    <h4>{row[0].firstName} {row[0].lastName}</h4>
    <EventAcceptanceRow 
                  rows={row} invocing={true}>
                   </EventAcceptanceRow>
                   </React.Fragment> )}

<hr/>
    <h1>All other responses</h1>

{paidRows.map(row =><React.Fragment key={row[0].accountId}> 
<h4>{row[0].firstName} {row[0].lastName}</h4>
<EventAcceptanceRow 
              rows={row} invocing={true}>
               </EventAcceptanceRow>
               </React.Fragment> )}
    
   </div>
}

    //   if(rows){

    //     //Need unpaid drivers first, then paid drivers
    //     // Object.entries(rows).map(([accountId, paidAndUnpaidList ])=>{
    //     //     paidAndUnpaidList.map(rowItem => { console.log(rowItem)})});
    //   return <div> {Object.entries(rows).map(([accountId, paidAndUnpaidList ])=><div> 
    //             {/* <p>{paidAndUnpaidList[0]}</p> */}
    //         <EventAcceptanceRow 
    //             rows={paidAndUnpaidList[1]} >
  
    //             </EventAcceptanceRow>
    //             <EventAcceptanceRow 
    //             rows={paidAndUnpaidList[0]} >
  
    //             </EventAcceptanceRow>
    //             </div>
                
       
    //         )}
    //   </div>}
      


      
    
    


     
   
}
