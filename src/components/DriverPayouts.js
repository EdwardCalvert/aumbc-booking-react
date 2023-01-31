import React, { Component } from "react";


class DriverPayouts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            LiterOfFuel : 1.70,
            DriverPayouts : [{
                firstName : "Edward",
                lastName : "Calvert",
                distanceTravelled : 385,
                ammountDue: 44.6,
                mpg :100,
                petrol : true,
                rides : [
                    {
                    eventName : "glentress",
                    distance : 320,
                    date : "16/01/2023"},
                    {
                        eventName : "durris",
                        distance : 32,
                        date : "18/01/2023"}


                ]
            },
            {
                firstName : "Cara",
                lastName : "Calvert",
                distanceTravelled : 999,
                ammountDue: 780,
                mpg :100,
                petrol : true,
                rides : [
                    {
                    eventName : "glentress",
                    distance : 460,
                    date : "16/01/2023"},
                    {
                        eventName : "durris",
                        distance : 320,
                        date : "18/01/2023"},
                        {
                            eventName : "Glen Livet",
                            distance : 43,
                            date : "18/01/2023"}


                ]
            }
            ]
        };
      }

      render(){
        return <div>      
            <p>Sucessful app will allow payments to be made on a ride-level and a driver level. Need an accountability </p>     
    <table className="table ">
        <tbody>
            {this.state.DriverPayouts.map(item => 
            <React.Fragment>
                
                <tr className="pb-3 ">
                    <th scope="row" colSpan={3}>{item.firstName} {item.lastName} - £{item.ammountDue.toFixed(2)} ({item.petrol? "Petrol" : "Diesel"}, {item.mpg}mpg)</th>
                    <td>{item.distanceTravelled}mi </td>
                </tr>
                {item.rides.map(ride=>
                <tr>
                    <td></td>
                    <td>{ride.eventName} </td>
                    <td>{ride.date}</td>
                    <td>{ride.distance}mi   </td>
                </tr>
                 )}
            </React.Fragment>)}
            
        </tbody>
    </table>
</div>
      }

}

export default DriverPayouts;