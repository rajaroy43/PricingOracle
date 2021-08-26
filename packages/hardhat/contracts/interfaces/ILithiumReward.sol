pragma solidity ^0.8.0;

/**
 * @title LithiumReward
 * @notice Calculates the reward for a question answer.
 */
interface ILithiumReward {
 
  /** Getter Functions */
  
  function getReward (
    uint256 _questionId,
    address _answerer
  ) external view returns (
    uint256
  );

}
