import React, {Component} from 'react'

class HelpWidget extends React.Component{

    constructor(props){
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.state = {
            show: false
        };
    
    }
    handleClick() {

        this.setState({show: !this.state.show});
      }

    render(){
        
        if(this.state.show){
            return<div > 
            <div className="HelpWidget">
            <ShowButton onClick={this.handleClick}/>
            
            </div>
            <ShowPopover/>
            </div>
        }
        else{
            return <div className="HelpWidget"> 
            <ShowButton onClick={this.handleClick}/>
            </div>
        }

    }

    

    
}

function ShowPopover(props) {
    return <div class="HelpWidget-popover popover "  >
             <p>Drop your question in the group WhattsApp! It's probably a bug!:)</p>
            </div>

}
function ShowButton(props){
return <button type="button" className="HelpWidget btn btn-sm btn-info" onClick={props.onClick}><i className="bi bi-question-circle"> </i>Help</button>
}

export default HelpWidget
