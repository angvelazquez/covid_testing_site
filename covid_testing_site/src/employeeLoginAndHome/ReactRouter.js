import React from "react";
import EmployeeLoginApp from './EmployeeLoginApp';
import EmployeeHome from './EmployeeHome';
import TryEmployeeLogin from './TryEmployeeLogin';
import WellTesting from '../wellTesting/WellTesting';
import WellAdd from '../wellTesting/WellAdd';
import LabLogin from '../wellTesting/LabLogin';
import EditOrDeleteWell from '../wellTesting/EditOrDeleteWell';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
//npm install react-router-dom  was used.
// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.

export default function BasicExample() {
  console.log(window.location.href);
  return (
    <Router>
      <div>
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/employee">
            <EmployeeLoginPage />
          </Route>
          <Route exact path="/labtech">
            <LabLoginPage />
          </Route>
          <Route path="/EmployeeHome">
            <EmployeeHomePage />
          </Route>
          <Route path="/collectLabLogin">
            <LoginApp />
          </Route>
          <Route path="/labHomeButtons">
            <LabHomeApp />
          </Route>
          <Route path="/login">
            <TryEmployeeLoginPage />
          </Route>
          <Route path="/WellTest">
            <WellTestPage />
          </Route>
          <Route path="/addWell">
            <WellAddPage />
          </Route>

          <Route path="/editOrDelete">
            <EditOrDeleteWellPage />
          </Route>
          <Route path="/">
            <Dashboard />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

// You can think of these components as "pages"
// in your app.

function EmployeeLoginPage() {
  return (
    <EmployeeLoginApp></EmployeeLoginApp>
  );
}

function LabLoginPage() {
  return (
    <LabLogin></LabLogin>
  );
}

function EmployeeHomePage() {
  console.log("hello");
  return (
    <EmployeeHome></EmployeeHome>
  );
}

function TryEmployeeLoginPage() {
  console.log("helo");
  return (
    <TryEmployeeLogin></TryEmployeeLogin>
  );
}

function WellTestPage() {
  console.log("helo");
  return (
    <WellTesting></WellTesting>
  );
}

function WellAddPage() {
  return (
    <WellAdd></WellAdd>
  );
}

function EditOrDeleteWellPage() {
  return (
    <EditOrDeleteWell></EditOrDeleteWell>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}
