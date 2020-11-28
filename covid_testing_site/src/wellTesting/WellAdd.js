import React, {Component} from "react";
import "./CSS/wellAddStyle.css";
import {
    Redirect,
  } from "react-router-dom";

class WellAdd extends Component {
  constructor(props){
    super(props);
    this.state = {members: []};
  }

  callAPI(){
    console.log(window.location.href.substring(30));
    fetch('http://localhost:9000/addWell'+window.location.href.substring(30))
      .then(res => res.json())
      .then(members => this.setState({ members: members }));
    console.log(this.state)
  }

  componentDidMount(){
    this.callAPI();
  }

  render(){
    if(this.state.members===[]){
        return(<h1>Loading</h1>);
      }
    //2020-11-20T16:47:30.000Z
    else{
  return (
  <Redirect
    to={{
      pathname: "/wellTest",
      search: window.location.href.substring(30)
    }}
    />);
        }
    }
}

export default WellAdd;
