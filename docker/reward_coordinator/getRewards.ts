import http from "http"
const axios = require('axios')


//questionGroupId, questionId, wisdomNodeAddess, answerSet, answerValue, stakeAmount, wisdomNodeReputation
const prepareAnswerRow = (groupId: string, questionId: string, answerSet: string[], answer: any) => {
  const reputationScore = answer.answerer.categoryReputations.length ? answer.answerer.categoryReputations[0] : "0"
  return [
    groupId,
    questionId,
    answer.answerer.id,
    answerSet,
    answerSet[answer.answerIndex],
    answer.stakeAmount,
    reputationScore
  ] 
}

const prepareQuestion = (groupId: string, question: any) => {

  return question.answers.map((answer: any) => prepareAnswerRow(groupId, question.id, question.answerSet, answer))
}

const preparePayload = (groupData: any) => {

  return groupData.questions
    .map((question: any) => prepareQuestion(groupData.id, question.question))
    .reduce((acc: any, answers: any) => acc.concat(answers), [])
}

const getRewards = (groupData: any) => {
  const msg = preparePayload(groupData)
  console.log(`reqesting reward data for\n ${JSON.stringify(msg)}`)
  axios
    .post(`${process.env.REWARD_CALCULATOR_URI}/calculate-reward`, {
      msg
    })
    .then((res:any) => {
      console.log(`calculate-reward statusCode: ${res.status}\nresponse: ${JSON.stringify(res.data)}`)
    })
    .catch((error: any) => {
      console.error(`error getting rewards`, error)
    })

    axios
    .get(`${process.env.REWARD_CALCULATOR_URI}/ping-me`, {
      msg
    })
    .then((res:any) => {
      console.log(`ping-me statusCode: ${res.status}\nresponse: ${JSON.stringify(res.data)}`)
    })
    .catch((error: any) => {
      console.error(`error getting rewards`, error)
    })


}

export default getRewards