import { 
  Horizon, 
  Keypair, 
  Asset, 
  Operation, 
  TransactionBuilder, 
  Networks,
  Memo,
  BASE_FEE
} from '@stellar/stellar-sdk';
import { 
  isConnected, 
  getAddress, 
  signTransaction,
  setAllowed,
  isAllowed,
  getNetwork,
  requestAccess,
  isBrowser
} from '@stellar/freighter-api';

// Stellar Testnet Configuration
const TESTNET_SERVER_URL = 'https://horizon-testnet.stellar.org';
const TESTNET_NETWORK_PASSPHRASE = Networks.TESTNET;

// Asset configurations for Stellar testnet
export const STELLAR_ASSETS = {
  XLM: {
    code: 'XLM',
    issuer: undefined,
    name: 'Stellar Lumens',
    symbol: 'XLM',
    decimals: 7
  },
  USDC: {
    code: 'USDC',
    issuer: 'GBBD47IF6LXCC7EDU6DY4F4BBW52DQODQERRBGHQKBM6Y6TDE2TCB65D',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 7
  },
  MXN: {
    code: 'MXN',
    issuer: 'GDMGQBDB2F5BX4RYF2QJ7QY3Q5XJ6Q5XJ6Q5XJ6Q5XJ6',
    name: 'Mexican Peso',
    symbol: 'MXN',
    decimals: 7
  }
};

export interface StellarAccount {
  publicKey: string;
  balances: Array<{
    asset: string;
    balance: string;
    asset_type: string;
    asset_code?: string;
    asset_issuer?: string;
  }>;
}

export interface TransactionParams {
  destination: string;
  amount: string;
  asset: keyof typeof STELLAR_ASSETS;
  memo?: string;
  publicKey?: string;
}

export interface TransactionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

class StellarService {
  private server: Horizon.Server;
  private isInitialized = false;

