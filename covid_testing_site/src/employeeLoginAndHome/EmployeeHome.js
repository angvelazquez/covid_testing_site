import React, {Component} from "react";

class EmployeeHome extends Component {
  constructor(props){
    super(props);
    this.state = {members: []};
  }

  callAPI(){
    //console.log(window.location.href.substring(22));
    fetch('http://localhost:9000/'+window.location.href.substring(22))
      .then(res => res.json())
      .then(members => this.setState({ members: members }));
    console.log(this.state)
  }

  componentDidMount(){
    this.callAPI();
  }

  render(){
  return (
    <div className="Users">
    <h1>Employee Home</h1>
    {this.state.members.map(member =>
      <div key={member.employeeId}>{member.email} {member.firstName} - {member.lastName}: {member.passcode}</div>
    )}
  </div>
  );
}
}

export default EmployeeHome;
