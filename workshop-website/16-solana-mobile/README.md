# Solana Mobile Development

> Build mobile dApps untuk Android dengan Mobile Wallet Adapter dan React Native

## Apa itu Solana Mobile?

Solana Mobile adalah platform untuk building mobile-first decentralized applications di Solana. Dengan **Mobile Wallet Adapter (MWA)**, mobile dApps bisa connect ke wallet apps dan request signing services secara native di Android.

### Key Features

- 📱 **Native Mobile Experience** - Seamless wallet integration di Android
- 🔐 **Secure Communication** - MWA protocol untuk secure dApp-wallet communication
- ⚡ **React Native Support** - Build dengan familiar React Native framework
- 🎯 **dApp Store** - Distribute apps via Solana dApp Store

## Prerequisites

### Development Environment

**Install Node.js & npm:**
```bash
# macOS
brew install node

# Verify
node --version
npm --version
```

**Install Android Studio:**
- Download dari https://developer.android.com/studio
- Install Android SDK
- Setup Android emulator atau physical device

**For React Native:**
```bash
# Install Expo CLI
npm install -g expo-cli

# Verify
expo --version
```

## Quick Start

### 1. Create Project

```bash
# Create Solana Mobile app
npm create solana-dapp@latest

# Select "Solana Mobile" framework
# Choose template (Basic, NFT, Token, etc.)
```

### 2. Install Dependencies

```bash
cd your-app-name

# Install dependencies
npm install

# Install Mobile Wallet Adapter
npm install @wallet-ui/react-native-web3js \
  react-native-quick-crypto \
  @solana/web3.js \
  expo-dev-client
```

### 3. Configure Polyfills

**Create `polyfill.js`:**
```javascript
import { install } from 'react-native-quick-crypto';
install();
```

**Create `index.js`:**
```javascript
import './polyfill';
import 'expo-router/entry';
```

**Update `package.json`:**
```json
{
  "main": "./index.js"
}
```

### 4. Run on Android

```bash
# Build and run
npm run android

# Or with Expo
expo run:android
```

## Mobile Wallet Adapter Setup

### 1. Wrap App with Provider

```tsx
// App.tsx
import { MobileWalletProvider } from '@wallet-ui/react-native-web3js';
import { clusterApiUrl } from '@solana/web3.js';

const chain = 'solana:devnet';
const endpoint = clusterApiUrl('devnet');

const identity = {
  name: 'My Solana App',
  uri: 'https://mysolanaapp.com',
  icon: 'favicon.png',
};

export default function App() {
  return (
    <MobileWalletProvider 
      chain={chain} 
      endpoint={endpoint} 
      identity={identity}
    >
      {/* Your app content */}
    </MobileWalletProvider>
  );
}
```

### 2. Use the Hook

```tsx
import { useMobileWallet } from '@wallet-ui/react-native-web3js';

function MyComponent() {
  const {
    account,           // Connected wallet account
    connect,           // Connect to wallet
    disconnect,        // Disconnect
    signMessage,       // Sign message
    signIn,            // Sign in with Solana
    signAndSendTransaction, // Sign & send tx
    connection,        // RPC connection
  } = useMobileWallet();

  return (
    <View>
      {account ? (
        <Text>Connected: {account.address}</Text>
      ) : (
        <Button title="Connect" onPress={connect} />
      )}
    </View>
  );
}
```

## Common Use Cases

### Connect / Disconnect

```tsx
function ConnectButton() {
  const { account, connect, disconnect } = useMobileWallet();

  if (account) {
    return (
      <View>
        <Text>Connected: {account.address.slice(0, 8)}...</Text>
        <Button title="Disconnect" onPress={disconnect} />
      </View>
    );
  }

  return <Button title="Connect Wallet" onPress={connect} />;
}
```

### Sign Message

