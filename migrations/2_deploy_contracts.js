var WalletTracker = artifacts.require("./WalletTracker.sol");

module.exports = function(deployer) {
  // Deploy the WalletTracker contract as our only task
  deployer.deploy(WalletTracker, "0x7C5983ceCaE31B8F9Fc0CC968726c5848c797c74");
};

