import React, { Component } from "react";
//import EmployeeLoginApp from './EmployeeLoginApp';
//import EmployeeHome from './EmployeeHome';
import { Redirect } from "react-router-dom";
class TryEmployeeLogin extends Component {
  constructor(props) {
    super(props);
    this.state = { correct: [] };
  }

  callAPI() {
    console.log(window.location.href.substring(22));
    fetch("http://localhost:9000/" + window.location.href.substring(22))
      .then((res) => res.json())
      .then((members) => this.setState({ correct: members }));
  }

  componentDidMount() {
    this.callAPI();
  }

  render() {
    //console.log(this.state.correct[0])
    if (this.state.correct[0] === undefined) {
      return <h1>Loading</h1>;
    }
    if (JSON.stringify(this.state.correct[0]) !== '{"valid":0}') {
      return (
        <Redirect
          to={{
            pathname: "/employeeHome",
            search: window.location.href.substring(28),
          }}
        />
      );
    } else {
      return (
        <Redirect
          to={{
            pathname: "/employee",
          }}
        />
      );
    }
  }
}

export default TryEmployeeLogin;
