"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserProvider, JsonRpcProvider, Contract } from 'ethers';

const FUJI_CHAIN_ID = 43113;
const FUJI_RPC_URL = 'https://api.avax-test.network/ext/bc/C/rpc';

export const CONTRACT_ADDRESS = "0x420b6D22e286E27A53F6Ca2D4fA2C3093c86F0Ab";

export const CONTRACT_ABI = [
  "function mintHero(string _name, uint8 _class) external payable",
  "function entrenarHeroe(uint256 tokenId) external",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function getHeroStats(uint256 tokenId) view returns (tuple(string name, uint8 heroClass, uint8 rarity, uint256 exp, uint256 level, uint256 attack, uint256 defense, uint256 lastTrainedAt))",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function withdrawBalance() external",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

export interface Hero {
  id: number;
  name: string;
  heroClass: number;
  rarity: number;
  exp: number;
  level: number;
  attack: number;
  defense: number;
  lastTrainedAt: number;
}

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
  myHeroes: Hero[];
  isLoadingHeroes: boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [provider, setProvider] = useState<BrowserProvider | JsonRpcProvider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [myHeroes, setMyHeroes] = useState<Hero[]>([]);
  const [isLoadingHeroes, setIsLoadingHeroes] = useState(false);

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  const fetchHeroes = async () => {
    if (!contract || !address || isWrongNetwork) return;
    setIsLoadingHeroes(true);
    try {
      const ownedHeroes = [];
      for (let i = 0; i < 50; i++) {
        try {
          const owner = await contract.ownerOf(i);
          if (owner.toLowerCase() === address.toLowerCase()) {
            const stats = await contract.getHeroStats(i);
            ownedHeroes.push({
              id: i,
              name: stats.name,
              heroClass: Number(stats.heroClass),
              rarity: Number(stats.rarity),
              exp: Number(stats.exp),
              level: Number(stats.level),
              attack: Number(stats.attack),
              defense: Number(stats.defense),
              lastTrainedAt: Number(stats.lastTrainedAt)
            });
          }
        } catch (e) {
          break;
        }
      }
      setMyHeroes(ownedHeroes);
    } catch (err) {
      console.error("Error fetching heroes:", err);
    }
    setIsLoadingHeroes(false);
  };

  useEffect(() => {
    if (!address || !contract) {
      setMyHeroes([]);
      return;
    }
    fetchHeroes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, contract, isWrongNetwork, refreshTrigger]);

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
        triggerRefresh();
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
    <Web3Context.Provider value={{ address, isWrongNetwork, provider, contract, connectWallet, disconnectWallet, switchToFuji, refreshTrigger, triggerRefresh, myHeroes, isLoadingHeroes }}>
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
