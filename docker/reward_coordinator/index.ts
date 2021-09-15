import CURRENTLY_CALCULATING from "./currentlyCalculating"
import { getEndedQuestionGroups } from "./queries/questionGroup"
import { getQuestion } from "./queries/question"
import getRewards from "./getRewards"

require('dotenv').config()

const calculateQuestionGroup = async (group: any) => {
  const questions = await Promise.all(
    group.questions.map((question: any) => {
      console.log(`getting question `, question, group)
      return getQuestion(question.id, group.category.id)
    })
  ) 

  const groupData = {
    ...group,
    questions
  }

  console.log(`qs and as `, JSON.stringify(questions))

  const rewards =  getRewards(groupData)
  console.log(`got rewards`, rewards)

}

const fetchQuestionsToCalculate = async () => {
  const response = await getEndedQuestionGroups()
  console.log('questions are xx', JSON.stringify(response.data.questionGroups))

  if (response.error) {
    console.log(`Error fetching question groups: ${response.error}`)
    return 
  }

  response.data.questionGroups.forEach(calculateQuestionGroup)
    
}

setInterval(fetchQuestionsToCalculate, 5000)