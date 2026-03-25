"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserProvider, JsonRpcProvider, Contract } from 'ethers';

const FUJI_CHAIN_ID = 43113;
const FUJI_RPC_URL = 'https://api.avax-test.network/ext/bc/C/rpc';

export const CONTRACT_ADDRESS = "0xd5f18A720E51C12baBA546A68485e8f14f69cE25";

export const CONTRACT_ABI = [
  "function mintHero(string name, uint256 heroClass) public payable",
  "function entrenarHeroe(uint256 tokenId) external",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function heroes(uint256) view returns (uint256 level, uint256 attack, uint256 defense)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

interface Web3ContextType {
  address: string | null;
  isWrongNetwork: boolean;
  provider: BrowserProvider | JsonRpcProvider | null;
  contract: Contract | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToFuji: () => Promise<void>;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [provider, setProvider] = useState<BrowserProvider | JsonRpcProvider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    const initWeb3 = async () => {
      const providerObj = (window as any).avalanche || (window as any).ethereum;
      
      if (localStorage.getItem('walletDisconnected') === 'true') {
        const defaultProvider = new JsonRpcProvider(FUJI_RPC_URL);
        setProvider(defaultProvider);
        setContract(new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, defaultProvider));
        return;
      }

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
        params: [{ chainId: '0xa869' }],
      });
      setIsWrongNetwork(false);
    } catch (switchError: unknown) {
      const err = switchError as { code: number };
      if (err.code === 4902) {
        try {
          await providerObj.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xa869',
              chainName: 'Avalanche Fuji Testnet',
              rpcUrls: [FUJI_RPC_URL],
              nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
              blockExplorerUrls: ['https://testnet.snowtrace.io/'],
            }],
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
        localStorage.removeItem('walletDisconnected');

        const browserProvider = new BrowserProvider(providerObj);
        
        await providerObj.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });

        await browserProvider.send("eth_requestAccounts", []);
        const signer = await browserProvider.getSigner();
        const userAddress = await signer.getAddress();

        setAddress(userAddress);
        setProvider(browserProvider);
        setContract(new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer));

        await checkNetwork(browserProvider);
      } catch (err) {
        console.error("Error al conectar la wallet:", err);
      }
    } else {
      alert("¡Por favor instala Core Wallet o MetaMask para jugar!");
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setProvider(null);
    setContract(null);
    localStorage.setItem('walletDisconnected', 'true');
  };

  useEffect(() => {
    const providerObj = (window as any).avalanche || (window as any).ethereum;

    if (providerObj) {
      const handleChainChanged = () => window.location.reload();
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          if (localStorage.getItem('walletDisconnected') !== 'true') {
            setAddress(accounts[0]);
          }
        } else {
          setAddress(null);
          localStorage.setItem('walletDisconnected', 'true');
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

  return (
    <Web3Context.Provider value={{ address, isWrongNetwork, provider, contract, connectWallet, disconnectWallet, switchToFuji, refreshTrigger, triggerRefresh }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}
