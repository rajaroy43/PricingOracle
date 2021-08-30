const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const { BigNumber } = ethers;
use(solidity);
import { Wallet } from "@ethersproject/wallet";
import { LithiumPricing, LithiumReward, LithiumToken } from "../typechain";
describe("Lithium Pricing", async function () {
  let lithiumPricing: LithiumPricing,
    lithiumReward: LithiumReward,
    lithToken: LithiumToken,
    account0: Wallet,
    account1: Wallet,
    account2: Wallet,
    stakeAmount: any,
    transferAmount1: any;
  beforeEach(async () => {
    const accounts = await ethers.getSigners();
    account0 = accounts[0];
    account1 = accounts[1];
    account2 = accounts[2];
    const approveAmount = ethers.utils.parseUnits("1000.0", 18);
    transferAmount1 = ethers.utils.parseUnits("100.0", 18);
    stakeAmount = ethers.utils.parseUnits("25.0", 18);

    const pricingContract = await ethers.getContractFactory("LithiumPricing");
    lithiumPricing = await pricingContract.deploy();

    const tokenContract = await ethers.getContractFactory("LithiumToken");
    lithToken = await tokenContract.deploy(account0.address);

    const rewardContract = await ethers.getContractFactory("LithiumReward");
    lithiumReward = await rewardContract.deploy(lithiumPricing.address);

    await lithToken
      .connect(account1)
      .approve(lithiumPricing.address, approveAmount);

    await lithToken.approve(lithiumPricing.address, approveAmount);
    await lithToken
      .connect(account2)
      .approve(lithiumPricing.address, approveAmount);
    await lithToken.transfer(account1.address, transferAmount1);
    await lithToken.transfer(account2.address, transferAmount1);
  });

  describe("Setting config for Lithium Pricing", () => {
    it("Should set admin", async () => {
      const owner = await lithiumPricing.isAdmin(account0.address);
      expect(owner).equal(true);
    });

    it("Should set initial category id as preIPO", async () => {
      const label = "preIPO";
      const categoryid = 0;
      const pricingContract = await ethers.getContractFactory("LithiumPricing");
      const lithiumPricing: LithiumPricing = await pricingContract.deploy();
      await expect(Promise.resolve(lithiumPricing.deployTransaction))
        .to.emit(lithiumPricing, "CategoryAdded")
        .withArgs(categoryid, label);
      const categoryIdHash = ethers.utils.solidityKeccak256(
        ["string"],
        [label]
      );
      const getCategoryIdHash = await lithiumPricing.categories(categoryid);
      expect(getCategoryIdHash).to.be.equal(categoryIdHash);
    });

    it("Should set minimum stake =0 initially", async () => {
      const getMinimumStake = await lithiumPricing.minimumStake();
      expect(getMinimumStake).equal(0);
    });

    it("should emit events for setting  lithium token", async () => {
      await expect(lithiumPricing.setLithiumTokenAddress(lithToken.address))
        .emit(lithiumPricing, "SetLithiumTokenAddress")
        .withArgs(lithToken.address);
    });

    it("should not allow non-admin to  set lithium token address", async () => {
      await expect(
        lithiumPricing
          .connect(account1)
          .setLithiumTokenAddress(lithToken.address)
      ).to.be.revertedWith("Must be admin to set token address");
    });

    it("should not allow  to set lithium token address with null address", async () => {
      const NULL_ADDRESS = ethers.constants.AddressZero;
      await expect(
        lithiumPricing.setLithiumTokenAddress(NULL_ADDRESS)
      ).to.be.revertedWith("Token Address can't be null");
    });

    it("should emit events for setting  lithium rewards", async () => {
      await expect(
        lithiumPricing.setLithiumRewardAddress(lithiumReward.address)
      )
        .emit(lithiumPricing, "SetLithiumRewardAddress")
        .withArgs(lithiumReward.address);
    });

    it("should not allow non-admin to  set lithium rewards address", async () => {
      await expect(
        lithiumPricing
          .connect(account1)
          .setLithiumRewardAddress(lithiumReward.address)
      ).to.be.revertedWith("Must be admin to set token address");
    });

    it("should not allow  to set lithium reward address with null address", async () => {
      const NULL_ADDRESS = ethers.constants.AddressZero;
      await expect(
        lithiumPricing.setLithiumRewardAddress(NULL_ADDRESS)
      ).to.be.revertedWith("Reward Address can't be null");
    });
  });

  describe("Create a question", function () {
    beforeEach(async function () {
      await lithiumPricing.setLithiumTokenAddress(lithToken.address);
      await lithiumPricing.setLithiumRewardAddress(lithiumReward.address);
    });

    it("Should be able to create a question with pricingTime and QuestionType as Pricing type ", async function () {
      const senderBalance = await lithToken.balanceOf(account0.address);
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;
      // QuestionType{ Pricing, GroundTruth }
      //if questiontype = 0 ,then question is Pricing type
      //if questiontype = 1 ,then question is GroundTruth type
      const questiontype = 0;
      await expect(
        lithiumPricing.createQuestion(
          categoryId,
          bounty,
          pricingTime,
          endTime,
          questiontype,
          description,
          answerSet
        )
      )
        .emit(lithiumPricing, "QuestionCreated")
        .withArgs(
          0,
          bounty,
          pricingTime,
          endTime,
          categoryId,
          account0.address,
          description,
          answerSet,
          questiontype
        );

      const senderBalanceAfter = await lithToken.balanceOf(account0.address);

      expect(bounty.add(senderBalanceAfter)).to.equal(senderBalance);
    });
    it("Should be able to create a question with pricingTime and QuestionType as Ground type", async function () {
      const senderBalance = await lithToken.balanceOf(account0.address);
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;
      const questiontype = 1;
      await expect(
        lithiumPricing.createQuestion(
          categoryId,
          bounty,
          pricingTime,
          endTime,
          questiontype,
          description,
          answerSet
        )
      )
        .emit(lithiumPricing, "QuestionCreated")
        .withArgs(
          0,
          bounty,
          pricingTime,
          endTime,
          categoryId,
          account0.address,
          description,
          answerSet,
          questiontype
        );

      const senderBalanceAfter = await lithToken.balanceOf(account0.address);

      expect(bounty.add(senderBalanceAfter)).to.equal(senderBalance);
    });
    it("Should not able to create a question with pricingTime less than end time", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 3;
      const endTime = block.timestamp + 5;
      const description = "hello";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;
      const questiontype = 0;
      await expect(
        lithiumPricing.createQuestion(
          categoryId,
          bounty,
          pricingTime,
          endTime,
          questiontype,
          description,
          answerSet
        )
      ).to.be.revertedWith(
        "Pricing time of asset must be greater than endtime"
      );
    });

    it("Should fail to create a question with an invalid categoryId", async function () {
      const block = await ethers.provider.getBlock();
      const endTime = block.timestamp + 5;
      const pricingTime = block.timestamp + 7;
      const description = "foo1";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 1;
      const questiontype = 1;
      await expect(
        lithiumPricing.createQuestion(
          categoryId,
          bounty,
          pricingTime,
          endTime,
          questiontype,
          description,
          answerSet
        )
      ).to.be.revertedWith(
        "VM Exception while processing transaction: revert "
      );
    });

    it("Should fail to create a question with an invalid answerSet length: too few", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo2";
      const bounty = transferAmount1;
      const answerSet = [50];
      const categoryId = 0;
      const questiontype = 1;
      await expect(
        lithiumPricing.createQuestion(
          categoryId,
          bounty,
          pricingTime,
          endTime,
          questiontype,
          description,
          answerSet
        )
      ).to.be.revertedWith("Answer Set length invalid");
    });

    it("Should fail to create a question with an invalid answerSet length: too many", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo2";
      const bounty = transferAmount1;
      const answerSet = [0, 50, 100];
      const categoryId = 0;
      const questiontype = 1;
      await expect(
        lithiumPricing.createQuestion(
          categoryId,
          bounty,
          pricingTime,
          endTime,
          questiontype,
          description,
          answerSet
        )
      ).to.be.revertedWith("Answer Set length invalid");
    });

    it("Should fail to create a question with an invalid answerSet order", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo2";
      const bounty = transferAmount1;
      const answerSet = [0, 0];
      const categoryId = 0;
      const questiontype = 0;
      await expect(
        lithiumPricing.createQuestion(
          categoryId,
          bounty,
          pricingTime,
          endTime,
          questiontype,
          description,
          answerSet
        )
      ).to.be.revertedWith("Answers must be in ascending order");
    });

    it("Should fail to create a question if 1st index is not equal to 0", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo2";
      const bounty = transferAmount1;
      const answerSet = [50, 40];
      const categoryId = 0;
      const questiontype = 0;
      await expect(
        lithiumPricing.createQuestion(
          categoryId,
          bounty,
          pricingTime,
          endTime,
          questiontype,
          description,
          answerSet
        )
      ).to.be.revertedWith("AnswerSets must starts with 0");
    });
    it("Should fail to create a question with enough bounty provided", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = ethers.utils.parseUnits("1000000.0", 18);
      const answerSet = [0, 50];
      const categoryId = 0;
      const questiontype = 0;
      await lithToken.connect(account1).approve(lithiumPricing.address, bounty);
      await expect(
        lithiumPricing
          .connect(account1)
          .createQuestion(
            categoryId,
            bounty,
            pricingTime,
            endTime,
            questiontype,
            description,
            answerSet
          )
      ).to.be.revertedWith("Insufficient balance");
    });

    it("Should fail to create a question if approve amount < bounty amount", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;
      const questiontype = 0;
      await lithToken.connect(account1).approve(lithiumPricing.address, 0);
      await expect(
        lithiumPricing
          .connect(account1)
          .createQuestion(
            categoryId,
            bounty,
            pricingTime,
            endTime,
            questiontype,
            description,
            answerSet
          )
      ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
    });

    describe("Answer a question", function () {
      beforeEach(async () => {
        const block = await ethers.provider.getBlock();
        const pricingTime = block.timestamp + 20;
        const endTime = block.timestamp + 15;
        const description = "foo";
        const bounty = transferAmount1;
        const answerSet = [0, 50];
        const categoryId = 0;
        const questiontype = 0;
        // await lithiumPricing.createQuestion(
        //   categoryId,
        //   bounty,
        //   pricingTime,
        //   endTime,
        //   questiontype,
        //   description,
        //   answerSet
        // );

        const pricingTime1 = block.timestamp + 7;
        const endTime1 = block.timestamp + 5;
        const description1 = "foo1";
        const bounty1 = transferAmount1;
        const answerSet1 = [0, 100];
        const categoryId1 = 0;

        const args = [
          [categoryId, categoryId1],
          [bounty, bounty1],
          [pricingTime, pricingTime1],
          [endTime, endTime1],
          [questiontype, questiontype],
          [description, description1],
          [answerSet, answerSet1],
        ];
        //@ts-ignore
        await lithiumPricing.createQuestionGroup(...args);
      });
      it("Should be able to answer a question", async function () {
        const senderBalance = await lithToken.balanceOf(account1.address);
        const stakeAmounts = [stakeAmount, stakeAmount];
        const answerIndexes = [1, 0];
        const questionGroupId = 0;
        await expect(
          lithiumPricing
            .connect(account1)
            .answerQuestions(questionGroupId, stakeAmounts, answerIndexes)
        )
          .emit(lithiumPricing, "QuestionAnswered")
          .withArgs(0, account1.address, stakeAmounts[0], answerIndexes[0])
          .withArgs(1, account1.address, stakeAmounts[1], answerIndexes[1])
          .emit(lithiumPricing, "AnswerGroupSetSubmitted")
          .withArgs(account1.address, questionGroupId);
        const senderBalanceAfter = await lithToken.balanceOf(account1.address);

        expect(
          stakeAmounts[0].add(stakeAmounts[1]).add(senderBalanceAfter)
        ).to.equal(senderBalance);

        const sender2Balance = await lithToken.balanceOf(account2.address);
        const stake2Amounts = [
          ethers.utils.parseUnits("20.0", 18),
          ethers.utils.parseUnits("20.0", 18),
        ];
        const answer2Indexes = [0, 0];
        await expect(
          lithiumPricing
            .connect(account2)
            .answerQuestions(questionGroupId, stake2Amounts, answer2Indexes)
        )
          .emit(lithiumPricing, "QuestionAnswered")
          .withArgs(0, account2.address, stake2Amounts[0], answer2Indexes[0])
          .withArgs(0, account2.address, stake2Amounts[1], answer2Indexes[1])
          .emit(lithiumPricing, "AnswerGroupSetSubmitted")
          .withArgs(account2.address, questionGroupId);
        const sender2BalanceAfter = await lithToken.balanceOf(account2.address);

        expect(
          stake2Amounts[0].add(stake2Amounts[1]).add(sender2BalanceAfter)
        ).to.equal(sender2Balance);
      });

      it("Should not  able to answer a question for mismatch array invalid ids/stakeAmounts/answerIndexes", async function () {
        const stakeAmounts = [stakeAmount, 12];
        const answerIndexes = [1];
        const questionGroupId = 0;
        await expect(
          lithiumPricing
            .connect(account1)
            .answerQuestions(questionGroupId, stakeAmounts, answerIndexes)
        ).to.be.revertedWith("Array mismatch");
      });

      it("Should not  able to answer a question for invalid questionGroup id", async function () {
        const stakeAmounts = [stakeAmount, stakeAmount];
        const answerIndexes = [1, 0];
        const questionGroupId = 1;
        await expect(
          lithiumPricing
            .connect(account1)
            .answerQuestions(questionGroupId, stakeAmounts, answerIndexes)
        ).to.be.revertedWith("Invalid question group id");
      });

      it("Should not  able to answer if deadline of question hasbeen reached", async function () {
        const stakeAmounts = [stakeAmount, stakeAmount];
        const answerIndexes = [1, 0];
        const one_minute = 60 * 60;
        const questionGroupId = 0;
        await ethers.provider.send("evm_increaseTime", [one_minute]);
        await ethers.provider.send("evm_mine");

        await expect(
          lithiumPricing
            .connect(account1)
            .answerQuestions(questionGroupId, stakeAmounts, answerIndexes)
        ).to.be.revertedWith("Question is not longer active");
      });

      it("Should not  able to answer if out of range answer is given", async function () {
        const stakeAmounts = [stakeAmount, stakeAmount];
        const answerIndexes = [12, 0];
        const questionGroupId = 0;
        await expect(
          lithiumPricing
            .connect(account1)
            .answerQuestions(questionGroupId, stakeAmounts, answerIndexes)
        ).to.be.revertedWith("Invalid answer index");
      });

      it("Should not  able to answer if stake amount < minimumStake amount", async function () {
        const stakeAmounts = [0, stakeAmount];
        const answerIndexes = [1, 0];
        const questionGroupId = 0;
        const minimumStake = ethers.utils.parseUnits("10.0", 18);
        await expect(lithiumPricing.updateMinimumStake(minimumStake))
          .emit(lithiumPricing, "MinimumStakeUpdated")
          .withArgs(minimumStake);
        await expect(
          lithiumPricing
            .connect(account1)
            .answerQuestions(questionGroupId, stakeAmounts, answerIndexes)
        ).to.be.revertedWith("Stake amount must be greater than minimumStake");
      });

      it("Should not  be able to answer if don't have sufficient balance", async function () {
        const stakeAmounts = [
          ethers.utils.parseUnits("1000000000000000.0", 18),
          ethers.utils.parseUnits("1000000000000000.0", 18),
        ];
        const answerIndexes = [1, 0];
        const questionGroupId = 0;
        await expect(
          lithiumPricing
            .connect(account1)
            .answerQuestions(questionGroupId, stakeAmounts, answerIndexes)
        ).to.be.revertedWith("Insufficient balance");
      });

      it("Should not  able to answer if approve amount is less than stake amount", async function () {
        const stakeAmounts = [stakeAmount, stakeAmount];
        const answerIndexes = [1, 0];
        const approveAmount = 0;
        const questionGroupId = 0;
        await lithToken
          .connect(account1)
          .approve(lithiumPricing.address, approveAmount);
        await expect(
          lithiumPricing
            .connect(account1)
            .answerQuestions(questionGroupId, stakeAmounts, answerIndexes)
        ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
      });

      describe("Claim reward", function () {
        beforeEach(async () => {
          const questionGroupId = 0;
          const stakeAmounts = [stakeAmount, stakeAmount];
          const answerIndexes = [0, 0];
          await lithiumPricing
            .connect(account1)
            .answerQuestions(questionGroupId, stakeAmounts, answerIndexes);
        });

        it("Should be able to claim reward", async function () {
          const one_minute = 60 * 60;
          await ethers.provider.send("evm_increaseTime", [one_minute]);
          await ethers.provider.send("evm_mine");
          const senderBalance = await lithToken.balanceOf(account1.address);
          const questionGroupId = 0;
          //staked amount+bounty amount
          const rewardAmount1 = ethers.utils.parseUnits("125.0", 18);
          const rewardAmount2 = ethers.utils.parseUnits("125.0", 18);
          const totalRewardClaimed = rewardAmount1.add(rewardAmount2);
          await expect(
            lithiumPricing.connect(account1).claimRewards(questionGroupId)
          )
            .emit(lithiumPricing, "RewardClaimed")
            .withArgs(0, account1.address, rewardAmount1)
            .withArgs(1, account1.address, rewardAmount2)
            .emit(lithiumPricing, "GroupRewardClaimed")
            .withArgs(questionGroupId, account1.address, totalRewardClaimed);
          const senderBalanceAfter = await lithToken.balanceOf(
            account1.address
          );

          expect(totalRewardClaimed.add(senderBalance)).to.equal(
            senderBalanceAfter
          );
        });

        it("Should not able  to claim reward if deadline not be reached yet", async function () {
          const questionGroupId = 0;

          await expect(
            lithiumPricing.connect(account1).claimRewards(questionGroupId)
          ).to.be.revertedWith(
            "Question is still active and cannot be claimed"
          );
        });

        it("Should not be able to claim reward again ", async function () {
          const one_minute = 60 * 60;
          await ethers.provider.send("evm_increaseTime", [one_minute]);
          await ethers.provider.send("evm_mine");
          const senderBalance = await lithToken.balanceOf(account1.address);
          const questionGroupId = 0;
          //staked amount+bounty amount
          const rewardAmount1 = ethers.utils.parseUnits("125.0", 18);
          const rewardAmount2 = ethers.utils.parseUnits("125.0", 18);
          const totalRewardClaimed = rewardAmount1.add(rewardAmount2);
          await expect(
            lithiumPricing.connect(account1).claimRewards(questionGroupId)
          )
            .emit(lithiumPricing, "RewardClaimed")
            .withArgs(0, account1.address, rewardAmount1)
            .withArgs(1, account1.address, rewardAmount2)
            .emit(lithiumPricing, "GroupRewardClaimed")
            .withArgs(questionGroupId, account1.address, totalRewardClaimed);

          const senderBalanceAfter = await lithToken.balanceOf(
            account1.address
          );

          expect(totalRewardClaimed.add(senderBalance)).to.equal(
            senderBalanceAfter
          );

          await expect(
            lithiumPricing.connect(account1).claimRewards(questionGroupId)
          ).to.be.revertedWith("Group Rewards has already been claimed");
        });

        it("Should not be able to claim reward with invalid question Group Id ", async function () {
          const one_minute = 60 * 60;
          await ethers.provider.send("evm_increaseTime", [one_minute]);
          await ethers.provider.send("evm_mine");
          const ids = [1];
          await expect(lithiumPricing.claimRewards(ids)).to.be.revertedWith(
            "Invalid question group id"
          );
        });

        it("Should not able  claim reward if wisdom node doesn't give answer yet", async function () {
          const one_minute = 60 * 60;
          await ethers.provider.send("evm_increaseTime", [one_minute]);
          await ethers.provider.send("evm_mine");
          const senderBalance = await lithToken.balanceOf(account0.address);
          const questionGroupId = 0;
          await expect(
            lithiumPricing.connect(account0).claimRewards(questionGroupId)
          ).to.be.revertedWith("User haven't submit answer");

          const senderBalanceAfter = await lithToken.balanceOf(
            account0.address
          );

          expect(senderBalance).to.equal(senderBalanceAfter);
        });
      });

      describe("Reward Update status ", async function () {
        beforeEach(async () => {
          const one_minute = 60 * 60;
          await ethers.provider.send("evm_increaseTime", [one_minute]);
          await ethers.provider.send("evm_mine");
        });

        const questionId = 0;
        it("Should allow admins to update reward status", async function () {
          const calculatedewardStatus = 1;
          await expect(lithiumPricing.updateRewardCalculatedStatus(questionId))
            .emit(lithiumPricing, "RewardCalculatedStatus")
            .withArgs(questionId, calculatedewardStatus);
        });

        it("Should not allow non admins to update reward status", async function () {
          await expect(
            lithiumPricing
              .connect(account1)
              .updateRewardCalculatedStatus(questionId)
          ).to.be.revertedWith("Must be admin");
        });

        it("Should not update reward status again ", async function () {
          const calculatedewardStatus = 1;
          await expect(lithiumPricing.updateRewardCalculatedStatus(questionId))
            .emit(lithiumPricing, "RewardCalculatedStatus")
            .withArgs(questionId, calculatedewardStatus);
          await expect(
            lithiumPricing.updateRewardCalculatedStatus(questionId)
          ).to.be.revertedWith("Rewards is already updated");
        });

        it("Should not  update reward status for invalid questionId", async function () {
          const invalidQuestionId = 19090;
          await expect(
            lithiumPricing.updateRewardCalculatedStatus(invalidQuestionId)
          ).to.be.revertedWith("Invalid question id");
        });
      });
    });
  });

  describe("Create a question group", function () {
    beforeEach(async function () {
      await lithiumPricing.setLithiumTokenAddress(lithToken.address);
      await lithiumPricing.setLithiumRewardAddress(lithiumReward.address);
    });
    it("Should be able to create a question group", async function () {
      const senderBalance = await lithToken.balanceOf(account0.address);
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const bounty1 = transferAmount1;
      const answerSet1 = [0, 100];
      const categoryId1 = 0;

      const questiontype = 0;

      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1],
        [pricingTime, pricingTime1],
        [endTime, endTime1],
        [questiontype, questiontype],
        [description, description1],
        [answerSet, answerSet1],
      ];
      const createQuestionGroupTx = await expect(
        //@ts-ignore
        lithiumPricing.createQuestionGroup(...args)
      );
      //createQuestionGroupTx
      createQuestionGroupTx
        .emit(lithiumPricing, "QuestionCreated")
        .withArgs(
          0,
          bounty,
          pricingTime,
          endTime,
          categoryId,
          account0.address,
          description,
          answerSet,
          questiontype
        );

      createQuestionGroupTx
        .emit(lithiumPricing, "QuestionGroupCreated")
        .withArgs(0, account0.address, [0, 1]);

      const senderBalanceAfter = await lithToken.balanceOf(account0.address);

      expect(bounty.add(senderBalanceAfter).add(bounty1)).to.equal(
        senderBalance
      );
    });
    it("Should not create a question group with categoryIds param length mismatch", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const bounty1 = transferAmount1;
      const answerSet1 = [0, 100];
      const categoryId1 = 0;

      const questiontype = 0;

      const args = [
        [categoryId, categoryId1, categoryId],
        [bounty, bounty1],
        [pricingTime, pricingTime1],
        [endTime, endTime1],
        [questiontype, questiontype],
        [description, description1],
        [answerSet, answerSet1],
      ];
      await expect(
        //@ts-ignore
        lithiumPricing.createQuestionGroup(...args)
      ).to.be.revertedWith("Array mismatch");
    });
    it("Should not create a question group with bounties param length mismatch", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const bounty1 = transferAmount1;
      const answerSet1 = [0, 100];
      const categoryId1 = 0;

      const questiontype = 0;

      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1, bounty],
        [pricingTime, pricingTime1],
        [endTime, endTime1],
        [questiontype, questiontype],
        [description, description1],
        [answerSet, answerSet1],
      ];
      await expect(
        //@ts-ignore
        lithiumPricing.createQuestionGroup(...args)
      ).to.be.revertedWith("Array mismatch");
    });
    it("Should not create a question group with pricingTimes param length mismatch", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const bounty1 = transferAmount1;
      const answerSet1 = [0, 100];
      const categoryId1 = 0;

      const questiontype = 0;

      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1],
        [pricingTime, pricingTime1, pricingTime],
        [endTime, endTime1],
        [questiontype, questiontype],
        [description, description1],
        [answerSet, answerSet1],
      ];
      await expect(
        //@ts-ignore
        lithiumPricing.createQuestionGroup(...args)
      ).to.be.revertedWith("Array mismatch");
    });
    it("Should not create a question group with endingTimes param length mismatch", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const bounty1 = transferAmount1;
      const answerSet1 = [0, 100];
      const categoryId1 = 0;

      const questiontype = 0;

      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1],
        [pricingTime, pricingTime1],
        [endTime, endTime1, endTime],
        [questiontype, questiontype, 0],
        [description, description1],
        [answerSet, answerSet1],
      ];
      await expect(
        //@ts-ignore
        lithiumPricing.createQuestionGroup(...args)
      ).to.be.revertedWith("Array mismatch");
    });

    it("Should not create a question group with questionTypes param length mismatch", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const bounty1 = transferAmount1;
      const answerSet1 = [0, 100];
      const categoryId1 = 0;

      const questiontype = 0;

      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1],
        [pricingTime, pricingTime1],
        [endTime, endTime1],
        [questiontype, questiontype, 0],
        [description, description1],
        [answerSet, answerSet1],
      ];
      await expect(
        //@ts-ignore
        lithiumPricing.createQuestionGroup(...args)
      ).to.be.revertedWith("Array mismatch");
    });

    it("Should not create a question group with descriptions param length mismatch", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const bounty1 = transferAmount1;
      const answerSet1 = [0, 100];
      const categoryId1 = 0;

      const questiontype = 0;

      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1],
        [pricingTime, pricingTime1],
        [endTime, endTime1],
        [questiontype, questiontype, 0],
        [description, description1, description],
        [answerSet, answerSet1],
      ];
      await expect(
        //@ts-ignore
        lithiumPricing.createQuestionGroup(...args)
      ).to.be.revertedWith("Array mismatch");
    });

    it("Should not create a question group with answer sets param length mismatch", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const bounty1 = transferAmount1;
      const answerSet1 = [0, 100];
      const categoryId1 = 0;

      const questiontype = 0;

      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1],
        [pricingTime, pricingTime1],
        [endTime, endTime1],
        [questiontype, questiontype, 0],
        [description, description1],
        [answerSet, answerSet1, answerSet],
      ];
      await expect(
        //@ts-ignore
        lithiumPricing.createQuestionGroup(...args)
      ).to.be.revertedWith("Array mismatch");
    });
  });

  describe("Adding categories", function () {
    it("Should allow admins to add a category", async function () {
      const categoryLabel = "Art Stuff";
      await expect(lithiumPricing.addCategory(categoryLabel))
        .emit(lithiumPricing, "CategoryAdded")
        .withArgs(1, categoryLabel);
      const categoryIdHash = ethers.utils.solidityKeccak256(
        ["string"],
        [categoryLabel]
      );
      const getCategoryIdHash = await lithiumPricing.categories(1);
      expect(getCategoryIdHash).to.be.equal(categoryIdHash);
    });

    it("Should not allow non admins to add a category", async function () {
      const categoryLabel = "Art Stuff";
      await expect(
        lithiumPricing.connect(account1).addCategory(categoryLabel)
      ).to.be.revertedWith("Must be admin");
    });

    it("Should not allow to add a category with empty category label", async function () {
      const categoryLabel = "";
      await expect(
        lithiumPricing.addCategory(categoryLabel)
      ).to.be.revertedWith("Category label can't be null");
    });
  });

  describe("Wisdom node reputation ", async function () {
    const categoryIds = [0, 1, 0, 1, 0, 1];
    //fake repuation scores
    const reputationScores = [10, 20, 0, 5, 37, 75];

    it("Should allow admins to update reputaion scrores", async function () {
      await lithiumPricing.addCategory("Art Stuff");
      const addressesToUpdate = [
        account0.address,
        account0.address,
        account1.address,
        account1.address,
        account2.address,
        account2.address,
      ];
      await expect(
        lithiumPricing.updateReputation(
          addressesToUpdate,
          categoryIds,
          reputationScores
        )
      )
        .emit(lithiumPricing, "ReputationUpdated")
        .withArgs(addressesToUpdate, categoryIds, reputationScores);
      const getReputation = await lithiumPricing.getRepuation(
        account0.address,
        categoryIds[0]
      );
      expect(getReputation).to.be.equal(reputationScores[0]);
    });

    it("Should not allow non admins to update reputaion scrores", async function () {
      const addressesToUpdate = [
        account0.address,
        account0.address,
        account1.address,
        account1.address,
        account2.address,
        account2.address,
      ];
      await expect(
        lithiumPricing
          .connect(account1)
          .updateReputation(addressesToUpdate, categoryIds, reputationScores)
      ).to.be.revertedWith("Must be admin");
    });

    it("Should not allow 0 address to update reputation", async function () {
      const addressesToUpdate: [] = [];
      await expect(
        lithiumPricing.updateReputation(
          addressesToUpdate,
          categoryIds,
          reputationScores
        )
      ).to.be.revertedWith("address length must be greater than zero");
    });

    it("Should not update reputation with  invalid  array of  wisdom node address  ", async function () {
      const addressesToUpdate = [account0.address];
      const categoryIds = [0, 1, 1, 2];
      //fake repuation scores
      const reputationScores = [10, 20, 37, 75];
      await expect(
        lithiumPricing.updateReputation(
          addressesToUpdate,
          categoryIds,
          reputationScores
        )
      ).to.be.revertedWith("argument array length mismatch");
    });
    it("Should not update reputation with  invalid  array of categoryids", async function () {
      const addressesToUpdate = [account0.address, account1.address];
      const categoryIds = [0, 1, 1, 2];
      //fake repuation scores
      const reputationScores = [10, 90];
      await expect(
        lithiumPricing.updateReputation(
          addressesToUpdate,
          categoryIds,
          reputationScores
        )
      ).to.be.revertedWith("argument array length mismatch");
    });
    it("Should not update reputation with  invalid  array of reputation scores", async function () {
      const addressesToUpdate = [account0.address, account1.address];
      const categoryIds = [0, 1];
      //fake repuation scores
      const reputationScores = [10, 90, 70];
      await expect(
        lithiumPricing.updateReputation(
          addressesToUpdate,
          categoryIds,
          reputationScores
        )
      ).to.be.revertedWith("argument array length mismatch");
    });
  });

  describe("Minimum Stake for answering questions", () => {
    it("Should allow admins to set minimum stake ", async () => {
      //minimum stake=10LITH tokens
      const minimumStake = ethers.utils.parseUnits("10.0", 18);
      await expect(lithiumPricing.updateMinimumStake(minimumStake))
        .emit(lithiumPricing, "MinimumStakeUpdated")
        .withArgs(minimumStake);
      const getMinimumStake = await lithiumPricing.minimumStake();
      expect(getMinimumStake).equal(minimumStake);
    });

    it("Should not allow admins to set minimum stake ", async () => {
      const minimumStake = ethers.utils.parseUnits("10.0", 18);
      await expect(
        lithiumPricing.connect(account1).updateMinimumStake(minimumStake)
      ).to.be.revertedWith("Must be admin");
    });
  });
});
