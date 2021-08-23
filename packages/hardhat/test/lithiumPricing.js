const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const { BigNumber } = ethers;
use(solidity);
describe("Lithium Pricing", async function () {
  let lithiumPricing,
    lithiumReward,
    lithToken,
    account0,
    account1,
    account2,
    stakeAmount,
    transferAmount1;

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
      const lithiumPricing = await pricingContract.deploy();
      await expect(lithiumPricing.deployTransaction)
        .to.emit(lithiumPricing, "CategoryAdded")
        .withArgs(categoryid, label);
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
  });

  describe("Create a question", function () {
    beforeEach(async function () {
      await lithiumPricing.setLithiumTokenAddress(lithToken.address);
      await lithiumPricing.setLithiumRewardAddress(lithiumReward.address);
    });

    it("Should be able to create a question with pricingTime", async function () {
      const senderBalance = await lithToken.balanceOf(account0.address);
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;

      await expect(
        lithiumPricing.createQuestion(
          categoryId,
          bounty,
          pricingTime,
          endTime,
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
          answerSet
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

      await expect(
        lithiumPricing.createQuestion(
          categoryId,
          bounty,
          pricingTime,
          endTime,
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

      await expect(
        lithiumPricing.createQuestion(
          categoryId,
          bounty,
          pricingTime,
          endTime,
          description,
          answerSet
        )
      ).to.be.revertedWith("reverted with panic code 0x32");
    });

    it("Should fail to create a question with an invalid answerSet length: too few", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo2";
      const bounty = transferAmount1;
      const answerSet = [50];
      const categoryId = 0;

      await expect(
        lithiumPricing.createQuestion(
          categoryId,
          bounty,
          pricingTime,
          endTime,
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

      await expect(
        lithiumPricing.createQuestion(
          categoryId,
          bounty,
          pricingTime,
          endTime,
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
      const answerSet = [50, 40];
      const categoryId = 0;

      await expect(
        lithiumPricing.createQuestion(
          categoryId,
          bounty,
          pricingTime,
          endTime,
          description,
          answerSet
        )
      ).to.be.revertedWith("Answers must be in ascending order");
    });

    it("Should fail to create a question with enough bounty provided", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = ethers.utils.parseUnits("1000000.0", 18);
      const answerSet = [0, 50];
      const categoryId = 0;
      await lithToken.connect(account1).approve(lithiumPricing.address, bounty);
      await expect(
        lithiumPricing
          .connect(account1)
          .createQuestion(
            categoryId,
            bounty,
            pricingTime,
            endTime,
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
      await lithToken.connect(account1).approve(lithiumPricing.address, 0);
      await expect(
        lithiumPricing
          .connect(account1)
          .createQuestion(
            categoryId,
            bounty,
            pricingTime,
            endTime,
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

        await lithiumPricing.createQuestion(
          categoryId,
          bounty,
          pricingTime,
          endTime,
          description,
          answerSet
        );
      });
      it("Should be able to answer a question", async function () {
        const senderBalance = await lithToken.balanceOf(account1.address);
        const ids = [0];
        const stakeAmounts = [stakeAmount];
        const answerIndexes = [1];
        await expect(
          lithiumPricing
            .connect(account1)
            .answerQuestions(ids, stakeAmounts, answerIndexes)
        )
          .emit(lithiumPricing, "QuestionAnswered")
          .withArgs(0, account1.address, stakeAmounts[0], answerIndexes[0])
          .emit(lithiumPricing, "AnswerGroupSetSubmitted")
          .withArgs(account1.address, ids);
        const senderBalanceAfter = await lithToken.balanceOf(account1.address);

        expect(stakeAmounts[0].add(senderBalanceAfter)).to.equal(senderBalance);

        const sender2Balance = await lithToken.balanceOf(account2.address);
        const stake2Amounts = [ethers.utils.parseUnits("20.0", 18)];
        const answer2Indexes = [0];
        await expect(
          lithiumPricing
            .connect(account2)
            .answerQuestions(ids, stake2Amounts, answer2Indexes)
        )
          .emit(lithiumPricing, "QuestionAnswered")
          .withArgs(0, account2.address, stake2Amounts[0], answer2Indexes[0])
          .emit(lithiumPricing, "AnswerGroupSetSubmitted")
          .withArgs(account2.address, ids);
        const sender2BalanceAfter = await lithToken.balanceOf(account2.address);

        expect(stake2Amounts[0].add(sender2BalanceAfter)).to.equal(
          sender2Balance
        );
      });

      it("Should not  able to answer a question for invalid Question id", async function () {
        const ids = [1];
        const stakeAmounts = [stakeAmount];
        const answerIndexes = [1];
        await expect(
          lithiumPricing
            .connect(account1)
            .answerQuestions(ids, stakeAmounts, answerIndexes)
        ).to.be.revertedWith("Invalid question id");
      });

      it("Should not  able to answer if deadline of question hasbeen reached", async function () {
        const ids = [0];
        const stakeAmounts = [stakeAmount];
        const answerIndexes = [1];
        const one_minute = 60 * 60;
        await ethers.provider.send("evm_increaseTime", [one_minute]);
        await ethers.provider.send("evm_mine");

        await expect(
          lithiumPricing
            .connect(account1)
            .answerQuestions(ids, stakeAmounts, answerIndexes)
        ).to.be.revertedWith("Question is not longer active");
      });

      it("Should not  able to answer if out of range answer is given", async function () {
        const ids = [0];
        const stakeAmounts = [stakeAmount];
        const answerIndexes = [12];

        await expect(
          lithiumPricing
            .connect(account1)
            .answerQuestions(ids, stakeAmounts, answerIndexes)
        ).to.be.revertedWith("Invalid answer index");
      });

      it("Should not  able to answer is stake amount=0", async function () {
        const ids = [0];
        const stakeAmounts = [0];
        const answerIndexes = [1];
        await expect(
          lithiumPricing
            .connect(account1)
            .answerQuestions(ids, stakeAmounts, answerIndexes)
        ).to.be.revertedWith("Stake amount must be greater than zero");
      });

      it("Should not  be able to answer if don't have sufficient balance", async function () {
        const ids = [0];
        const stakeAmounts = [
          ethers.utils.parseUnits("1000000000000000.0", 18),
        ];
        const answerIndexes = [1];
        await expect(
          lithiumPricing
            .connect(account1)
            .answerQuestions(ids, stakeAmounts, answerIndexes)
        ).to.be.revertedWith("Insufficient balance");
      });

      it("Should not  able to answer if approve amount is less than stake amount", async function () {
        const ids = [0];
        const stakeAmounts = [stakeAmount];
        const answerIndexes = [1];
        const approveAmount = 0;
        await lithToken
          .connect(account1)
          .approve(lithiumPricing.address, approveAmount);
        await expect(
          lithiumPricing
            .connect(account1)
            .answerQuestions(ids, stakeAmounts, answerIndexes)
        ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
      });

      describe("Claim reward", function () {
        beforeEach(async () => {
          const ids = [0];
          const stakeAmounts = [stakeAmount];
          const answerIndexes = [1];
          await lithiumPricing
            .connect(account1)
            .answerQuestions(ids, stakeAmounts, answerIndexes);
        });

        it("Should be able to claim reward", async function () {
          const one_minute = 60 * 60;
          await ethers.provider.send("evm_increaseTime", [one_minute]);
          await ethers.provider.send("evm_mine");
          const senderBalance = await lithToken.balanceOf(account1.address);
          const ids = [0];
          //stake amount+bounty amount
          const rewardAmount = ethers.utils.parseUnits("125.0", 18);

          await expect(lithiumPricing.connect(account1).claimRewards(ids))
            .emit(lithiumPricing, "RewardClaimed")
            .withArgs(0, account1.address, rewardAmount);

          const senderBalanceAfter = await lithToken.balanceOf(
            account1.address
          );

          expect(rewardAmount.add(senderBalance)).to.equal(senderBalanceAfter);
        });

        it("Should not able  to claim reward if deadline not be reached yet", async function () {
          const ids = [0];

          await expect(
            lithiumPricing.connect(account1).claimRewards(ids)
          ).to.be.revertedWith(
            "Question is still active and cannot be claimed"
          );
        });

        it("Should not be able to claim reward again ", async function () {
          const one_minute = 60 * 60;
          await ethers.provider.send("evm_increaseTime", [one_minute]);
          await ethers.provider.send("evm_mine");
          const senderBalance = await lithToken.balanceOf(account1.address);
          const ids = [0];
          //stake amount+bounty amount
          const rewardAmount = ethers.utils.parseUnits("125.0", 18);

          await expect(lithiumPricing.connect(account1).claimRewards(ids))
            .emit(lithiumPricing, "RewardClaimed")
            .withArgs(0, account1.address, rewardAmount);

          const senderBalanceAfter = await lithToken.balanceOf(
            account1.address
          );

          expect(rewardAmount.add(senderBalance)).to.equal(senderBalanceAfter);

          await expect(
            lithiumPricing.connect(account1).claimRewards(ids)
          ).to.be.revertedWith("Reward has already been claimed");
        });

        it("Should not able  claim reward if wisdom node doesn't give answer yet", async function () {
          const one_minute = 60 * 60;
          await ethers.provider.send("evm_increaseTime", [one_minute]);
          await ethers.provider.send("evm_mine");
          const senderBalance = await lithToken.balanceOf(account0.address);
          const ids = [0];
          await expect(
            lithiumPricing.connect(account0).claimRewards(ids)
          ).to.be.revertedWith("Answer must be correct to claim reward");

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
  describe("Adding categories", function () {
    it("Should allow admins to add a category", async function () {
      const categoryLabel = "Art Stuff";
      await expect(lithiumPricing.addCategory(categoryLabel))
        .emit(lithiumPricing, "CategoryAdded")
        .withArgs(1, categoryLabel);
    });

    it("Should not allow non admins to add a category", async function () {
      const categoryLabel = "Art Stuff";
      await expect(
        lithiumPricing.connect(account1).addCategory(categoryLabel)
      ).to.be.revertedWith("Must be admin");
    });
  });

  describe("Wisdom node reputation ", async function () {
    const categoryIds = [
      [0, 1],
      [1, 2],
      [0, 2],
    ];
    //fake repuation scores
    const reputationScores = [
      [10, 20],
      [0, 5],
      [37, 75],
    ];

    it("Should allow admins to update reputation scores", async function () {
      const addressesToUpdate = [
        account0.address,
        account1.address,
        account2.address,
      ];
      await expect(
        lithiumPricing.updateReputation(
          addressesToUpdate,
          categoryIds,
          reputationScores
        )
      ).emit(lithiumPricing, "ReputationUpdated");
      //.withArgs(addressesToUpdate,categoryIds,reputationScores)
      const getReputation = await lithiumPricing.getRepuation(
        account0.address,
        categoryIds[0][0]
      );
      expect(getReputation).to.be.equal(reputationScores[0][0]);
    });

    it("Should not allow non admins to update reputation scores", async function () {
      const addressesToUpdate = [
        account0.address,
        account1.address,
        account2.address,
      ];
      await expect(
        lithiumPricing
          .connect(account1)
          .updateReputation(addressesToUpdate, categoryIds, reputationScores)
      ).to.be.revertedWith("Must be admin");
    });

    it("Should not allow 0 address to update reputation", async function () {
      const addressesToUpdate = [];
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
      const categoryIds = [
        [0, 1],
        [1, 2],
      ];
      //fake repuation scores
      const reputationScores = [
        [10, 20],
        [37, 75],
      ];
      await expect(
        lithiumPricing.updateReputation(
          addressesToUpdate,
          categoryIds,
          reputationScores
        )
      ).to.be.revertedWith("incomplete address array");
    });

    it("Should not update reputation with  invalid  array of categoryid and reputation", async function () {
      const addressesToUpdate = [account0.address, account1.address];
      const categoryIds = [
        [0, 1],
        [1, 2],
      ];
      //fake repuation scores
      const reputationScores = [[10], [90]];
      await expect(
        lithiumPricing.updateReputation(
          addressesToUpdate,
          categoryIds,
          reputationScores
        )
      ).to.be.revertedWith("invalid categoryIds/reputationScore array");
    });
  });
});
