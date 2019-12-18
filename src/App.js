import React, { Component } from 'react';
import './App.css';
import { HashRouter as Router, Route, Redirect} from "react-router-dom";
import ViewPage from "./components/View";
import SearchPage from "./components/Search";
import {Login} from "./components/Login";
import assetInfoPage from "./components/AssetInfo"

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <div className="App">
            <Redirect from="/" to="/login" />
            <Route path="/login" component={Login} />
            <Route path="/mapskills" component={ViewPage} />
            <Route path="/search" component={SearchPage} />
            <Route path="/assetInfo" component={assetInfoPage} />
          </div>
        </Router>
      </div>
    )
  }
}

export default App;