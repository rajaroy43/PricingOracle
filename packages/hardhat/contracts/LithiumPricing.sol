pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC777/IERC777.sol";
import "./Roles.sol";
import "./ILithiumPricing.sol";
import "./ILithiumReward.sol";

/**
 * @title LithiumPricing
 * Based on https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/examples/SimpleToken.sol
 */
contract LithiumPricing is ILithiumPricing, Roles {
  IERC777 LithToken;
  ILithiumReward lithiumReward;

  string[] categories; 

  struct Question {
    address owner;
    uint256 id;
    uint256 categoryId;
    string description;
    uint256[] answerSet;
    uint256 answerCount;
    uint256[] answerSetTotals;
    uint256 finalAnswerIndex;
    uint256 bounty;
    uint256 totalStaked;
    uint256 endTime;
  }

  struct Answer {
    address answerer;
    uint256 id;
    uint256 questionId;
    uint256 answerIndex;
    uint256 stakeAmount;
    AnswerStatus status;
  }

  Question[] questions;

  // questionId => answerer => Answer
  mapping(uint256 => mapping(address => Answer)) public answers;

  constructor () {
    string memory preIPO = "preIPO";
    categories.push(preIPO);
  }

  /**
  * @dev Sets the address of the LithToken.
  *
  * Requirements
  *
  * - the caller must be an admin.
  */
  function setLithTokenAddress(address _tokenAddress) public {
    require(isAdmin(msg.sender), "Must be admin to set token address");
    LithToken = IERC777(_tokenAddress);
  }

  /**
  * @dev Sets the address of the LithiumReward.
  *

  */
  function setLithiumRewardAddress(address _rewardAddress) public {
    require(isAdmin(msg.sender), "Must be admin to set token address");
    lithiumReward = ILithiumReward(_rewardAddress);
  }

  /**
    * @dev Checks if an answer set is valid
    *
    * A valid answer set must have at least one value greater than zero and
    * must be in ascending order
    * `operatorData`. See {IERC777Sender} and {IERC777Recipient}.
    *
    * Emits a {Sent} event.
    *
    * Requirements
    *
    * - the caller must have at least `amount` tokens.
    * - `recipient` cannot be the zero address.
    * - if `recipient` is a contract, it must implement the {IERC777Recipient}
    * interface.
    */
  function isValidAnswerSet(uint256[] memory answerSet) internal pure {
    require(answerSet[0] != 0, "Zero cannot be in answer set");
    if (answerSet.length > 1) {
      for (uint256 i = 1; i < answerSet.length; i++) {
        require(answerSet[i] > answerSet[i-1], "Answers must be in ascending order");        
      }
    }
  }

  /**
  * @dev Adds a Question to contract storage.
  *
  * the `bounty` is amount of tokens the questioner is offering for pricing information
  * the `description` is a description of the asset to price
  * the `endtime` is when all voting stops and votes are tallied and payouts become eligible
  * the `answerSet` is any array of values that represent less than or greater than prices
  *   For example, an array of [5] indicates the price can be <= OR > 5.
  *   A 0 is appended to the answer set to represent > the highest value
  *
  * Emits a { QuestionCreated } event.
  *
  * Requirements
  *
  * - the caller must have at least `bounty` tokens.
  * - the answer set must be valid (see isValidAnswerSet).
  * - the `endtime` must be in the future
  */
  function createQuestion(
    uint256 bounty,
    string memory description,
    uint256 endTime,
    uint256[] memory answerSet
  ) external override {
    require(endTime > block.timestamp, "Endtime must be in the future");
    require(LithToken.balanceOf(msg.sender) >= bounty, "Insufficient balance");

    LithToken.operatorSend(msg.sender, address(this), bounty, "", "");
    uint256 id = questions.length;
    Question memory question;
    question.id = id;
    question.owner = msg.sender;
    question.description =  description;
    question.answerSet = answerSet;
    question.answerCount = answerSet.length + 1;
    question.endTime = endTime;
    question.finalAnswerIndex = 0;
    questions.push(question);
    
    Question storage storedQuestion = questions[id];
    storedQuestion.answerSet.push(0);
    
    emit QuestionCreated(id, question.owner, description, storedQuestion.answerSet, endTime);
  }

  /**
  * @dev Adds an Answer to contract storage.
  *
  * the `stakeAmount` for the answer will be added to totalStake for the question
  * and the answerSetTotal for the `answerIndex`
  *
  * Emits a { QuestionAnswered } event.
  *
  * Requirements
  *
  * - the caller must have at least `stakeAmount` tokens.
  * - `stakeAmount` must be greater than zero.
  * - the answerIndex must correspond to a valid answer(see isValidAnswerSet).
  * - the `endtime` must be in the future
  */
  function answerQuestion(
    uint256 _questionId,
    uint256 _answerIndex,
    uint256 _stakeAmount
  ) internal {
    Question storage question = questions[_questionId];
    require(question.endTime > block.timestamp, "Question is not longer active");
    require(_answerIndex <= question.answerCount, "Invalid answer index");
    require(_stakeAmount > 0, "Stake amount must be greater than zero");
    require(LithToken.balanceOf(msg.sender) >= _stakeAmount, "Insufficient balance");
    
    LithToken.operatorSend(msg.sender, address(this), _stakeAmount, "", "");

    uint256 id = questions.length;

    Answer memory answer;
    answer.id = id;
    answer.answerer = msg.sender;
    answer.questionId = question.id;
    answer.answerIndex = _answerIndex;
    answer.stakeAmount = _stakeAmount;
    answer.status = AnswerStatus.Unclaimed;

    answers[_questionId][msg.sender] = answer;

    question.totalStaked = question.totalStaked + _stakeAmount;
    question.answerSetTotals[_answerIndex] = question.answerSetTotals[_answerIndex] + _stakeAmount;

    emit QuestionAnswered(id, answer.questionId, answer.answerer, _answerIndex, _stakeAmount);

  }

  function answerQuestions (
    uint256[] memory questionIds,
    uint256[] memory answerIndexes,
    uint256[] memory stakeAmounts
  ) external override {
    for (uint256 i = 0; i < questionIds.length; i++) {
      answerQuestion(questionIds[i], answerIndexes[i], stakeAmounts[i]);
    }
  }

  function getQuestion (
    uint256 _id
  ) external view override returns (
    address owner,
    uint256 id,
    uint256 categoryId,
    string memory description,
    uint256[] memory answerSet,
    uint256 answerCount,
    uint256[] memory answerSetTotals,
    uint256 finalAnswerIndex,
    uint256 bounty,
    uint256 totalStaked,
    uint256 endTime
  ) {
    Question storage question = questions[_id];
    owner = question.owner;
    id = question.id;
    categoryId = question.categoryId;
    description = question.description;
    answerSet = question.answerSet;
    answerCount = question.answerCount;
    answerSetTotals = question.answerSetTotals;
    finalAnswerIndex = question.finalAnswerIndex;
    bounty = question.bounty;
    totalStaked = question.totalStaked;
    endTime = question.endTime;
  }

  function getAnswer (
    uint256 _questionId,
    address _answerer
  ) external view override returns (
    address answerer,
    uint256 id,
    uint256 questionId,
    uint256 answerIndex,
    uint256 stakeAmount,
    AnswerStatus status
  ) {
    Answer storage answer = answers[_questionId][_answerer];
    answerer = answer.answerer;
    id = answer.id;
    questionId = answer.questionId;
    answerIndex = answer.answerIndex;
    stakeAmount = answer.stakeAmount;
    status = answer.status;
  }

  function getAnswerSetTotals (
    uint256 _questionId
  ) external view override returns (
    uint256[] memory
  ) {
    return questions[_questionId].answerSetTotals;
  }

  function getAnswerSet (
    uint256 _questionId
  ) external view override returns (
    uint256[] memory
  ) {
    return questions[_questionId].answerSet;
  }

  function getRewardTotal (
    uint256 _questionId
  ) external view override returns (
    uint256
  ) {
    Question storage question = questions[_questionId];

    return question.bounty + question.totalStaked;
  }    

  function claimReward (
    uint256 _questionId
  ) internal {
    Question storage question = questions[_questionId];
    require(question.endTime <= block.timestamp, "Question is still active and cannot be claimed");
    Answer storage answer = answers[_questionId][msg.sender];
    require(answer.status == AnswerStatus.Unclaimed, "Reward has already been claimed");

    uint256 reward = lithiumReward.getReward(_questionId, msg.sender);

    if (reward > 0) {
      answer.status = AnswerStatus.Claimed;
      LithToken.send(msg.sender, reward, "");

      emit RewardClaimed(_questionId, msg.sender, reward);
    }
  }

  function claimRewards (
    uint256[] memory questionIds
  ) external override {
    for (uint256 i = 0; i < questionIds.length; i++) {
      claimReward(questionIds[i]);
    }
  }
}
