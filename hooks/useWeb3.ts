"use client"

import { useState, useEffect } from 'react';
import { BrowserProvider, JsonRpcProvider, Contract } from 'ethers';

const FUJI_CHAIN_ID = 43113;
const FUJI_RPC_URL = 'https://api.avax-test.network/ext/bc/C/rpc';

// Dirección del Smart Contract desplegado en Avalanche Fuji
export const CONTRACT_ADDRESS = "0xd5f18A720E51C12baBA546A68485e8f14f69cE25"; // !<- PEGAR ADDRESS AQUÍ

// ABI de nuestro AvaxQuest.sol
export const CONTRACT_ABI = [
  "function mintHero() external",
  "function entrenarHeroe(uint256 tokenId) external",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function heroes(uint256) view returns (uint256 level, uint256 attack, uint256 defense)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

export function useWeb3() {
  const [address, setAddress] = useState<string | null>(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [provider, setProvider] = useState<BrowserProvider | JsonRpcProvider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  // Intenta recuperar la wallet automáticamente; si no funciona, usa el Fallback.
  useEffect(() => {
    const initWeb3 = async () => {
      const providerObj = (window as any).avalanche || (window as any).ethereum;
      if (providerObj) {
        try {
          const accounts = await providerObj.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            const browserProvider = new BrowserProvider(providerObj);
            const signer = await browserProvider.getSigner();
            setAddress(accounts[0]);
            setProvider(browserProvider);
            setContract(new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer));
            return;
          }
        } catch (e) {
          console.error("Error auto-conectando:", e);
        }
      }
      
      const defaultProvider = new JsonRpcProvider(FUJI_RPC_URL);
      setProvider(defaultProvider);
      setContract(new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, defaultProvider));
    };

    initWeb3();
  }, []);

  const checkNetwork = async (prov: BrowserProvider) => {
    const network = await prov.getNetwork();
    if (Number(network.chainId) !== FUJI_CHAIN_ID) {
      setIsWrongNetwork(true);
      return false;
    }
    setIsWrongNetwork(false);
    return true;
  };

  const switchToFuji = async () => {
    const providerObj = (window as any).avalanche || (window as any).ethereum;
    if (!providerObj) return;

    try {
      await providerObj.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xa869' }], // 43113 en hexadecimal
      });
      setIsWrongNetwork(false);
    } catch (switchError: unknown) {
      const err = switchError as { code: number };
      // El error 4902 significa que la red no ha sido agregada a la wallet aún
      if (err.code === 4902) {
        try {
          await providerObj.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xa869',
                chainName: 'Avalanche Fuji Testnet',
                rpcUrls: [FUJI_RPC_URL],
                nativeCurrency: {
                  name: 'AVAX',
                  symbol: 'AVAX',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://testnet.snowtrace.io/'],
              },
            ],
          });
          setIsWrongNetwork(false);
        } catch (addError) {
          console.error("Error agregando la red Fuji:", addError);
        }
      }
    }
  };

  const connectWallet = async () => {
    const providerObj = (window as any).avalanche || (window as any).ethereum;

    if (providerObj) {
      try {
        const browserProvider = new BrowserProvider(providerObj);
        await browserProvider.send("eth_requestAccounts", []); // Pide permisos de conexión
        const signer = await browserProvider.getSigner();
        const userAddress = await signer.getAddress();

        setAddress(userAddress);
        setProvider(browserProvider);
        setContract(new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)); // Contrato habilitado para escribir

        await checkNetwork(browserProvider);
      } catch (err) {
        console.error("Error al conectar la wallet:", err);
      }
    } else {
      alert("¡Por favor instala Core Wallet o MetaMask para jugar!");
    }
  };

  // Re-evaluar cuando el usuario cambia de red o cuenta desde su wallet directamente
  useEffect(() => {
    const providerObj = (window as any).avalanche || (window as any).ethereum;

    if (providerObj) {
      const handleChainChanged = () => window.location.reload();
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        } else {
          setAddress(null);
        }
      };

      providerObj.on('chainChanged', handleChainChanged);
      providerObj.on('accountsChanged', handleAccountsChanged);

      return () => {
        providerObj.removeListener('chainChanged', handleChainChanged);
        providerObj.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  return { address, isWrongNetwork, connectWallet, switchToFuji, provider, contract };
}
