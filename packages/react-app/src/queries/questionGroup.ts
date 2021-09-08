import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { QuestionGroup } from 'lithium-subgraph'
import { QueryResponse, QUESTION_FIELDS } from './common'
import { QuestionView } from '../types/question';
import { selectQuestionGroup } from '../selectors/questionGroup';
import { QuestionGroupView } from '../types/questionGroup';

interface ActiveQuestionGroupsQueryVars {
  now: string
}

interface GetQuestionGroupData {
  questionGroup: QuestionGroup
}

interface GetQuestionGroupsData {
  questionGroups: QuestionGroup[] 
}


export const GET_QUESTION_GROUPS  = gql`
  ${QUESTION_FIELDS}
  query questionGroups {
    questionGroups {
      id
      endTime
      questions {
        ...QuestionFields
      }
      
    }
  }
`;

export const GET_ACTIVE_QUESTION_GROUPS  = gql`
  ${QUESTION_FIELDS}
  query questionGroups($now: String!) {
    questionGroups(where: {endTime_gt: $now}) {
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
  const now = Math.floor(new Date().getTime() / 1000).toString()
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
