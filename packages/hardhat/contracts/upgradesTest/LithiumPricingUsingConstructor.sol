pragma solidity ^0.8.0;

import "../LithiumPricing.sol";
/**
 * @title LithiumPricing
 */
contract LithiumPricingUsingConstructor is LithiumPricing  {

  constructor() {
    Roles.initialize();
    _addCategory("preIPO");
    minAnswerSetLength = 2;
    maxAnswerSetLength = 2;
  }
}

