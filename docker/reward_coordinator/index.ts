
require('dotenv').config()
import CURRENTLY_CALCULATING from "./currentlyCalculating"
import { getEndedQuestionGroups } from "./queries/questionGroup"
import { getQuestion } from "./queries/question"
import getRewards from "./getRewards"
import { publishInvalidAnswers } from "./publishReward"


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
    console.log(`QuestionGroup ${group.id} INVALID: ${JSON.stringify(questions)}`)
    const questionIds = group.questions.map((question: any) => question.id)
    console.log(`question ids ${questionIds}`)
    const groupIds = Array(answerCount).fill(group.id)
    const allAddresses = questions.map(
        (question: any) => { 
          console.log(`inside question ${JSON.stringify(question)}`);
          return question.question.answers.map((answer: any) => [answer.answerer.id, answer.stakeAmount])
        })
    console.log(`got all addresses ${allAddresses}`)
     const addresses =  allAddresses.reduce((acc: string[], addrs: string[]) => acc.concat(addrs), [])
    const rewardAmounts = Array(answerCount).fill(group.id)
    await publishInvalidAnswers(
      questionIds,
      groupIds,
      addresses,
      rewardAmounts
    )


  } else {
    console.log(`QuestionGroup ${group.id} VALID, getting rewards`)
    const groupData = {
      ...group,
      questions
    }
   
    getRewards(groupData)
  }

}

const fetchQuestionsToCalculate = async () => {
  const response = await getEndedQuestionGroups()

  if (response.error) {
    console.log(`Error fetching question groups: ${response.error}`)
    return 
  }

  response.data.questionGroups.forEach(calculateQuestionGroup)
    
}
console.log(`fetch interval ${process.env.FETCH_INTERVAL}`)
setInterval(fetchQuestionsToCalculate, 30000)