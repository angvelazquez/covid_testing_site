import React, {Component} from "react";
import "./CSS/labHomeStyle.css";


class LabHomeApp extends Component {
  constructor(props){
    super(props);
    this.state = {apiResponse: ""};
  }

  callAPI(){
    fetch("http://localhost:9000/labHome")
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

export default LabHomeApp;