  constructor() {
    this.server = new Horizon.Server(TESTNET_SERVER_URL);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Check if Freighter is available
      if (!isBrowser) {
        console.warn('Freighter is not available in this environment');
        return;
      }
      
      // Set network configuration for Freighter
      await setAllowed();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Stellar service:', error);
      // Don't throw error, just log it
    }
  }

  async isWalletConnected(): Promise<boolean> {
    try {
      // Check if Freighter is available first
      if (!isBrowser) {
        return false;
      }
      const connectionStatus = await isConnected();
      return connectionStatus.isConnected;
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      return false;
    }
  }

  async connectWallet(): Promise<string> {
    try {
      await this.initialize();
      
      // Check if Freighter is available
      if (!isBrowser) {
        throw new Error('Freighter is not available in this environment');
      }
      
      // Request access to Freighter
      const accessResponse = await requestAccess();
      
      if (accessResponse.error) {
        throw new Error(`Error requesting access: ${accessResponse.error}`);
      }
      
      if (!accessResponse.address || typeof accessResponse.address !== 'string') {
        throw new Error('No valid public key received from wallet');
      }

      return accessResponse.address;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      if (error instanceof Error && error.message.includes('not available')) {
        throw new Error('Freighter wallet no está disponible. Por favor instala la extensión Freighter desde freighter.app');
      }
      if (error instanceof Error && error.message.includes('User rejected')) {
        throw new Error('El usuario rechazó la conexión con la wallet');
      }
      throw new Error('No se pudo conectar con Freighter. Asegúrate de que la extensión esté instalada y desbloqueada.');
    }
  }

  async getAccountInfo(publicKey: string): Promise<StellarAccount> {
    try {
      const account = await this.server.loadAccount(publicKey);
      
      return {
        publicKey,
        balances: account.balances.map(balance => ({
          asset: balance.asset_type === 'native' ? 'XLM' : `${balance.asset_code}:${balance.asset_issuer}`,
          balance: balance.balance,
          asset_type: balance.asset_type,
          asset_code: balance.asset_code,
          asset_issuer: balance.asset_issuer
        }))
      };
    } catch (error: any) {
      console.error('Error fetching account info:', error);
      
      // Check if it's a 404 error (account not found)
      if (error.status === 404 || error.message?.includes('Not Found')) {
        throw new Error(`La cuenta ${publicKey} no existe en la red de testnet. Necesitas crear la cuenta primero con al menos 1 XLM.`);
      }
      
      throw new Error('Failed to fetch account information');
    }
  }

  async getAssetBalance(publicKey: string, assetCode: keyof typeof STELLAR_ASSETS): Promise<string> {
    try {
      const account = await this.getAccountInfo(publicKey);
      const asset = STELLAR_ASSETS[assetCode];
      
      if (assetCode === 'XLM') {
        const xlmBalance = account.balances.find(b => b.asset_type === 'native');
        return xlmBalance ? xlmBalance.balance : '0';
      } else {
        const assetBalance = account.balances.find(b => 
          b.asset_code === asset.code && b.asset_issuer === asset.issuer
        );
        return assetBalance ? assetBalance.balance : '0';
      }
    } catch (error) {
      console.error('Error fetching asset balance:', error);
      return '0';
    }
  }

  async buildTransaction(params: TransactionParams): Promise<string> {
    try {
      // Use provided publicKey or try to get it from wallet
      let publicKey = params.publicKey;
      
      if (!publicKey) {
        const addressResponse = await getAddress();
        if (addressResponse.error || !addressResponse.address) {
          throw new Error('Wallet not connected');
        }
        publicKey = addressResponse.address;
      }

      // Load account
      const account = await this.server.loadAccount(publicKey);
      
      // Create asset
      const asset = params.asset === 'XLM' 
        ? Asset.native()
        : new Asset(STELLAR_ASSETS[params.asset].code, STELLAR_ASSETS[params.asset].issuer!);

      // Build transaction
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
      })
        .addOperation(
          Operation.payment({
            destination: params.destination,
            asset: asset,
            amount: params.amount,
          })
        )
        .addMemo(Memo.text(params.memo || ''))
        .setTimeout(30)
        .build();

      // Sign transaction
      console.log('Signing transaction with XDR:', transaction.toXDR());
      const signResult = await signTransaction(transaction.toXDR(), {
        networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
        accountToSign: publicKey,
      });
      
      console.log('Sign result type:', typeof signResult);
      console.log('Sign result:', signResult);
      console.log('Sign result keys:', Object.keys(signResult || {}));
      
      // Check if signing was successful
      if (signResult && signResult.error) {
        throw new Error(`Error signing transaction: ${signResult.error}`);
      }
      
      // Handle different response formats
      let signedTransactionXDR;
      if (typeof signResult === 'string') {
        // If it's already a string (XDR), use it directly
        signedTransactionXDR = signResult;
      } else if (signResult && signResult.signedTxXdr) {
        // If it's an object with signedTxXdr property (Freighter format)
        signedTransactionXDR = signResult.signedTxXdr;
      } else if (signResult && signResult.signedTransaction) {
        // If it's an object with signedTransaction property
        signedTransactionXDR = signResult.signedTransaction;
      } else if (signResult && signResult.xdr) {
        // If it's an object with xdr property
        signedTransactionXDR = signResult.xdr;
      } else {
        console.error('Unexpected signTransaction response format:', signResult);
        throw new Error('No signed transaction received from wallet');
      }
      
      console.log('Final signed transaction XDR:', signedTransactionXDR);
      return signedTransactionXDR;
    } catch (error: any) {
      console.error('Error building transaction:', error);
      
      // Check if it's a 404 error (account not found)
      if (error.status === 404 || error.message?.includes('Not Found')) {
        throw new Error(`La cuenta ${params.publicKey || 'actual'} no existe en la red de testnet. Necesitas crear la cuenta primero con al menos 1 XLM desde el faucet de testnet.`);
      }
      
      throw new Error('Failed to build transaction');
    }
  }

  async submitTransaction(signedTransactionXDR: string): Promise<TransactionResult> {
    try {
      console.log('Submitting transaction XDR:', signedTransactionXDR);
      console.log('XDR length:', signedTransactionXDR.length);
      console.log('XDR type:', typeof signedTransactionXDR);
      
      // Parse the transaction to validate it before submission
      let transaction;
      try {
        transaction = TransactionBuilder.fromXDR(signedTransactionXDR, TESTNET_NETWORK_PASSPHRASE);
        console.log('Parsed transaction successfully:', transaction);
      } catch (parseError) {
        console.error('Error parsing transaction XDR:', parseError);
        throw new Error('Invalid transaction format');
      }
      
      const result = await this.server.submitTransaction(transaction);
      
      return {
        success: true,
        transactionHash: result.hash
      };
    } catch (error: any) {
      console.error('Error submitting transaction:', error);
      
      return {
        success: false,
        error: error.message || 'Transaction failed'
      };
    }
  }

  async sendPayment(params: TransactionParams, publicKey?: string): Promise<TransactionResult> {
    try {
      const transactionParams = { ...params, publicKey };
      const signedTransaction = await this.buildTransaction(transactionParams);
      return await this.submitTransaction(signedTransaction);
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Payment failed'
      };
    }
  }

  async validateAddress(address: string): Promise<boolean> {
    try {
      Keypair.fromPublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  async checkAccountExists(address: string): Promise<boolean> {
    try {
      await this.server.loadAccount(address);
      return true;
    } catch (error: any) {
      if (error.status === 404 || error.message?.includes('Not Found')) {
        return false;
      }
      throw error;
    }
  }

  async getNetworkInfo() {
    return {
      network: 'testnet',
      server: TESTNET_SERVER_URL,
      passphrase: TESTNET_NETWORK_PASSPHRASE
    };
  }
}

export const stellarService = new StellarService();
