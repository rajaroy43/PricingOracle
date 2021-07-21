import React, { Component } from "react";
import {Route, Switch } from 'react-router-dom'
import Home from './components/pages/Home'
import Account from './components/pages/Account'
import Question from './components/pages/Question'


// import "./styles/app.scss";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/account/:address' component={Account} />
        <Route exact path='/question/:id' component={Question} />
      </Switch>

    );
  }
}

export default App;