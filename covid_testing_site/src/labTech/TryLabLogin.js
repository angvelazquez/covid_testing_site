import React, { Component } from "react";
//import EmployeeLoginApp from './EmployeeLoginApp';
//import EmployeeHome from './EmployeeHome';
import { Redirect } from "react-router-dom";
class TryLabLogin extends Component {
  constructor(props) {
    super(props);
    this.state = { correct: "" };
  }

  callAPI() {
    console.log("Check URL " + window.location.href);
    const url = window.location.href;
    fetch("http://localhost:9000/auth/login" + url.substring(31), {method: 'POST',headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },  body: JSON.stringify({
        labID: url.substring(url.indexOf("labID")+6, url.indexOf("&")),
        password: url.substring(url.indexOf("password=")+9),
      }) })
      .then((res) => {return res.json()})
      .then((res) => this.setState({ correct: JSON.stringify(res) }));
  }

  componentDidMount() {
    this.callAPI();
  }

  render() {
    console.log("Check this: " + this.state.correct)
    if (this.state.correct === "") {
      return <h1>Loading</h1>;
    }
    if (this.state.correct === '{"valid":"0"}') {
        console.log("worked");
      return (
        <Redirect to="/labHomeButtons" />
      );
    } else {
      return (
        <Redirect to="/labtech" />
      );
    }
  }
}

export default TryLabLogin;