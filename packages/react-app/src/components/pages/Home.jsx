import React from 'react'
import { subgraphClient } from '../../client'
import { useGetQuestions } from '../../queries/question'
import LoadingCircle from '../atoms/Loading'
import QuestionList from '../questions/QuestionList'
import Base from './Base'

const Account = () => {
  const {loading, questions} = useGetQuestions(subgraphClient)

  return (
    <Base>
     <h1>Lithium Finance</h1>
     {loading ?
        <LoadingCircle />
        :
        <QuestionList questions={questions} />
     }
    </Base>
  )
}

export default Account