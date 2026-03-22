# 🦸‍♂️ AVAX Quest: Fuji Testnet RPG

¡Bienvenido a **AVAX Quest**! Un RPG descentralizado construido para el ecosistema de Avalanche. Entra a la arena, mintea tu NFT de héroe único y entrénalo mejorando sus estadísticas (Ataque, Defensa y Nivel) de forma 100% on-chain.

## 🚀 Características Principales (Features)
- **Minting de NFTs (ERC721):** Crea tu propio héroe directamente en la blockchain sin costo (pagando con gas de Testnet).
- **On-Chain Stats:** Sube de nivel a tu NFT y almacena sus estadísticas permanentemente en el Smart Contract.
- **Auto-Connect Wallet:** Detección de billetera (MetaMask / Core) y cambio automático hacia la red (Avalanche Fuji).
- **Interfaz Moderna:** UI estilizada usando Tailwind CSS y Radix UI, 100% lista para Vercel.

## 🛠️ Tecnologías (Tech Stack)
* **Frontend:** [Next.js](https://nextjs.org/) + React
* **Estilos:** Tailwind CSS + UI Components
* **Web3/Blockchain:** [Ethers.js v6](https://docs.ethers.org/v6/) para la conexión con la red.
* **Smart Contracts:** Escritos en [Solidity](https://soliditylang.org/) y desplegados con el framework **Foundry**.
* **Red Principal:** Avalanche Fuji Testnet (Chain ID: `43113`).

## 📜 Smart Contract Info
El contrato inteligente que maneja toda la lógica del juego está desplegado en la **C-Chain** de la red de pruebas de Avalanche:
- **Contract Address:** `0xd5f18A720E51C12baBA546A68485e8f14f69cE25`

*(Puedes buscar este contrato copiando la dirección en [Snowtrace Testnet](https://testnet.snowtrace.io/))*

## 💻 Instalación Local (Para el Equipo)

Si tu compañero quiere correr este proyecto en su propia computadora, que siga estos pasos:

1. **Clona este repositorio:**
   ```bash
   git clone https://github.com/TU_USUARIO/Avax_Project.git
   cd Avax_Project
   ```

2. **Instala las dependencias del Frontend:**
   ```bash
   npm install
   ```

3. **Corre el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

Abre [http://localhost:3000](http://localhost:3000) en el navegador y el frontend ya funcionará conectándose a la Fuji Testnet.

## 🤝 Desarrollo de Contratos (Foundry)
Si parte de tu equipo quiere hacer cambios al código del Smart Contract ubicado en `contracts-foundry/src/AvaxQuest.sol`:

1.  Asegúrense de darle doble clic al archivo llamado `.env.example` dentro de la carpeta `contracts-foundry`.
2. Renómbrenlo a `.env` (Este archivo sí está ignorado por el repositorio para que no lo vayan a subir accidentalmente).
3. Adentro del archivo `.env`, cada persona de tu equipo debe poner **SU PROPIA** Private Key. *(Nunca la suban a GitHub).*
4. Abran una terminal y usen `forge build` o `forge create` para compilar y lanzar sus propias actualizaciones del contrato a la Fuji Testnet.
