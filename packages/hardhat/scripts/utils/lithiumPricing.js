const { utils } = require("ethers");
const { generateMockQuestionData } = require("./mockQuestionData");

const createQuestionGroup = async (
  lithiumPricing,
  endTimeFutureSeconds = 10000,
  minimumRequiredAnswer = 1,
  startTimeFutureSeconds = 15
) => {
  const args = await generateMockQuestionData(
    endTimeFutureSeconds,
    minimumRequiredAnswer,
    startTimeFutureSeconds
  );
  console.log("\n\n 📡 Creating mock question groups \n");
  for (var i = 0; i < args.length; i++) {
    await lithiumPricing.createQuestionGroup(...args[i]);
  }
  return args;
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomTokenAmount(max) {
  const amount = getRandomInt(max).toString()
  return utils.parseUnits(amount, 18)
}

const answerQuestionGroup = async (lithiumPricing, groupId, questions, account) => {
  const stakeAmounts = questions[0].map(() => getRandomTokenAmount(101))
  const answerIndexes = questions[0].map(() => getRandomInt(2))
  const answer = await lithiumPricing.connect(account).answerQuestions(groupId, stakeAmounts, answerIndexes)
}

const answerQuestionGroups = async (lithiumPricing, questions, accounts, idxStart = 0) => {
  //time in seconds
  const time = 15
  await ethers.provider.send('evm_increaseTime', [time]); 
  await ethers.provider.send('evm_mine')
  for (let i = 0; i < questions.length; i++) {
    console.log(`Answering group ${i + idxStart}`);
    for (let t = 0; t < accounts.length; t++) {
      console.log(`Answering by wisdom node ${t + 1}`);
      await answerQuestionGroup(
        lithiumPricing,
        i + idxStart,
        questions[i],
        accounts[t]
      );
    }
  }
};

const getRandomBidAmount= (max)=>{
  const amount = getRandomInt(max).toString()
  return amount == '0' ? utils.parseUnits('1', 18) :utils.parseUnits(amount, 18);
}

const putBids = async(lithiumPricing , bidders , questionIds)=>{
  const bidAmounts = questionIds.map(() => getRandomBidAmount(101));
  console.log(`\n\n 📡 putting bids on questionIds ${questionIds} with bidding Amount ${bidAmounts.map(bid=>bid/1e18)} \n`);
  for (var i = 0; i < questionIds.length; i++) {
    const bidder = bidders[getRandomInt(bidders.length)]
    await lithiumPricing.connect(bidder).increaseBid(questionIds[i],bidAmounts[i])
  }
  console.log("Bids have been placed")
}

module.exports = {
  createQuestionGroup,
  answerQuestionGroups,
  putBids
}
