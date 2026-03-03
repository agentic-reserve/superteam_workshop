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

### Test with Any Android Device

Seeker adalah Android phone biasa. Untuk 99% development dan testing, kamu bisa menggunakan:
- ✅ Any Android device (Samsung, Pixel, dll)
- ✅ Android emulator dari Android Studio
- ✅ Any standard Android API

App kamu akan behave sama di Seeker seperti di Android device lainnya.

### Install Mock MWA Wallet (Recommended)

**Mock MWA Wallet** adalah testing wallet yang simulate Seed Vault Wallet functionality dengan features:
- ✅ Mobile Wallet Adapter support (`authorize`, `signIn`, `signAndSendTransactions`, `signMessage`)
- ✅ Apple Pay-like transaction signing (bottom sheet approval, no app switch)
- ✅ Biometric authentication
- ✅ Configurable Ed25519 private key importing

**Install Mock MWA Wallet:**
```bash
# Clone repository
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

## Detecting Seeker Users

### Overview

Ada 2 metode utama untuk identify Seeker users:

1. **Platform Constants Check** - Lightweight client-side check
2. **Seeker Genesis Token Verification** - Secure on-chain verification

### Method 1: Platform Constants Check

Platform Constants method menggunakan React Native's built-in Platform API. Quick dan lightweight, cocok untuk UI treatments dan non-critical features.

⚠️ **SECURITY WARNING**: Platform Constants API bisa di-spoof dan **TIDAK boleh** digunakan untuk use cases yang memerlukan guaranteed Seeker user. Untuk guarantee, gunakan Method 2.

**Check Platform Constants:**

```tsx
import { Platform } from 'react-native';

const isSeekerDevice = (): boolean => {
  return Platform.constants.Model === 'Seeker';
};

// Usage
if (isSeekerDevice()) {
  console.log('Running on Seeker device!');
}
```

**Platform Constants Output di Seeker:**

```json
{
  "uiMode": "normal",
  "reactNativeVersion": {
    "minor": 79,
    "prerelease": null,
    "major": 0,
    "patch": 5
  },
  "isTesting": false,
  "ServerHost": "localhost:8081",
  "Brand": "solanamobile",
  "Manufacturer": "Solana Mobile Inc.",
  "Release": "15",
  "Fingerprint": "solanamobile/seeker/seeker:15/AP3A.250103.524.A2/mp1V912:userdebug/release-keys",
  "Serial": "unknown",
  "Model": "Seeker",
  "Version": 35
}
```

**Use Cases:**
- ✅ UI Treatments (special welcome messages, themes, layouts)
- ✅ Feature Flags (enable/disable features by device type)
- ✅ Analytics (track usage patterns)
- ✅ Marketing (device-specific promotional content)

**Limitations:**
- ❌ Spoofable - rooted devices atau modified apps bisa change Platform constants

### Method 2: Seeker Genesis Token Verification

Untuk use cases yang memerlukan **guarantee** bahwa user adalah Seeker owner, verify bahwa wallet contains **Seeker Genesis Token (SGT)**.

**Apa itu Seeker Genesis Token?**

SGT adalah unique NFT yang:
- ✅ Minted **once per Seeker device**
- ✅ Represents verified ownership of Seeker
- ✅ Implements Token Extensions (Token-2022)
- ✅ Can only be transferred between user's wallet accounts in Seed Vault

**Key Addresses:**
- Mint Authority: `GT2zuHVaZQYZSyQMgJPLzvkmyztfyXg2NJunqFp4p3A4`
- Metadata Address: `GT22s89nU4iWFkNXj1Bw6uYhJJWDRPpShHt4Bk8f99Te`
- Group Address: `GT22s89nU4iWFkNXj1Bw6uYhJJWDRPpShHt4Bk8f99Te`

### Genesis Token Verification Process

Verification process ada **2 main steps**:

#### Step 1: Prove Wallet Ownership dengan SIWS

**Client-side: Sign SIWS Payload**

```tsx
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';

