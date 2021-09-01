pragma solidity ^0.8.0;

import "./interfaces/ILithiumPricing.sol";
import "./interfaces/ILithiumReward.sol";

/**
 * @title LithiumReward
 * Calculates the reward for a question answer.
 */
contract LithiumReward is ILithiumReward {
 
  ILithiumPricing lithiumPricing;

  constructor (address _pricingAddress) {
    lithiumPricing = ILithiumPricing(_pricingAddress);
  }
  //topAnswerIndex is the final answer index
  function getTopAnswerIndex (
    uint256[] memory answerSetTotalStaked
  ) internal pure returns (
    uint256
  ) {

    uint256 topAnswerValue = 0;
    uint256 topAnswerIndex = 0;

    for (uint256 i = 0; i < answerSetTotalStaked.length; i++) {

      if (answerSetTotalStaked[i] > topAnswerValue) {
        topAnswerValue = answerSetTotalStaked[i];
        topAnswerIndex  = i;
      }
    }

    return topAnswerIndex;
  }

  function calculateReward(uint256 totalReward, uint256 userStake, uint256 totalAnswerStake) internal pure returns (uint256) {
    return totalReward * userStake / totalAnswerStake;
  }
  
  //get rewrad per answerer
  function getReward(
    uint256 _questionId,
    address _answerer
  ) external view override returns (
    uint256
  ) {

    ( address answerer
      ,
      ,
      uint256 answerIndex,
      uint256 stakeAmount,
      
    ) = lithiumPricing.getAnswer(_questionId, _answerer);
    require(answerer != address(0),"User haven't submit answer");
    uint256[] memory answerSetTotalStaked = lithiumPricing.getAnswerSetTotals(_questionId);
    uint256 topAnswerIndex = getTopAnswerIndex(answerSetTotalStaked);

    require(topAnswerIndex == answerIndex, "Answer must be correct to claim reward");

    uint256 rewardTotal = lithiumPricing.getRewardTotal(_questionId);
    uint256 answerTotal = answerSetTotalStaked[answerIndex];
    uint256 rewardValue = calculateReward(rewardTotal, stakeAmount, answerTotal);

    return rewardValue;
  }

}
