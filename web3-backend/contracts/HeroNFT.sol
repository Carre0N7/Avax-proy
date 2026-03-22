// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HeroNFT
 * @dev Token ERC-721 para los personajes del juego. 
 * Incluye un struct nativo on-chain con estadisticas como ataque, defensa, nivel.
 */
contract HeroNFT is ERC721, Ownable {
    uint256 private _nextTokenId;

    struct HeroStats {
        uint256 attack;
        uint256 defense;
        uint256 level;
        uint256 experience;
    }

    mapping(uint256 => HeroStats) public heroes;
    mapping(address => bool) public authorizedMinters;

    constructor() ERC721("AVAX Quest Hero", "AQH") Ownable(msg.sender) {}

    modifier onlyMinter() {
        require(owner() == msg.sender || authorizedMinters[msg.sender], "HeroNFT: No estas autorizado");
        _;
    }

    function setMinter(address minter, bool status) external onlyOwner {
        authorizedMinters[minter] = status;
    }

    function getHeroStats(uint256 tokenId) external view returns (HeroStats memory) {
        require(_ownerOf(tokenId) != address(0), "HeroNFT: Error, heroe inexistente");
        return heroes[tokenId];
    }

    function mintHero(address to) external onlyMinter returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        heroes[tokenId] = HeroStats({ attack: 10, defense: 10, level: 1, experience: 0 });
        _mint(to, tokenId);
        return tokenId;
    }

    function updateHeroStats(
        uint256 tokenId, uint256 _attack, uint256 _defense, uint256 _level, uint256 _experience
    ) external onlyMinter {
        require(_ownerOf(tokenId) != address(0), "HeroNFT: Error, heroe inexistente");
        heroes[tokenId] = HeroStats({ attack: _attack, defense: _defense, level: _level, experience: _experience });
    }
}
