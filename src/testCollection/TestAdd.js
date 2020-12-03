import React, {Component} from "react";
import "./CSS/testAddStyle.css";
import {
    Redirect,
  } from "react-router-dom";

class TestAdd extends Component {
  constructor(props){
    super(props);
    this.state = {members: []};
  }

  callAPI(){
    console.log(window.location.href.substring(36));
    fetch('http://localhost:9000/addTest'+window.location.href.substring(36))
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
      pathname: "/testCollection",
      search: window.location.href.substring(30)
    }}
    />);
        }
    }
}

export default TestAdd;
