// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    address lastWaver;

    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }

    function wave(uint256 amount) public {
        lastWaver = msg.sender;
        totalWaves += amount;
        console.log("%s has waved!", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %s total waves! The last from %s", totalWaves, lastWaver);
        return totalWaves;
    }
}