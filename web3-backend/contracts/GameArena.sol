// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./AQToken.sol";
import "./HeroNFT.sol";

/**
 * @title GameArena
 * @dev Contrato principal central de jugabilidad.
 * Permite "entrenar" bloqueando el NFT a cambio de subir stats y recibir AQTokens.
 */
contract GameArena is Ownable {
    AQToken public aqToken;
    HeroNFT public heroNft;

    uint256 public constant TRAINING_DURATION = 1 minutes; 
    uint256 public constant REWARD_AMOUNT = 100 * 10 ** 18; 

    struct TrainingSession {
        uint256 tokenId;
        uint256 startTime;
        bool isTraining;
    }

    mapping(address => TrainingSession) public activeSessions;

    event TrainingStarted(address indexed user, uint256 indexed tokenId, uint256 startTime);
    event TrainingEnded(address indexed user, uint256 indexed tokenId, uint256 reward, uint256 newLevel);

    constructor(address _aqToken, address _heroNft) Ownable(msg.sender) {
        aqToken = AQToken(_aqToken);
        heroNft = HeroNFT(_heroNft);
    }

    function startTraining(uint256 tokenId) external {
        require(heroNft.ownerOf(tokenId) == msg.sender, "No eres el dueno de este Heroe");
        require(!activeSessions[msg.sender].isTraining, "Ya tienes un heroe entrenando");

        heroNft.transferFrom(msg.sender, address(this), tokenId);
        
        activeSessions[msg.sender] = TrainingSession({ tokenId: tokenId, startTime: block.timestamp, isTraining: true });
        emit TrainingStarted(msg.sender, tokenId, block.timestamp);
    }

    function endTraining() external {
        TrainingSession memory session = activeSessions[msg.sender];
        require(session.isTraining, "No tienes un entrenamiento activo");
        require(block.timestamp >= session.startTime + TRAINING_DURATION, "El entrenamiento aun no ha terminado");

        delete activeSessions[msg.sender];

        HeroNFT.HeroStats memory stats = heroNft.getHeroStats(session.tokenId);
        uint256 newLevel = stats.level + 1;
        uint256 newAttack = stats.attack + 5;
        uint256 newDefense = stats.defense + 5;
        uint256 newExperience = stats.experience + 100;

        heroNft.updateHeroStats(session.tokenId, newAttack, newDefense, newLevel, newExperience);
        aqToken.mint(msg.sender, REWARD_AMOUNT);
        heroNft.transferFrom(address(this), msg.sender, session.tokenId);

        emit TrainingEnded(msg.sender, session.tokenId, REWARD_AMOUNT, newLevel);
    }
}
