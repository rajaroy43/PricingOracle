import { CalculatorResponse, RewardsResponseData } from "./types"

const axios = require('axios')


//[questionGroupId, numberQuestionChoices, numberQuestions, questionGroupCategory, wisdomNodeAddess, questionId, answerSet, answerValue, answerIndex, stakeAmount, wisdomNodeReputation, totalBounty, totalStaked]
const prepareAnswerRow = (
  groupId: string,
  questionCount: number,
  question: any,
  answer: any
) => {
  const reputationScore = answer.answerer.categoryReputations.length ? answer.answerer.categoryReputations[0].score : "0"
  return [
    groupId,
    question.answerSet.length,
    questionCount,
    question.category.id,
    answer.answerer.id,
    question.id,
    question.answerSet,
    question.answerSet[answer.answerIndex],
    answer.answerIndex,
    answer.stakeAmount,
    reputationScore,
    question.bounty,
    question.totalStaked
  ] 
}

const prepareQuestion = (groupId: string, questionCount: number, question: any) => {

  return question.answers.map((answer: any) => prepareAnswerRow(groupId, questionCount, question, answer))
}

const preparePayload = (groupData: any) => {

  return groupData.questions
    .map((question: any) => prepareQuestion(groupData.id, groupData.questions.length, question.question))
    .reduce((acc: any, answers: any) => acc.concat(answers), [])
}

const getRewards = (groupData: any): Promise<CalculatorResponse> => {
  const msg = preparePayload(groupData)
  return axios
    .post(`${process.env.REWARD_CALCULATOR_URI}/calculate-reward`, {
      msg
    })
}

export default getRewards