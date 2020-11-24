import React, {Component} from "react";
import EmployeeLoginApp from './EmployeeLoginApp';
import EmployeeHome from './EmployeeHome';

class TryEmployeeLogin extends Component {
  constructor(props){
    super(props);
    this.state = {correct: []};
  }

  callAPI(){
    //console.log(window.location.href.substring(22));
    fetch('http://localhost:9000/'+window.location.href.substring(22))
      .then(res => res.json())
      .then(members => this.setState({ correct: members }));

  }

  componentDidMount(){
    this.callAPI();
  }

  render(){
    console.log(this.state);
    if(this.state.correct!==0){
      console.log("hee");
      return (
        <EmployeeHome></EmployeeHome>
      );
    }
    else{
      return(
        <EmployeeLoginApp></EmployeeLoginApp>
      );
    }
}
}

export default TryEmployeeLogin;
