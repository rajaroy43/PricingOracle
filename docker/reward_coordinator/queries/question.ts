import { gql } from '@apollo/client';
import { subgraphClient } from '../client';

export const GET_QUESTION  = gql`
  query question($id: String!) {
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
      answers {
        id
        answerer {
          id
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

export const getQuestion = async (id: string) => {
  const response = await subgraphClient.query({
    query: GET_QUESTION,
    variables: {id}
  })

  return response
  
}