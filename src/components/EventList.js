import React, {Component} from 'react'
import EventTile from './EventTile'

class EventList extends Component{
    render(){
        const events = this.props.events.sort((a,b) => a.date - b.date); //This obviously doesn't work on strings ...
  return (<div>
            <h2>Upcoming Rides</h2>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-3">
                {events.map((task,index)=> <EventTile key={index} event={task}/>)}
            </div>
        </div>)
    }
  }

  export default EventList