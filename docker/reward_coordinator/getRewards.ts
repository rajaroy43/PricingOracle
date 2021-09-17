const axios = require('axios')


//questionGroupId, wisdomNodeAddess, questionId, answerSet, answerValue, stakeAmount, wisdomNodeReputation
const prepareAnswerRow = (groupId: string, questionId: string, answerSet: string[], answer: any) => {
  const reputationScore = answer.answerer.categoryReputations.length ? answer.answerer.categoryReputations[0].score : "0"
  return [
    groupId,
    answer.answerer.id,
    questionId,
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