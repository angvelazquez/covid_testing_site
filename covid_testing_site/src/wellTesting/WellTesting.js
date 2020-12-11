import React, {Component} from "react";
import "./CSS/wellTestStyle.css";

class WellTesting extends Component {
  constructor(props){
    super(props);
    this.state = {members: [],id:0, Well:'',Pool:'',result:'In Progress',result2:'Positive',result3:'Negative'};
    
    //http://localhost:3000/editOrDelete?WellPoolResult=10%2C20%2CIn+Progress&action=Edit
    //
    //console.log(window.location.href.substring(46))
    //console.log(window.location.href.substring(46).split('&'));
    //window.location.href.substring(50).split('&')[0].split("%2C")
  }

  callAPI(){
    console.log(window.location.href.substring(22));
    fetch('http://localhost:9000/'+window.location.href.substring(22))
      .then(res => res.json())
      .then(members => this.setState({ members: members }));
    console.log(this.state)
  }

  componentDidMount(){
    this.callAPI();
    console.log(window.location.href)
    //http://localhost:3000/wellTest?action=Edit&WellPoolResult=1000%2C20%2CIn+Progress
    //action=Edit&WellPoolResult=1000%2C20%2CIn+Progress  with 31 substring
    //console.log(window.location.href.split("/")[3])
    //console.log(window.location.href.split('?')[1].split('&')[0])
    if(window.location.href.split("/")[3]!=="wellTest?action=Edit"){
      if(window.location.href.split('?')[1]!==undefined && window.location.href.split('?')[1].split('&')[0]==="action=Edit"){
        //http://localhost:3000/wellTest?action = Edit&WellPoolResult = 1000  %2C  20  %2C  In+Progress
        //.split("%2C")
        var x = window.location.href.split("=")[2].split('%2C');
        x[2] = x[2].split('&')[0];
        //console.log(x[0])
        if (x[2]==="In+Progress"){
          this.setState({
            result:'In Progress',result2:'Positive',result3:'Negative'
          })
        }
        if (x[2]==="Negative"){
          this.setState({
            result:'Negative',result2:'In Progress',result3:'Positive'
          })
        }
        if (x[2]==="Positive"){
          this.setState({
            result:'Positive',result2:'Negative',result3:'In Progress'
          })
        }
        this.setState({
          Well: x[0],
          Pool:x[1],
          
        })
        //console.log(this.state.Well);
        //console.log(this.state.Pool);

      }
    }
  }

  //myChangeHandler = (event) => {
  //  this.setState({well: event.target.value});
  //}

  render(){
    if(this.state.members==[]){
      return(<h1>Loading</h1>);
    }
    console.log(this.state)
  return (
    <div>
    <h1 className="Center">Well Testing</h1>
    <div>
    <form className="addWell" action="/addWell" method="get">
        <ul className="flex-outer">
          <li>
            <label htmlFor="wellBarcode">Well Barcode:</label>
            <input type="text" name="wellBarcode" defaultValue={this.state.Well}></input>
          </li>
          <li>
            <label htmlFor="poolBarcode">Pool Barcode:</label>
            <input type="text" name="poolBarcode" defaultValue={this.state.Pool}></input>
          </li>
          <li>
            <label htmlFor="result">Result:</label>
            <select name="result" id="result" >
                <option value={this.state.result}>{this.state.result}</option>
                <option value={this.state.result2}>{this.state.result2}</option>
                <option value={this.state.result3}>{this.state.result3}</option>
            </select>
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


      <form action="/editOrDelete" method="get">
        <ul className="flex-outer">
        <li>
      <input
              type="submit"
              id="editButton"
              name="action"
              value="Edit"
            ></input>
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
            <th className="cellBorder">Well Barcode</th>
            <th className="cellBorder">Pool Barcode</th>
            <th className="cellBorder">Result</th>
          </tr>
      </thead>
      <tbody>
    {this.state.members.map(member =>
          <tr key={this.state.id+=1}>
            <td className="cellBorder">
              <input className = "box" type="checkbox" id={member.WellBarcode} name="WellPoolResult" 
              value={member.WellBarcode+","+member.PoolBarcode+","+member.result}></input>
              <label htmlFor={member.WellBarcode} className = "cell">{member.WellBarcode}</label>
              </td>
            <td className="cellBorder">{member.PoolBarcode}</td>
            <td className="cellBorder">{member.result}</td>
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

export default WellTesting;
