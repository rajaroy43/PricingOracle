import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import fetch from "cross-fetch"
import { ethers } from "ethers";

console.log(`subgraph endpoint `, process.env.LITHIUM_SUBGRAPH_URI, process.env.COORDINATOR_KEY)
export const subgraphClient = new ApolloClient({
  link: new HttpLink({
    uri: "http://docker_graph-node_1:8000/subgraphs/name/scaffold-eth/your-contract",
    fetch
  }),//"http://docker_graph-node_1:8000/subgraphs/name/scaffold-eth/your-contract",//process.env.LITHIUM_SUBGRAPH_URI,
  cache: new InMemoryCache()
});

console.log(`connecting provider to eth node: ${process.env.ETH_NODE}`)
export const ethProvider = (() => {
  //@ts-ignore
  return new ethers.providers.JsonRpcProvider(process.env.ETH_NODE)
})()
const defProvider = 'nn';//ethers.providers.getDefaultProvider(process.env.ETH_NODE)

const defProviderx = ethers.providers.getDefaultProvider('http://172.19.0.1:8545')
console.log(`default provider is ${defProvider}\n${defProviderx}`)

export const coordinatorWallet = new ethers.Wallet( process.env.COORDINATOR_KEY || 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', defProviderx )
