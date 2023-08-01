const CoinFlip = artifacts.require('CoinFlip');
const MockVRF = artifacts.require('MockVRF');
const { expect } = require('chai');
const { BN } = require('web3-utils');

require('chai')
  .use(require('chai-bn')(BN))
  .should();

contract('CoinFlip', (accounts) => {
  let coinFlip;
  let mockVRF;

  before(async () => {
    mockVRF = await MockVRF.new(); // Deploy the mock VRF
    coinFlip = await CoinFlip.new(mockVRF.address); // Deploy the CoinFlip contract with the mock VRF address
  });

  it('should allow the owner to withdraw funds', async () => {
    const owner = accounts[0];
    const initialBalance = new BN(await web3.eth.getBalance(owner));
    await coinFlip.withdrawFunds(web3.utils.toWei('0.1', 'ether'), { from: owner });
    const finalBalance = new BN(await web3.eth.getBalance(owner));
    expect(finalBalance).to.be.a.bignumber.gt(initialBalance);
  });

  it('should allow a player to bet', async () => {
    const player = accounts[1];
    const betAmount = web3.utils.toWei('0.1', 'ether');
    await coinFlip.bet(0, { from: player, value: betAmount });
    const game = await coinFlip.games(0);
    game.player.should.equal(player);
    expect(new BN(game.amount)).to.be.a.bignumber.equal(new BN(betAmount));
    game.isProcessed.should.equal(false);
  });

  it('should flip a coin and process a game', async () => {
    const player = accounts[1];
    const betAmount = web3.utils.toWei('0.1', 'ether');
    await coinFlip.bet(0, { from: player, value: betAmount });

    // Flip the coin
    await coinFlip.flipCoin();

    // Get the requestId that was used
    const requestId = await mockVRF.requestId();

    // Manually fulfill randomness using the mock
    await mockVRF.fulfillRandomness(requestId, 1); // You can set your own randomness value

    // Check the result of the flip
    const game = await coinFlip.games(0);
    expect(game.isProcessed).to.be.true;
    // Additional assertions based on the game result
  });
});