const APP_IDENTITY = {
  name: 'Your React Native dApp',
  uri: 'https://yourdapp.com',
  icon: 'favicon.ico',
};

async function signSIWSPayload() {
  const result = await transact(async (wallet) => {
    const authorizationResult = await wallet.authorize({
      cluster: 'solana:mainnet',
      identity: APP_IDENTITY,
      sign_in_payload: {
        domain: 'yourdapp.com',
        statement: 'Sign in to verify Seeker ownership',
        uri: 'https://yourdapp.com',
      },
    });

    return {
      walletAddress: authorizationResult.accounts[0].address,
      signInResult: authorizationResult.sign_in_result,
    };
  });

  return result;
}
```

**Server-side: Verify SIWS Signature**

```tsx
// Backend server
import { verifySignIn } from "@solana/wallet-standard-util";

async function verifySIWS(signInPayload, signInResult): Promise<boolean> {
  const serialisedOutput = {
    account: {
      publicKey: new Uint8Array(signInResult.account.publicKey),
      ...signInResult.account,
    },
    signature: new Uint8Array(signInResult.signature),
    signedMessage: new Uint8Array(signInResult.signedMessage),
  };

  // Verify signature against original payload
  return verifySignIn(signInPayload, serialisedOutput);
}
```

#### Step 2: Check SGT Ownership

**Server-side: Query RPC untuk Verify SGT**

```tsx
// Backend server
const { Connection, PublicKey } = require('@solana/web3.js');
const { 
  unpackMint, 
  getMetadataPointerState, 
  getTokenGroupMemberState, 
  TOKEN_2022_PROGRAM_ID 
} = require('@solana/spl-token');

