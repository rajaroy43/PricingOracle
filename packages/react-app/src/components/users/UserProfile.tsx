import React from 'react'
import { UserView } from '../../types/user'
import AnswerList from '../answers/AnswerList'
import QuestionList from '../questions/QuestionList'

const UserProfile = ({user}: {user: UserView}) => {
  return (
    <div>
      <QuestionList questions={user.questionViews} />
      <AnswerList answers={user.answerViews} />
    </div>
  )
}

export default UserProfile