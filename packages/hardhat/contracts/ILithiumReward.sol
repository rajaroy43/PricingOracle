pragma solidity ^0.8.0;

/**
 * @title LithiumReward
 * Calculates the reward for a question answer.
 */
interface ILithiumReward {
 
  function getReward (
    uint256 _questionId,
    address _answerer
  ) external view returns (
    uint256
  );

}
