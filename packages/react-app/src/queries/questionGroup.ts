import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { QuestionGroup } from 'lithium-subgraph'
import { QueryResponse, QUESTION_FIELDS, QUESTION_GROUP_FIELDS } from './common'
import { selectQuestionGroup } from '../selectors/questionGroup';
import { QuestionGroupView } from '../types/questionGroup';
import { msToSec, toLowerCase } from '../helpers/formatters';

interface QuestionGroupQueryVars {
  id: string
}

interface QuestionGroupAndUserBidQueryVars {
  id: string,
  address: string
}

interface QuestionGroupAndUserAnswerQueryVars {
  id: string;
  address: string;
}

interface ActiveQuestionGroupsQueryVars {
  now: string
}

interface UpcomingQuestionGroupsQueryVars {
  now: string
}

interface GetQuestionGroupData {
  questionGroup: QuestionGroup
}

interface GetQuestionGroupsData {
  questionGroups: QuestionGroupView[] 
}


export const GET_QUESTION_GROUP  = gql`
  ${QUESTION_GROUP_FIELDS}
  ${QUESTION_FIELDS}
  query questionGroup($id: ID!) {
    questionGroup(id: $id) {
      ...QuestionGroupFields
      questions {
        ...QuestionFields
      }
    }
}
`;


export const GET_QUESTION_GROUP_AND_USER_ANSWER  = gql`
  ${QUESTION_GROUP_FIELDS}
  ${QUESTION_FIELDS}
  query questionGroup($id: ID!, $address: String!) {
    questionGroup(id: $id) {
      ...QuestionGroupFields
      questions {
        ...QuestionFields
        answers(where: {answerer: $address}) {
          id
        }
      }
    }
}
`;

interface GetQuestionGroupResponse extends QueryResponse {
  questionGroup: QuestionGroupView | null
}

export const GET_QUESTION_GROUPS  = gql`
  ${QUESTION_GROUP_FIELDS}
  ${QUESTION_FIELDS}
  query questionGroups {
    questionGroups {
      ...QuestionGroupFields
      questions {
        ...QuestionFields
      }
      
    }
  }
`;

export const GET_ACTIVE_QUESTION_GROUPS  = gql`
  ${QUESTION_FIELDS}
  query questionGroups($now: String!) {
    questionGroups(where: {endTime_gt: $now, startTime_lt: $now}) {
      id
      endTime
      questions {
        ...QuestionFields
      }
    }
}
`;

export const GET_UPCOMING_QUESTION_GROUPS  = gql`
  ${QUESTION_FIELDS}
  query questionGroups($now: String!) {
    questionGroups(where: {startTime_gt: $now}) {
      id
      endTime
      questions {
        ...QuestionFields
      }
    }
}
`;



interface GetQuestionGroupsResponse extends QueryResponse {
  questionGroups: QuestionGroupView [] | null
}

export const useGetQuestionGroup = (client: any, id: string): GetQuestionGroupResponse => {
  const {loading, error, data} = useQuery<GetQuestionGroupData, QuestionGroupQueryVars>(
    GET_QUESTION_GROUP,
    {
      client,
      variables: { id },
      fetchPolicy: 'no-cache'
    });
  return {
    loading,
    error,
    questionGroup: data != null ? selectQuestionGroup(data.questionGroup) : null
  } 
}

export const useGetQuestionGroupAndUserBid = (client: any, id: string, address: string): GetQuestionGroupResponse => {
  address = toLowerCase(address)
  const {loading, error, data} = useQuery<GetQuestionGroupData, QuestionGroupAndUserBidQueryVars>(
    GET_QUESTION_GROUP,
    {
      client,
      variables: { id, address },
      fetchPolicy: 'no-cache'
    });
  return {
    loading,
    error,
    questionGroup: data != null ? selectQuestionGroup(data.questionGroup) : null
  } 
}

export const useGetQuestionGroupAndUserAnswer = (client: any, id: string, address: string): GetQuestionGroupResponse => {
  address = toLowerCase(address)
  const {loading, error, data} = useQuery<GetQuestionGroupData, QuestionGroupAndUserAnswerQueryVars>(
    GET_QUESTION_GROUP_AND_USER_ANSWER,
    {
      client,
      variables: { id, address },
      fetchPolicy: 'no-cache'
    });
  return {
    loading,
    error,
    questionGroup: data != null ? selectQuestionGroup(data.questionGroup) : null
  } 
}

export const useGetQuestionGroups = (client: any): GetQuestionGroupsResponse => {
  const {loading, error, data} = useQuery<GetQuestionGroupsData, {}>(
    GET_QUESTION_GROUPS,
    {
      client,
      variables: {},
      fetchPolicy: 'no-cache'
    });
  return {
    loading,
    error,
    questionGroups: data != null ? data.questionGroups.map(selectQuestionGroup) : []
  } 
}

export const useGetActiveQuestionGroups = (client: any): GetQuestionGroupsResponse => {
  const now = msToSec(new Date().getTime()).toString()
  const {loading, error, data} = useQuery<GetQuestionGroupsData, ActiveQuestionGroupsQueryVars>(
    GET_ACTIVE_QUESTION_GROUPS,
    {
      client,
      variables: {now},
      fetchPolicy: 'no-cache'
    });
  return {
    loading,
    error,
    questionGroups: data != null ? data.questionGroups.map(selectQuestionGroup) : null
  } 
}

export const useGetUpcomingQuestionGroups = (client: any): GetQuestionGroupsResponse => {
  const now = msToSec(new Date().getTime()).toString()
  const {loading, error, data} = useQuery<GetQuestionGroupsData, UpcomingQuestionGroupsQueryVars>(
    GET_UPCOMING_QUESTION_GROUPS,
    {
      client,
      variables: {now},
      fetchPolicy: 'no-cache'
    });
  return {
    loading,
    error,
    questionGroups: data != null ? data.questionGroups.map(selectQuestionGroup) : null
  } 
}



