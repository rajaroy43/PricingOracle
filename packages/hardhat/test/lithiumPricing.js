const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Lithium Pricing", function () {
  let lithiumPricing, lithiumReward, lithToken, account0, account1;

  describe("Contract Deployment", function () {
    it("Should deploy LithiumPricing, LithiumReward, LithToken", async function () {
      //contracts = await deployLithiumPricing()
      console.log("\n\n 📡 Deploying Pricing...\n");
      const pricingContract = await ethers.getContractFactory("LithiumPricing");
      lithiumPricing = await pricingContract.deploy()
      console.log("\n\n 📡 Deploying Token...\n");
    
      const tokenContract = await ethers.getContractFactory("LithToken")
      lithToken = await tokenContract.deploy([lithiumPricing.address])

      console.log("\n\n 📡 Deploying Reward...\n");
    
      const rewardContract = await ethers.getContractFactory("LithiumReward")
      lithiumReward = await rewardContract.deploy(lithiumPricing.address)
    
      await lithiumPricing.setLithTokenAddress(lithToken.address)
    
      await lithiumPricing.setLithiumRewardAddress(lithiumReward.address)

      const accounts = await ethers.getSigners()
      account0 = accounts[0].address
      account1 = accounts[1].address
      const transferAmount = ethers.utils.parseUnits("100.0", 18)
      await lithToken.transfer(account1, transferAmount)


    });

    describe("Create a question", function () {
      it("Should be able to create a question", async function () {
        const senderBalance = await lithToken.balanceOf(account0)
        const block = await ethers.provider.getBlock()
        const endTime = block.timestamp + 500000
        const description = "foo"
        const bounty =  ethers.utils.parseUnits("100.0", 18)
        const answerSet = [50]
        const finalAnswerSet = [50,0]

        await expect(lithiumPricing.createQuestion(
          bounty,
          description,
          endTime,
          answerSet
        )).emit(lithiumPricing, "QuestionCreated").withArgs(
          0,
          bounty,
          account0,
          description,
          finalAnswerSet,
          endTime
        )

        const senderBalanceAfter = await lithToken.balanceOf(account0)

        expect(bounty.add(senderBalanceAfter)).to.equal(senderBalance)

      });
    });

    describe("Answer a question", function () {
      it("Should be able to answer a question", async function () {
        const senderBalance = await lithToken.balanceOf(account0)
        const ids = [0]
        const stakeAmounts = [ethers.utils.parseUnits("25.0", 18)]
        const answerIndexes = [1]

        await expect(lithiumPricing.answerQuestions(
          ids,
          answerIndexes,
          stakeAmounts
        )).emit(lithiumPricing, "QuestionAnswered").withArgs(
          0,
          account0,
          answerIndexes[0],
          stakeAmounts[0]
        )

        const senderBalanceAfter = await lithToken.balanceOf(account0)

        expect(stakeAmounts[0].add(senderBalanceAfter)).to.equal(senderBalance)

      });
    });
  });
});
