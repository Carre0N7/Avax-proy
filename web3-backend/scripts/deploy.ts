import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  // 1. Deploy AQToken
  const AQToken = await ethers.getContractFactory("AQToken");
  const aqToken = await AQToken.deploy();
  await aqToken.waitForDeployment();
  const aqTokenAddress = await aqToken.getAddress();
  console.log(`AQToken deployed to: ${aqTokenAddress}`);

  // 2. Deploy HeroNFT
  const HeroNFT = await ethers.getContractFactory("HeroNFT");
  const heroNft = await HeroNFT.deploy();
  await heroNft.waitForDeployment();
  const heroNftAddress = await heroNft.getAddress();
  console.log(`HeroNFT deployed to: ${heroNftAddress}`);

  // 3. Deploy GameArena
  const GameArena = await ethers.getContractFactory("GameArena");
  const gameArena = await GameArena.deploy(aqTokenAddress, heroNftAddress);
  await gameArena.waitForDeployment();
  const gameArenaAddress = await gameArena.getAddress();
  console.log(`GameArena deployed to: ${gameArenaAddress}`);

  // 4. Set Authorized Minters
  console.log("Setting authorized minters for GameArena...");
  
  const aqTokenTx = await aqToken.setMinter(gameArenaAddress, true);
  await aqTokenTx.wait();
  
  const heroNftTx = await heroNft.setMinter(gameArenaAddress, true);
  await heroNftTx.wait();

  console.log("Deployment and setup complete!");
  console.log("-----------------------------------------");
  console.log("AQToken Address:   ", aqTokenAddress);
  console.log("HeroNFT Address:   ", heroNftAddress);
  console.log("GameArena Address: ", gameArenaAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
