import React, {Component} from 'react'
import EventTile from './EventTile'

class EventList extends Component{

    constructor(props){
        super(props)
        this.state = {
            events: [],
            dataFetched: false
        }
    }

    render(){
        if(!this.state.dataFetched){
            return(<this.PlaceHolderEvent/>)
        }
        const events =  this.state.events//this.props.events.sort((a,b) => a.date - b.date); //This obviously doesn't work on strings ...
  return (<div>
    <h2>Welcome to AUMBC's Booking page.</h2>
    <p>Use this site to view upcoming rides, and either find transport if you are a passenger or offer to drive other members (and get reimbursed for any additionl fuel costs). &nsbp; If you have any questions, please feel free to put them in the Group WhatsApp 👌</p>
            <h2>Upcoming Rides</h2>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-3">
                {events.map((task,index)=> <EventTile key={index} event={task}/>)}
            </div>
        </div>)
    }

    componentDidMount(){

        let headers = new Headers()

        fetch(
            "https://localhost:7260/api/MtbEvent/get-upcoming-events")
                        .then((res) => res.json())
                        .then((json) => {
                            this.setState({
                                events: json,
                                dataFetched: true
                            });
                        })
    }

    PlaceHolderEvent(){
        return(<div className="card" aria-hidden="true">
        <img src="..." className="card-img-top" alt="..."/>
        <div className="card-body">
          <h5 className="card-title placeholder-glow">
            <span className="placeholder col-6"></span>
          </h5>
          <p className="card-text placeholder-glow">
            <span className="placeholder col-7"></span>
            <span className="placeholder col-4"></span>
            <span className="placeholder col-4"></span>
            <span className="placeholder col-6"></span>
            <span className="placeholder col-8"></span>
          </p>
          <a href="#" tabIndex="-1" className="btn btn-primary disabled placeholder col-6"></a>
        </div>
      </div>)
    }
  }



  export default EventList