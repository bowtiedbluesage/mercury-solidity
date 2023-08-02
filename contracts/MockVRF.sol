// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract MockVRF is VRFConsumerBase {
    bytes32 public requestId;
    uint256 public lastRandomness;

    constructor() VRFConsumerBase(
        address(0), // Mock VRF Coordinator
        address(0)  // Mock LINK Token
    ) {}

    function fulfillRandomness(bytes32 _requestId, uint256 randomness) internal override {
        // Save the randomness for testing
        lastRandomness = randomness;

        // Optionally, you can emit an event here to notify off-chain
        // systems that the randomness was fulfilled
        emit RandomnessFulfilled(_requestId, randomness);
    }

    function testRequestRandomness(bytes32 _keyHash, uint256 _fee) public returns (bytes32) {
        requestId = super.requestRandomness(_keyHash, _fee);
        return requestId;
    }

    event RandomnessFulfilled(bytes32 requestId, uint256 randomness);
}
