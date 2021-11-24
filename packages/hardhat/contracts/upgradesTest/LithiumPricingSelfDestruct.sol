pragma solidity ^0.8.0;


import "../LithiumPricing.sol";
/**
 * @title LithiumPricing
 */
contract LithiumPricingWithSelfDestruct is LithiumPricing  {

  function destroy(address payable fundReceiver) external  {
      isAdmin(msg.sender);
      selfdestruct(fundReceiver);      
  }
}

