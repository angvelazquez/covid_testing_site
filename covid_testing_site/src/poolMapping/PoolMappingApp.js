import React, { Component } from "react";
import "./CSS/poolMappingStyle.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import {useLocation} from 'react-router-dom'

class PoolMappingApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      id: 0,
      Pool: "",
      TestBarcodes: [{ barcode: "" }, { barcode: "" }],
    };
  }

  callAPI(){
    fetch("http://localhost:9000/poolMapping")
      .then(res => res.json())
      .then(members => this.setState({ members: members }));
    console.log(this.state)
  }

  componentDidMount(){
    // const stuff = props.location.state.PoolBarcode;
    console.log(this.props.location.state);
    if(this.props.location.state !== undefined && this.props.location.state.PoolBarcode !== undefined)
    {
      var pool = this.props.location.state.PoolBarcode;
      this.setState({ Pool: pool });
    }
    if(this.props.location.state !== undefined && this.props.location.state.tBarcodes !== undefined)
    {
      var testBarcodes = this.props.location.state.tBarcodes;
      this.setState({ TestBarcodes: testBarcodes });
    }
    this.callAPI();
  }

  handleChangeInput(index, event) {
    const values = [...this.state.TestBarcodes];
    values[index][event.target.name] = event.target.value;
    this.setState({ TestBarcodes: values });
    this.handleAddField = this.handleAddField.bind(this);
  }

  handleChangePoolInput(event) {
    const value = event.target.value;
    this.setState({ Pool: value });
    this.handleAddField = this.handleAddField.bind(this);
  }

  handleAddField() {
    console.log("Clicked");
    this.setState({
      TestBarcodes: [...this.state.TestBarcodes, { barcode: "" }],
    });
  }

  handleRemoveField(index) {
    const values = [...this.state.TestBarcodes];
    values.splice(index, 1);
    this.setState({ TestBarcodes: values });
  }

  handleSubmit(event) {
    console.log("Hit Submit");
    this.props.history.push({
      pathname: "/addPool",
      state: { PoolBarcode: this.state.Pool, tBarcodes: this.state.TestBarcodes }
    });
    // event.preventDefault();
    // return (
    //   <Redirect
    //     to={{
    //       pathname: "/collectLabLogin",
    //       // state: { age: this.state.age, sex: this.state.sex },
    //     }}
    //   />)
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <h1 className="Center">Pool Mapping</h1>
        <div className="main">
          <form action="/addPool" method="get">
            <ul className="flex-outer">
              <li>
                <label htmlFor="poolBarcode">Pool Barcode:</label>
                <input
                  type="text"
                  name="poolBarcode"
                  value={this.state.Pool}
                  onChange={(event) =>
                    this.handleChangePoolInput(event)
                  }
                ></input>
              </li>
              <li>
                <label htmlFor="testBarcodes">Test Barcodes:</label>
                <div className="pool">
                  {this.state.TestBarcodes.map((barcode, index) => (
                    <div className="testBarcodes" key={index}>
                      <input
                        name="barcode"
                        type="text"
                        value={this.state.TestBarcodes[index].barcode}
                        onChange={(event) =>
                          this.handleChangeInput(index, event)
                        }
                      />
                      <button
                        type="button"
                        onClick={this.handleRemoveField.bind(this, index)}
                      >
                        delete
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    id="addRowsButton"
                    onClick={this.handleAddField.bind(this)}
                  >
                    Add more rows
                  </button>
                  <input
                    type="submit"
                    id="submitButton"
                    name="action"
                    value="Submit Pool"
                  ></input>
                </div>
              </li>
              <li></li>
            </ul>
          </form>

          <form action="/editDeletePool" method="get">
            <ul className="flex-outer">
              <li style={{ marginTop: "1%" }}>
                <table className="tableBorder">
                  <thead>
                    <tr key={0}>
                      <th className="cellBorder">Pool Barcodes</th>
                      <th className="cellBorder">Test Barcodes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.members.map((member) => (
                      <tr key={(this.state.id += 1)}>
                        <td className="cellBorder">
                          <input
                            className="box"
                            type="checkbox"
                            id={member.pool}
                            name="PoolBarcodes"
                            value={
                              member.pool
                            }
                          ></input>
                          <label htmlFor={member.pool} className="cell">
                            {member.pool}
                          </label>
                        </td>
                        <td className="cellBorder">{member.testCodes.toString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </li>
              <li></li>
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
            </ul>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(PoolMappingApp);
