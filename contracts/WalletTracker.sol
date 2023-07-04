// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WalletTracker {
    // This struct represents a transaction made by a wallet
    struct WalletTransaction {
        address wallet;
        uint256 timestamp;
        uint256 value;
    }

    // This mapping maps an address to a list of transactions
    mapping(address => WalletTransaction[]) public transactions;

    // The address we are monitoring
    address public trackedWallet;

    constructor(address _trackedWallet) {
        trackedWallet = _trackedWallet;
    }

    // This function accepts ether and stores a record of the transaction
    function recordTransaction() external payable {
        require(msg.sender == trackedWallet, "Only the tracked wallet can interact with this contract.");
        transactions[msg.sender].push(WalletTransaction(msg.sender, block.timestamp, msg.value));
    }

    // This function returns the count of transactions made by the tracked wallet
    function getTransactionsCount() public view returns (uint256) {
        return transactions[trackedWallet].length;
    }

    // This function returns the i-th transaction made by the tracked wallet
    function getTransaction(uint256 i) public view returns (WalletTransaction memory) {
        require(i < transactions[trackedWallet].length, "Transaction index out of range.");
        return transactions[trackedWallet][i];
    }
}

