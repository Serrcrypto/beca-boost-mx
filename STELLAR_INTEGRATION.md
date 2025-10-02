# Stellar Blockchain Integration

## Overview
The transfer screen now includes full Stellar blockchain integration using the Freighter wallet. Users can send XLM, USDC, and MXN stablecoins on the Stellar testnet.

## Features

### Wallet Integration
- **Freighter Wallet Connection**: Native integration with Freighter browser extension
- **Testnet Support**: Configured for Stellar testnet (horizon-testnet.stellar.org)
- **Account Management**: Automatic balance fetching and account information display

### Asset Support
- **XLM (Stellar Lumens)**: Native Stellar currency
- **USDC**: USD Coin stablecoin on Stellar
- **MXN**: Mexican Peso stablecoin (testnet)

### Transaction Features
- **Address Validation**: Real-time validation of Stellar addresses
- **Balance Checking**: Live balance display for selected assets
- **Memo Support**: Optional transaction memos (up to 28 characters)
- **Transaction Status**: Real-time feedback on transaction success/failure
- **Error Handling**: Comprehensive error messages and user guidance

## Usage

### Prerequisites
1. Install the [Freighter browser extension](https://freighter.app/)
2. Create a testnet account in Freighter
3. Fund your account with testnet XLM from the [Stellar Testnet Faucet](https://laboratory.stellar.org/#account-creator?network=test)

### Sending Transactions
1. Navigate to the "Transferir" (Transfer) screen
2. Click "Conectar Freighter" to connect your wallet
3. Select the asset you want to send (XLM, USDC, or MXN)
4. Enter the destination Stellar address
5. Enter the amount to send
6. Optionally add a memo
7. Click "Enviar" to execute the transaction

### Quick Send
Use the frequent contacts section to quickly select common destination addresses.

## Technical Implementation

### Services
- **stellarService.ts**: Core Stellar blockchain operations using Horizon.Server
- **useStellarWallet.ts**: React hook for wallet state management

### Key Components
- Wallet connection status
- Asset selection interface
- Address validation
- Transaction form with real-time feedback
- Success/error notifications
- Error boundary for graceful error handling

## Security Notes
- All transactions are executed on Stellar testnet
- Private keys never leave the Freighter wallet
- Address validation prevents sending to invalid destinations
- Transaction amounts are validated against available balances

## Troubleshooting

### Common Issues

1. **"Freighter wallet no está disponible"**
   - Install the Freighter browser extension from [freighter.app](https://freighter.app/)
   - Make sure the extension is enabled in your browser
   - Refresh the page after installing the extension

2. **"No se pudo conectar con Freighter"**
   - Ensure Freighter is unlocked
   - Check that you're on the Stellar Testnet network
   - Try refreshing the page and reconnecting

3. **"Invalid destination address"**
   - Verify the Stellar address format (starts with 'G')
   - Make sure the address is for the testnet network

4. **Transaction failures**
   - Check your account balance
   - Ensure you have enough XLM for transaction fees
   - Verify the destination account exists

## Network Configuration
- **Network**: Stellar Testnet
- **Horizon Server**: https://horizon-testnet.stellar.org
- **Network Passphrase**: Test SDF Network ; September 2015
