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



// var CoinFlipper = artifacts.require("./FlipCoin.sol");
// var MockVRF = artifacts.require("./MockVRF.sol");

// module.exports = function(deployer) {
//   // First, deploy the MockVRF contract
//   deployer.deploy(MockVRF).then(() => {
//     // Then, deploy the CoinFlipper contract with the address of the deployed MockVRF
//     return deployer.deploy(CoinFlipper, MockVRF.address);
//   });
// };

// var CoinFlipper = artifacts.require("./FlipCoin.sol");
// var MockVRF = artifacts.require("./MockVRF.sol");

// module.exports = function(deployer) {
//   // Deploy the CoinFlipper contract
//   deployer.deploy(CoinFlipper, "0x7C5983ceCaE31B8F9Fc0CC968726c5848c797c74");
//   deployer.deploy(MockVRF, "")
// };

