

  import React from 'react'
import { subgraphClient } from '../../client'
import { useGetAnswerGroupsForAddress } from '../../queries/answerGroup'
import LoadingCircle from '../atoms/Loading'

const AnswerGroupList = ({address}: {address: string}) => {
  console.log(`get answer group list ${address}`)
    // @ts-ignore
  const {loading, error, answerGroupView} = useGetAnswerGroupsForAddress(subgraphClient, address)
  const content = loading ?
  <LoadingCircle />
  :
  error ?
    'Error loading Answer Group'
    :
    answerGroupView!.answerGroupViews.length ?
      answerGroupView!.answerGroupViews.map(ag => <div key={ag.id}>AnswerGroup #{ag.id}</div>)
      :
      'No Answers' 
  return (
    <div>
      <h3>Answer Groups</h3>
      { content }
    </div>
  )
}

export default AnswerGroupList