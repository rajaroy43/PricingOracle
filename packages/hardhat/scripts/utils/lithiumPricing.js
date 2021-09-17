const { generateMockQuestionData } = require("./mockQuestionData");

const createQuestionGroup = async (lithiumPricing) => {
  const args = await generateMockQuestionData();
  console.log("\n\n 📡 Creating mock question groups \n");
  for (var i = 0; i < args.length; i++) {
    await lithiumPricing.createQuestionGroup(...args[i]);
  }
  return args
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const answerQuestionGroup = async (lithiumPricing, groupId, questions, account) => {
  const stakeAmounts = questions[0].map(() => getRandomInt(101))
  const answerIndexes = questions[0].map(() => getRandomInt(2))
  console.log(`answering question ${groupId} `, stakeAmounts, answerIndexes)
  const answer = await lithiumPricing.connect(account).answerQuestions(groupId, stakeAmounts, answerIndexes)
  console.log(`QuestionGroup answered `, answer)
}

const answerQuestionGroups = async (lithiumPricing, questions, accounts) => {
  for (let i = 0; i < questions.length; i++) {
    for (let t = 0; t < accounts.length; t++) {
      await answerQuestionGroup(lithiumPricing, i, questions[i], accounts[t])
    }
  }
}

module.exports = {
  createQuestionGroup,
  answerQuestionGroups
}