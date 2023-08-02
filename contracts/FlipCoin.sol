// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract FlipCoin is VRFConsumerBase {
    enum Bet { Heads, Tails }
    struct Game {
        address payable player;
        uint256 amount;
        Bet bet;
        bool isProcessed;
    }

    bytes32 internal keyHash;
    uint256 internal fee;
    address public owner;
    Game[] public games;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function.");
        _;
    }

    constructor(address _vrfCoordinator, address _linkToken) VRFConsumerBase(_vrfCoordinator, _linkToken) {
        keyHash = 0xced103054e349b8dfb51352f0f8fa9b5d20dde3d06f9f43cb2b85bc64b238205;
        fee = 0.1 * 10 ** 18; // 0.1 LINK (varies by network)
        owner = msg.sender;
    }

    receive() external payable {
    }

    function bet(Bet betChoice) external payable {
        require(address(this).balance - msg.value >= msg.value * 2, "The contract doesn't have enough funds to pay out this bet.");
        games.push(Game(payable(msg.sender), msg.value, betChoice, false));
    }

    function flipCoin() external {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        require(games.length > 0, "No active games.");
        requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        Bet result = (randomness % 2 == 0) ? Bet.Heads : Bet.Tails;
        uint256 lastGameIndex = games.length - 1;
        Game storage lastGame = games[lastGameIndex];

        if (!lastGame.isProcessed) {
            if (result == lastGame.bet) {
                lastGame.player.transfer(lastGame.amount * 2);
            }

            lastGame.isProcessed = true;

            if (games.length > 1) {
                games[lastGameIndex] = games[games.length - 1];
            }
            games.pop();
        }
    }

    function withdrawFunds(uint256 amount) external onlyOwner {
        require(games.length == 0, "Can't withdraw while there are active games.");
        require(address(this).balance >= amount, "Not enough funds.");
        payable(owner).transfer(amount);
    }
}
