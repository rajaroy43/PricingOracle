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

export const getEndedQuestionGroups = () => {
  const now = Math.floor(new Date().getTime()).toString();
  subgraphClient.query({
    query: GET_ENDED_QUESTION_GROUPS,
    variables: {now}
  }).then((resp) => {
    console.log(`resonse is `, resp, now)
  }).catch((err) => console.log(`query err `, err))
  
}
