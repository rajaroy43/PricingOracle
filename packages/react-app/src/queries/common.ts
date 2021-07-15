import { ApolloError } from "@apollo/react-hooks";

export interface QueryResponse {
  loading: boolean
  error: ApolloError | undefined
}