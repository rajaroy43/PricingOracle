import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter} from 'react-router-dom'
import WalletProvider from "./components/providers/WalletProvider";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "styled-components";
import theme from './theme'
const subgraphUri = "http://http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <HashRouter>
      <ThemeProvider theme={theme}>
        <WalletProvider>
          <App />
        </WalletProvider>
        </ThemeProvider>
    </HashRouter>
  </ApolloProvider>,
  document.getElementById("root"),
);
