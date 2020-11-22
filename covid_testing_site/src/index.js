import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import EmployeeLoginApp from './employeeLogin/EmployeeLoginApp';
import EmployeeHome from './employeeLogin/EmployeeHome';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <EmployeeHome /> 
  </React.StrictMode>,
  document.getElementById('root')
);//I changed this to my EmployeeHome page, gotta add React-Routing later to choose the page.

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
