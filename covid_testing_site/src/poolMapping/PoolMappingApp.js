import React, { Component } from "react";
import "./CSS/poolMappingStyle.css";

class PoolMappingApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      id: 0,
      Pool: "",
      TestBarcodes: [{ barcode: "2345" }, { barcode: "2345" }],
    };
  }

  // callAPI(){
  //   //console.log(window.location.href.substring(22));
  //   fetch('http://localhost:9000/'+window.location.href.substring(22))
  //     .then(res => res.json())
  //     .then(members => this.setState({ members: members }));
  //   console.log(this.state)
  // }

  // componentDidMount(){
  //   this.callAPI();
  // }

  // myChangeHandler = (event) => {
  //   this.setState({well: event.target.value});
  // }

  handleChangeInput(index, event) {
    const values = [...this.state.TestBarcodes];
    values[index][event.target.name] = event.target.value;
    this.setState({ TestBarcodes: values });
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

  render() {
    console.log(this.state);
    return (
      <div>
        <h1 className="Center">Pool Mapping</h1>
        <div>
          <form className="addPool" action="/addPool" method="get">
            <ul className="flex-outer">
              <li>
                <label htmlFor="poolBarcode">Pool Barcode:</label>
                <input
                  type="text"
                  name="poolBarcode"
                  defaultValue={this.state.Pool}
                ></input>
              </li>
              <li>
                <label htmlFor="testBarcodes">Test Barcodes:</label>
                <div>
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
                </div>
              </li>
              <li>
                <input
                  type="submit"
                  id="addButton"
                  name="action"
                  value="Submit Pool"
                ></input>
              </li>
            </ul>
          </form>

          <form action="/editOrDelete" method="get">
            <ul className="flex-outer">
              <li>
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
                            id={member.PoolBarcode}
                            name="PoolBarcodes"
                            value={
                              member.PoolBarcode + "," + member.TestBarcodes
                            }
                          ></input>
                          <label htmlFor={member.PoolBarcode} className="cell">
                            {member.TestBarcodes}
                          </label>
                        </td>
                        <td className="cellBorder">{member.PoolBarcode}</td>
                        <td className="cellBorder">{member.result}</td>
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

export default PoolMappingApp;
