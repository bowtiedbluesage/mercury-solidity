// MockVRF.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract MockVRF is VRFConsumerBase {
    bytes32 public requestId;

    constructor() VRFConsumerBase(
        address(0), // Mock VRF Coordinator
        address(0)  // Mock LINK Token
    ) {}

    function fulfillRandomness(bytes32 _requestId, uint256 randomness) public {
        super.fulfillRandomness(_requestId, randomness);
    }

    function testRequestRandomness(bytes32 _keyHash, uint256 _fee) public returns (bytes32) {
        requestId = super.requestRandomness(_keyHash, _fee);
        return requestId;
    }
}
