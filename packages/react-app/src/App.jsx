import React, { Component } from "react";
import {Route, Switch,HashRouter } from 'react-router-dom'

import Home from './components/pages/Home'
import Account from './components/pages/Account'
import Question from './components/pages/Question'
import "./index.css";
import WalletProvider from "./components/providers/WalletProvider";
import { ThemeProvider } from "styled-components";
import theme from './theme'


// import "./styles/app.scss";

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <WalletProvider>
          <HashRouter>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/account/:address' component={Account} />
              <Route exact path='/question/:id' component={Question} />
            </Switch>
          </HashRouter>
        </WalletProvider>
      </ThemeProvider>
    );
  }
}

export default App;