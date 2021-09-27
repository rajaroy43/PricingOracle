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