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

        const events =  this.state.events;
  return (<div>
    <h2>Welcome to AUMBC's Booking page.</h2>
    <p>If you have any questions, please feel free to put them in the Group WhatsApp</p>
                {!this.state.dataFetched && 
                  <this.PlaceHolderEvent/>
                }
              {this.state.dataFetched && events.length > 0 && !this.state.errorWhileFetch &&
                  <React.Fragment>
                     <h2>Upcoming Rides</h2>
                      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-3">
                          {events.map((task,index)=> <EventTile key={index} event={task}/>)}
                      </div>
                  </React.Fragment>
              }
              { this.state.dataFetched&& events.length === 0 && !this.state.errorWhileFetch&&
                <h3>There are no upcoming events</h3>
              }
              {this.state.errorWhileFetch &&
                <p className='alert alert-danger'>An error occured while attempting to load the events.</p>
              }
           
        </div>)
    }

    componentDidMount(){

      // let currentDate =  Date.now();
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
          this.setState({errorWhileFetch : true, dataFetched : true})
        });
    }

    PlaceHolderEvent(){
        return(<div>
        <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
        </div>
        
      </div>
      <p>Loading...</p>
      </div>)
    }
  }



  export default EventList