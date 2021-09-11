import { ApolloClient, InMemoryCache } from "@apollo/client";

export const subgraphClient = new ApolloClient({
  uri: process.env.LITHIUM_SUBGRAPH_URI,
  cache: new InMemoryCache(),
});
