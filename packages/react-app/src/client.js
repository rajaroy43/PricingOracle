import { ApolloClient, InMemoryCache } from "@apollo/client";
import config from './config'

export const subgraphClient = new ApolloClient({
  uri: config.LITHIUM_SUBGRAPH,
  cache: new InMemoryCache(),
});
