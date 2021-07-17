import React from 'react'
import { UserView } from '../../types/user'
import AnswerList from '../answers/AnswerList'
import Flex from '../atoms/Flex'
import QuestionList from '../questions/QuestionList'
import UserBalances from './UserBalances'
import UserInputRow from './UserInputRow'

const UserProfile = ({user, connectedWallet}: {user: UserView, connectedWallet?: any}) => {
  return (
    <div>
      { connectedWallet && <UserInputRow connectedWallet={connectedWallet} /> }
      <UserBalances user={user}/>
      <Flex>
        <QuestionList questions={user.questionViews} />
        <AnswerList answers={user.answerViews} />
      </Flex>
    </div>
  )
}

export default UserProfile