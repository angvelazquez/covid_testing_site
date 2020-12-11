import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { withRouter } from 'react-router-dom';

class EditPool extends Component {
  constructor(props) {
    super(props);
    this.state = { members: [] };
  }

  callAPI() {
    let url = window.location.href;
    console.log(url);
    console.log("Made it!")
    console.log("http://localhost:9000/editDeletePool" + url.substring(url.indexOf("?")));
    fetch("http://localhost:9000/editDeletePool" + url.substring(url.indexOf("?")))
      .then((res) => res.json())
      .then((members) => this.setState({ members: members }));
      console.log(this.state.members);
  }

  componentDidMount() {
    this.callAPI();
  }

  render() {
    if (this.state.members === []) {
      return(<h1>Loading</h1>);
    }
    //2020-11-20T16:47:30.000Z
    else if (JSON.stringify(this.state.members) === '{"valid":"0"}') {
      return (
        <Redirect to="/poolMapping" />
        );
    }
    else if(this.state.members.pool){
        // this.props.history.push({
        //     pathname: "/poolMapping",
        //     state: { PoolBarcode: this.state.members.pool, tBarcodes: this.state.members.test }
        //   });
        console.log(this.props.location.state);
        console.log(this.state.members);
          return (
            <Redirect to={{
                pathname: "/poolMapping",
                state: { PoolBarcode: this.state.members.pool, tBarcodes: this.state.members.tests }
              }} />
            );
    }
    else{
        return(<h1>Loading</h1>);
    }
  }
}

export default withRouter(EditPool);
