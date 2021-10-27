// contracts/Roles.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Roles is AccessControlUpgradeable {

    function initialize() public virtual initializer{
        // Grant the contract deployer the default admin role: it will be able
        // to grant and revoke any roles
        __AccessControl_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function isAdmin(address _addr) public view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, _addr);
    }

    function grantAdminRole(address _addr) public {
        grantRole(DEFAULT_ADMIN_ROLE, _addr);
    }

    function revokeAdminRole(address _addr) public {
        revokeRole(DEFAULT_ADMIN_ROLE, _addr);
    }
}