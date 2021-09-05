import { ApolloError } from "@apollo/react-hooks";
import { gql } from 'apollo-boost';

export interface QueryResponse {
  loading: boolean
  error: ApolloError | undefined
}

export const QUESTION_FIELDS = gql`
    fragment QuestionFields on Question {
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
      pricingTime
      answerCount
      created
    }
    `

export const ANSWER_FIELDS = gql`
  fragment AnswerFields on Answer {
    id
    answerer {
      id
    }
    question {
      id
      answerSet
    }
    answerIndex
    stakeAmount
    rewardClaimed
    status
    created
  }
`

export const USER_FIELDS = gql`
    fragment UserFields on User {
      id
      questionCount
      totalBounty
      answerCount
      totalRewardsClaimed
      totalStaked
      tokenBalance
      tokenApprovalBalance
    }
  `