```tsx
function SignMessageButton() {
  const { signMessage } = useMobileWallet();

  const handleSign = async () => {
    try {
      const message = 'Verify this message';
      const messageBytes = new TextEncoder().encode(message);
      
      const signature = await signMessage(messageBytes);
      console.log('Signature:', signature);
      
      Alert.alert('Success', 'Message signed!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return <Button title="Sign Message" onPress={handleSign} />;
}
```

### Sign In with Solana (SIWS)

```tsx
function SignInButton() {
  const { account, signIn } = useMobileWallet();

  const handleSignIn = async () => {
    try {
      await signIn({
        domain: 'your-app-domain.com',
        statement: 'Sign in to Your App',
      });
      
      Alert.alert('Success', `Signed in: ${account?.address}`);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return <Button title="Sign In" onPress={handleSignIn} />;
}
```

### Send Transaction

```tsx
import {
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

function SendTransactionButton() {
  const { account, signAndSendTransaction, connection } = useMobileWallet();

  const handleSend = async () => {
    if (!account) return;

    try {
      const { blockhash } = await connection.getLatestBlockhash();
      
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: new PublicKey(account.address),
      }).add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(account.address),
          toPubkey: new PublicKey('RECIPIENT_ADDRESS'),
          lamports: 1_000_000, // 0.001 SOL
        })
      );

      const signature = await signAndSendTransaction(transaction);
      
      Alert.alert('Success', `Transaction: ${signature}`);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return <Button title="Send SOL" onPress={handleSend} />;
}
```

## Advanced: Direct MWA Sessions

Untuk advanced use cases, kamu bisa invoke MWA sessions directly:

```tsx
import {
  transact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';

const APP_IDENTITY = {
  name: 'My dApp',
  uri: 'https://mydapp.com',
  icon: 'favicon.ico',
};

// Authorize wallet
const authResult = await transact(async (wallet: Web3MobileWallet) => {
  const result = await wallet.authorize({
    cluster: 'solana:devnet',
    identity: APP_IDENTITY,
  });
  
  return result;
});

console.log('Connected:', authResult.accounts[0].address);
```

### Sign and Send Transaction

```tsx
const signature = await transact(async (wallet: Web3MobileWallet) => {
  // Authorize first
  const authResult = await wallet.authorize({
    cluster: 'solana:devnet',
    identity: APP_IDENTITY,
  });

  const publicKey = new PublicKey(
    toByteArray(authResult.accounts[0].address)
  );

  // Build transaction
  const { blockhash } = await connection.getLatestBlockhash();
  
  const transaction = new Transaction({
    recentBlockhash: blockhash,
    feePayer: publicKey,
  }).add(
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: recipientPubkey,
      lamports: 1_000_000,
    })
  );

  // Sign and send
  const signatures = await wallet.signAndSendTransactions({
    transactions: [transaction],
  });

  return signatures[0];
});
```

## Testing Your App

### Install Development Wallet

**Mock MWA Wallet:**
```bash
# Clone mock wallet
git clone https://github.com/solana-mobile/mock-mwa-wallet.git

# Open in Android Studio
# Build and install on device/emulator
```

**Production Wallets:**
- Solflare: https://www.solflare.com/
- Jupiter Mobile: https://jup.ag/mobile
- Phantom (coming soon)

### Test on Emulator

```bash
# Start Android emulator
emulator -avd Pixel_5_API_33

# Run your app
npm run android
```

### Test on Physical Device

```bash
# Enable USB debugging on device
# Connect via USB

# Verify device
adb devices

# Run app
npm run android
```

## UI Components

### Wallet Button Component

