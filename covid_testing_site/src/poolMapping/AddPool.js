import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class AddPool extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
    };
  }

  callAPI() {
    let url = window.location.href;
    console.log(url);
    console.log("Made it!");
    console.log(
      "http://localhost:9000/addPool" + url.substring(url.indexOf("?"))
    );
    fetch("http://localhost:9000/addPool" + url.substring(url.indexOf("?")))
      .then((res) => res.json())
      .then((members) => this.setState({ members: members }));
    console.log(this.state.members);
  }

  componentDidMount() {
    this.callAPI();
  }

  //   callAPI() {
  //     console.log(window.location.href.substring(30));
  //     fetch("http://localhost:9000/addPool", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         poolBarcode: this.state.Pool,
  //         testBarCodes: this.state.TestBarcodes,
  //       }),
  //     })
  //       .then((res) => {
  //         return res.json();
  //       })
  //       .then((res) => this.setState({ members: JSON.stringify(res) }));
  //     // fetch('http://localhost:9000/addWell'+window.location.href.substring(30))
  //     //   .then(res => res.json())
  //     //   .then(members => this.setState({ members: members }));
  //     // console.log(this.state);
  //   }

  //   componentDidMount() {
  //     var pool = this.props.location.state.PoolBarcode;
  //     var testBarcodes = this.props.location.state.tBarcodes;
  //     this.setState({ Pool: pool });
  //     this.setState({ TestBarcodes: testBarcodes });
  //     this.callAPI();
  //   }

  render() {
    if (this.state.members === []) {
      return <h1>Loading</h1>;
    } else if (JSON.stringify(this.state.members) === '{"valid":"0"}') {
      return <Redirect to="/poolMapping" />;
    }
    else{
        return <h1>Loading</h1>;
    }
  }
}

export default AddPool;
