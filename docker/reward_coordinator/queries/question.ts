import { gql } from '@apollo/client';
import { subgraphClient } from '../client';

export const GET_QUESTION  = gql`
  query question($id: String!,  $categoryId: String!) {
    question(id: $id) {
      id
      questionType
      owner {
        id
      }
      category {
        label
        id
      }
      description
      answerSet
      answerSetTotalStaked
      answerCount
      bounty
      totalStaked
      answers {
        id
        answerer {
          id
          categoryReputations(where: {category: $categoryId}) {
            id
            score
          }
        }
        answerIndex
        stakeAmount
        group {
          id
        }
      }
      
    }
  }
`;

export const getQuestion = async (id: string, categoryId: string) => {
  const response = await subgraphClient.query({
    query: GET_QUESTION,
    variables: {id, categoryId},
    fetchPolicy: "network-only"
  })

  return response.data  
}

export const GET_BIDS_TO_REFUND = gql`
  query questions($now: String!, $metaId: String!) {
    questions(where: {startTime_lt: $now}) {
      id
      bidCount
      bids {
        id
        isRefunded
        amount
        user {
          id
        }
      }
    }
    pricingContractMeta(id: $metaId) {
      id
      revealTiers
    }
  }

`



export const getBidsToRefund = async () => {
  const metaId = 'pricing_contract_meta'
  const now = Math.floor(new Date().getTime() / 1000).toString();
  const response = await subgraphClient.query({
    query: GET_BIDS_TO_REFUND,
    variables: {now, metaId},
    fetchPolicy: "network-only"
  })

  return response
}
