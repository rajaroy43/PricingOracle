const { ethers } = require("hardhat");
module.exports = async () => {
  const block = await ethers.provider.getBlock();
  const pricingTime = block.timestamp + 700000000000;
  const endTime = block.timestamp + 500000000000;
  const description = `What is the price of an MRF share `;
  const bounty = ethers.utils.parseUnits("80.0", 18);
  const answerSet = [0, 50];
  const categoryId = 0;

  const minimumRequiredAnswers = 1;

  const pricingTime1 = block.timestamp + 700000000000;
  const endTime1 = block.timestamp + 500000000000;
  const startTime = block.timestamp + 3;
  const description1 = `What is the price of an TATA NANO share  `;
  const bounty1 = ethers.utils.parseUnits("120.0", 18);
  const answerSet1 = [0, 1320];
  const categoryId1 = 0;

  const pricingTime2 = block.timestamp + 800000000000;
  const endTime2 = block.timestamp + 200000000000;
  const description2 = `What is the price of an Lithium Token share  `;
  const bounty2 = ethers.utils.parseUnits("125.0", 18);
  const answerSet2 = [0, 9870];
  const categoryId2 = 0;

  const pricingTime3 = block.timestamp + 1200000000000;
  const endTime3 = block.timestamp + 300000000000;
  const description3 = `What is the price of an TESLA-PRE-IPO  share  `;
  const bounty3 = ethers.utils.parseUnits("183.0", 18);
  const answerSet3 = [0, 9870];
  const categoryId3 = 0;

  const questiontype = 0;

  const args1 = [
    [categoryId, categoryId1, categoryId2, categoryId3],
    [bounty, bounty1, bounty2, bounty3],
    [pricingTime, pricingTime1, pricingTime2, pricingTime3],
    [endTime, endTime1, endTime2, endTime3],
    [questiontype, questiontype, questiontype, questiontype],
    [description, description1, description2, description3],
    [answerSet, answerSet1, answerSet2, answerSet3],
    [startTime, startTime, startTime, startTime],
    minimumRequiredAnswers,
  ];

  const args2 = [
    [categoryId, categoryId1, categoryId2, categoryId3],
    [bounty, bounty1, bounty2, bounty3],
    [pricingTime, pricingTime1, pricingTime2, pricingTime3],
    [endTime, endTime1, endTime2, endTime3],
    [questiontype, questiontype, questiontype, questiontype],
    [description, description1, description2, description3],
    [answerSet, answerSet1, answerSet2, answerSet3],
    [startTime, startTime, startTime, startTime],
    minimumRequiredAnswers,
  ];
  const args = [args1, args2];
  return args;
};
