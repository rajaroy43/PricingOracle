
require('dotenv').config()
import { BigNumber } from "ethers"
import CURRENTLY_CALCULATING from "./currentlyCalculating"
import { getEndedQuestionGroups } from "./queries/questionGroup"
import { getQuestion } from "./queries/question"
import getRewards from "./getRewards"
import { updateInvalidAndRefund, updateQuestionStatusAndReward } from "./publishReward"
import { AnswerStatus } from './types'


const calculateQuestionGroup = async (group: any) => {
  console.log(`calculating group : \n${JSON.stringify(group)}`)
  const questions = await Promise.all(
    group.questions.map((question: any) => {
      return getQuestion(question.id, group.category.id)
    })
  )

  //@ts-ignore
  const answerCount = parseInt(questions[0].question.answerCount, 10)
  if (parseInt(group.minimumRequiredAnswers, 10) > answerCount) {
    updateInvalidAndRefund(group, questions)
  } else {
    console.log(`QuestionGroup ${group.id} VALID, getting rewards`)
    const groupData = {
      ...group,
      questions
    }
   
    const rewardsResponse = await getRewards(groupData)
    if (rewardsResponse.error) {
      console.log(`Error calculating rewards for group ${group.id}\nError Message: ${rewardsResponse.error}`)
    } else {
      console.log(`Got rewards response ${rewardsResponse.data}`)
      //const rewards = JSON.parse(rewardsResponse.data)
      if (rewardsResponse.data.answerStatus === AnswerStatus.Success) {
        console.log('Valid answer calculation')
        updateQuestionStatusAndReward(rewardsResponse.data)
      } else {
        console.log('Invalid answer calculation')
        updateInvalidAndRefund(group, questions)
      }
    }
  }

}

const fetchQuestionsToCalculate = async () => {
  const response = await getEndedQuestionGroups()

  if (response.error) {
    console.log(`Error fetching question groups: ${response.error}`)
    return 
  }

  await Promise.all(response.data.questionGroups.map(calculateQuestionGroup))
    
}
console.log(`fetch interval ${process.env.FETCH_INTERVAL}`)
//@ts-ignore
setInterval(fetchQuestionsToCalculate, process.env.FETCH_INTERVAL)