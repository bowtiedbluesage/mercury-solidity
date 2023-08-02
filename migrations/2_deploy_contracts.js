var CoinFlipper = artifacts.require("./FlipCoin.sol");
var MockVRF = artifacts.require("./MockVRF.sol");
var MockLINK = artifacts.require("./MockLINK.sol");

module.exports = function(deployer) {
  // Deploy the MockVRF contract
  deployer.deploy(MockVRF).then(() => {
    // Deploy the MockLINK contract
    return deployer.deploy(MockLINK);
  }).then(() => {
    // Deploy the CoinFlipper contract with the address of the deployed MockVRF and MockLINK
    return deployer.deploy(CoinFlipper, MockVRF.address, MockLINK.address);
  });
};
