import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { Question } from 'lithium-subgraph'
import { QueryResponse, QUESTION_FIELDS } from './common'
import { QuestionView } from '../types/question';
import { selectQuestion } from '../selectors/question';

interface QuestionQueryVars {
  id: string
}

interface ActiveQuestionsQueryVars {
  now: string
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

export const useGetActiveQuestions = (client: any): GetQuestionsResponse => {
  const now = (new Date().getTime() / 1000).toString()
  const {loading, error, data} = useQuery<GetUsersData, ActiveQuestionsQueryVars>(
    GET_QUESTIONS,
    {
      client,
      variables: {now},
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