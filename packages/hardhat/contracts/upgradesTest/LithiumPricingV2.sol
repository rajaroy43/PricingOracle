pragma solidity ^0.8.0;

import "../LithiumPricing.sol";
/**
 * @title LithiumPricing
 */
contract LithiumPricingV2 is LithiumPricing {

  bool public isLithiumTokenSet;

  /**
  * @dev Sets the address of the LithiumToken.
  *
  * Requirements
  *
  * - the caller must be an admin.
  */
  function setLithiumTokenBool(address _tokenAddress) public{
    require(isAdmin(msg.sender), "Must be admin to set token address");
    require(_tokenAddress != NULL_ADDRESS,"Token Address can't be null");
    require(!isLithiumTokenSet ,"Already Lithium Token Set");
    LithiumToken = IERC20(_tokenAddress);
    isLithiumTokenSet = true;
    emit SetLithiumTokenAddress(address(LithiumToken));
  }
}
