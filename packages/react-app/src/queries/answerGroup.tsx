import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { AnswerGroup } from 'lithium-subgraph'
import { QueryResponse,ANSWER_GROUP_FIELDS } from './common'
import { AnswerGroupsView } from '../types/answerGroup';
import { selectAnswerGroups } from '../selectors/answerGroup';

interface AnswerGroupsForAddressQueryVars {
  address: string
}

interface GetAnswerData {
  answerGroups: AnswerGroup[]
}

export const GET_ANSWER = gql`
  ${ANSWER_GROUP_FIELDS}
  query answerGroups($address: String!) {
    answerGroups(where: {owner: $address}) {
      ...AnswerGroupFields
    }
  }
`;

interface GetAnswerGroupsResponse extends QueryResponse {
  answerGroupView: AnswerGroupsView | null
}

export const useGetAnswerGroupsForAddress = (client: any, address: string): GetAnswerGroupsResponse => {
  address = address.split('').map(f => f.toLowerCase()).join('')
  const {loading, error, data} = useQuery<GetAnswerData, AnswerGroupsForAddressQueryVars>(
    GET_ANSWER,
    {
      client,
      variables: { address },
      fetchPolicy: 'no-cache'
    });
  return {
    loading,
    error,
    answerGroupView: data != null && data.answerGroups != null ? selectAnswerGroups(data.answerGroups) : null
  } 
}
