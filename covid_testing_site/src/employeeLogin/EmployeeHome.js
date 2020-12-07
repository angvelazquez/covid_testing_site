import React, {Component} from "react";

class EmployeeHome extends Component {
  constructor(props){
    super(props);
    this.state = {members: []};
  }

  callAPI(){
    fetch('http://localhost:9000/employeeHome')
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
