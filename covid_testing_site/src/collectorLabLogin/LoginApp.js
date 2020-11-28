import React, { Component } from "react";
import "./CSS/loginStyle.css";

class LoginApp extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI() {
    fetch("http://localhost:3000/login")
      .then((res) => res.text())
      .then((res) => this.setState({ apiResponse: res }))
      .catch((err) => err);
  }

  componentDidMount() {
    this.callAPI();
  }

  render() {
    return (
      <html lang="en" dir="ltr">
        <head>
          <meta charset="utf-8" />
          <title>Login</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="../CSS/loginStyle.css" />
        </head>
        <body>
          <h1 style={{ textAlign: "center" }}>Login Page</h1>
          <form class="form-inline" action="auth" method="POST">
            <label for="email" style={{ marginRight: "77%" }}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              name="email"
            />
            <label for="pwd" style={{ marginRight: "76%" }}>
              Password:
            </label>
            <input
              type="password"
              id="pwd"
              placeholder="Enter password"
              name="pswd"
            />
            <div style={{ display: "inline-block" }}>
              <button type="submit">Login Collector</button>
              <button type="submit">Lab Login</button>
            </div>
          </form>
        </body>
      </html>
    );
  }
}

export default LoginApp;
