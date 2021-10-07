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
    startTime
    pricingTime
    answerCount
    created
  }
`

export const QUESTION_GROUP_FIELDS = gql`
  fragment QuestionGroupFields on QuestionGroup {
    id
    category {
      id
      label
    }
    endTime
    startTime
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
    created
  }
`

export const ANSWER_GROUP_FIELDS = gql`
  ${ANSWER_FIELDS}
  fragment AnswerGroupFields on AnswerGroup {
    id
    owner {
      id
    }
    questionGroup {
      id
    }
    answers {
      ...AnswerFields
    }
    rewardAmount
    status
    isRewardCalculated
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

  export const REPUTATION_FIELDS = gql`
    fragment CategoryReputationFields on UserCategoryReputation {
      category {
        id
        label
      }
      score
    }
  `
