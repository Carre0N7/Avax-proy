// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title AQToken
 * @dev Token estándar ERC-20 para la economía de AVAX Quest.
 * Es minable y quemable. El "GameArena" tiene permisos de acuñación
 * para recompensar a los jugadores de manera descentralizada.
 */
contract AQToken is ERC20, ERC20Burnable, Ownable {
    mapping(address => bool) public authorizedMinters;

    constructor() ERC20("AVAX Quest Token", "AQT") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    modifier onlyMinter() {
        require(owner() == msg.sender || authorizedMinters[msg.sender], "AQToken: No estas autorizado para mintear");
        _;
    }

    function setMinter(address minter, bool status) external onlyOwner {
        authorizedMinters[minter] = status;
    }

    function mint(address to, uint256 amount) public onlyMinter {
        _mint(to, amount);
    }
}
