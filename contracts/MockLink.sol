// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockLINK is ERC20 {
    constructor() ERC20("Chainlink Token", "LINK") {
        // Mint initial supply
        _mint(msg.sender, 1000 * 10**18);
    }

    // Optional: Add a mint function to create more tokens during testing
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
