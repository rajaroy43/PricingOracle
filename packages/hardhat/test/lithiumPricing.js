const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Lithium Pricing", async function () {
  let lithiumPricing, lithiumReward, lithToken, account0, account1, account2;

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
      account0 = accounts[0]
      account1 = accounts[1]
      account2 = accounts[2]
      const transferAmount = ethers.utils.parseUnits("100.0", 18)
      await lithToken.transfer(account1.address, transferAmount)

      await lithToken.transfer(account2.address, transferAmount)


    });

    describe("Create a question", function () {
      it("Should be able to create a question", async function () {
        const senderBalance = await lithToken.balanceOf(account0.address)
        const block = await ethers.provider.getBlock()
        const endTime = block.timestamp + 4
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
          account0.address,
          description,
          finalAnswerSet,
          endTime
        )

        const senderBalanceAfter = await lithToken.balanceOf(account0.address)

        expect(bounty.add(senderBalanceAfter)).to.equal(senderBalance)

      });
    });

    describe("Answer a question", function () {
      it("Should be able to answer a question", async function () {
        const senderBalance = await lithToken.balanceOf(account1.address)
        const ids = [0]
        const stakeAmounts = [ethers.utils.parseUnits("25.0", 18)]
        const answerIndexes = [1]

        await expect(lithiumPricing.connect(account1).answerQuestions(
          ids,
          answerIndexes,
          stakeAmounts
        )).emit(lithiumPricing, "QuestionAnswered").withArgs(
          0,
          account1.address,
          answerIndexes[0],
          stakeAmounts[0]
        )

        const senderBalanceAfter = await lithToken.balanceOf(account1.address)

        expect(stakeAmounts[0].add(senderBalanceAfter)).to.equal(senderBalance)

        const sender2Balance = await lithToken.balanceOf(account2.address)
        const stake2Amounts = [ethers.utils.parseUnits("20.0", 18)]
        const answer2Indexes = [0]

        await expect(lithiumPricing.connect(account2).answerQuestions(
          ids,
          answer2Indexes,
          stake2Amounts
        )).emit(lithiumPricing, "QuestionAnswered").withArgs(
          0,
          account2.address,
          answer2Indexes[0],
          stake2Amounts[0]
        )

        const sender2BalanceAfter = await lithToken.balanceOf(account2.address)

        expect(stake2Amounts[0].add(sender2BalanceAfter)).to.equal(sender2Balance)

      });

      describe("Claim reward", function () {
        it("Should be able to claim reward", async function () {
          const senderBalance = await lithToken.balanceOf(account1.address)
          const ids = [0]
          const rewardAmount = ethers.utils.parseUnits("145.0", 18)
  
          await expect(lithiumPricing.connect(account1).claimRewards(
            ids
          )).emit(lithiumPricing, "RewardClaimed").withArgs(
            0,
            account1.address,
            rewardAmount
          )
  
          const senderBalanceAfter = await lithToken.balanceOf(account1.address)
  
          expect(rewardAmount.add(senderBalance)).to.equal(senderBalanceAfter)
  
         
        });
      });

      
    });
  });
});
