import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";

describe("AVAX Quest Contracts", function () {
  // Configuración base (Fixture) para reutilizar el mismo estado en cada test
  async function deployGameFixture() {
    const [owner, player1, player2] = await ethers.getSigners();

    // Desplegar Token
    const AQToken = await ethers.getContractFactory("AQToken");
    const aqToken = await AQToken.deploy();

    // Desplegar NFT
    const HeroNFT = await ethers.getContractFactory("HeroNFT");
    const heroNft = await HeroNFT.deploy();

    // Desplegar Arena de Juego
    const GameArena = await ethers.getContractFactory("GameArena");
    const gameArena = await GameArena.deploy(await aqToken.getAddress(), await heroNft.getAddress());

    // Autorizar al GameArena para mintear Tokens y NPCs
    await aqToken.setMinter(await gameArena.getAddress(), true);
    await heroNft.setMinter(await gameArena.getAddress(), true);

    return { aqToken, heroNft, gameArena, owner, player1, player2 };
  }

  describe("Despliegue y Propiedad", function () {
    it("Debería asignar al deployer como dueño de los contratos", async function () {
      const { aqToken, heroNft, owner } = await loadFixture(deployGameFixture);
      expect(await aqToken.owner()).to.equal(owner.address);
      expect(await heroNft.owner()).to.equal(owner.address);
    });
  });

  describe("Sistema de Héroes (HeroNFT)", function () {
    it("Debería permitir mintear un nuevo héroe con estadísticas base", async function () {
      const { heroNft, player1 } = await loadFixture(deployGameFixture);
      
      await heroNft.mintHero(player1.address);
      
      expect(await heroNft.ownerOf(0)).to.equal(player1.address);
      
      const stats = await heroNft.getHeroStats(0);
      expect(stats.level).to.equal(1);
      expect(stats.attack).to.equal(10);
      expect(stats.defense).to.equal(10);
      expect(stats.experience).to.equal(0);
    });
  });

  describe("Arena de Juego (GameArena)", function () {
    it("Debería bloquear el NFT, entrenarlo y otorgar recompensas", async function () {
      const { aqToken, heroNft, gameArena, player1 } = await loadFixture(deployGameFixture);
      const tokenId = 0;

      // 1. Mintear héroe inicial para el jugador 1
      await heroNft.mintHero(player1.address);

      // 2. El jugador 1 aprueba a la GameArena a transferir su héroe
      await heroNft.connect(player1).approve(await gameArena.getAddress(), tokenId);

      // 3. El jugador 1 comienza el entrenamiento
      await expect(gameArena.connect(player1).startTraining(tokenId))
        .to.emit(gameArena, "TrainingStarted");

      // Verificar que el NFT esté en el contrato GameArena
      expect(await heroNft.ownerOf(tokenId)).to.equal(await gameArena.getAddress());

      // 4. Simulamos el tiempo pasando en la blockchain local (1 minuto exacto)
      await time.increase(60);

      // 5. El jugador termina su entrenamiento
      await expect(gameArena.connect(player1).endTraining())
        .to.emit(gameArena, "TrainingEnded");

      // Verificar que el NFT se le devolvió al jugador 1
      expect(await heroNft.ownerOf(tokenId)).to.equal(player1.address);

      // Verificar recompensas: Estadísticas del Héroe deben subir
      const stats = await heroNft.getHeroStats(tokenId);
      expect(stats.level).to.equal(2);
      expect(stats.attack).to.equal(15);
      expect(stats.defense).to.equal(15);
      expect(stats.experience).to.equal(100);

      // Verificar recompensas: El jugador 1 debe tener 100 AQT tokens
      const balance = await aqToken.balanceOf(player1.address);
      expect(balance).to.equal(ethers.parseEther("100")); // 100 tokens con 18 decimales
    });

    it("Debería fallar si se intenta terminar el entrenamiento antes de tiempo", async function () {
      const { heroNft, gameArena, player1 } = await loadFixture(deployGameFixture);
      
      await heroNft.mintHero(player1.address);
      await heroNft.connect(player1).approve(await gameArena.getAddress(), 0);
      await gameArena.connect(player1).startTraining(0);

      // Intentamos terminar el entrenamiento de manera inmediata sin pasar tiempo en la blockchain
      await expect(gameArena.connect(player1).endTraining())
        .to.be.revertedWith("El entrenamiento aun no ha terminado");
    });
  });
});
