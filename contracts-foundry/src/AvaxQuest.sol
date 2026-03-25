// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// MVP del contrato inteligente para AVAX Quest utilizando Foundry.
contract AvaxQuest is ERC721, Ownable {
    uint256 private _nextTokenId;

    uint256 public constant MAX_SUPPLY = 5000;
    uint256 public constant MINT_COST = 0.01 ether;
    uint256 public constant TRAIN_COOLDOWN = 1 minutes; // Cambiar a 12 hours para produccion

    enum HeroClass { Guerrero, Arquero, Mago }
    enum HeroRarity { Comun, Raro, Especial, Epico, Legendario, Mitico }

    struct HeroStats {
        string name;
        HeroClass heroClass;
        HeroRarity rarity;
        uint256 exp;
        uint256 level;
        uint256 attack;
        uint256 defense;
        uint256 lastTrainedAt;
    }

    mapping(uint256 => HeroStats) public heroes;

    constructor() ERC721("AVAX Quest Hero", "AQH") Ownable(msg.sender) {}

    /**
     * @dev Mintea un nuevo heroe asignandole stats basicas, rareza aleatoria y nombre.
     */
    function mintHero(string memory _name, HeroClass _class) external payable {
        require(_nextTokenId < MAX_SUPPLY, "Se ha alcanzado el suministro maximo");
        require(msg.value >= MINT_COST, "Ether insuficiente para mintear");

        uint256 tokenId = _nextTokenId++;
        
        // Pseudo-random generation for rarity (1-100)
        uint256 randomWord = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenId)));
        uint256 chance = (randomWord % 100) + 1;
        
        HeroRarity rarity;
        uint256 bonusStats = 0;

        if (chance <= 50) {
            rarity = HeroRarity.Comun;
            bonusStats = 0;
        } else if (chance <= 75) {
            rarity = HeroRarity.Raro;
            bonusStats = 5;
        } else if (chance <= 88) {
            rarity = HeroRarity.Especial;
            bonusStats = 12;
        } else if (chance <= 95) {
            rarity = HeroRarity.Epico;
            bonusStats = 20;
        } else if (chance <= 99) {
            rarity = HeroRarity.Legendario;
            bonusStats = 30;
        } else {
            rarity = HeroRarity.Mitico;
            bonusStats = 50;
        }

        uint256 baseAtk;
        uint256 baseDef;

        if (_class == HeroClass.Guerrero) {
            baseAtk = 10;
            baseDef = 20;
        } else if (_class == HeroClass.Arquero) {
            baseAtk = 15;
            baseDef = 10;
        } else { // Mago
            baseAtk = 20;
            baseDef = 5;
        }

        heroes[tokenId] = HeroStats({
            name: _name,
            heroClass: _class,
            rarity: rarity,
            exp: 0,
            level: 1,
            attack: baseAtk + bonusStats,
            defense: baseDef + bonusStats,
            lastTrainedAt: 0
        });

        _mint(msg.sender, tokenId);
    }

    /**
     * @dev Entrena al heroe respetando el cooldown. Otorga 50XP y sube de nivel cada 100XP.
     */
    function entrenarHeroe(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "No eres el dueno del heroe");
        require(block.timestamp >= heroes[tokenId].lastTrainedAt + TRAIN_COOLDOWN, "El heroe esta cansado. Espera el cooldown.");

        heroes[tokenId].lastTrainedAt = block.timestamp;
        heroes[tokenId].exp += 50;

        // Si la experiencia llega a 100 o mas, sube de nivel
        if (heroes[tokenId].exp >= 100) {
            heroes[tokenId].exp -= 100; // Resta 100 en lugar de volver a cero para no perder sobrantes
            heroes[tokenId].level += 1;
            
            // Incremento de stats especializado por cada nivel ganado
            if (heroes[tokenId].heroClass == HeroClass.Guerrero) {
                heroes[tokenId].attack += 2;
                heroes[tokenId].defense += 5;
            } else if (heroes[tokenId].heroClass == HeroClass.Arquero) {
                heroes[tokenId].attack += 4;
                heroes[tokenId].defense += 3;
            } else { // Mago
                heroes[tokenId].attack += 6;
                heroes[tokenId].defense += 1;
            }
        }
    }

    /**
     * @dev Permite al dueno del smart contract retirar los fondos recaudados por cada mint.
     */
    function withdrawBalance() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No hay saldo para retirar");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Fallo al retirar fondos");
    }

    /**
     * @dev Funcion para obtener las stats de un heroe y facilitar el mapeo rapido de getters en la DApp.
     */
    function getHeroStats(uint256 tokenId) external view returns (HeroStats memory) {
        ownerOf(tokenId); // Revierte automaticamente si no existe
        return heroes[tokenId];
    }
}
