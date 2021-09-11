import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import fetch from "cross-fetch"

console.log(`subgraph endpoint `, process.env.LITHIUM_SUBGRAPH_URI)
export const subgraphClient = new ApolloClient({
  link: new HttpLink({
    uri: "http://docker_graph-node_1:8000/subgraphs/name/scaffold-eth/your-contract",
    fetch
  }),//"http://docker_graph-node_1:8000/subgraphs/name/scaffold-eth/your-contract",//process.env.LITHIUM_SUBGRAPH_URI,
  cache: new InMemoryCache()
});
