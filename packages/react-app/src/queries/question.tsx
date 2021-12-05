import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { Question } from 'lithium-subgraph'
import { QueryResponse, QUESTION_FIELDS, QUESTION_BID_FIELDS } from './common'
import { QuestionAndBidsView, QuestionView } from '../types/question';
import { selectQuestion, selectQuestionAndBids } from '../selectors/question';
import { msToSec, toLowerCase } from '../helpers/formatters';

interface QuestionQueryVars {
  id: string
}

interface QuestionAndBidsQueryVars {
  id: string,
  metaId: string
}

interface BiddableQuestionsAndUserBidQueryVars {
  now: string,
  address: string
}

interface GetQuestionData {
  question: Question
}

interface GetQuestionAndBidsData {
  questions: Question,
  pricingContractMeta: {
    revealTiers: number[]
  }
}


interface GetQuestionsData {
  questions: Question[] 
}

interface GetQuestionResponse extends QueryResponse {
  question: QuestionView | null
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

export const GET_BIDDABLE_QUESTIONS_AND_USER_BID  = gql`
  ${QUESTION_FIELDS}
  ${QUESTION_BID_FIELDS}
  query questions($now: String!, $address: String!) {
    questions(where: {startTime_gt: $now, questionType: "Pricing" }) {
      ...QuestionFields
      bids(where: {user: $address}) {
        ...QuestionBidFields
      }
    }
}
`;

export const GET_CLOSED_QUESTIONS_AND_USER_BID  = gql`
  ${QUESTION_FIELDS}
  ${QUESTION_BID_FIELDS}
  query questions($now: String!, $address: String!) {
    questions(where: {startTime_lt: $now, questionType: "Pricing" }) {
      ...QuestionFields
      bids(where: {user: $address}) {
        ...QuestionBidFields
      }
    }
}
`;

export const GET_QUESTION_BIDS  = gql`
  ${QUESTION_FIELDS}
  query questions($now: String!, $metaId: String!) {
    questions(where: {created_gt: $now}) {
      ...QuestionFields
      bids {
        ...QuestionBidFields
      }
    }
    pricingContractMeta(id: $metaId) {
      revealTiers
    }
}
`;

interface GetQuestionsResponse extends QueryResponse {
  questions: QuestionView[] | null
}

interface GetQuestionAndBidsResponse extends QueryResponse {
  question: QuestionAndBidsView | null,
    pricingContractMeta: {
      revealTiers: number[]
    } | null
}

export const useGetQuestions = (client: any): GetQuestionsResponse => {
  const {loading, error, data} = useQuery<GetQuestionsData, {}>(
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

export const useGetQuestionBids = (client: any, id: string): GetQuestionAndBidsResponse => {
  const metaId = 'prcing_contract_meta'
  const {loading, error, data} = useQuery<GetQuestionAndBidsData, QuestionAndBidsQueryVars>(
    GET_QUESTION_BIDS,
    {
      client,
      variables: {id, metaId},
      fetchPolicy: 'no-cache'
    });
  return {
    loading,
    error,
    question: data != null ? selectQuestionAndBids(data.questions, data.pricingContractMeta.revealTiers) : null,
    pricingContractMeta: data != null ? data.pricingContractMeta : null
  } 
}

export const useGetBiddableQuestionsAndUserBid = (client: any, address: string): GetQuestionsResponse => {
  const now = msToSec(new Date().getTime()).toString()
  address = toLowerCase(address)
  const {loading, error, data} = useQuery<GetQuestionsData, BiddableQuestionsAndUserBidQueryVars>(
    GET_BIDDABLE_QUESTIONS_AND_USER_BID,
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

export const useGetClosedQuestionsAndUserBid = (client: any, address: string): GetQuestionsResponse => {
  const now = msToSec(new Date().getTime()).toString()
  address = toLowerCase(address)
  const {loading, error, data} = useQuery<GetQuestionsData, BiddableQuestionsAndUserBidQueryVars>(
    GET_CLOSED_QUESTIONS_AND_USER_BID,
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