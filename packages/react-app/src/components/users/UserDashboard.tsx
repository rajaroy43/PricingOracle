import React from 'react'
import { UserView } from '../../types/user'
import AnswerList from '../answers/AnswerList'
import Flex from '../atoms/Flex'
import QuestionList from '../questions/QuestionList'
import UserInputRow from './UserInputRow'

const UserDashboard = ({user, connectedWallet}: {user: UserView, connectedWallet?: any}) => {
  return (
    <div>
      { connectedWallet && <UserInputRow pricingIsApproved={user.pricingIsApproved} /> }
      <Flex justifyContent='space-around' mt='3em'>
        <QuestionList questions={user.questionViews} />
        <AnswerList answers={user.answerViews} />
      </Flex>
    </div>
  )
}

export default UserDashboard