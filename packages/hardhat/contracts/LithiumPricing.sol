pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Roles.sol";
import "./ILithiumPricing.sol";
import "./ILithiumReward.sol";

/**
 * @title LithiumPricing
 */
contract LithiumPricing is ILithiumPricing, Roles {
  IERC20 LithiumToken;
  ILithiumReward lithiumReward;

  string[] categories; 

  struct Question {
    address owner; // question creator
    uint256 id; // uinique identifier
    uint256 categoryId; // related category id
    string description; // explanation of asset to price ex 'The price of LITH will be higher then'
    uint256[] answerSet; // the list of possible answers
    uint256[] answerSetTotals; // the total staked for each answer
    uint256 bounty; // to bounty offered by the questions creator in LITH tokens
    uint256 totalStaked; // the total staked by answeres in LITH token
    uint256 endTime; // the time answering ends relative to block.timestamp
  }

  struct Answer {
    address answerer; // the answer creator
    uint256 questionId; // the id of the question being answered
    uint256 stakeAmount; // the amount to stake in LITH token for the answer
    uint16 answerIndex; // the index of the chosen answer in the question.answerSet
    AnswerStatus status; // the status of the Answer, Unclaimed or Claimed
  }

  Question[] questions;

  // questionId => answerer => Answer
  mapping(uint256 => mapping(address => Answer)) public answers;

  event TokensReceived(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData);

  constructor () {
    string memory preIPO = "preIPO";
    categories.push(preIPO);
  }

  /**
  * @dev Sets the address of the LithiumToken.
  *
  * Requirements
  *
  * - the caller must be an admin.
  */
  function setLithiumTokenAddress(address _tokenAddress) public {
    require(isAdmin(msg.sender), "Must be admin to set token address");
    LithiumToken = IERC20(_tokenAddress);
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
  * the `categoryId` is the id for the related category
  * the `bounty` is amount of tokens the questioner is offering for pricing information
  * the `description` is a description of the asset to price, ex 'The price of LITH token will be higher then'
  * the `endtime` is when all voting stops and votes are tallied and payouts become eligible relative to the block.timestamp
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
    uint16 categoryId,
    uint256 bounty,
    uint256 endTime,
    string memory description,
    uint256[] memory answerSet
  ) external override {
    require(endTime > block.timestamp, "Endtime must be in the future");
    require(LithiumToken.balanceOf(msg.sender) >= bounty, "Insufficient balance");

    LithiumToken.transferFrom(msg.sender, address(this), bounty);
    uint256 id = questions.length;
    Question memory question;
    question.id = id;
    question.categoryId = categoryId;
    question.bounty = bounty;
    question.owner = msg.sender;
    question.description =  description;
    question.answerSet = answerSet;
    question.endTime = endTime;
    questions.push(question);
    
    Question storage storedQuestion = questions[id];
    storedQuestion.answerSet.push(0);
    for (uint256 i = 0; i < storedQuestion.answerSet.length; i++) {
      storedQuestion.answerSetTotals.push(0);
    }
    
    emit QuestionCreated(id, bounty, endTime, categoryId, question.owner, description, storedQuestion.answerSet);
  }

  /**
  * @dev Adds an Answer to contract storage.
  * the `questionId` is the id of the question being answered
  * the `stakeAmount` is the amount of LITH the answerer wants to stake on the answer
  * and it will be added to totalStake for the question
  * and the answerSetTotal for the `answerIndex`
  * the `answerIndex` is the index of the answer in the question.answerSet
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
    uint256 _stakeAmount,
    uint16 _answerIndex
  ) internal {
    require(_questionId < questions.length, "Invalid question id");
    Question storage question = questions[_questionId];
    require(question.endTime > block.timestamp, "Question is not longer active");
    require(_answerIndex <= question.answerSet.length, "Invalid answer index");
    require(_stakeAmount > 0, "Stake amount must be greater than zero");
    require(LithiumToken.balanceOf(msg.sender) >= _stakeAmount, "Insufficient balance");
    
    LithiumToken.transferFrom(msg.sender, address(this), _stakeAmount);

    Answer memory answer;
  
    answer.answerer = msg.sender;
    answer.questionId = _questionId;
    answer.answerIndex = _answerIndex;
    answer.stakeAmount = _stakeAmount;

    answers[_questionId][msg.sender] = answer;

    question.totalStaked = question.totalStaked + _stakeAmount;
    question.answerSetTotals[_answerIndex] = question.answerSetTotals[_answerIndex] + _stakeAmount;

    emit QuestionAnswered(_questionId, msg.sender, _stakeAmount, _answerIndex);

  }

  function answerQuestions (
    uint256[] memory questionIds,
    uint256[] memory stakeAmounts,
    uint16[] memory answerIndexes
  ) external override {
    for (uint256 i = 0; i < questionIds.length; i++) {
      answerQuestion(questionIds[i], stakeAmounts[i], answerIndexes[i]);
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
    uint256[] memory answerSetTotals,
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
    answerSetTotals = question.answerSetTotals;
    bounty = question.bounty;
    totalStaked = question.totalStaked;
    endTime = question.endTime;
  }

  function getAnswer (
    uint256 _questionId,
    address _answerer
  ) external view override returns (
    address answerer,
    uint256 questionId,
    uint16 answerIndex,
    uint256 stakeAmount,
    AnswerStatus status
  ) {
    Answer storage answer = answers[_questionId][_answerer];
    answerer = answer.answerer;
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

  /**
  * @dev Allow users to claim a reward for an answered question
  * the `questionId` is the id of the question to claim the reward for
  * the reward amount is determined by the LithiumReward contract
  * Emits a { RewardClaimed } event.
  *
  * Requirements
  *
  * - the caller must have answered the question
  */
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
      LithiumToken.transfer(msg.sender, reward);

      emit RewardClaimed(_questionId, msg.sender, reward);
    }
  }

    /**
  * @dev Allow users to claim rewards for answered questions
  * the `questionIds` is the ids of the questions to claim the rewards for
  *
  * Requirements
  *
  * - the caller must have answered the questions
  */

  function claimRewards (
    uint256[] memory questionIds
  ) external override {
    for (uint256 i = 0; i < questionIds.length; i++) {
      claimReward(questionIds[i]);
    }
  }
}
