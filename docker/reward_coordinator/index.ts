import express from "express"

import CURRENTLY_CALCULATING from "./currentlyCalculating"
import { getEndedQuestionGroups } from "./queries/questionGroup"
import { getQuestion } from "./queries/question"
import getRewards from "./getRewards"

require('dotenv').config()

const calculateQuestionGroup = async (group: any) => {
  const questions = await Promise.all(
    group.questions.map((question: any) => {
      return getQuestion(question.id)
    })
  ) 

  const groupData = {
    ...group,
    questions
  }

  const rewards =  getRewards(groupData)
  console.log(`got rewards`, rewards)

}

const fetchQuestionsToCalculate = async () => {
  const response = await getEndedQuestionGroups()
  console.log('questions are ', response)

  if (response.error) {
    console.log(`Error fetching question groups: ${response.error}`)
  }

  response.data.questionGroups.filter(
    (group: any) => CURRENTLY_CALCULATING.isCalculationRequired(group.id)
  ).forEach(calculateQuestionGroup)
    
}

setInterval(fetchQuestionsToCalculate, 5000)