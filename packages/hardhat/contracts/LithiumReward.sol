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
 
  function calculateReward(uint256 userStake,uint256 rewardAmount) internal pure returns (uint256) {
    return userStake * rewardAmount;
  }
  
  //get reward per answerGroup
  function getReward(
    uint256 _groupId,
    address _answerer
  ) external view override returns (
    uint256
  ) {

    ( address answerer,
      ,
      ,
      ,
      ,
      uint256 rewardAmount,
      
    ) = lithiumPricing.getAnswerGroup(_groupId, _answerer);
    
    require(answerer != address(0),"User haven't submit answer");
    uint256 rewardValue = rewardAmount;

    return rewardValue;
  }

}
