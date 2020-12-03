//copy pasted from employee login

import React, {Component} from "react";
import "./CSS/employeeLoginStyle.css";


class LabLogin extends Component {
  constructor(props){
    super(props);
    this.state = {apiResponse: ""};
  }

  callAPI(){
    fetch("http://localhost:9000/labLogin")
      .then(res => res.text())
      .then(res => this.setState({apiResponse: res}))
      .catch(err => err);
  }

  componentDidMount(){
    this.callAPI();
  }

  render(){
  return (
      <div dangerouslySetInnerHTML={{__html: this.state.apiResponse}} />
  );
}
}

export default LabLogin;
