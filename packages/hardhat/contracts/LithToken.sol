pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";


/**
 * @title Token
 * Based on https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/examples/SimpleToken.sol
 */
contract LithiumToken is ERC777 {
    uint256 constant DECIMALS = 10 ** 18;
    uint256 constant MILLION = 10 ** 6;
    uint256 constant MAX_SUPPLY = 21 * MILLION * DECIMALS;

    constructor (address[] memory defaultOperators) ERC777("Lithium Token", "LITH", defaultOperators) {
        _mint(msg.sender, MAX_SUPPLY, "", "");
    }
}
