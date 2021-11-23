import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import fetch from "cross-fetch"
import { ethers } from "ethers";
import { NonceManager } from "@ethersproject/experimental"


console.log(`subgraph endpoint `, process.env.LITHIUM_SUBGRAPH_URI, process.env.COORDINATOR_KEY, JSON.stringify(process.env))
export const subgraphClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.LITHIUM_SUBGRAPH_URI,
    fetch
  }),//"http://docker_graph-node_1:8000/subgraphs/name/scaffold-eth/your-contract",//process.env.LITHIUM_SUBGRAPH_URI,
  cache: new InMemoryCache()
});


const ethProvider = ethers.providers.getDefaultProvider(process.env.ETH_NODE)

//@ts-ignore
export const coordinatorWallet = (() => new NonceManager(new ethers.Wallet( process.env.COORDINATOR_KEY, ethProvider )))()