async function checkWalletForSGT(walletAddress: string): Promise<boolean> {
  const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
  const SGT_MINT_AUTHORITY = 'GT2zuHVaZQYZSyQMgJPLzvkmyztfyXg2NJunqFp4p3A4';
  const SGT_METADATA_ADDRESS = 'GT22s89nU4iWFkNXj1Bw6uYhJJWDRPpShHt4Bk8f99Te';
  const SGT_GROUP_MINT_ADDRESS = 'GT22s89nU4iWFkNXj1Bw6uYhJJWDRPpShHt4Bk8f99Te';

  try {
    const connection = new Connection(HELIUS_RPC_URL);

    // Use getTokenAccountsByOwnerV2 with pagination
    let allTokenAccounts = [];
    let paginationKey = null;
    let pageCount = 0;

    do {
      pageCount++;
      const requestPayload = {
        jsonrpc: '2.0',
        id: `page-${pageCount}`,
        method: 'getTokenAccountsByOwnerV2',
        params: [
          walletAddress,
          { "programId": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb" },
          {
            encoding: 'jsonParsed',
            limit: 1000,
            ...(paginationKey && { paginationKey })
          }
        ]
      };

      const response = await fetch(HELIUS_RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      const data = await response.json();
      const pageResults = data.result?.value.accounts || [];
      
      if (pageResults.length > 0) {
        allTokenAccounts.push(...pageResults);
      }

      paginationKey = data.result?.paginationKey;
    } while (paginationKey);

    if (allTokenAccounts.length === 0) {
      return false;
    }

    // Extract mint addresses
    const mintPubkeys = allTokenAccounts
      .map((accountInfo) => {
        try {
          if (accountInfo?.account?.data?.parsed?.info?.mint) {
            return new PublicKey(accountInfo.account.data.parsed.info.mint);
          }
          return null;
        } catch (error) {
          return null;
        }
      })
      .filter((mintPubkey) => mintPubkey !== null);

    // Fetch mint account data in batches
    const BATCH_SIZE = 100;
    const mintAccountInfos = [];
    
    for (let i = 0; i < mintPubkeys.length; i += BATCH_SIZE) {
      const batch = mintPubkeys.slice(i, i + BATCH_SIZE);
      const batchResults = await connection.getMultipleAccountsInfo(batch);
      mintAccountInfos.push(...batchResults);
    }

    // Check each mint for SGT verification
    for (let i = 0; i < mintAccountInfos.length; i++) {
      const mintInfo = mintAccountInfos[i];
      
      if (mintInfo) {
        const mintPubkey = mintPubkeys[i];
        
        try {
          // Unpack mint account data
          const mint = unpackMint(mintPubkey, mintInfo, TOKEN_2022_PROGRAM_ID);
          const mintAuthority = mint.mintAuthority?.toBase58();
          const hasCorrectMintAuthority = mintAuthority === SGT_MINT_AUTHORITY;

          // Check SGT Metadata
          const metadataPointer = getMetadataPointerState(mint);
          const hasCorrectMetadata = metadataPointer &&
            metadataPointer.authority?.toBase58() === SGT_MINT_AUTHORITY &&
            metadataPointer.metadataAddress?.toBase58() === SGT_METADATA_ADDRESS;

          // Check SGT Group Member
          const tokenGroupMemberState = getTokenGroupMemberState(mint);
          const hasCorrectGroupMember = tokenGroupMemberState &&
            tokenGroupMemberState.group?.toBase58() === SGT_GROUP_MINT_ADDRESS;

          // If all match, it's a verified SGT
          if (hasCorrectMintAuthority && hasCorrectMetadata && hasCorrectGroupMember) {
            console.log(`VERIFIED SGT FOUND: ${mint.address.toBase58()}`);
            return true;
          }
        } catch (mintError) {
          continue;
        }
      }
    }

    return false;
  } catch (error) {
    console.error("Error verifying SGT ownership:", error.message);
    return false;
  }
}
```

#### Step 3: Combine SIWS + SGT Check

```tsx
// Backend server
async function verifySeekerUser(signInResult) {
  // Verify SIWS signature
  const siwsVerified = await verifySIWS(signInResult);

  // Check SGT ownership
  const hasSGT = await checkWalletForSGT(signInResult.walletAddress);

  // Both must be true for verified Seeker owner
  return siwsVerified && hasSGT;
}
```

### SGT Transferability & Anti-Sybil

⚠️ **IMPORTANT**: SGTs are transferrable between user's wallet accounts, so you **must verify uniqueness** by checking the SGT's **unique mint address**.

**Anti-Sybil Example: In-App Rewards Claim**

Untuk limit rewards claim to once per Seeker device:

```tsx
// Backend server
const claimedSGTMints = new Set(); // Store claimed mint addresses

async function claimReward(walletAddress: string) {
  // 1. Verify wallet ownership via SIWS
  const siwsVerified = await verifySIWS(signInResult);
  if (!siwsVerified) {
    throw new Error('SIWS verification failed');
  }

  // 2. Check wallet owns SGT
  const sgtMintAddress = await getSGTMintAddress(walletAddress);
  if (!sgtMintAddress) {
    throw new Error('No SGT found in wallet');
  }

  // 3. Check SGT mint hasn't been used before
  if (claimedSGTMints.has(sgtMintAddress)) {
    throw new Error('This SGT has already claimed rewards');
  }

  // Grant reward and mark SGT as used
  await grantReward(walletAddress);
  claimedSGTMints.add(sgtMintAddress);
  
  return { success: true };
}
```

### Use Cases

**Platform Constants (Method 1):**
- ✅ UI treatments dan themes
- ✅ Feature flags
- ✅ Analytics tracking
- ✅ Marketing content

**SGT Verification (Method 2):**
- ✅ Gated content (restrict features to verified Seeker users)
- ✅ Rewards programs (exclusive rewards for Seeker owners)
- ✅ Anti-Sybil measures (prevent multiple claims per device)
- ✅ Access control (premium features for Seeker users)

---

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
