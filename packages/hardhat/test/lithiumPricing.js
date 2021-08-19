const { ethers} = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);
describe("Lithium Pricing", async function () {
  let lithiumPricing, lithiumReward, lithToken, account0, account1, account2, stakeAmount, transferAmount1, approveAmount;

  describe("Contract Deployment", function () {
    it("Should deploy LithiumPricing, LithiumReward, LithToken", async function () {
      const accounts = await ethers.getSigners()
      account0 = accounts[0]
      account1 = accounts[1]
      account2 = accounts[2]
      const approveAmount = ethers.utils.parseUnits("1000.0", 18)
      transferAmount1 = ethers.utils.parseUnits("100.0", 18)
      stakeAmount = ethers.utils.parseUnits("25.0", 18)

      //contracts = await deployLithiumPricing()
      console.log("\n\n 📡 Deploying Pricing...\n");
      const pricingContract = await ethers.getContractFactory("LithiumPricing");
      lithiumPricing = await pricingContract.deploy()
      console.log("\n\n 📡 Deploying Token...\n");
    
      const tokenContract = await ethers.getContractFactory("LithiumToken")
      lithToken = await tokenContract.deploy(account0.address)

      console.log("\n\n 📡 Deploying Reward...\n");
    
      const rewardContract = await ethers.getContractFactory("LithiumReward")
      lithiumReward = await rewardContract.deploy(lithiumPricing.address)
    
      await lithToken.connect(account1).approve(lithiumPricing.address, approveAmount)

      await lithToken.approve(lithiumPricing.address, approveAmount)
      await lithToken.connect(account2).approve(lithiumPricing.address, approveAmount)
      await lithToken.transfer(account1.address, transferAmount1)

      await lithToken.transfer(account2.address, transferAmount1)


    });

    describe('Setting config for Lithium Pricing', () => {
      it("should emit events for setting  lithium token",async()=>{

      await expect(lithiumPricing.setLithiumTokenAddress(lithToken.address)).emit(
        lithiumPricing,
        "SetLithiumTokenAddress",
      ).withArgs(lithToken.address)
      });
      it("should emit events for setting  lithium rewards",async()=>{

        await expect(lithiumPricing.setLithiumRewardAddress(lithiumReward.address)).emit(
          lithiumPricing,
          "SetLithiumRewardAddress",
        ).withArgs(lithiumReward.address)
        });

    })
    

    describe("Create a question", function () {
      it("Should be able to create a question with pricingTime", async function () {
        const senderBalance = await lithToken.balanceOf(account0.address)
        const block = await ethers.provider.getBlock()
        const pricingTime=block.timestamp+7
        const endTime = block.timestamp + 5
        const description = "foo"
        const bounty =  transferAmount1
        const answerSet = [0,50]
        const categoryId = 0

        await expect(lithiumPricing.createQuestion(
          categoryId,
          bounty,
          pricingTime,
          endTime,
          description,
          answerSet
        )).emit(lithiumPricing, "QuestionCreated").withArgs(
          0,
          bounty,
          pricingTime,
          endTime,
          categoryId,
          account0.address,
          description,
          answerSet
        )

        const senderBalanceAfter = await lithToken.balanceOf(account0.address)

        expect(bounty.add(senderBalanceAfter)).to.equal(senderBalance)

      });

      it("Should not able to create a question with pricingTime greater than end time", async function () {
        const block = await ethers.provider.getBlock()
        const pricingTime=block.timestamp+3
        const endTime = block.timestamp + 5
        const description = "hello"
        const bounty =  transferAmount1
        const answerSet = [0,50]
        const categoryId = 0

        await expect(lithiumPricing.createQuestion(
          categoryId,
          bounty,
          pricingTime,
          endTime,
          description,
          answerSet
        )).to.be.revertedWith("Pricing time of asset must be greater than endtime");
        });

    });

    describe("Answer a question", function () {

      it("Should not able to get answer sets with invalid question  id  ",async()=>{
        const questionId=1;
        await expect(lithiumPricing.getAnswerSetsGroups(questionId)).to.be.revertedWith("Invalid question id");
      });

      it("Should be able to answer a question", async function () {account0
      
        const senderBalance = await lithToken.balanceOf(account1.address)
        const ids = [0]
        const stakeAmounts = [stakeAmount]
        const answerIndexes = [1]
        const answerGroupIds=[ethers.utils.solidityKeccak256([ "uint256", "address" ],[ids[0],account1.address])];
        await expect(lithiumPricing.connect(account1).answerQuestions(
          ids,
          stakeAmounts,
          answerIndexes
        )).emit(lithiumPricing, "QuestionAnswered").withArgs(
          0,
          account1.address,
          stakeAmounts[0],
          answerIndexes[0]
        ).emit(lithiumPricing,"AnswerGroupSetSubmitted").withArgs(account1.address,answerGroupIds)
        const senderBalanceAfter = await lithToken.balanceOf(account1.address)

        expect(stakeAmounts[0].add(senderBalanceAfter)).to.equal(senderBalance)

        const sender2Balance = await lithToken.balanceOf(account2.address)
        const stake2Amounts = [ethers.utils.parseUnits("20.0", 18)]
        const answer2Indexes = [0]
        const answerGroupIdsAccount2=[ethers.utils.solidityKeccak256([ "uint256", "address" ],[ids[0],account2.address])];
        await expect(lithiumPricing.connect(account2).answerQuestions(
          ids,
          stake2Amounts,
          answer2Indexes,
        )).emit(lithiumPricing, "QuestionAnswered").withArgs(
          0,
          account2.address,
          stake2Amounts[0],
          answer2Indexes[0]
        ).emit(lithiumPricing,"AnswerGroupSetSubmitted").withArgs(account2.address,answerGroupIdsAccount2)
        const answerSetsGroups=await lithiumPricing.getAnswerSetsGroups(0);
        expect(answerSetsGroups[0]).to.be.equal(answerGroupIds[0])
        expect(answerSetsGroups[1]).to.be.equal(answerGroupIdsAccount2[0])
        const sender2BalanceAfter = await lithToken.balanceOf(account2.address)

        expect(stake2Amounts[0].add(sender2BalanceAfter)).to.equal(sender2Balance)

      });
      
    });

    describe("Preventing invalid question creation", function () {


      it("Should fail to create a question with an invalid categoryId", async function () {
        const block = await ethers.provider.getBlock()
        const endTime = block.timestamp + 5
        const pricingTime=block.timestamp+7
        const description = "foo1"
        const bounty =  transferAmount1
        const answerSet = [0,50]
        const categoryId = 1

        await expect(lithiumPricing.createQuestion(
          categoryId,
          bounty,
          pricingTime,
          endTime,
          description,
          answerSet
        )).to.be.reverted

      });

      it("Should fail to create a question with an invalid answerSet length: too few", async function () {
        const block = await ethers.provider.getBlock()
        const pricingTime=block.timestamp+7
        const endTime = block.timestamp + 5
        const description = "foo2"
        const bounty =  transferAmount1
        const answerSet = [50]
        const categoryId = 0

        await expect(lithiumPricing.createQuestion(
          categoryId,
          bounty,
          pricingTime,
          endTime,
          description,
          answerSet
        )).to.be.revertedWith("Answer Set length invalid")

      })

      it("Should fail to create a question with an invalid answerSet length: too many", async function () {
        const block = await ethers.provider.getBlock()
        const pricingTime=block.timestamp+7
        const endTime = block.timestamp + 5
        const description = "foo2"
        const bounty =  transferAmount1
        const answerSet = [0,50,100]
        const categoryId = 0

        await expect(lithiumPricing.createQuestion(
          categoryId,
          bounty,
          pricingTime,
          endTime,
          description,
          answerSet
        )).to.be.revertedWith("Answer Set length invalid")

      })


      it("Should fail to create a question with an invalid answerSet order", async function () {
        const block = await ethers.provider.getBlock()
        const pricingTime=block.timestamp+7
        const endTime = block.timestamp + 5
        const description = "foo2"
        const bounty =  transferAmount1
        const answerSet = [50,40]
        const categoryId = 0

        await expect(lithiumPricing.createQuestion(
          categoryId,
          bounty,
          pricingTime,
          endTime,
          description,
          answerSet
        )).to.be.revertedWith("Answers must be in ascending order")

      })
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

    describe("Adding categories", function () {
      it("Should allow admins to add a category", async function () {
        const categoryLabel = 'Art Stuff'
        await expect(
          lithiumPricing.addCategory(categoryLabel)
        ).emit(lithiumPricing, "CategoryAdded").withArgs(
          1,
          categoryLabel
        )
      });

      it("Should not allow non admins to add a category", async function () {
        const categoryLabel = 'Art Stuff'
        await expect(
          lithiumPricing.connect(account1)
          .addCategory(categoryLabel)
        ).to.be.revertedWith("Must be admin")
      });
    });
    describe("Reward Update status ", async function () {
      const questionId = 0
      it("Should allow admins to update reward status", async function () {
        const calculatedewardStatus=1
        await expect(lithiumPricing.updateRewardCalculatedStatus(questionId))
        .emit(lithiumPricing, "RewardCalculatedStatus").withArgs(
         questionId,
         calculatedewardStatus
       )
      });
      it("Should not allow non admins to update reward status", async function () {
        await expect(lithiumPricing.connect(account1).
              updateRewardCalculatedStatus(questionId)).
              to.be.revertedWith("Must be admin")
       });
      it("Shound not update reward status again ",async function(){
        await expect(lithiumPricing.updateRewardCalculatedStatus(questionId))
        .to.be.revertedWith("Rewards is already updated")
      });
      it("Should not  update reward status for invalid questionId", async function () {
        const invalidQuestionId = 19090
        await expect(lithiumPricing.updateRewardCalculatedStatus(invalidQuestionId)).
        to.be.revertedWith("Invalid question id")
       });
    });

  });
});