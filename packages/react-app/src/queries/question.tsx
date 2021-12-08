import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { Question, QuestionBid } from 'lithium-subgraph'
import { QueryResponse, QUESTION_FIELDS, QUESTION_BID_FIELDS } from './common'
import { QuestionAndBidsView, QuestionBidView, QuestionView, UserBidsView } from '../types/question';
import { selectQuestion, selectQuestionAndBids, selectUserBidQuestion } from '../selectors/question';
import { msToSec, toLowerCase } from '../helpers/formatters';

const metaId = 'pricing_contract_meta'

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

interface UserBidsQueryVars {
  address: string,
  metaId: string
}

interface GetQuestionData {
  question: Question
}

interface GetQuestionAndBidsData {
  question: Question,
  pricingContractMeta: {
    revealTiers: number[]
  }
}

interface GetUserBidsData {
  bids: QuestionBid[],
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
  ${QUESTION_BID_FIELDS}
  query question($id: String!, $metaId: String!) {
    question(id: $id) {
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
    question: data != null ? selectQuestionAndBids(data.question, data.pricingContractMeta.revealTiers) : null,
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

export const GET_USER_BIDS  = gql`
  ${QUESTION_FIELDS}
  ${QUESTION_BID_FIELDS}
  query bids($address: String!, $metaId: String!) {
    bids(where: {user: $address}) {
      bids {
        ...QuestionBidFields
        question {
          ...QuestionFields
          bids {
            ...QuestionBidFields
          }
        }
      }
    }
    pricingContractMeta(id: $metaId) {
      revealTiers
    }
}
`;

interface GetUserBidsResponse extends QueryResponse {
  bids: UserBidsView
}

export const useGetUserBids = (client: any, address: string): GetUserBidsResponse => {
  address = toLowerCase(address)
  const {loading, error, data} = useQuery<GetUserBidsData, UserBidsQueryVars>(
    GET_USER_BIDS,
    {
      client,
      variables: { address, metaId },
      fetchPolicy: 'no-cache'
    });
  const userBids = {
    biddingOpenQuestions: [],
    answeringOpenQuestions: [],
    answeredQuestions: []
  }
  const bids = data != null ?
    data.bids.map((bid) => selectUserBidQuestion(bid, data.pricingContractMeta.revealTiers))
    .reduce((acc: any, question: any) => {
      if (question.isBiddingOpen) {
        acc.biddingOpenQuestions.push(question)
      } else if (question.isAnswerCalculated) {
        acc.answeringOpenQuestions.push(question)
      } else {
        acc.answeredQuestions.push(question)
      }
      return acc
    }, {...userBids} )

    :
    userBids
  return {
    loading,
    error,
    bids
  } 
}