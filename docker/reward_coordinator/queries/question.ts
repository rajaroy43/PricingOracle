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