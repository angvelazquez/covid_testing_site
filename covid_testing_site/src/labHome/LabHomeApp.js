import React, {Component} from "react";
import "./CSS/labHomeStyle.css";


class LabHomeApp extends Component {
  constructor(props){
    super(props);
    this.state = {apiResponse: ""};
  }

  callAPI(){
    fetch("http://localhost:9000/labHome")
      .then(res => res.text())
      .then(res => this.setState({apiResponse: res}))
      .catch(err => err);
  }

  componentDidMount(){
    this.callAPI();
  }

  render(){
  return (
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Lab Home</title>
    </head>
    <body>
        <h1 style={{textAlign: 'center'}}>Lab Home</h1>
        <form className="form-inline" action="">
          <button type="submit">Pool Mapping</button>
          <button type="submit">Well Testing</button>
        </form>
    </body>
  </html>
  );
}
}

export default LabHomeApp;
