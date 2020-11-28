import React, {Component} from "react";
import "./CSS/employeeHomeStyle.css";

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
    //2020-11-20T16:47:30.000Z
  return (
    <div>
    <h1 className="Center">Employee Home</h1>
    <div className="Center">
    <table className = "tableBorder">
      <thead>
      <tr key={0}>
            <th className="cellBorder">Collection Date</th>
            <th className="cellBorder">Result</th>
          </tr>
      </thead>
      <tbody>
    {this.state.members.map(member =>
          <tr key={member.id}>
            <th className="cellBorder">{member.collectionDate.substring(5,7)}/{member.collectionDate.substring(8,10)}/{member.collectionDate.substring(0,4)}</th>
            <th className="cellBorder">{member.result}</th>
          </tr>
    )}
    </tbody>
    </table>
    </div>
  </div>
  );
}
}

export default EmployeeHome;
