import { gql } from '@apollo/client';
import { subgraphClient } from '../client';

export const GET_ENDED_QUESTION_GROUPS  = gql`
  query questionGroups($now: String!) {
    questionGroups(where: {endTime_lt: $now, isAnswerCalculated: NotCalculated}) {
      id
      minimumRequiredAnswers
      category {
        id
      }
      questions {
        id
        answerCount
      }
    }
}
`;

interface GetQuestionGroupsResponse {
  questionGroups: {
    id: string
    minimumRequiredAnswers: string
    category: {id: string}
    questions: {id: string}[]
  }
}

export const getEndedQuestionGroups = async () => {
  const now = Math.floor(new Date().getTime() / 1000).toString();
  const response = await subgraphClient.query({
    query: GET_ENDED_QUESTION_GROUPS,
    variables: {now},
    fetchPolicy: "network-only"
  })

  return response
  
}
