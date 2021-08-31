import React, { Component } from "react";
import {Route, Switch, HashRouter } from 'react-router-dom'
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";

import Account from './components/pages/Account'
import Home from './components/pages/Home'
import Question from './components/pages/Question'
import theme from './components/Theme';
import WalletProvider from "./components/providers/WalletProvider";
import "./index.css";

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
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