import { useState, useEffect, useCallback } from 'react';
import { stellarService, STELLAR_ASSETS, TransactionParams, TransactionResult, StellarAccount } from '../services/stellarService';

export interface UseStellarWalletReturn {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  publicKey: string | null;
  account: StellarAccount | null;
  
  // Connection methods
  connect: () => Promise<void>;
  disconnect: () => void;
  
  // Transaction state
  isTransactionPending: boolean;
  lastTransaction: TransactionResult | null;
  
  // Transaction methods
  sendPayment: (params: TransactionParams) => Promise<TransactionResult>;
  validateAddress: (address: string) => Promise<boolean>;
  
  // Balance methods
  getBalance: (asset: keyof typeof STELLAR_ASSETS) => Promise<string>;
  refreshAccount: () => Promise<void>;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

export const useStellarWallet = (): UseStellarWalletReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [account, setAccount] = useState<StellarAccount | null>(null);
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<TransactionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check connection status on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = useCallback(async () => {
    try {
      const connected = await stellarService.isWalletConnected();
      if (connected) {
        const pk = await stellarService.connectWallet();
        if (pk && typeof pk === 'string') {
          setPublicKey(pk);
          setIsConnected(true);
          await refreshAccount();
        }
      }
    } catch (err) {
      console.error('Error checking connection:', err);
      // Don't throw error here, just log it
    }
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const pk = await stellarService.connectWallet();
      if (pk && typeof pk === 'string') {
        setPublicKey(pk);
        setIsConnected(true);
        await refreshAccount();
      } else {
        throw new Error('Invalid public key received from wallet');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      setIsConnected(false);
      setPublicKey(null);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setPublicKey(null);
    setAccount(null);
    setError(null);
    setLastTransaction(null);
  }, []);

  const refreshAccount = useCallback(async () => {
    if (!publicKey) return;
    
    try {
      const accountInfo = await stellarService.getAccountInfo(publicKey);
      setAccount(accountInfo);
    } catch (err: any) {
      setError(err.message || 'Failed to refresh account');
    }
  }, [publicKey]);

  const getBalance = useCallback(async (asset: keyof typeof STELLAR_ASSETS): Promise<string> => {
    if (!publicKey) return '0';
    
    try {
      return await stellarService.getAssetBalance(publicKey, asset);
    } catch (err: any) {
      setError(err.message || 'Failed to get balance');
      return '0';
    }
  }, [publicKey]);

  const validateAddress = useCallback(async (address: string): Promise<boolean> => {
    try {
      return await stellarService.validateAddress(address);
    } catch (err: any) {
      setError(err.message || 'Invalid address');
      return false;
    }
  }, []);

  const sendPayment = useCallback(async (params: TransactionParams): Promise<TransactionResult> => {
    setIsTransactionPending(true);
    setError(null);
    
    try {
      // Validate destination address
      const isValidAddress = await validateAddress(params.destination);
      if (!isValidAddress) {
        throw new Error('Invalid destination address');
      }

      // Send payment
      const result = await stellarService.sendPayment(params);
      setLastTransaction(result);
      
      if (result.success) {
        // Refresh account after successful transaction
        await refreshAccount();
      } else {
        setError(result.error || 'Transaction failed');
      }
      
      return result;
    } catch (err: any) {
      const errorResult: TransactionResult = {
        success: false,
        error: err.message || 'Transaction failed'
      };
      setLastTransaction(errorResult);
      setError(err.message || 'Transaction failed');
      return errorResult;
    } finally {
      setIsTransactionPending(false);
    }
  }, [validateAddress, refreshAccount]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Connection state
    isConnected,
    isConnecting,
    publicKey,
    account,
    
    // Connection methods
    connect,
    disconnect,
    
    // Transaction state
    isTransactionPending,
    lastTransaction,
    
    // Transaction methods
    sendPayment,
    validateAddress,
    
    // Balance methods
    getBalance,
    refreshAccount,
    
    // Error handling
    error,
    clearError,
  };
};
