// contracts/Roles.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Roles is AccessControl {

    constructor() {
        // Grant the contract deployer the default admin role: it will be able
        // to grant and revoke any roles
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