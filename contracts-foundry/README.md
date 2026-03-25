# AVAX Quest Foundry Contracts

Este es el backend de Smart Contracts utilizando el framework [Foundry](https://book.getfoundry.sh/). 

## Requisitos de tu Bootcamp
Si aún no tienes Foundry instalado nativamente en tu máquina, instálalo ejecutando:
`curl -L https://foundry.paradigm.xyz | bash`
y luego corre `foundryup`.

## Inicialización y Dependencias
Antes de compilar, necesitas descargar la estructura de plantillas de OpenZeppelin:
```bash
forge install OpenZeppelin/openzeppelin-contracts
```

## Compilación
Para compilar y emitir los ABIs de tus contratos de Solidity (se guardarán en `out/`):
```bash
forge build
```

## Despliegue en Fuji Testnet
Copia `.env.example` y crea un archivo `.env` vacío donde incluirás tu propia llave privada.
```bash
source .env
forge create --rpc-url fuji --private-key $PRIVATE_KEY src/AvaxQuest.sol:AvaxQuest
```
 *(Nota: Usa el explorador de Fuji para confirmar la dirección de despliegue de tu contrato, y no olvides copiar ese address temporal global en tu `hooks/useWeb3.ts` del frontend).*
