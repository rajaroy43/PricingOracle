pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC777/IERC777.sol";
import "./Roles.sol";
/**
 * @title LithiumPricing
 * Based on https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/examples/SimpleToken.sol
 */
contract LithiumPricing is Roles{
  enum AnswerStatus { Unclaimed, Claimed }

  IERC777 LithToken;

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

  event QuestionCreated(uint256 id, address owner, string description, uint256[] answerOptions, uint256 endTime);

  event QuestionActive(uint256 id);

  event QuestionAnswered(uint256 id, uint256 questionId, address answerer, uint256 answerIndex, uint256 stakeAmount);

  event RewardClaimed(uint256 questionId, address answerer, uint256 rewardAmount);

  constructor () {
    string memory preIPO = "preIPO";
    categories.push(preIPO);
  }

  /**
  * @dev Sets the address of the LithToken.
  *
  * If send or receive hooks are registered for the caller and `recipient`,
  * the corresponding functions will be called with `data` and empty
  * `operatorData`. See {IERC777Sender} and {IERC777Recipient}.
  *
  * Emits a {Sent} event.
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
  function createQuestion(uint256 bounty, string memory description, uint256 endTime, uint256[] memory answerSet) public {
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
  function recordAnswer(uint256 questionId, uint256 answerIndex, uint256 stakeAmount) internal {
    Question storage question = questions[questionId];
    require(question.endTime > block.timestamp, "Question is not longer active");
    require(answerIndex <= question.answerCount, "Invalid answer index");
    require(stakeAmount > 0, "Stake amount must be greater than zero");
    require(LithToken.balanceOf(msg.sender) >= stakeAmount, "Insufficient balance");
    
    LithToken.operatorSend(msg.sender, address(this), stakeAmount, "", "");

    uint256 id = questions.length;

    Answer memory answer;
    answer.id = id;
    answer.answerer = msg.sender;
    answer.questionId = question.id;
    answer.answerIndex = answerIndex;
    answer.stakeAmount = stakeAmount;
    answer.status = AnswerStatus.Unclaimed;

    question.totalStaked = question.totalStaked + stakeAmount;
    question.answerSetTotals[answerIndex] = question.answerSetTotals[answerIndex] + stakeAmount;

    emit QuestionAnswered(id, answer.questionId, answer.answerer, answerIndex, stakeAmount);

  }

  function answerQuestions(uint256[] memory questionIds, uint256[] memory answerIndexes, uint256[] memory stakeAmounts) public payable {
    for (uint256 i = 0; i < questionIds.length; i++) {
      recordAnswer(questionIds[i], answerIndexes[i], stakeAmounts[i]);
    }
  }

  function getTopAnswerValue(uint256 questionId) internal view returns(uint256) {
    Question storage question = questions[questionId];

    uint256[] storage answerSetTotals = question.answerSetTotals;

    uint256 topAnswerValue = 0;

    for (uint256 i = 0; i < answerSetTotals.length; i++) {

      if (answerSetTotals[i] > topAnswerValue) {
        topAnswerValue = answerSetTotals[i];
      }
    }

    return topAnswerValue;
  }

  function getReward(uint256 totalReward, uint256 userStake, uint256 totalAnswerStake) internal pure returns (uint256) {
    return totalReward * userStake / totalAnswerStake;
  }

  function claimReward(uint256 questionId) public {
    Question storage question = questions[questionId];
    require(question.endTime <= block.timestamp, "Question is still active and cannot be claimed");

    Answer storage answer = answers[questionId][msg.sender];

    uint256 topAnswerValue = getTopAnswerValue(questionId);
    uint256 userAnswerValue = question.answerSetTotals[answer.answerIndex];

    require(userAnswerValue == topAnswerValue, "Answer must be correct to claim reward");
    require(answer.status == AnswerStatus.Unclaimed, "Reward has already been claimed");

    answer.status = AnswerStatus.Claimed;

    uint256 rewardTotal = question.bounty + question.totalStaked;
    uint256 answerTotal = question.answerSetTotals[answer.answerIndex];
    uint256 rewardValue = getReward(rewardTotal, answer.stakeAmount, answerTotal);

    LithToken.send(msg.sender, rewardValue, "");

    emit RewardClaimed(questionId, msg.sender, rewardValue);
  }

  function claimRewards(uint256[] memory questionIds) public {
    for (uint256 i = 0; i < questionIds.length; i++) {
      claimReward(questionIds[i]);
    }
  }
}
