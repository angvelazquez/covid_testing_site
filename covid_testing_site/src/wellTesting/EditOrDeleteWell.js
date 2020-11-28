import React, {Component} from "react";
//import "./CSS/wellAddStyle.css";
import {
    Redirect,
  } from "react-router-dom";

class EditOrDeleteWell extends Component {
  constructor(props){
    super(props);
    this.state = {members: [1]};
  }

  callAPI(){
    console.log(window.location.href.substring(22));
    fetch('http://localhost:9000/'+window.location.href.substring(22))
      .then(res => res.json())
      .then(members => this.setState({ members: members }));
    console.log(this.state)
  }

  componentDidMount(){
    this.callAPI();
  }

  render(){
    console.log(JSON.stringify(this.state));
    if(JSON.stringify(this.state)==='{"members":[1]}'){
    //if(this.state.members===[]){
        return(<h1>Loading</h1>);
      }
    //2020-11-20T16:47:30.000Z
  return (
    //<h1>Loading</h1>
    <Redirect
    to={{
      pathname: "/wellTest",
      search: window.location.href.substring(35)
    }}
    />
  );
    }
}

export default EditOrDeleteWell;
