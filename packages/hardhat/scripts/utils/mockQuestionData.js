const { ethers } = require("hardhat");
const generateMockQuestionData = async (minimumRequiredAnswer) => {
  const block = await ethers.provider.getBlock();
  const pricingTime = block.timestamp + 100;
  const endTime = block.timestamp + 60;
  const description = `What is the price of an MRF share `;
  const bounty = ethers.utils.parseUnits("80.0", 18);
  const answerSet = [0, 50];
  const categoryId = 0;


  const startTime = block.timestamp + 2;
  const description1 = `What is the price of an TATA NANO share  `;
  const bounty1 = ethers.utils.parseUnits("120.0", 18);
  const answerSet1 = [0, 1320];
  const categoryId1 = 0;

  const description2 = `What is the price of an Lithium Token share  `;
  const bounty2 = ethers.utils.parseUnits("125.0", 18);
  const answerSet2 = [0, 9870];
  const categoryId2 = 0;

  const description3 = `What is the price of an TESLA-PRE-IPO  share  `;
  const bounty3 = ethers.utils.parseUnits("183.0", 18);
  const answerSet3 = [0, 9870];
  const categoryId3 = 0;

  const questiontype = 0;

  const args1 = [
    [categoryId, categoryId1, categoryId2, categoryId3],
    [bounty, bounty1, bounty2, bounty3],
    [pricingTime, pricingTime, pricingTime, pricingTime],
    [endTime, endTime, endTime, endTime],
    [questiontype, questiontype, questiontype, questiontype],
    [description, description1, description2, description3],
    [answerSet, answerSet1, answerSet2, answerSet3],
    [startTime, startTime, startTime, startTime],
    minimumRequiredAnswer,
  ];

  const args2 = [
    [categoryId, categoryId1, categoryId2, categoryId3],
    [bounty, bounty1, bounty2, bounty3],
    [pricingTime, pricingTime, pricingTime, pricingTime],
    [endTime, endTime, endTime, endTime],
    [questiontype, questiontype, questiontype, questiontype],
    [description, description1, description2, description3],
    [answerSet, answerSet1, answerSet2, answerSet3],
    [startTime, startTime, startTime, startTime],
    minimumRequiredAnswer,
  ];
  const args = [args1, args2];
  return args;
};

module.exports = {
  generateMockQuestionData
}
