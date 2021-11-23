import React, { Component } from "react"
import { Route, Switch, HashRouter } from "react-router-dom"
import CssBaseline from "@material-ui/core/CssBaseline"
import { ThemeProvider } from "@material-ui/styles"

import Account from "./components/pages/Account"
import Home from "./components/pages/Home"
import Question from "./components/pages/Question"
import AvailableQuestions from "./components/pages/AvailableQuestions"
import UpcomingQuestions from './components/pages/UpcomingQuestions'
import Answering from "./components/pages/Answering"
import Admin from "./components/pages/Admin"
import theme from "./components/Theme"
import WalletProvider from "./components/providers/WalletProvider"
import "./index.css"
import History from "./components/pages/History"
import SuggestAsset from "./components/pages/SuggestAsset"
import MyBids from "./components/pages/MyBids"
import BiddableQuestions from "./components/pages/wisdomSeeker/BiddableQuestions"


class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <WalletProvider>
          <HashRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/wisdom-node/account/:address" component={Account} />
            <Route exact path="/wisdom-node/question/:id" component={Question} />
            <Route exact path="/wisdom-node/available-questions" component={AvailableQuestions} />
            <Route exact path='/wisdom-node/upcoming-questions' component={UpcomingQuestions} />
            <Route exact path="/wisdom-node/answering/:questionGroupId" component={Answering} />
            <Route exact path="/wisdom-node/history" component={History} />
            <Route exact path="/admin" component={Admin} />
            <Route exact path="/wisdom-seeker/suggest-asset" component={SuggestAsset} />
            <Route exact path="/wisdom-seeker/biddable-questions" component={BiddableQuestions} />
            <Route exact path="/wisdom-seeker/mybids" component={MyBids} />
          </Switch>
          </HashRouter>
        </WalletProvider>
      </ThemeProvider>
    )
  }
}

export default App