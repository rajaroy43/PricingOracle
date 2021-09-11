import express from "express"

import CURRENTLY_CALCULATING from "./currentlyCalculating"
import { getEndedQuestionGroups } from "./queries/questionGroup"
import { getQuestion } from "./queries/question"

require('dotenv').config()

const calculateQuestionGroup = async (group: any) => {
  const questionsAndAnswers = await Promise.all(
    group.questions.map((question: any) => {
      return getQuestion(question.id)
    })
  )
}

const fetchQuestionsToCalculate = async () => {
  const questionGroups = await getEndedQuestionGroups()
  console.log('questions are ', questionGroups)

  if (questionGroups.error) {
    console.log(`Error fetching question groups: ${questionGroups.error}`)
  }

  questionGroups.data.filter(
    (group: any) => CURRENTLY_CALCULATING.isCalculationRequired(group.id)
  ).forEach(calculateQuestionGroup)
    
}

setInterval(fetchQuestionsToCalculate, 5000)