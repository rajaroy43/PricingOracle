// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC777Token standard as defined in the EIP.
 *
 * This contract uses the
 * https://eips.ethereum.org/EIPS/eip-1820[ERC1820 registry standard] to let
 * token holders and recipients react to token movements by using setting implementers
 * for the associated interfaces in said registry. See {IERC1820Registry} and
 * {ERC1820Implementer}.
 */
interface ILithiumPricing {
  enum AnswerStatus { Unclaimed, Claimed }

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
    uint256 endTime
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

  function createQuestion (
    uint16 categoryId,
    uint256 bounty,
    uint256 pricingTime,
    uint256 endTime,
    string memory description,
    uint256[] memory answerSet
  ) external;

  function answerQuestions (
    uint256[] memory questionIds,
    uint256[] memory stakeAmounts,
    uint16[] memory answerIndexes
  ) external;

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

  function claimRewards (
    uint256[] memory questionIds
  ) external;

  event QuestionCreated (
    uint256 id,
    uint256 bounty,
    uint256 pricingTime,
    uint256 endTime,
    uint16 categoryId,
    address owner,
    string description,
    uint256[] answerSet
  );

  event QuestionAnswered (
    uint256 questionId,
    address answerer,
    uint256 stakeAmount,
    uint16 answerIndex
  );

  event AnswerGroupSetSubmitted (
  address answerer,
  uint256[] questionIds
);

  event RewardClaimed(uint256 questionId, address answerer, uint256 rewardAmount);

}