```tsx
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useMobileWallet } from '@wallet-ui/react-native-web3js';

export function WalletButton() {
  const { account, connect, disconnect } = useMobileWallet();

  if (account) {
    return (
      <TouchableOpacity style={styles.button} onPress={disconnect}>
        <Text style={styles.buttonText}>
          {account.address.slice(0, 4)}...{account.address.slice(-4)}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.button} onPress={connect}>
      <Text style={styles.buttonText}>Connect Wallet</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#512DA8',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

### Balance Display

```tsx
import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useMobileWallet } from '@wallet-ui/react-native-web3js';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export function BalanceDisplay() {
  const { account, connection } = useMobileWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!account) return;

    const fetchBalance = async () => {
      const pubkey = new PublicKey(account.address);
      const lamports = await connection.getBalance(pubkey);
      setBalance(lamports / LAMPORTS_PER_SOL);
    };

    fetchBalance();
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [account, connection]);

  if (!account || balance === null) return null;

  return <Text>Balance: {balance.toFixed(4)} SOL</Text>;
}
```

## Best Practices

### 1. Handle Errors Gracefully

```tsx
const handleTransaction = async () => {
  try {
    const signature = await signAndSendTransaction(transaction);
    Alert.alert('Success', `Transaction sent: ${signature}`);
  } catch (error) {
    if (error.message.includes('User rejected')) {
      Alert.alert('Cancelled', 'Transaction was cancelled');
    } else {
      Alert.alert('Error', error.message);
    }
  }
};
```

### 2. Store Auth Token

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save auth token
await AsyncStorage.setItem('auth_token', authResult.auth_token);

// Retrieve for next session
const storedToken = await AsyncStorage.getItem('auth_token');

// Use in authorize
await wallet.authorize({
  cluster: 'solana:devnet',
  identity: APP_IDENTITY,
  auth_token: storedToken || undefined,
});
```

### 3. Confirm Transactions

```tsx
const signature = await signAndSendTransaction(transaction);

// Wait for confirmation
const confirmation = await connection.confirmTransaction(
  signature,
  'confirmed'
);

if (confirmation.value.err) {
  throw new Error('Transaction failed');
}
```

### 4. Use Versioned Transactions

```tsx
import {
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';

const { blockhash } = await connection.getLatestBlockhash();

const message = new TransactionMessage({
  payerKey: publicKey,
  recentBlockhash: blockhash,
  instructions: [transferInstruction],
}).compileToV0Message();

const transaction = new VersionedTransaction(message);

await signAndSendTransaction(transaction);
```

## Deployment

### Build Release APK

```bash
# Build release
cd android
./gradlew assembleRelease

# APK location
# android/app/build/outputs/apk/release/app-release.apk
```

### Submit to dApp Store

1. Build signed APK
2. Visit https://dappstore.solanamobile.com
3. Submit your app
4. Wait for review

## Common Issues

### Issue: Polyfill Error

```
Error: crypto.getRandomValues() not supported
```

**Solution:**
```javascript
// Ensure polyfill.js is imported FIRST
import './polyfill';
import 'expo-router/entry';
```

### Issue: Wallet Not Found

```
Error: No MWA wallet found
```

**Solution:**
- Install Mock MWA Wallet atau production wallet
- Verify wallet app is installed on device

### Issue: Transaction Failed

```
Error: Transaction simulation failed
```

**Solution:**
```tsx
// Add more SOL for fees
// Check account has sufficient balance
const balance = await connection.getBalance(publicKey);
console.log('Balance:', balance / LAMPORTS_PER_SOL);
```

## Resources

- **Solana Mobile Docs**: https://docs.solanamobile.com
- **Sample Apps**: https://github.com/solana-mobile/solana-mobile-dapp-scaffold
- **MWA Protocol**: https://solana-mobile.github.io/mobile-wallet-adapter/spec/spec.html
- **dApp Store**: https://dappstore.solanamobile.com
- **Discord**: https://discord.gg/solanamobile

## Next Steps

1. ✅ Setup development environment
2. ✅ Create project dengan `create-solana-dapp`
3. ✅ Install MWA dependencies
4. ✅ Implement wallet connection
5. ✅ Add transaction functionality
6. ✅ Test on device/emulator
7. ✅ Build dan submit ke dApp Store

Solana Mobile membuka possibilities baru untuk mobile-first crypto experiences! 📱🚀
