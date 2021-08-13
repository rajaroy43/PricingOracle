import { ApolloError } from "@apollo/react-hooks";
import { gql } from 'apollo-boost';

export interface QueryResponse {
  loading: boolean
  error: ApolloError | undefined
}

export const QUESTION_FIELDS = gql`
    fragment QuestionFields on Fields {
      id
      owner {
        id
      }
      category {
        id
        label
      }
      description
      answerSet
      answerSetTotalStaked
      bounty
      totalStaked
      endTime
      answerCount
      created
    }
  `