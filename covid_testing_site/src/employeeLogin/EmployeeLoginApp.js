import React, { Component } from "react";
import "./CSS/employeeLoginStyle.css";

class EmployeeLoginApp extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI() {
    fetch("http://localhost:3000/employeeLogin")
      .then((res) => res.text())
      .then((res) => this.setState({ apiResponse: res }))
      .catch((err) => err);
  }

  componentDidMount() {
    this.callAPI();
  }

  render() {
    return (
      <div dangerouslySetInnerHTML={{ __html: this.state.apiResponse }} />
      // <h1>hello</h1>
    );
  }
}

export default EmployeeLoginApp;
