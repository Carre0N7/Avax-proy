# AVAX Quest - Web3 Backend

Este directorio contiene los contratos inteligentes para el backend descentralizado de "AVAX Quest", construidos con Hardhat y Solidity.

## Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Una billetera compatible con EVM (ej. MetaMask) configurada para la red **Avalanche Fuji Testnet**.
- AVAX de prueba en la Fuji Testnet (puedes obtenerlo en el [Faucet de Avalanche](https://faucet.avax.network/)).

## Configuración del Entorno

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Crea un archivo `.env` en la raíz de la carpeta `web3-backend` (mismo nivel que este README) y agrega tus variables de entorno:
   ```env
   PRIVATE_KEY="tu_clave_privada_aqui"
   AVALANCHE_FUJI_URL="https://api.avax-test.network/ext/bc/C/rpc"
   ```
   *Nota: No compartas tu clave privada con nadie y asegúrate de no subir el archivo `.env` a repositorios públicos.*

## Comandos Útiles

### Compilar los Contratos
Para compilar los contratos inteligentes de Solidity (se guardarán los artefactos en `artifacts/` y generará los `typechain-types`):
```bash
npx hardhat compile
```

### Pruebas Locales (Tests)
Actualmente no hay tests detallados configurados, pero puedes correr la suite de pruebas básica usando:
```bash
npx hardhat test
```

### Despliegue Local
Si deseas probar desplegar los contratos en una red local de Hardhat simulada:
```bash
npx hardhat run scripts/deploy.ts
```

### Despliegue en Avalanche Fuji Testnet
Para lanzar los contratos en la testnet pública de Avalanche (necesitas AVAX de prueba en tu billetera y tu private key configurada en `.env`):
```bash
npx hardhat run scripts/deploy.ts --network fuji
```

## Arquitectura de los Smart Contracts

1. **AQToken (AQT)**: ERC-20 utilizado como la moneda del juego. Es minable por el contrato GameArena como recompensa y es quemable.
2. **HeroNFT**: ERC-721 que representa a los personajes. Sus estadísticas (Ataque, Defensa, Nivel, Experiencia) viven completamente dentro de la blockchain (On-Chain) usando structs.
3. **GameArena**: Contrato intermedio donde los jugadores pueden enviar su `HeroNFT` a "entrenar" bloqueándolo por un tiempo y, al completar el tiempo, se les recompensa subiendo las estadísticas del NFT y recibiendo tokens `AQT`.
