import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { User } from 'lithium-subgraph'
import { QueryResponse, QUESTION_FIELDS, ANSWER_FIELDS, USER_FIELDS } from './common'
import { UserView } from '../types/user';
import { selectUser } from '../selectors/user';

interface UserQueryVars {
  id: string
}

interface GetUserData {
  user: User
}

interface GetUsersData {
  users: User[] 
}

export const GET_USERS  = gql`
  ${USER_FIELDS}
  query users {
    users {
      ...UserFields
    }
}
`;

interface GetUsersResponse extends QueryResponse {
  users: UserView[] | null
}

export const useGetUsers = (client: any): GetUsersResponse => {
  const {loading, error, data} = useQuery<GetUsersData, {}>(
    GET_USERS,
    {
      client,
      variables: {},
      fetchPolicy: 'no-cache'
    });
  return {
    loading,
    error,
    users: data ? data.users.map(selectUser) : null
  } 
}

export const GET_USER  = gql`
  ${USER_FIELDS}
  ${QUESTION_FIELDS}
  ${ANSWER_FIELDS}
  query user($id: ID!) {
    user(id: $id) {
      ...UserFields
      answers {
        ...AnswerFields
      }
      questions {
        ...QuestionFields
      }
  }
    }
`;

interface GetUserResponse extends QueryResponse {
  user: UserView | null
}

export const useGetUser = (client: any, id: string): GetUserResponse => {
  id = id.split('').map(f => f.toLowerCase()).join('')
  
  const {loading, error, data} = useQuery<GetUserData, UserQueryVars>(
    GET_USER,
    {
      client,
      variables: { id },
      fetchPolicy: 'no-cache'
    });
    
  return {
    loading,
    error,
    user: data && data.user ? selectUser(data.user) : null
  } 
}