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
  enum RewardCalculated{NotCalculated,Calculated}

  uint8 minAnswerSetLength = 2;
  uint8 maxAnswerSetLength = 2;

  bytes32[] categories; 

  struct Question {
    address owner; // question creator
    uint256 id; // uinique identifier
    uint256 categoryId; // related category id
    string description; // explanation of asset to price ex 'The price of LITH will be higher then'
    uint256[] answerSet; // the list of possible answers
    uint256[] answerSetTotalStaked; // the total staked for each answer
    uint256 bounty; // to bounty offered by the questions creator in LITH tokens
    uint256 totalStaked; // the sum of AnswerSetTotals in LITH token
    uint256 endTime; // the time answering ends relative to block.timestamp
    RewardCalculated isRewardCalculated;//reward status will be Updated by LithiumCordinator once deadline passed
    uint256 pricingTime;//Indicate when the asset should be priced for
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
// questionId => groupOfAnswerProvided
  mapping(uint256 =>  uint256[])  answerSetsGroups;
  // categoryId=> groupOfQuestion ids
  mapping(uint256=>uint256[]) questionSetsGroup;
  event CategoryAdded(
    uint256 id,
    string label
  );

  event RewardCalculatedStatus(
    uint256 questionId,
    RewardCalculated isupdated
  );

  event SetLithiumRewardAddress(
    address rewardAddress
  );

  event SetLithiumTokenAddress(
    address lithiumTokenAddress
  );

  constructor () {
    _addCategory("preIPO");
  }

    /**
  * @dev Adds new category
  *
  */
  function _addCategory(string memory _label) internal {
    bytes32 hash = keccak256(abi.encodePacked(_label));
    categories.push(hash);
    emit CategoryAdded(categories.length - 1,  _label);
  }

  /**
  * @dev public interface to add a new category
  *
  * Requirements
  *
  * - the caller must be an admin.
  */
  function addCategory(string memory _label) public {
    require(isAdmin(msg.sender), "Must be admin");
    _addCategory(_label);
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
    emit SetLithiumTokenAddress(address(LithiumToken));
  }

  /**
  * @dev Sets the address of the LithiumReward.
  *

  */
  function setLithiumRewardAddress(address _rewardAddress) public {
    require(isAdmin(msg.sender), "Must be admin to set token address");
    lithiumReward = ILithiumReward(_rewardAddress);
    emit SetLithiumRewardAddress(address(lithiumReward));
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
  function isValidAnswerSet(uint256[] memory answerSet) internal view {
    require(minAnswerSetLength <= answerSet.length && answerSet.length <= maxAnswerSetLength, "Answer Set length invalid");

    for (uint256 i = 1; i < answerSet.length; i++) {
      require(answerSet[i] > answerSet[i-1], "Answers must be in ascending order");        
    }

  }

  /**
  * @dev Adds a Question to contract storage.
  * the `categoryId` is the id for the related category
  * the `bounty` is amount of tokens the questioner is offering for pricing information
  * the `description` is a description of the asset to price, ex 'The price of LITH token will be higher then'
  * the `endtime` is when all voting stops and votes are tallied and payouts become eligible relative to the block.timestamp
  * the `answerSet` is an array of values that represent equal to or greater than prices in usd
  *   Each answer except for the last represents the statement 'equal to or greather than the selected value and less than the next value in the array'
  *   with the last value representing the statement 'equal to or greater than the selected value'
  *   For example, an answerSet for the questions 'Will the price of the dow be greater or less than $35,000'
  *   would be [0,35000]
  *   An answerSet for the question 'Will the price of the dow be less then $35,000, between $35,000 and $37,000, or greater than $37,000'
  *   would be [0,35000,37000]
  *
  * Emits a { QuestionCreated } event.
  *
  * Requirements
  *
  * - the caller must have at least `bounty` tokens.
  * - the answer set must be valid (see isValidAnswerSet).
  * - the `endtime` must be in the future
  * - the category id must be valid
  */
  function createQuestion(
    uint16 categoryId,
    uint256 bounty,
    uint256 pricingTime,
    uint256 endTime,
    string memory description,
    uint256[] memory answerSet
  ) external override {
    require(endTime > block.timestamp, "Endtime must be in the future");
    require(pricingTime>endTime,"Pricing time of asset must be greater than endtime");
    require(LithiumToken.balanceOf(msg.sender) >= bounty, "Insufficient balance");
    require(categories[categoryId] != 0, "Invalid categoryId");
    isValidAnswerSet(answerSet);

    LithiumToken.transferFrom(msg.sender, address(this), bounty);
    uint256 id = questions.length;
    uint256[] memory answerSetTotalStaked = new uint256[](answerSet.length);
    Question memory question;
    question.id = id;
    question.categoryId = categoryId;
    question.bounty = bounty;
    question.owner = msg.sender;
    question.description =  description;
    question.answerSet = answerSet;
    question.answerSetTotalStaked = answerSetTotalStaked;
    question.endTime = endTime;
    question.pricingTime = pricingTime;
    questions.push(question);
    questionSetsGroup[categoryId].push(id);
    emit QuestionCreated(id, bounty,pricingTime, endTime, categoryId, question.owner, description, answerSet);
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
    answerSetsGroups[_questionId].push(_answerIndex);
    question.totalStaked = question.totalStaked + _stakeAmount;
    question.answerSetTotalStaked[_answerIndex] = question.answerSetTotalStaked[_answerIndex] + _stakeAmount;

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
    uint256[] memory answerSetTotalStaked,
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
    answerSetTotalStaked = question.answerSetTotalStaked;
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
    return questions[_questionId].answerSetTotalStaked;
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

   /**
  * @dev Allow Lithium Coordinator to submit status of rewards 
  * the `questionId` is the id of the question to updated the status of reward
  *
  * Requirements
  *
  * - the caller must be admin of this contract
  * - endtime must be passed for answering question
  * - rewards can't be updated again with same question id
  * - question id must be valid 
  */

  function updateRewardCalculatedStatus(uint256 questionId)external{
    require(isAdmin(msg.sender),"Must be admin");
    require(questionId < questions.length, "Invalid question id");
    Question storage question = questions[questionId];
    require(question.endTime <= block.timestamp, "Question is still active and rewards can't be updated");
    require(question.isRewardCalculated==RewardCalculated.NotCalculated,"Rewards is already updated");
    question.isRewardCalculated= RewardCalculated.Calculated;
    emit RewardCalculatedStatus(questionId,question.isRewardCalculated);
  }

  function getAnswerGroups(uint256 questionId) public view returns(uint256[] memory){
    require(questionId < questions.length, "Invalid question id");
    return answerSetsGroups[questionId];
  }
  function getQuestionGroupsByCategory( uint16 categoryId) public view returns(uint256[] memory){
    require(categories[categoryId] != 0, "Invalid categoryId");
    return questionSetsGroup[categoryId];
  }
}
