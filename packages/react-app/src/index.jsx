import React from "react";
import ReactDOM from "react-dom";
import { HashRouter} from 'react-router-dom'
import WalletProvider from "./components/providers/WalletProvider";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "styled-components";
import theme from './theme'


ReactDOM.render(
    <HashRouter>
        <ThemeProvider theme={theme}>
          <WalletProvider>
            <App />
          </WalletProvider>
          </ThemeProvider>
    </HashRouter>,
  document.getElementById("root"),
);
