var WalletTracker = artifacts.require("./WalletTracker.sol");

module.exports = function(deployer) {
  // Deploy the WalletTracker contract as our only task
  deployer.deploy(WalletTracker, "0xYourTrackedWalletAddress");
};

