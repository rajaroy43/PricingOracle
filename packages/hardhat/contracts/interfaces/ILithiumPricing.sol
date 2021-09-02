// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @title The interface for LithiumPricing
 * @notice The LithiumPricing facilitates creating Questions and Giving Answer asynchronously
 *
 */
interface ILithiumPricing {
  /* events */

  event QuestionCreated (
    uint256 id,
    uint256 bounty,
    uint256 pricingTime,
    uint256 endTime,
    uint16 categoryId,
    address owner,
    string description,
    uint256[] answerSet,
    QuestionType questionType

  );

  event QuestionGroupCreated (
    uint256 id,
    address owner,
    uint256[] questionIds
  );

  event QuestionAnswered (
    uint256 questionId,
    address answerer,
    uint256 stakeAmount,
    uint16 answerIndex
  );

  event AnswerGroupSetSubmitted (
  address answerer,
  uint256 questionSetId
);

  event MinimumStakeUpdated(uint256 minimumStake);

  event RewardClaimed(uint256 questionGroupId, address answerer, uint256 rewardAmount);

  event ReputationUpdated(address[] addressesToUpdate,uint256[] categoryIds,uint256[] reputationScores);

  event CategoryAdded(
    uint256 id,
    string label
  );

  event FinalAnswerCalculatedStatus(
    uint256 questionId,
    StatusCalculated isCalculated,
    uint256 finalAnswer
  );

  event SetLithiumRewardAddress(
    address rewardAddress
  );

  event SetLithiumTokenAddress(
    address lithiumTokenAddress
  );

  event GroupRewardUpdated(address[] addressesToUpdate,uint256[] groupIds,uint256[] rewardAmounts);

  /** Datatypes */
  enum AnswerStatus { Unclaimed, Claimed }
  enum StatusCalculated{NotCalculated,Calculated}
  enum QuestionType{ Pricing, GroundTruth }
  /** Getter Functions */

  /**
  * @dev Returns a Question.
  */
  function getQuestion (
    uint256 _id
  ) external view returns (
    address owner,
    uint256 id,
    uint256 categoryId,
    string memory description,
    uint256[] memory answerSet,
    uint256[] memory answerSetTotalStaked,
    uint256 bounty,
    uint256 totalStaked,
    uint256 endTime,
    uint256 pricingTime,
    QuestionType questionType
  ); 

  /**
    * @dev Returns an Answer.
    */
  function getAnswer (
    uint256 _questionId,
    address _answerer
  ) external view returns (
    address answerer,
    uint256 questionId,
    uint16 answerIndex,
    uint256 stakeAmount,
    AnswerStatus status
  );

 function getAnswerGroup (
    uint256 _groupId,
    address _answerer
  ) external view returns (
    address answerer,
    uint256 questionGroupId,
    uint16[] memory answerIndexes,
    uint256 stakeAmount,
    AnswerStatus status,
    uint256 rewardAmount
  ) ;
  
  function getAnswerSetTotals (
    uint256 questionId
  ) external view returns (
    uint256[] memory
  );

  function getAnswerSet (
    uint256 _questionId
  ) external view returns (
    uint256[] memory
  );

  function getRewardTotal (
    uint256 _questionId
  ) external view returns (
    uint256
  );


/* External Functions */

  function updateFinalAnswerStatus(
    uint256 questionId, 
    uint256 answer
    )external;

  function updateReputation(
    address[] memory addressesToUpdate,
    uint256[] memory categoryIds,
    uint256[] memory  reputationScores
    ) external;
  
  function updateMinimumStake (
    uint256 _minimumStake
    )external;

  function updateGroupRewardAmounts(
    address[] memory addressesToUpdate,
    uint256[] memory groupIds, 
    uint256[] memory rewardAmounts
    ) external;
  
  function createQuestion (
    uint16 categoryId,
    uint256 bounty,
    uint256 pricingTime,
    uint256 endTime,
    QuestionType questionType,
    string memory description,
    uint256[] memory answerSet
  ) external;

  function createQuestionGroup (
    uint16[] memory categoryIds,
    uint256[] memory bounties,
    uint256[] memory pricingTimes,
    uint256[] memory endTimes,
    QuestionType[] memory questionTypes,
    string[] memory descriptions,
    uint256[][] memory answerSets
  ) external;

  function answerQuestions (
    uint256 questionGroupId,
    uint256[] memory stakeAmounts,
    uint16[] memory answerIndexes
  ) external;

  function claimRewards (
    uint256 questionGroupId
  ) external ;


}