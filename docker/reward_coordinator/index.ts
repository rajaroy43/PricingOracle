import CURRENTLY_CALCULATING from "./currentlyCalculating"
import { getEndedQuestionGroups } from "./queries/questionGroup"
import { getQuestion } from "./queries/question"
import getRewards from "./getRewards"

require('dotenv').config()

const calculateQuestionGroup = async (group: any) => {
  const questions = await Promise.all(
    group.questions.map((question: any) => {
      return getQuestion(question.id, group.category.id)
    })
  ) 

  const groupData = {
    ...group,
    questions
  }


  getRewards(groupData)

}

const fetchQuestionsToCalculate = async () => {
  const response = await getEndedQuestionGroups()

  if (response.error) {
    console.log(`Error fetching question groups: ${response.error}`)
    return 
  }

  response.data.questionGroups.forEach(calculateQuestionGroup)
    
}

setInterval(fetchQuestionsToCalculate, 10000)