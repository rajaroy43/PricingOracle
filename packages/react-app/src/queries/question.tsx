import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { Question } from 'lithium-subgraph'
import { QueryResponse, QUESTION_FIELDS, QUESTION_BID_FIELDS } from './common'
import { QuestionView } from '../types/question';
import { selectQuestion } from '../selectors/question';
import { toLowerCase } from '../helpers/formatters';

interface QuestionQueryVars {
  id: string
}

interface ActiveQuestionsAndUserBidQueryVars {
  now: string,
  address: string
}

interface GetQuestionData {
  question: Question
}

interface GetUsersData {
  questions: Question[] 
}

export const GET_QUESTIONS  = gql`
  ${QUESTION_FIELDS}
  query questions {
    questions {
      ...QuestionFields
    }
}
`;

export const GET_ACTIVE_QUESTIONS  = gql`
  ${QUESTION_FIELDS}
  query questions($now: String!) {
    questions(where: {created_gt: $now}) {
      ...QuestionFields
    }
}
`;

export const GET_ACTIVE_QUESTIONS_AND_USER_BID  = gql`
  ${QUESTION_FIELDS}
  ${QUESTION_BID_FIELDS}
  query questions($now: String!, $address: String!) {
    questions(where: {startTime_gt: $now}) {
      ...QuestionFields
      bids(where: {user: $address}) {
        ...QuestionBidFields
      }
    }
}
`;

export const GET_QUESTION_BIDS  = gql`
  ${QUESTION_FIELDS}
  query questions($now: String!) {
    questions(where: {created_gt: $now}) {
      ...QuestionFields
    }
}
`;

interface GetQuestionsResponse extends QueryResponse {
  questions: QuestionView[] | null
}

export const useGetQuestions = (client: any): GetQuestionsResponse => {
  const {loading, error, data} = useQuery<GetUsersData, {}>(
    GET_QUESTIONS,
    {
      client,
      variables: {},
      fetchPolicy: 'no-cache'
    });
  return {
    loading,
    error,
    questions: data != null ? data.questions.map(selectQuestion) : []
  } 
}

export const useGetActiveQuestionsAndUserBid = (client: any, address: string): GetQuestionsResponse => {
  const now = (new Date().getTime() / 1000).toString()
  address = toLowerCase(address)
  const {loading, error, data} = useQuery<GetUsersData, ActiveQuestionsAndUserBidQueryVars>(
    GET_ACTIVE_QUESTIONS_AND_USER_BID,
    {
      client,
      variables: {now, address},
      fetchPolicy: 'no-cache'
    });
  return {
    loading,
    error,
    questions: data != null ? data.questions.map(selectQuestion) : null
  } 
}


export const GET_QUESTION  = gql`
  ${QUESTION_FIELDS}
  query question($id: ID!) {
    question(id: $id) {
      ...QuestionFields
    }
}
`;

interface GetQuestionResponse extends QueryResponse {
  question: QuestionView | null
}

export const useGetQuestion = (client: any, id: string): GetQuestionResponse => {
  const {loading, error, data} = useQuery<GetQuestionData, QuestionQueryVars>(
    GET_QUESTION,
    {
      client,
      variables: { id },
      fetchPolicy: 'no-cache'
    });
  return {
    loading,
    error,
    question: data != null ? selectQuestion(data.question) : null
  } 
}