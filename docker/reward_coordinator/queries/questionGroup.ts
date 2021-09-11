import { gql } from '@apollo/client';
import { subgraphClient } from '../client';

export const GET_ENDED_QUESTION_GROUPS  = gql`
  query questionGroups($now: String!) {
    questionGroups(where: {endTime_lt: $now}) {
      id
      minimumRequiredAnswers
      questions (where: {isAnswerCalculated: NotCalculated}) {
        id
      }
    }
}
`;

interface GetQuestionGroupsResponse {
  questionGroups: {
    id: string
    minimumRequiredAnswers: string
    questions: {id: string}[]
  }
}

export const getEndedQuestionGroups = async () => {
  const now = Math.floor(new Date().getTime() / 1000).toString();
  const response = await subgraphClient.query({
    query: GET_ENDED_QUESTION_GROUPS,
    variables: {now}
  })

  return response
  
}
