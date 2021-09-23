
require('dotenv').config()
import { BigNumber } from "ethers"
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

    const answerStakes = questions
      .map(({question}: any) => question.answers)
      .reduce((acc:any, answers:any) => acc.concat(answers), [])
      .reduce((acc: any, answer: any) => {
        const answererId = answer.answerer.id
        console.log(`inside red ${JSON.stringify(acc)}`)
        if (acc.hasOwnProperty(answererId)) {
          acc[answererId] = acc[answererId].add(BigNumber.from(answer.stakeAmount))
        } else {
          acc[answererId] = BigNumber.from(answer.stakeAmount)
        } 
        return acc
      }, {})

    const addresses = Object.keys(answerStakes)
    const rewardAmounts = addresses.map((addr: string) => answerStakes[addr].toString())
    console.log(`publishing invalid questions: ${questionIds}\nstake refunds groupIds\n${groupIds}\n${addresses}\n${JSON.stringify(rewardAmounts)}`)
    return publishInvalidAnswers(
      questionIds,
      {
        groupIds,
        addresses,
        rewardAmounts
      }
    )


  } else {
    console.log(`QuestionGroup ${group.id} VALID, getting rewards`)
    const groupData = {
      ...group,
      questions
    }
   
    return getRewards(groupData)
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
setInterval(fetchQuestionsToCalculate, 50000)