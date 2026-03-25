// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract AvaxQuest is ERC721, Ownable {
    uint256 private _nextTokenId;

    uint256 public constant MAX_SUPPLY = 5000;
    uint256 public constant MINT_COST_STANDARD = 0.01 ether;
    uint256 public constant MINT_COST_PREMIUM = 0.05 ether;
    uint256 public constant TRAIN_COOLDOWN = 1 minutes; // Cambiar a 12h en prod

    enum HeroType { Sylas, Ignis, Aethelgard, Noctis, Thalassa, Voltz, Krag, Zyra }
    enum HeroRarity { Comun, Raro, Especial, Epico, Legendario, Mitico }

    struct HeroStats {
        string name;
        HeroType heroType;
        HeroRarity rarity;
        uint256 exp;
        uint256 level;
        uint256 attack;
        uint256 defense;
        uint256 lastTrainedAt;
    }

    mapping(uint256 => HeroStats) public heroes;
    
    // Bitmask for checking which heroes a user has minted (8 bits used: 11111111 = 255)
    mapping(address => uint8) public userMintMask;

    constructor() ERC721("AVAX Quest Hero", "AQH") Ownable(msg.sender) {}

    function getWeight(uint8 heroId, bool isPremium) internal pure returns (uint256) {
        if (heroId == 6) { // Rare
            return isPremium ? 10 : 100;
        } else if (heroId == 4 || heroId == 5) { // Epic
            return isPremium ? 30 : 50;
        } else if (heroId == 2 || heroId == 3) { // Legendary
            return isPremium ? 80 : 20;
        } else { // Mythic (0, 1, 7)
            return isPremium ? 50 : 5;
        }
    }

    /**
     * @dev Gacha system para mintear 8 héroes únicos sin repetidos.
     */
    function mintHero() external payable {
        require(_nextTokenId < MAX_SUPPLY, "Max supply reached");
        require(msg.value >= MINT_COST_STANDARD, "Incorrect AVAX value");
        require(userMintMask[msg.sender] != 255, "You already own all 8 heroes");

        bool isPremium = (msg.value >= MINT_COST_PREMIUM);
        
        uint8[] memory available = new uint8[](8);
        uint256[] memory weights = new uint256[](8);
        uint256 count = 0;
        uint256 totalWeight = 0;

        for(uint8 i = 0; i < 8; i++) {
            if ((userMintMask[msg.sender] & (1 << i)) == 0) {
                available[count] = i;
                uint256 w = getWeight(i, isPremium);
                weights[count] = w;
                totalWeight += w;
                count++;
            }
        }

        uint256 random = (uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, _nextTokenId))) % totalWeight);
        uint256 runningTotal = 0;
        uint8 selectedId = 0;

        for(uint256 i = 0; i < count; i++) {
            runningTotal += weights[i];
            if (random < runningTotal) {
                selectedId = available[i];
                break;
            }
        }

        userMintMask[msg.sender] |= (1 << selectedId);

        string[8] memory heroNames = ["Sylas", "Ignis", "Aethelgard", "Noctis", "Thalassa", "Voltz", "Krag", "Zyra"];
        HeroRarity[8] memory heroRarities = [
            HeroRarity.Mitico, HeroRarity.Mitico, HeroRarity.Legendario, HeroRarity.Legendario, 
            HeroRarity.Epico, HeroRarity.Epico, HeroRarity.Raro, HeroRarity.Mitico
        ];
        uint256[8] memory baseAtk = [uint256(15), 35, 20, 30, 25, 25, 15, 40];
        uint256[8] memory baseDef = [uint256(35), 15, 25, 10, 20, 15, 30,  5];

        uint256 tokenId = _nextTokenId++;

        heroes[tokenId] = HeroStats({
            name: heroNames[selectedId],
            heroType: HeroType(selectedId),
            rarity: heroRarities[selectedId],
            exp: 0,
            level: 1,
            attack: baseAtk[selectedId],
            defense: baseDef[selectedId],
            lastTrainedAt: 0
        });

        _mint(msg.sender, tokenId);
    }

    /**
     * @dev Entrenar otorga 50XP y sube de nivel cada 100XP. Se especializa segun el tipo de héroe.
     */
    function entrenarHeroe(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(block.timestamp >= heroes[tokenId].lastTrainedAt + TRAIN_COOLDOWN, "Hero is resting");

        heroes[tokenId].lastTrainedAt = block.timestamp;
        heroes[tokenId].exp += 50;

        if (heroes[tokenId].exp >= 100) {
            heroes[tokenId].exp -= 100;
            heroes[tokenId].level += 1;
            
            // Subida generica pero adaptable por el ID
            uint8 hId = uint8(heroes[tokenId].heroType);
            if (hId == 0 || hId == 6) { // Tanks
                heroes[tokenId].attack += 2;
                heroes[tokenId].defense += 5;
            } else if (hId == 2 || hId == 4 || hId == 5) { // Balanced
                heroes[tokenId].attack += 4;
                heroes[tokenId].defense += 4;
            } else { // Attackers (1, 3, 7)
                heroes[tokenId].attack += 7;
                heroes[tokenId].defense += 1;
            }
        }
    }

    function adminMintSpecific(address to, uint8[] calldata ids) external onlyOwner {
        for(uint256 i = 0; i < ids.length; i++) {
            uint8 hId = ids[i];
            if ((userMintMask[to] & (1 << hId)) == 0) {
                 userMintMask[to] |= (1 << hId);
                 
                 string[8] memory heroNames = ["Sylas", "Ignis", "Aethelgard", "Noctis", "Thalassa", "Voltz", "Krag", "Zyra"];
                 HeroRarity[8] memory heroRarities = [HeroRarity.Mitico, HeroRarity.Mitico, HeroRarity.Legendario, HeroRarity.Legendario, HeroRarity.Epico, HeroRarity.Epico, HeroRarity.Raro, HeroRarity.Mitico];
                 uint256[8] memory baseAtk = [uint256(15), 35, 20, 30, 25, 25, 15, 40];
                 uint256[8] memory baseDef = [uint256(35), 15, 25, 10, 20, 15, 30,  5];

                 uint256 tokenId = _nextTokenId++;
                 heroes[tokenId] = HeroStats({name: heroNames[hId], heroType: HeroType(hId), rarity: heroRarities[hId], exp: 0, level: 1, attack: baseAtk[hId], defense: baseDef[hId], lastTrainedAt: 0});
                 _mint(to, tokenId);
            }
        }
    }

    function withdrawBalance() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdraw failed");
    }

    function getHeroStats(uint256 tokenId) external view returns (HeroStats memory) {
        ownerOf(tokenId);
        return heroes[tokenId];
    }
}
