const WalletTracker = artifacts.require('WalletTracker');
const { assert } = require('chai');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { BN } = require('@openzeppelin/test-helpers');

contract('WalletTracker', function(accounts) {
    let instance;
    const trackedWallet = accounts[0];
    const nonTrackedWallet = accounts[1];

    beforeEach(async function() {
        instance = await WalletTracker.new(trackedWallet);
    });

    it('should let the tracked wallet send a transaction', async function() {
        await instance.receive({ from: trackedWallet, value: web3.utils.toWei("1", "ether")});
        const transactionCount = await instance.getTransactionsCount();
        assert.equal(transactionCount, 1, "transaction count should be 1");
    });

    it('should reject a transaction from non-tracked wallet', async function() {
        try {
            await instance.receive({ from: nonTrackedWallet, value: web3.utils.toWei("1", "ether")});
            assert.fail("transaction should have been rejected");
        } catch (error) {
            assert.include(error.message, "Only the tracked wallet can interact with this contract.", "Expected revert error");
        }
    });

    it('should return transaction details correctly', async function() {
        await instance.receive({ from: trackedWallet, value: web3.utils.toWei("1", "ether")});
        const transaction = await instance.getTransaction(0);
        assert.equal(transaction.wallet, trackedWallet, "wallet address should match tracked wallet");
        assert(new BN(transaction.value).eq(web3.utils.toWei("1", "ether")), "transaction value should match sent value");
    });
});

