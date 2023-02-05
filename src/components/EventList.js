import React, {Component} from 'react'
import EventTile from './EventTile'
import api from './../services/api';

class EventList extends Component{

    constructor(props){
        super(props)
        this.state = {
            events: [],
            dataFetched: false,
            errorWhileFetch: false,
        }
    }

    render(){
        if(!this.state.dataFetched){
            return(<this.PlaceHolderEvent/>)
        }
        const events =  this.state.events;
  return (<div>
    <h2>Welcome to AUMBC's Booking page.</h2>
    <p>Use this site to view upcoming rides, and either find transport if you are a passenger or offer to drive other members (and get reimbursed for any additionl fuel costs). &nsbp; If you have any questions, please feel free to put them in the Group WhatsApp 👌</p>
              {events.length > 0 && !this.state.errorWhileFetch &&
                  <React.Fragment>
                     <h2>Upcoming Rides</h2>
                      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-3">
                          {events.map((task,index)=> <EventTile key={index} event={task}/>)}
                      </div>
                  </React.Fragment>
              }
              {events.length == 0&&
                <h3>There are no upcoming events- please check back soon.</h3>
              }
              {this.state.errorWhileFetch &&
                <p className='alert alert-danger'>An error occured while attempting to load the events.</p>
              }
           
        </div>)
    }

    componentDidMount(){

        let headers = new Headers()
        api.get("MtbEvent/get-upcoming-events").then(success => {
          if(success.status === 204){
            this.setState({
              dataFetched: true
            })
          }
          if(success.status===200){
            this.setState({
            
              events: success.data,
              dataFetched: true
          });
          }
         
        }, error => {
          this.setState({errorWhileFetch : true})
          console.log(error);
        });
    }

    PlaceHolderEvent(){
        return(<div>
        <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
        </div>
        
      </div>
      <p>Loading...</p>
      </div>)
    }
  }



  export default EventList