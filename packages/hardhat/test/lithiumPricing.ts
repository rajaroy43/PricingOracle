const { ethers ,upgrades} = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const { BigNumber } = ethers;
use(solidity);
import { Wallet } from "@ethersproject/wallet";
import { getBytes32FromMultiash ,getMultihashFromBytes32} from "../scripts/utils/multihash"
import { LithiumPricing, LithiumReward, LithiumToken } from "../typechain";
describe("Lithium Pricing", async function () {
  let lithiumPricing: LithiumPricing,
    lithiumReward: LithiumReward,
    lithToken: LithiumToken,
    account0: Wallet,
    account1: Wallet,
    account2: Wallet,
    stakeAmount: any,
    transferAmount1: any,
    minimumRequiredAnswer: any;

  const mockIpfsHash:string = 'QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB';

  beforeEach(async () => {
    const accounts = await ethers.getSigners();
    account0 = accounts[0];
    account1 = accounts[1];
    account2 = accounts[2];

    minimumRequiredAnswer = 1;
    const approveAmount = ethers.utils.parseUnits("1000.0", 18);
    transferAmount1 = ethers.utils.parseUnits("100.0", 18);
    stakeAmount = ethers.utils.parseUnits("25.0", 18);

    const pricingContract = await ethers.getContractFactory("LithiumPricing");
    lithiumPricing = await upgrades.deployProxy(pricingContract);

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
      const lithiumPricing: LithiumPricing = await upgrades.deployProxy(pricingContract);
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
      ).to.be.revertedWith("Must be admin");
    });

    it("should not allow  to set lithium token address with null address", async () => {
      const NULL_ADDRESS = ethers.constants.AddressZero;
      await expect(
        lithiumPricing.setLithiumTokenAddress(NULL_ADDRESS)
      ).to.be.revertedWith("Token Address != null");
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
      ).to.be.revertedWith("Must be admin");
    });

    it("should not allow  to set lithium reward address with null address", async () => {
      const NULL_ADDRESS = ethers.constants.AddressZero;
      await expect(
        lithiumPricing.setLithiumRewardAddress(NULL_ADDRESS)
      ).to.be.revertedWith("Reward Address != null");
    });
  });

  describe("Questions Group creation", function () {
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
      const keccak256Description0 = ethers.utils.solidityKeccak256(
        ["string"],
        [description]
      );
      
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;

      const startTime = block.timestamp + 3;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const keccak256Description1 = ethers.utils.solidityKeccak256(
        ["string"],
        [description1]
      )
      const bounty1 = transferAmount1;
      const answerSet1 = [0, 100];
      const categoryId1 = 0;

      const questiontype = 0;
      // QuestionType{ Pricing, GroundTruth }
      //if questiontype = 0 ,then question is Pricing type
      //if questiontype = 1 ,then question is GroundTruth type
      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1],
        [pricingTime, pricingTime1],
        [endTime, endTime1],
        [questiontype, questiontype],
        [description, description1],
        [answerSet, answerSet1],
        [startTime, startTime],
        minimumRequiredAnswer,
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
          questiontype,
          startTime
        );

      createQuestionGroupTx
        .emit(lithiumPricing, "QuestionGroupCreated")
        .withArgs(0, account0.address, [0, 1], minimumRequiredAnswer);

      const question0 = await lithiumPricing.getQuestion(0)
      const question1 = await lithiumPricing.getQuestion(1)

      expect(question0.description).to.equal(keccak256Description0)
      expect(question1.description).to.equal(keccak256Description1)
      const [questionBidAmount1,] = await lithiumPricing.questionBids(0,account0.address)
      expect(questionBidAmount1).to.equal(bounty)
      const [questionBidAmount2,] = await lithiumPricing.questionBids(1,account0.address) 
      expect(questionBidAmount2).to.equal(bounty1)

      const senderBalanceAfter = await lithToken.balanceOf(account0.address);

      expect(bounty.add(senderBalanceAfter).add(bounty1)).to.equal(
        senderBalance
      );
    });
    it("Should be able to create a question group with  QuestionType as Pricing type and GroundType", async function () {
      const senderBalance = await lithToken.balanceOf(account0.address);
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const keccak256Description0 = ethers.utils.solidityKeccak256(
        ["string"],
        [description]
      )
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;
      const questiontype0 = 0;
      const startTime = block.timestamp + 3;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const keccak256Description1 = ethers.utils.solidityKeccak256(
        ["string"],
        [description1]
      )
      const bounty1 = transferAmount1;
      const answerSet1 = [0, 100];
      const categoryId1 = 0;
      const questiontype1 = 1;
      // QuestionType{ Pricing, GroundTruth }
      //if questiontype = 0 ,then question is Pricing type
      //if questiontype = 1 ,then question is GroundTruth type
      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1],
        [pricingTime, pricingTime1],
        [endTime, endTime1],
        [questiontype0, questiontype1],
        [description, description1],
        [answerSet, answerSet1],
        [startTime, startTime],
        minimumRequiredAnswer,
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
          questiontype0,
          startTime
        );

      createQuestionGroupTx
        .emit(lithiumPricing, "QuestionCreated")
        .withArgs(
          1,
          bounty1,
          pricingTime1,
          endTime1,
          categoryId1,
          account0.address,
          description1,
          answerSet1,
          questiontype1,
          startTime
        );

      createQuestionGroupTx
        .emit(lithiumPricing, "QuestionGroupCreated")
        .withArgs(0, account0.address, [0, 1], minimumRequiredAnswer);

      const senderBalanceAfter = await lithToken.balanceOf(account0.address);

      const question0 = await lithiumPricing.getQuestion(0)
      const question1 = await lithiumPricing.getQuestion(1)

      expect(question0.description).to.equal(keccak256Description0)
      expect(question1.description).to.equal(keccak256Description1)

      expect(bounty.add(senderBalanceAfter).add(bounty1)).to.equal(
        senderBalance
      );
    });

    it("Should  allow   admin  to create a single question", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const keccak256Description = ethers.utils.solidityKeccak256(
        ["string"],
        [description]
      )
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;
      const questiontype0 = 0;
      const startTime = block.timestamp + 3;

      const args = [
        categoryId, 
        bounty,
        pricingTime,
        endTime,
        questiontype0,
        description,
        answerSet,
        startTime
      ];
      await expect(//@ts-ignore
        lithiumPricing.createQuestion(...args)
      ).emit(lithiumPricing,"QuestionCreated")
      .withArgs(
        0,
        bounty,
        pricingTime,
        endTime,
        categoryId,
        account0.address,
        description,
        answerSet,
        questiontype0,
        startTime
      );
      const question = await lithiumPricing.getQuestion(0)
      expect(question.description).to.equal(keccak256Description)

    });

    it("Should not allow non admin  to create a question group", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;
      const questiontype0 = 0;
      const startTime = block.timestamp + 3;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const bounty1 = transferAmount1;
      const answerSet1 = [0, 100];
      const categoryId1 = 0;
      const questiontype1 = 1;
      // QuestionType{ Pricing, GroundTruth }
      //if questiontype = 0 ,then question is Pricing type
      //if questiontype = 1 ,then question is GroundTruth type
      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1],
        [pricingTime, pricingTime1],
        [endTime, endTime1],
        [questiontype0, questiontype1],
        [description, description1],
        [answerSet, answerSet1],
        [startTime, startTime],
        minimumRequiredAnswer,
      ];
      await expect(//@ts-ignore
        lithiumPricing.connect(account1).createQuestionGroup(...args)
      ).to.be.revertedWith("Must be Admin")

    });


    it("Should not allow non  admin  to create a single question", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;
      const questiontype0 = 0;
      const startTime = block.timestamp + 3;

      const args = [
        categoryId, 
        bounty,
        pricingTime,
        endTime,
        questiontype0,
        description,
        answerSet,
        startTime
      ];
      await expect(//@ts-ignore
        lithiumPricing.connect(account1).createQuestion(...args)
      ).to.be.revertedWith("Must be Admin")

    });

    it("Should not create a question group with categoryIds param length mismatch", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;
      const startTime = block.timestamp + 3;

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
        [startTime, startTime],
        minimumRequiredAnswer,
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
      const startTime = block.timestamp + 3;

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
        [startTime, startTime],
        minimumRequiredAnswer,
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
      const startTime = block.timestamp + 3;

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

        [startTime, startTime],
        minimumRequiredAnswer,
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
      const startTime = block.timestamp + 3;

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
        [questiontype, questiontype],
        [description, description1],
        [answerSet, answerSet1],
        [startTime, startTime],
        minimumRequiredAnswer,
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
      const startTime = block.timestamp + 3;

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
        [questiontype, questiontype, questiontype],
        [description, description1],
        [answerSet, answerSet1],
        [startTime, startTime],
        minimumRequiredAnswer,
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
      const startTime = block.timestamp + 3;

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
        [description, description1, description],
        [answerSet, answerSet1],
        [startTime, startTime],
        minimumRequiredAnswer,
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
      const startTime = block.timestamp + 3;

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
        [answerSet, answerSet1, answerSet],
        [startTime, startTime],
        minimumRequiredAnswer,
      ];
      await expect(
        //@ts-ignore
        lithiumPricing.createQuestionGroup(...args)
      ).to.be.revertedWith("Array mismatch");
    });

    it("Should not create a question group with startTimes param length mismatch", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;
      const startTime = block.timestamp + 3;

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
        [questiontype, questiontype],
        [description, description1],
        [answerSet, answerSet1],
        [startTime, startTime, startTime],
        minimumRequiredAnswer,
      ];
      await expect(
        //@ts-ignore
        lithiumPricing.createQuestionGroup(...args)
      ).to.be.revertedWith("Array mismatch");
    });

    it("Should not able to create a questionGroup if any question with pricingTime less than end time", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;
      const questiontype0 = 0;
      const startTime = block.timestamp + 3;

      const pricingTime1 = block.timestamp + 2;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const bounty1 = transferAmount1;
      const answerSet1 = [0, 100];
      const categoryId1 = 0;
      const questiontype1 = 1;

      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1],
        [pricingTime, pricingTime1],
        [endTime, endTime1],
        [questiontype0, questiontype1],
        [description, description1],
        [answerSet, answerSet1],
        [startTime, startTime],
        minimumRequiredAnswer,
      ];
      await expect(
        //@ts-ignore
        lithiumPricing.createQuestionGroup(...args)
      ).to.be.revertedWith(
        "Pricing time of asset must be greater than endtime"
      );
    });

    it("Should fail to create  questionGroup  if any question with startTime of giving answer > endTime", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;
      const questiontype0 = 0;
      const startTime = endTime + 1;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const bounty1 = transferAmount1;
      const answerSet1 = [0, 100];
      const categoryId1 = 0;
      const questiontype1 = 1;

      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1],
        [pricingTime, pricingTime1],
        [endTime, endTime1],
        [questiontype0, questiontype1],
        [description, description1],
        [answerSet, answerSet1],
        [startTime, startTime],
        minimumRequiredAnswer,
      ];
      await expect(
        //@ts-ignore
        lithiumPricing.createQuestionGroup(...args)
      ).to.be.revertedWith(
        "startTime > end time or < current time"
      );
    });

    it("Should fail to create  questionGroup  if any question with startTime of giving answer < current time", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;
      const questiontype0 = 0;
      const startTime = block.timestamp - 10;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const bounty1 = transferAmount1;
      const answerSet1 = [0, 100];
      const categoryId1 = 0;
      const questiontype1 = 1;

      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1],
        [pricingTime, pricingTime1],
        [endTime, endTime1],
        [questiontype0, questiontype1],
        [description, description1],
        [answerSet, answerSet1],
        [startTime, startTime],
        minimumRequiredAnswer,
      ];
      await expect(
        //@ts-ignore
        lithiumPricing.createQuestionGroup(...args)
      ).to.be.revertedWith(
        "startTime > end time or < current time"
      );
    });

    it("Should fail to create  questionGroup  if any question with an invalid categoryId", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;
      const questiontype0 = 0;
      const startTime = block.timestamp + 3;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const bounty1 = transferAmount1;
      const answerSet1 = [0, 100];
      const categoryId1 = 1;
      const questiontype1 = 1;

      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1],
        [pricingTime, pricingTime1],
        [endTime, endTime1],
        [questiontype0, questiontype1],
        [description, description1],
        [answerSet, answerSet1],
        [startTime, startTime],
        minimumRequiredAnswer,
      ];
      await expect(
        //@ts-ignore
        lithiumPricing.createQuestionGroup(...args)
      ).to.be.revertedWith("reverted with panic code 0x32");
    });

    it("Should fail to create a questionGroup  if any question  with an invalid answerSet length: too few", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;
      const questiontype0 = 0;
      const startTime = block.timestamp + 3;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const bounty1 = transferAmount1;
      const answerSet1 = [50];
      const categoryId1 = 0;
      const questiontype1 = 1;

      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1],
        [pricingTime, pricingTime1],
        [endTime, endTime1],
        [questiontype0, questiontype1],
        [description, description1],
        [answerSet, answerSet1],
        [startTime, startTime],
        minimumRequiredAnswer,
      ];
      await expect(
        //@ts-ignore
        lithiumPricing.createQuestionGroup(...args)
      ).to.be.revertedWith("Answer Set length invalid");
    });

    it("Should fail to create a questionGroup  if any question with an invalid answerSet length: too many", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;
      const questiontype0 = 0;
      const startTime = block.timestamp + 3;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const bounty1 = transferAmount1;
      const answerSet1 = [0, 50, 100];
      const categoryId1 = 0;
      const questiontype1 = 1;

      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1],
        [pricingTime, pricingTime1],
        [endTime, endTime1],
        [questiontype0, questiontype1],
        [description, description1],
        [answerSet, answerSet1],
        [startTime, startTime],
        minimumRequiredAnswer,
      ];
      await expect(
        //@ts-ignore
        lithiumPricing.createQuestionGroup(...args)
      ).to.be.revertedWith("Answer Set length invalid");
    });

    it("Should fail to create questionGroup  if any question with an invalid answerSet order", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;
      const questiontype0 = 0;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const bounty1 = transferAmount1;
      const answerSet1 = [0, 0];
      const categoryId1 = 0;
      const questiontype1 = 1;
      const startTime = block.timestamp + 3;

      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1],
        [pricingTime, pricingTime1],
        [endTime, endTime1],
        [questiontype0, questiontype1],
        [description, description1],
        [answerSet, answerSet1],
        [startTime, startTime],
        minimumRequiredAnswer,
      ];
      await expect(
        //@ts-ignore
        lithiumPricing.createQuestionGroup(...args)
      ).to.be.revertedWith("Answers not ascending");
    });

    it("Should fail to create a questionGroup  if any question with  1st index is not equal to 0", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;
      const questiontype0 = 0;
      const startTime = block.timestamp + 3;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const bounty1 = transferAmount1;
      const answerSet1 = [50, 100];
      const categoryId1 = 0;
      const questiontype1 = 1;

      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1],
        [pricingTime, pricingTime1],
        [endTime, endTime1],
        [questiontype0, questiontype1],
        [description, description1],
        [answerSet, answerSet1],
        [startTime, startTime],
        minimumRequiredAnswer,
      ];
      await expect(
        //@ts-ignore
        lithiumPricing.createQuestionGroup(...args)
      ).to.be.revertedWith("AnswerSet must include 0");
    });
    it("Should fail to create a questionGroup with any of one quesion with enough bounty provided", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = ethers.utils.parseUnits("1000000.0", 18);

      const answerSet = [0, 50];
      const categoryId = 0;
      const questiontype0 = 0;
      const startTime = block.timestamp + 3;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const bounty1 = transferAmount1;
      const answerSet1 = [0, 50];
      const categoryId1 = 0;
      const questiontype1 = 1;

      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1],
        [pricingTime, pricingTime1],
        [endTime, endTime1],
        [questiontype0, questiontype1],
        [description, description1],
        [answerSet, answerSet1],
        [startTime, startTime],
        minimumRequiredAnswer,
      ];
      await lithToken.connect(account1).approve(lithiumPricing.address, bounty);
      await expect(
        //@ts-ignore
        lithiumPricing.createQuestionGroup(...args)
      ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
    });

    it("Should fail to create a questionGroup with any of one quesion having approve amount < bounty amount", async function () {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;
      const startTime = block.timestamp + 3;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const bounty1 = transferAmount1;
      const answerSet1 = [0, 100];
      const categoryId1 = 0;

      const questiontype = 0;
      // QuestionType{ Pricing, GroundTruth }
      //if questiontype = 0 ,then question is Pricing type
      //if questiontype = 1 ,then question is GroundTruth type
      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1],
        [pricingTime, pricingTime1],
        [endTime, endTime1],
        [questiontype, questiontype],
        [description, description1],
        [answerSet, answerSet1],
        [startTime, startTime],
        minimumRequiredAnswer,
      ];
      await lithToken.approve(lithiumPricing.address, 0);
      await expect(
        //@ts-ignore
        lithiumPricing.createQuestionGroup(...args)
      ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
    });

    it("Should not  able to answer if starting time of question is not reached yet", async () => {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;

      const startTime = block.timestamp + 4;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const bounty1 = transferAmount1;
      const answerSet1 = [0, 100];
      const categoryId1 = 0;

      const questiontype = 0;
      // QuestionType{ Pricing, GroundTruth }
      //if questiontype = 0 ,then question is Pricing type
      //if questiontype = 1 ,then question is GroundTruth type
      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1],
        [pricingTime, pricingTime1],
        [endTime, endTime1],
        [questiontype, questiontype],
        [description, description1],
        [answerSet, answerSet1],
        [startTime, startTime],
        minimumRequiredAnswer,
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
          questiontype,
          startTime
        );

      createQuestionGroupTx
        .emit(lithiumPricing, "QuestionGroupCreated")
        .withArgs(0, account0.address, [0, 1], minimumRequiredAnswer);

      const stakeAmounts = [stakeAmount, stakeAmount];
      const answerIndexes = [1, 0];
      const questionGroupId = 0;
      await expect(
        lithiumPricing
          .connect(account1)
          .answerQuestions(questionGroupId, stakeAmounts, answerIndexes)
      ).to.be.revertedWith("Answering question not started");
    });

    it("Should not  able to refund bids if start time not passed ", async () => {
      const block = await ethers.provider.getBlock();
      const pricingTime = block.timestamp + 7;
      const endTime = block.timestamp + 5;
      const description = "foo";
      const bounty = transferAmount1;
      const answerSet = [0, 50];
      const categoryId = 0;

      const startTime = block.timestamp + 4;

      const pricingTime1 = block.timestamp + 7;
      const endTime1 = block.timestamp + 5;
      const description1 = "foo1";
      const bounty1 = transferAmount1;
      const answerSet1 = [0, 100];
      const categoryId1 = 0;

      const questiontype = 0;
      // QuestionType{ Pricing, GroundTruth }
      //if questiontype = 0 ,then question is Pricing type
      //if questiontype = 1 ,then question is GroundTruth type
      const args = [
        [categoryId, categoryId1],
        [bounty, bounty1],
        [pricingTime, pricingTime1],
        [endTime, endTime1],
        [questiontype, questiontype],
        [description, description1],
        [answerSet, answerSet1],
        [startTime, startTime],
        minimumRequiredAnswer,
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
          questiontype,
          startTime
        );

      createQuestionGroupTx
        .emit(lithiumPricing, "QuestionGroupCreated")
        .withArgs(0, account0.address, [0, 1], minimumRequiredAnswer);

      const questionIds = [0,1]
      const nodeAddresses = [account0.address,account0.address]
      const refundAmounts = [transferAmount1,transferAmount1]

      await expect(
        lithiumPricing
          .refundBids(questionIds,nodeAddresses,refundAmounts)
      ).to.be.revertedWith("Question not started");
    });

    describe('Bidding On Questions', function() {

      beforeEach(async () => {
        const block = await ethers.provider.getBlock();
        const pricingTime = block.timestamp + 20;
        const endTime = block.timestamp + 15;
        const description = "foo";
        const bounty = transferAmount1;
        const answerSet = [0, 50];
        const categoryId = 0;
        const questiontype = 0;

        const startTime = block.timestamp + 10;

        const pricingTime1 = block.timestamp + 17;
        const endTime1 = block.timestamp + 15;
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
          [startTime, startTime],
          minimumRequiredAnswer,
        ];
        //@ts-ignore
        await lithiumPricing.createQuestionGroup(...args);
      });

      it("Should able to increase bid on question by question creater",async()=>{
        const questionId = 0;
        const lithBidAmount = ethers.utils.parseUnits("10.0", 18);
        const [biddingAmountInitial,] = await lithiumPricing.questionBids(questionId,account0.address) 
        await expect(lithiumPricing.increaseBid(questionId,lithBidAmount)).
        emit(lithiumPricing,"BidReceived").
        withArgs(questionId,account0.address,lithBidAmount);  
        const [biddingAmountFinal,] = await lithiumPricing.questionBids(questionId,account0.address)
        expect(biddingAmountFinal).to.equal(lithBidAmount.add(biddingAmountInitial))

        //Checking updated Bounty

        const question = await lithiumPricing. getQuestion(questionId)
        expect(question.bounty).to.equal(biddingAmountFinal)
      })

      it("Should able to increase bid mutiple time on question by question creater",async()=>{
        const questionId = 0;
        const lithBidAmount = ethers.utils.parseUnits("10.0", 18);
        const [biddingAmountInitial,] = await lithiumPricing.questionBids(questionId,account0.address) 

        await expect(lithiumPricing.increaseBid(questionId,lithBidAmount)).
        emit(lithiumPricing,"BidReceived").
        withArgs(questionId,account0.address,lithBidAmount);

        await expect(lithiumPricing.increaseBid(questionId,lithBidAmount)).
        emit(lithiumPricing,"BidReceived").
        withArgs(questionId,account0.address,lithBidAmount);

        await expect(lithiumPricing.increaseBid(questionId,lithBidAmount)).
        emit(lithiumPricing,"BidReceived").
        withArgs(questionId,account0.address,lithBidAmount);

        const [biddingAmountFinal,] = await lithiumPricing.questionBids(questionId,account0.address)
        expect(biddingAmountFinal).to.equal(lithBidAmount.add(biddingAmountInitial).add(lithBidAmount).add(lithBidAmount))
      
        //Checking updated Bounty

        const question = await lithiumPricing.getQuestion(questionId)
        expect(question.bounty).to.equal(biddingAmountFinal)      
      })

      it("Should able to increase  bid mutiple time on question by another user ",async()=>{
        const questionId = 0;
        const lithBidAmount = ethers.utils.parseUnits("10.0", 18);
        const [biddingAmountInitial,] = await lithiumPricing.questionBids(questionId,account1.address) 
        
        await expect(lithiumPricing.connect(account1).increaseBid(questionId,lithBidAmount)).
        emit(lithiumPricing,"BidReceived").
        withArgs(questionId,account1.address,lithBidAmount);

        await expect(lithiumPricing.connect(account1).increaseBid(questionId,lithBidAmount)).
        emit(lithiumPricing,"BidReceived").
        withArgs(questionId,account1.address,lithBidAmount);

        await expect(lithiumPricing.connect(account1).increaseBid(questionId,lithBidAmount)).
        emit(lithiumPricing,"BidReceived").
        withArgs(questionId,account1.address,lithBidAmount);

        const [biddingAmountFinal,] = await lithiumPricing.questionBids(questionId,account1.address)
        expect(biddingAmountFinal).to.equal(lithBidAmount.add(biddingAmountInitial).add(lithBidAmount).add(lithBidAmount))

        //Checking updated Bounty

        const question = await lithiumPricing.getQuestion(questionId)
        //bountyAmount == transferAmount1
        //biddingAmountFinal + intialQuestion bounty == final question bounty
        expect(question.bounty).to.equal(biddingAmountFinal.add(transferAmount1))    
      })

      it("Should not  able to increase  bid if approve amount is 0",async()=>{
        await lithToken.connect(account1).approve(lithiumPricing.address,0);
        const questionId = 0;
        const lithBidAmount = ethers.utils.parseUnits("10.0", 18);
        await expect(lithiumPricing.connect(account1).increaseBid(questionId,lithBidAmount)).
        to.be.revertedWith("ERC20: transfer amount exceeds allowance")
      });

      it("Should not  able to increase  bid if lith token balance is less than bid amount",async()=>{
        await lithToken.connect(account1).transfer(account0.address,transferAmount1);
        const questionId = 0;
        const lithBidAmount = ethers.utils.parseUnits("10.0", 18);
        await expect(lithiumPricing.connect(account1).increaseBid(questionId,lithBidAmount)).
        to.be.revertedWith("ERC20: transfer amount exceeds balance")
      });


      it("Should not  able to increase  bid for invalid quesion ",async()=>{
        const questionId = 2;
        const lithBidAmount = ethers.utils.parseUnits("10.0", 18);
        await expect(lithiumPricing.connect(account1).increaseBid(questionId,lithBidAmount)).
        to.be.revertedWith("Invalid question id")
      });

      it("Should not  able to increase  bid for 0 amount ",async()=>{
        const questionId = 0;
        const lithBidAmount = 0;
        await expect(lithiumPricing.connect(account1).increaseBid(questionId,lithBidAmount)).
        to.be.revertedWith("Bidding amount is 0")
      });


      it("Should not  able to increase  bid if answering session started ",async()=>{
        //Modified Block Timestamp For future
        const increaseTime = 15;
        await ethers.provider.send("evm_increaseTime", [increaseTime]);
        await ethers.provider.send("evm_mine");

        const questionId = 0;
        const lithBidAmount = ethers.utils.parseUnits("10.0", 18);
        await expect(lithiumPricing.connect(account1).increaseBid(questionId,lithBidAmount)).
        to.be.revertedWith("Answering question time started ")
      });

      it("Should allow admin  to refund user bids amount+increaseLithBidAmount", async function () {
        const questionIds = [0,1]
        const nodeAddresses = [account0.address,account0.address]
        
        const lithBidAmount = ethers.utils.parseUnits("10.0", 18);

        await expect(lithiumPricing.increaseBid(questionIds[0],lithBidAmount)).
        emit(lithiumPricing,"BidReceived").
        withArgs(questionIds[0],account0.address,lithBidAmount);  

        await expect(lithiumPricing.increaseBid(questionIds[1],lithBidAmount)).
        emit(lithiumPricing,"BidReceived").
        withArgs(questionIds[1],account0.address,lithBidAmount);  

        const refundAmounts = [transferAmount1.add(lithBidAmount),transferAmount1.add(lithBidAmount)]

        const [initialBidAmount1,initialIsBidRefunded1] = await lithiumPricing.questionBids(questionIds[0],nodeAddresses[0])
        const [initialBidAmount2,initialIsBidRefunded2] = await lithiumPricing.questionBids(questionIds[1],nodeAddresses[1])
        expect(initialBidAmount1).to.equal(refundAmounts[0])
        expect(initialBidAmount2).to.equal(refundAmounts[1])
        expect(initialIsBidRefunded1).to.be.false
        expect(initialIsBidRefunded2).to.be.false
        
        const one_minute = 60 * 60;
        await ethers.provider.send("evm_increaseTime", [one_minute]);
        await ethers.provider.send("evm_mine");

        const questionBountyBeforeRefunding0 = (await lithiumPricing.getQuestion(questionIds[0])).bounty;
        const questionBountyBeforeRefunding1 =  (await lithiumPricing.getQuestion(questionIds[1])).bounty;
        const initialLithBalance = await lithToken.balanceOf(account0.address);

        const refundedBidTx = await expect(lithiumPricing.refundBids(questionIds,nodeAddresses,refundAmounts))
        refundedBidTx
          .emit(lithiumPricing,"BidRefunded")
          .withArgs(questionIds[0],nodeAddresses[0],refundAmounts[0])

        refundedBidTx
          .emit(lithiumPricing,"BidRefunded")
          .withArgs(questionIds[1],nodeAddresses[1],refundAmounts[1])

        const finalLithBalance = await lithToken.balanceOf(account0.address);
        const questionBountyAfterRefunding0 = (await lithiumPricing.getQuestion(questionIds[0])).bounty;
        const questionBountyAfterRefunding1 = (await lithiumPricing.getQuestion(questionIds[1])).bounty;
        
        expect(questionBountyAfterRefunding0.add(refundAmounts[0])).to.equal(questionBountyBeforeRefunding0)
        expect(questionBountyAfterRefunding1.add(refundAmounts[1])).to.equal(questionBountyBeforeRefunding1)
        expect(finalLithBalance).to.equal(initialLithBalance.add(refundAmounts[0].add(refundAmounts[1])))
        
        const [finalLeftRefundAmount1,finalIsBidRefunded1] = await lithiumPricing.questionBids(questionIds[0],nodeAddresses[0])
        const [finalLeftRefundAmount2,finalIsBidRefunded2] = await lithiumPricing.questionBids(questionIds[1],nodeAddresses[1])
        
        expect(finalLeftRefundAmount1).to.equal(0)
        expect(finalLeftRefundAmount2).to.equal(0)            
        
        expect(finalIsBidRefunded1).to.be.true
        expect(finalIsBidRefunded2).to.be.true

      })

    })


    describe("Answering  question group", function () {
      beforeEach(async () => {
        const block = await ethers.provider.getBlock();
        const pricingTime = block.timestamp + 20;
        const endTime = block.timestamp + 15;
        const description = "foo";
        const bounty = transferAmount1;
        const answerSet = [0, 50];
        const categoryId = 0;
        const questiontype = 0;

        const startTime = block.timestamp + 1;

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
          [startTime, startTime],
          minimumRequiredAnswer,
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

      it("Should not  able to answer a question for mismatch array invalid stakeAmounts/answerIndexes", async function () {
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
        ).to.be.revertedWith("Question not active");
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

      it("Should not  able to answer if wisdom node stake amount < minimumStake amount", async function () {
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
        ).to.be.revertedWith("Stake amount < minimumStake");
      });

      it("Should not  be able to answer if wisdom node don't have sufficient balance", async function () {
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

      it("Should not  able to answer a question again", async function () {
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

        //answering question again

        await expect(
          lithiumPricing
            .connect(account1)
            .answerQuestions(questionGroupId, stakeAmounts, answerIndexes)
        ).to.be.revertedWith("User already answered");
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

      it("Should not  update final answer status if question deadline is not ended yet", async () => {
        const questionIds = [0, 1];
        const answerHashes = [getBytes32FromMultiash(mockIpfsHash),getBytes32FromMultiash(mockIpfsHash)]
        
        await expect(
          lithiumPricing.updateValidAnswerStatus(questionIds,answerHashes)
        ).to.be.revertedWith(
          "Question is active"
        );
      })

      describe('Refunding Bidding to users', function() {

          it("Should allow admin  to refund user bids amount", async function () {
            const questionIds = [0,1]
            const nodeAddresses = [account0.address,account0.address]
            const refundAmounts = [transferAmount1,transferAmount1]
    
            const [,initialIsBidRefunded1] = await lithiumPricing.questionBids(questionIds[0],nodeAddresses[0])
            const [,initialIsBidRefunded2] = await lithiumPricing.questionBids(questionIds[1],nodeAddresses[1])
            expect(initialIsBidRefunded1).to.be.false
            expect(initialIsBidRefunded2).to.be.false

            const questionBountyBeforeRefunding0 = (await lithiumPricing.getQuestion(questionIds[0])).bounty;
            const questionBountyBeforeRefunding1 =  (await lithiumPricing.getQuestion(questionIds[1])).bounty;
            
            const initialLithBalance = await lithToken.balanceOf(account0.address);

            const refundedBidTx = await expect(lithiumPricing.refundBids(questionIds,nodeAddresses,refundAmounts))
            refundedBidTx
              .emit(lithiumPricing,"BidRefunded")
              .withArgs(questionIds[0],nodeAddresses[0],refundAmounts[0])
    
            refundedBidTx
              .emit(lithiumPricing,"BidRefunded")
              .withArgs(questionIds[1],nodeAddresses[1],refundAmounts[1])

            const questionBountyAfterRefunding0 = (await lithiumPricing.getQuestion(questionIds[0])).bounty;
            const questionBountyAfterRefunding1 = (await lithiumPricing.getQuestion(questionIds[1])).bounty;
              
            expect(questionBountyAfterRefunding0.add(refundAmounts[0])).to.equal(questionBountyBeforeRefunding0)
            expect(questionBountyAfterRefunding1.add(refundAmounts[1])).to.equal(questionBountyBeforeRefunding1)
           

            const finalLithBalance = await lithToken.balanceOf(account0.address);
        
            expect(finalLithBalance).to.equal(initialLithBalance.add(refundAmounts[0].add(refundAmounts[1])))
            
            const [,finalIsBidRefunded1] = await lithiumPricing.questionBids(questionIds[0],nodeAddresses[0])
            const [,finalIsBidRefunded2] = await lithiumPricing.questionBids(questionIds[1],nodeAddresses[1])
            
            expect(finalIsBidRefunded1).to.be.true
            expect(finalIsBidRefunded2).to.be.true
    
          })

    
          it("Should allow admin to refund user bid amount  (bid amount less than refund amount) bidAmount/2", async function () {
            const questionIds = [0,1]
            const nodeAddresses = [account0.address,account0.address]
            const refundAmounts = [transferAmount1.div(2),transferAmount1.div(2)]
    
            const [,initialIsBidRefunded1] = await lithiumPricing.questionBids(questionIds[0],nodeAddresses[0])
            const [,initialIsBidRefunded2] = await lithiumPricing.questionBids(questionIds[1],nodeAddresses[1])
            expect(initialIsBidRefunded1).to.be.false
            expect(initialIsBidRefunded2).to.be.false

            const initialLithBalance = await lithToken.balanceOf(account0.address);

            const questionBountyBeforeRefunding0 = (await lithiumPricing.getQuestion(questionIds[0])).bounty;
            const questionBountyBeforeRefunding1 =  (await lithiumPricing.getQuestion(questionIds[1])).bounty;
            
            const refundedBidTx = await expect(lithiumPricing.refundBids(questionIds,nodeAddresses,refundAmounts))
            refundedBidTx
              .emit(lithiumPricing,"BidRefunded")
              .withArgs(questionIds[0],nodeAddresses[0],refundAmounts[0])
    
            refundedBidTx
              .emit(lithiumPricing,"BidRefunded")
              .withArgs(questionIds[1],nodeAddresses[1],refundAmounts[1])

              const questionBountyAfterRefunding0 = (await lithiumPricing.getQuestion(questionIds[0])).bounty;
              const questionBountyAfterRefunding1 = (await lithiumPricing.getQuestion(questionIds[1])).bounty;
                
              expect(questionBountyAfterRefunding0.add(refundAmounts[0])).to.equal(questionBountyBeforeRefunding0)
              expect(questionBountyAfterRefunding1.add(refundAmounts[1])).to.equal(questionBountyBeforeRefunding1)
             

            const finalLithBalance = await lithToken.balanceOf(account0.address);
        
            expect(finalLithBalance).to.equal(initialLithBalance.add(refundAmounts[0].add(refundAmounts[1])))
              
            
            const [,finalIsBidRefunded1] = await lithiumPricing.questionBids(questionIds[0],nodeAddresses[0])
            const [,finalIsBidRefunded2] = await lithiumPricing.questionBids(questionIds[1],nodeAddresses[1])
            
            expect(finalIsBidRefunded1).to.be.true
            expect(finalIsBidRefunded2).to.be.true
    
          })
    
          it("Should not allow non-admin  to refund user bids amount ", async function () {
            const questionIds = [0,1]
            const nodeAddresses = [account0.address,account0.address]
            const refundAmounts = [transferAmount1,transferAmount1]
    
            await expect(lithiumPricing.connect(account1).refundBids(questionIds,nodeAddresses,refundAmounts))
            .to.be.revertedWith("Must be admin")
          })
    
          it("Should not allow admin  to refund user bids if mismatch argument `questionIds` provided ", async function () {
            const questionIds = [0]
            const nodeAddresses = [account0.address,account1.address]
            const refundAmounts = [transferAmount1,transferAmount1]
    
            await expect(lithiumPricing.refundBids(questionIds,nodeAddresses,refundAmounts))
            .to.be.revertedWith("argument length mismatch")
          })
    
          it("Should not allow admin  to refund user bids if mismatch argument `refundAmounts` provided ", async function () {
            const questionIds = [0,1]
            const nodeAddresses = [account0.address,account0.address]
            const refundAmounts = [transferAmount1]
    
            await expect(lithiumPricing.refundBids(questionIds,nodeAddresses,refundAmounts))
            .to.be.revertedWith("argument length mismatch")
          })
    
          it("Should not allow admin  to refund user bids if mismatch argument `nodeAddresses` provided ", async function () {
            const questionIds = [0,1]
            const nodeAddresses = [account0.address]
            const refundAmounts = [transferAmount1,transferAmount1]
    
            await expect(lithiumPricing.refundBids(questionIds,nodeAddresses,refundAmounts))
            .to.be.revertedWith("argument length mismatch")
          })
    
          it("Should not allow admin  to refund user bids amount if there is no node address to refund ", async function () {
            const questionIds = []
            const nodeAddresses = []
            const refundAmounts = []
    
            await expect(lithiumPricing.refundBids(questionIds,nodeAddresses,refundAmounts))
            .to.be.revertedWith("Node addresses length != 0")
          })
    
    
          it("Should not allow admin  to refund user bids amount if its done already ", async function () {
            const questionIds = [0,1]
            const nodeAddresses = [account0.address,account0.address]
            const refundAmounts = [transferAmount1,transferAmount1]
    
            const refundedBidTx = await expect(lithiumPricing.refundBids(questionIds,nodeAddresses,refundAmounts))
            refundedBidTx
              .emit(lithiumPricing,"BidRefunded")
              .withArgs(questionIds[0],nodeAddresses[0],refundAmounts[0])
    
            refundedBidTx
              .emit(lithiumPricing,"BidRefunded")
              .withArgs(questionIds[1],nodeAddresses[1],refundAmounts[1])
    
            await expect(lithiumPricing.refundBids(questionIds,nodeAddresses,refundAmounts))
            .to.be.revertedWith("Wsidom node already refunded")
          })

          it("Should not allow admin  to refund user bids amount if refund amount more than user bid amount ", async function () {
            const questionIds = [0,1]
            const nodeAddresses = [account0.address,account0.address]
            const refundAmounts = [transferAmount1.add(100),transferAmount1.add(100)]
    
            await expect(lithiumPricing.refundBids(questionIds,nodeAddresses,refundAmounts))
            .to.be.revertedWith("Refund > bid amount")
          })
        })

      describe("Reward Mechanism ", async () => {
        beforeEach(async () => {
          const questionGroupId = 0;
          const stakeAmounts = [stakeAmount, stakeAmount];
          const answerIndexes = [1, 1];
          await lithiumPricing
            .connect(account1)
            .answerQuestions(questionGroupId, stakeAmounts, answerIndexes);

          const one_minute = 60 * 60;
          await ethers.provider.send("evm_increaseTime", [one_minute]);
          await ethers.provider.send("evm_mine");
        });

        it("Should be able to update final answer status", async () => {
          const questionIds = [0, 1];
          const answersStatuses = [1, 1];
          const answerHashes = [getBytes32FromMultiash(mockIpfsHash),getBytes32FromMultiash(mockIpfsHash)]
          //Before updating final answer status
          const beforeUpdatingAnswerStatusquestion1 =
            await lithiumPricing.getQuestion(questionIds[0]);
          
          expect(beforeUpdatingAnswerStatusquestion1.answerHashIdxs.length).to.equal(
            0
          );

          expect(
            beforeUpdatingAnswerStatusquestion1.isAnswerCalculated
          ).to.equal(0);

          const beforeUpdatingAnswerStatusquestion2 =
            await lithiumPricing.getQuestion(questionIds[1]);
          expect(beforeUpdatingAnswerStatusquestion2.answerHashIdxs.length).to.equal(
              0
            );
  
          expect(
            beforeUpdatingAnswerStatusquestion2.isAnswerCalculated
          ).to.equal(0);


          await expect(
            lithiumPricing.updateValidAnswerStatus(
              questionIds,
              answerHashes
            )
          )    
          .emit(lithiumPricing, "FinalAnswerCalculatedStatus")
          .withArgs(
            questionIds[0],
            answerHashes[0].digest,
            answerHashes[0].hashFunction,
            answerHashes[0].size,
            answersStatuses[0]
          )

          .emit(lithiumPricing, "FinalAnswerCalculatedStatus")
          .withArgs(
            questionIds[1],
            answerHashes[1].digest,
            answerHashes[1].hashFunction,
            answerHashes[1].size,
            answersStatuses[1]
          ) 

          const afterUpdatingAnswerStatusquestion1 =
            await lithiumPricing.getQuestion(questionIds[0]);


          const multihashIdx1 = afterUpdatingAnswerStatusquestion1.answerHashIdxs[0];
          const multihash1 = await lithiumPricing.answerHashes(multihashIdx1)
          const expectedIpfsHash1 = getMultihashFromBytes32(multihash1);

          expect(expectedIpfsHash1).to.equal(mockIpfsHash);

          expect(
            [multihash1.digest,
            multihash1.hashFunction,
            multihash1.size]).
            to.eql(
            [answerHashes[0].digest,answerHashes[0].hashFunction,answerHashes[0].size]
          );

          expect(
            afterUpdatingAnswerStatusquestion1.isAnswerCalculated
          ).to.equal(1);

          const afterUpdatingAnswerStatusquestion2 =
            await lithiumPricing.getQuestion(questionIds[1]);

          const multihashIdx2 = afterUpdatingAnswerStatusquestion2.answerHashIdxs[0];
          const multihash2 = await lithiumPricing.answerHashes(multihashIdx2)
          const expectedIpfsHash2 = getMultihashFromBytes32(multihash2);
  
          expect(expectedIpfsHash2).to.equal(mockIpfsHash);
          expect(
            [multihash2.digest,
            multihash2.hashFunction,
            multihash2.size]).
          to.eql(
            [answerHashes[1].digest,answerHashes[1].hashFunction,answerHashes[1].size]
          );
          expect(
            afterUpdatingAnswerStatusquestion2.isAnswerCalculated
          ).to.equal(1);
        });

        it("Should be able to add answer hashes to valid questions", async () => {
          const questionIds = [0, 1];
          const answerHashes = [getBytes32FromMultiash(mockIpfsHash),getBytes32FromMultiash(mockIpfsHash)]

          await lithiumPricing.updateValidAnswerStatus(
            questionIds,
            answerHashes
          )

          await expect(
            lithiumPricing.addAnswerHash(
              questionIds,
              answerHashes
            )
          )    
          .emit(lithiumPricing, "QuestionAnswerAdded")
          .withArgs(
            questionIds[0],
            answerHashes[0].digest,
            answerHashes[0].hashFunction,
            answerHashes[0].size
          )

          .emit(lithiumPricing, "QuestionAnswerAdded")
          .withArgs(
            questionIds[1],
            answerHashes[1].digest,
            answerHashes[1].hashFunction,
            answerHashes[1].size
          ) 

          const afterUpdatingAnswerStatusquestion1 =
            await lithiumPricing.getQuestion(questionIds[0]);


          const multihashIdxs1 = afterUpdatingAnswerStatusquestion1.answerHashIdxs
          expect(multihashIdxs1.length).to.equal(2);

          const multihash1_2 = await lithiumPricing.answerHashes(multihashIdxs1[1])
          const expectedIpfsHash1_2 = getMultihashFromBytes32(multihash1_2);
          expect(expectedIpfsHash1_2).to.equal(mockIpfsHash);

          expect(
            [multihash1_2.digest,
              multihash1_2.hashFunction,
              multihash1_2.size]).
            to.eql(
            [answerHashes[0].digest,answerHashes[0].hashFunction,answerHashes[0].size]
          );

          const afterUpdatingAnswerStatusquestion2 =
            await lithiumPricing.getQuestion(questionIds[1]);

          const multihashIdxs2 = afterUpdatingAnswerStatusquestion2.answerHashIdxs;
          expect(multihashIdxs2.length).to.equal(2);
          const multihash2_2 = await lithiumPricing.answerHashes(multihashIdxs2[1])
          const expectedIpfsHash2 = getMultihashFromBytes32(multihash2_2);
  
          expect(expectedIpfsHash2).to.equal(mockIpfsHash);
          expect(
            [multihash2_2.digest,
              multihash2_2.hashFunction,
              multihash2_2.size]).
          to.eql(
            [answerHashes[1].digest,answerHashes[1].hashFunction,answerHashes[1].size]
          );
          expect(
            afterUpdatingAnswerStatusquestion2.isAnswerCalculated
          ).to.equal(1);
        });

        it("Should not be able to add answer hashes to not calculated questions", async () => {
          const questionIds = [0, 1];
          const answerHashes = [getBytes32FromMultiash(mockIpfsHash),getBytes32FromMultiash(mockIpfsHash)]


          await expect(
            lithiumPricing.addAnswerHash(
              questionIds,
              answerHashes
            )
          ).to.be.revertedWith("Question must be calculated");    
        

          const afterUpdatingAnswerStatusquestion1 =
            await lithiumPricing.getQuestion(questionIds[0]);


          const multihashIdxs1 = afterUpdatingAnswerStatusquestion1.answerHashIdxs
          expect(multihashIdxs1.length).to.equal(0);
  
        });

        it("Should not allow non admins to add answer hashes to valid questions", async () => {
          const questionIds = [0, 1];
          const answerHashes = [getBytes32FromMultiash(mockIpfsHash),getBytes32FromMultiash(mockIpfsHash)]


          await expect(
            lithiumPricing.connect(account2).addAnswerHash(
              questionIds,
              answerHashes
            )
          ).to.be.revertedWith("Must be admin");    
        

          const afterUpdatingAnswerStatusquestion1 =
            await lithiumPricing.getQuestion(questionIds[0]);


          const multihashIdxs1 = afterUpdatingAnswerStatusquestion1.answerHashIdxs
          expect(multihashIdxs1.length).to.equal(0);
  
        });

        it("Should able to update final answer status as invalid", async () => {
          const nullMultihash = {
            digest: '0x0000000000000000000000000000000000000000000000000000000000000000',
            hashFunction: 0,
            size: 0
          }
          const questionIds = [0, 1];
          const answersStatuses = [2,2]
          //Before updating final answer status
          const beforeUpdatingAnswerStatusquestion1 =
            await lithiumPricing.getQuestion(questionIds[0]);
          
          expect(beforeUpdatingAnswerStatusquestion1.answerHashIdxs.length).to.equal(
            0
          );

          expect(
            beforeUpdatingAnswerStatusquestion1.isAnswerCalculated
          ).to.equal(0);

          const beforeUpdatingAnswerStatusquestion2 =
            await lithiumPricing.getQuestion(questionIds[1]);
          expect(beforeUpdatingAnswerStatusquestion2.answerHashIdxs.length).to.equal(
              0
            );
  
          expect(
            beforeUpdatingAnswerStatusquestion2.isAnswerCalculated
          ).to.equal(0);

          await expect(
            lithiumPricing.updateInvalidAnswerStatus(
              questionIds
            )
          ) 
          .emit(lithiumPricing, "FinalAnswerCalculatedStatus")
          .withArgs(
            questionIds[0],
            nullMultihash.digest,
            nullMultihash.hashFunction,
            nullMultihash.size,
            answersStatuses[0]
          )

          .emit(lithiumPricing, "FinalAnswerCalculatedStatus")
          .withArgs(
            questionIds[1],
            nullMultihash.digest,
            nullMultihash.hashFunction,
            nullMultihash.size,
            answersStatuses[1]
          ) 

          const afterUpdatingAnswerStatusquestion1 =
            await lithiumPricing.getQuestion(questionIds[0]);


          const multihash1Count = afterUpdatingAnswerStatusquestion1.answerHashIdxs.length;
          expect(multihash1Count).to.equal(0)
  

          expect(
            afterUpdatingAnswerStatusquestion1.isAnswerCalculated
          ).to.equal(2);

          const afterUpdatingAnswerStatusquestion2 =
            await lithiumPricing.getQuestion(questionIds[1]);

          const multihash2Count = afterUpdatingAnswerStatusquestion2.answerHashIdxs.length;
  
          expect(multihash2Count).to.equal(0);

          expect(
            afterUpdatingAnswerStatusquestion2.isAnswerCalculated
          ).to.equal(2);
        });

        it("Should not allow non admin to update final answer status ", async () => {
          const questionIds = [0, 1];
          const answerHashes = [getBytes32FromMultiash(mockIpfsHash),getBytes32FromMultiash(mockIpfsHash)]
          await expect(
            lithiumPricing
              .connect(account2)
              .updateValidAnswerStatus(
                questionIds,
                answerHashes
              )
          ).to.be.revertedWith("Must be admin");
        });

        it("Should not allow  admin to update final answer status if having invalid question id", async () => {
          //invalid question id here
          const questionIds = [0, 81];
          const answerHashes = [getBytes32FromMultiash(mockIpfsHash),getBytes32FromMultiash(mockIpfsHash)]

          await expect(
            lithiumPricing.updateValidAnswerStatus(
              questionIds,
              answerHashes
            )
          ).to.be.revertedWith("Invalid question id");
        });

        it("Should not  update final answer status if passing questionIds as empty array", async () => {
          const questionIds: number[] = [];
          const answerHashes :any[]= []
         
          await expect(
            lithiumPricing.updateValidAnswerStatus(
              questionIds,
              answerHashes
            )
          ).to.be.revertedWith("questionIds empty");
        });

        it("Should not update final answer status if having mismatched argument ", async () => {
          //invalid question id here
          const questionIds = [0, 1, 0];
          const answerHashes = [getBytes32FromMultiash(mockIpfsHash),getBytes32FromMultiash(mockIpfsHash)]
          await expect(
            lithiumPricing.updateValidAnswerStatus(
              questionIds,
              answerHashes
            )
          ).to.be.revertedWith("argument length mismatch");
        });

        it("Should not  update final answer status again ", async () => {
          //invalid question id here
          const questionIds = [0, 1];
          const answersStatuses = [1, 1];
          const answerHashes = [getBytes32FromMultiash(mockIpfsHash),getBytes32FromMultiash(mockIpfsHash)]
          await expect(
            lithiumPricing.updateValidAnswerStatus(
              questionIds,
              answerHashes
            )
          )
            .emit(lithiumPricing, "FinalAnswerCalculatedStatus")
            .withArgs(
              questionIds[0],
              answerHashes[0].digest,
              answerHashes[0].hashFunction,
              answerHashes[0].size,
              answersStatuses[0]
            )

            .emit(lithiumPricing, "FinalAnswerCalculatedStatus")
            .withArgs(
              questionIds[1],
              answerHashes[1].digest,
              answerHashes[1].hashFunction,
              answerHashes[1].size,
              answersStatuses[1]
            )

          await expect(
            lithiumPricing.updateValidAnswerStatus(
              questionIds,
              answerHashes
            )
          ).to.be.revertedWith("Answer is calculated");
        });

        it("Should not  update reward amounts if answer is not calculated ", async () => {
          const addressesToUpdate = [account1.address];
          const groupIds = [0];
          const rewardAmounts = [2];
          await expect(
            lithiumPricing.updateGroupRewardAmounts(
              addressesToUpdate,
              groupIds,
              rewardAmounts
            )
          ).to.be.revertedWith("Answer not calculated");
        });

        describe("Update Group Reward Amounts", async () => {
          beforeEach(async () => {
            const questionIds = [0, 1];
            const answerHashes = [getBytes32FromMultiash(mockIpfsHash),getBytes32FromMultiash(mockIpfsHash)]
            await lithiumPricing.updateValidAnswerStatus(
              questionIds,
              answerHashes
            );
          });

          it("Should allow adimn  to update reward amounts ", async () => {
            const addressesToUpdate = [account1.address];
            const groupIds = [0];
            const rewardAmounts = [2];
            await expect(
              lithiumPricing.updateGroupRewardAmounts(
                addressesToUpdate,
                groupIds,
                rewardAmounts
              )
            )
              .emit(lithiumPricing, "GroupRewardUpdated")
              .withArgs(addressesToUpdate, groupIds, rewardAmounts);
          });

          it("Should not allow non-adimn  to update reward amounts ", async () => {
            const addressesToUpdate = [account1.address];
            const groupIds = [0];
            const rewardAmounts = [2];
            await expect(
              lithiumPricing
                .connect(account2)
                .updateGroupRewardAmounts(
                  addressesToUpdate,
                  groupIds,
                  rewardAmounts
                )
            ).to.be.revertedWith("Must be admin");
          });

          it("Should not  update reward amounts for mismatch params ", async () => {
            const addressesToUpdate = [account1.address, account2.address];
            const groupIds = [0];
            const rewardAmounts = [2];
            await expect(
              lithiumPricing.updateGroupRewardAmounts(
                addressesToUpdate,
                groupIds,
                rewardAmounts
              )
            ).to.be.revertedWith("Array mismatch");
          });

          it("Should not able to claim reward , if Answer Group Reward not calculated yet", async function () {
            const questionGroupId = 0;
            await expect(
              lithiumPricing.connect(account1).claimRewards([questionGroupId])
            ).to.be.revertedWith("Reward not calculated yet");
          });

          describe("Claim rewards for a answers group", function () {
            let addressesToUpdate: string[];
            let groupIds: number[];
            let rewardAmounts: number[];
            let questionGroupId: number;
            beforeEach(async () => {
              addressesToUpdate = [account1.address];
              groupIds = [0];
              rewardAmounts = [2];
              questionGroupId = 0;
              await lithiumPricing.updateGroupRewardAmounts(
                addressesToUpdate,
                groupIds,
                rewardAmounts
              );
            });

            it("Should be able to claim reward", async function () {
              const senderBalance = await lithToken.balanceOf(addressesToUpdate[0]);

              await expect(
                lithiumPricing.connect(account1).claimRewards([questionGroupId])
              ).emit(lithiumPricing, "RewardClaimed");
              const senderBalanceAfter = await lithToken.balanceOf(
                account1.address
              );

              expect(senderBalance.add(rewardAmounts[0])).to.equal(
                senderBalanceAfter
              );
            });

            it("Should not be able to claim reward again ", async function () {
              const senderBalance = await lithToken.balanceOf(addressesToUpdate[0]);

        
              await expect(
                lithiumPricing.connect(account1).claimRewards([questionGroupId])
              ).emit(lithiumPricing, "RewardClaimed");

              const senderBalanceAfter = await lithToken.balanceOf(
                account1.address
              );

              expect(senderBalance.add(rewardAmounts[0])).to.equal(
                senderBalanceAfter
              );

              await expect(
                lithiumPricing.connect(account1).claimRewards([questionGroupId])
              ).to.be.revertedWith("Group Rewards have already been claimed");
            });

            it("Should not be able to claim reward with invalid question Group Id ", async function () {
              const ids = [1];
              await expect(lithiumPricing.claimRewards([ids])).to.be.revertedWith(
                "Invalid question group id"
              );
            });
          });
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
      ).to.be.revertedWith("argument length mismatch");
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
      ).to.be.revertedWith("argument length mismatch");
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
      ).to.be.revertedWith("argument length mismatch");
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

    it("Should not allow non admins to set minimum stake ", async () => {
      const minimumStake = ethers.utils.parseUnits("10.0", 18);
      await expect(
        lithiumPricing.connect(account1).updateMinimumStake(minimumStake)
      ).to.be.revertedWith("Must be admin");
    });
  });

  describe("Tier Thresholds", () => {
    it("Should be set after deploy ", async () => {
      //minimum stake=10LITH tokens
      const thresholds = await lithiumPricing.getRevealTiers();
      const initialTierCount = 2;

      expect(thresholds.length).equal(initialTierCount);
    });

    it("Should allow admins to update tierThresholds", async () => {
      const newThresholds = [20, 100, 300];
      await expect(lithiumPricing.updateRevealTiers(newThresholds))
      .emit(lithiumPricing, "RevealTiersUpdated")
      .withArgs(newThresholds);

      const thresholds = await lithiumPricing["getRevealTiers()"]();
      expect(thresholds.length).equal(newThresholds.length);
      expect(thresholds[0]).equal(newThresholds[0])
      expect(thresholds[1]).equal(newThresholds[1])
    });

    it("Should not allow non admins update tierThresholds", async () => {
      const newThresholds = [20, 100, 300];    
      await expect(
        lithiumPricing.connect(account1).updateRevealTiers(newThresholds)
      ).to.be.revertedWith("Must be admin");
    });
  });
});
