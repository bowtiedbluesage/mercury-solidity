const CoinFlip = artifacts.require('FlipCoin');
const MockVRF = artifacts.require('MockVRF');
const { expect } = require('chai');
const { BN } = require('web3-utils');

require('chai')
  .use(require('chai-bn')(BN))
  .should();

contract('FlipCoin', (accounts) => {
let coinFlip;
let mockVRF;

before(async () => {
    try {
      mockVRF = await MockVRF.new(); // Deploy the mock VRF
      console.log('MockVRF deployed successfully.');
  
      // Deploy the CoinFlip contract with the mock VRF address for both _vrfCoordinator and _linkToken
      coinFlip = await CoinFlip.new(mockVRF.address, mockVRF.address);
      console.log('CoinFlip deployed successfully.');
  
      const balance = await web3.eth.getBalance(accounts[0]);
      console.log('Account[0] balance:', web3.utils.fromWei(balance, 'ether'), 'ether');

      // Send some Ether to the CoinFlip contract to ensure it has enough balance
      await web3.eth.sendTransaction({
        from: accounts[0],
        to: coinFlip.address,
        value: web3.utils.toWei('2', 'ether'),
      });
      console.log('Ether sent to CoinFlip successfully.');
    } catch (error) {
      console.error('An error occurred in the before hook:', error);
      throw error; // Re-throw the error so that the test fails
    }
  });
  

it('should allow the owner to withdraw funds', async () => {
    // Ensure there are no active games before the withdrawal
    const gamesLength = await coinFlip.games.length;
    expect(gamesLength).to.equal(0);
    // Check the owner's initial balance
    const owner = accounts[0];
    const initialBalance = new BN(await web3.eth.getBalance(owner));
    // Define withdrawal amount
    const withdrawalAmount = web3.utils.toWei('0.1', 'ether');
    // Ensure the contract has enough balance
    const contractBalance = new BN(await web3.eth.getBalance(coinFlip.address));
    expect(contractBalance).to.be.a.bignumber.gte(withdrawalAmount);
    // Withdraw funds
    await coinFlip.withdrawFunds(withdrawalAmount, { from: owner });
  
    // Check the owner's final balance
    const finalBalance = new BN(await web3.eth.getBalance(owner));
    expect(finalBalance).to.be.a.bignumber.gt(initialBalance);
    // Ensure the contract balance is reduced
    const finalContractBalance = new BN(await web3.eth.getBalance(coinFlip.address));
    expect(finalContractBalance).to.be.a.bignumber.equal(contractBalance.sub(new BN(withdrawalAmount)));
  });

it('should allow a player to bet', async () => {
    const player = accounts[1];
    const betAmount = web3.utils.toWei('0.1', 'ether');
    await coinFlip.bet(0, { from: player, value: betAmount });
    const game = await coinFlip.games(0);
    game.player.should.equal(player);
    expect(new BN(game.amount)).to.be.a.bignumber.equal(new BN(betAmount));
    expect(game.isProcessed).to.be.false;
});
  
//TO DO: implement a test for coinflipping itself. Potentially will need a mock for Link?

});
