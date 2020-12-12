import React, {Component} from "react";
import "./CSS/testCollectionStyle.css";

class TestCollection extends Component {
    constructor(props){
      super(props);
      this.state = {members: [],id:0, EmployeeID:'',TestBarcode:''};
      
      //http://localhost:3000/editOrDelete?WellPoolResult=10%2C20%2CIn+Progress&action=Edit
      //
      //console.log(window.location.href.substring(46))
      //console.log(window.location.href.substring(46).split('&'));
      //window.location.href.substring(50).split('&')[0].split("%2C")
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
  
    myChangeHandler = (event) => {
      this.setState({well: event.target.value});
    }
  
    render(){
      console.log(this.state)
    return (
      <div>
      <h1 className="Center">Test Collection</h1>
      <div>
      <form className="addWell" action="/addTest" method="get">
          <ul className="flex-outer">
            <li>
              <label htmlFor="employeeID">Employee ID:</label>
              <input type="text" name="employeeID" defaultValue={this.state.EmployeeID}></input>
            </li>
            <li>
              <label htmlFor="testBarcode">Test Barcode:</label>
              <input type="text" name="testBarcode" defaultValue={this.state.TestBarcode}></input>
            </li>
            <li>
              <input
                type="submit"
                id="addButton"
                name="action"
                value="Add"
              ></input>
            </li>
          </ul>
        </form>
  
  
        <form action="/deleteTest" method="get">
          <ul className="flex-outer">
          <li>
              <input
                type="submit"
                id="deleteButton"
                name="action"
                value="Delete"
              ></input>
        </li>
        <li>
      <table className = "tableBorder">
        <thead>
        <tr key={0}>
              <th className="cellBorder">Employee ID</th>
              <th className="cellBorder">Test Barcode</th>
            </tr>
        </thead>
        <tbody>
      {this.state.members.map(member =>
            <tr key={this.state.id+=1}>
              <td className="cellBorder">
                <input className = "box" type="checkbox" id={member.EmployeeID} name="IdBarcode" 
                value={member.EmployeeID+","+member.TestBarcode}></input>
                <label htmlFor={member.EmployeeID} className = "cell">{member.EmployeeID}</label>
                </td>
              <td className="cellBorder">{member.TestBarcode}</td>
            </tr>  
      )}
      </tbody>
      </table>
      </li>
  
     
          </ul>
        </form>
      </div>
    </div>
    );
  }
  }

export default TestCollection;
