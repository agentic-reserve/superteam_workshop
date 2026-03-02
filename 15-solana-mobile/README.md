# Solana Mobile Development

> Build mobile dApps untuk Solana dengan Mobile Wallet Adapter dan publish ke dApp Store

## Apa itu Solana Mobile?

Solana Mobile adalah platform untuk building crypto-native mobile applications. Menyediakan:
- **Mobile Wallet Adapter (MWA)** - Protocol untuk connect dApps dengan wallet apps
- **Solana dApp Store** - Crypto-friendly app store tanpa 30% fee
- **Saga & Seeker** - Web3-native Android phones
- **Multi-framework support** - React Native, Kotlin, Flutter, Unity, Unreal

## Quick Start

### 1. Setup Development Environment

```bash
# Install Node.js dan npm
node --version  # v18+

# Install Android Studio
# Download dari: https://developer.android.com/studio

# Install React Native CLI
npm install -g react-native-cli

# Install Solana Mobile CLI
npm install -g @solana-mobile/dapp-store-cli
```

### 2. Create Project dengan Template

```bash
# Create Solana Mobile dApp
npx create-solana-dapp my-solana-app

# Pilih template:
# - React Native (recommended untuk beginners)
# - Kotlin (native Android)
# - Flutter (cross-platform)

cd my-solana-app
npm install
```

### 3. Run on Android Emulator

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Or iOS (if on Mac)
npm run ios
```

## Mobile Wallet Adapter (MWA)

MWA adalah protocol yang enables dApps untuk connect dengan wallet apps secara secure.

### React Native Integration

**Install Library:**
```bash
npm install @wallet-ui/react-native-web3js
```

**Setup Provider:**
```typescript
// App.tsx
import { MobileWalletProvider } from '@wallet-ui/react-native-web3js';
import { clusterApiUrl } from '@solana/web3.js';

export default function App() {
  return (
    <MobileWalletProvider
      cluster={clusterApiUrl('devnet')}
      appIdentity={{
        name: 'My Solana App',
        uri: 'https://myapp.com',
        icon: './icon.png',
      }}
    >
      <YourApp />
    </MobileWalletProvider>
  );
}
```

**Connect Wallet:**
```typescript
import { useMobileWallet } from '@wallet-ui/react-native-web3js';

function WalletButton() {
  const { connect, disconnect, publicKey, connected } = useMobileWallet();

  if (connected && publicKey) {
    return (
      <View>
        <Text>Connected: {publicKey.toBase58().slice(0, 8)}...</Text>
        <Button title="Disconnect" onPress={disconnect} />
      </View>
    );
  }

  return <Button title="Connect Wallet" onPress={connect} />;
}
```

**Sign Transaction:**
```typescript
import { useMobileWallet } from '@wallet-ui/react-native-web3js';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

function SendSOL() {
  const { publicKey, signAndSendTransaction } = useMobileWallet();

  const sendSOL = async () => {
    if (!publicKey) return;

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPublicKey,
        lamports: 0.1 * LAMPORTS_PER_SOL,
      })
    );

    try {
      const signature = await signAndSendTransaction(transaction);
      console.log('Transaction sent:', signature);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  return <Button title="Send 0.1 SOL" onPress={sendSOL} />;
}
```

**Sign Message:**
```typescript
function SignMessage() {
  const { signMessage } = useMobileWallet();

  const handleSign = async () => {
    const message = new TextEncoder().encode('Hello Solana Mobile!');
    
    try {
      const signature = await signMessage(message);
      console.log('Message signed:', signature);
    } catch (error) {
      console.error('Signing failed:', error);
    }
  };

  return <Button title="Sign Message" onPress={handleSign} />;
}
```

### Kotlin Integration

**Add Dependencies:**
```kotlin
// build.gradle
dependencies {
    implementation 'com.solanamobile:mobile-wallet-adapter-clientlib-ktx:2.0.0'
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'
}
```

**Setup MWA Client:**
```kotlin
import com.solana.mobilewalletadapter.clientlib.ActivityResultSender
import com.solana.mobilewalletadapter.clientlib.MobileWalletAdapter

class MainActivity : ComponentActivity() {
    private lateinit var walletAdapter: MobileWalletAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        walletAdapter = MobileWalletAdapter(
            activityResultSender = ActivityResultSender(this)
        )
    }
}
```

**Connect and Sign:**
```kotlin
import com.solana.mobilewalletadapter.clientlib.scenario.LocalAssociationScenario

suspend fun connectWallet() {
    val result = walletAdapter.transact { session ->
        session.authorize(
            identityUri = Uri.parse("https://myapp.com"),
            iconUri = Uri.parse("favicon.ico"),
            identityName = "My Solana App"
        )
    }
    
    when (result) {
        is TransactionResult.Success -> {
            val publicKey = result.authResult.publicKey
            println("Connected: ${publicKey.toBase58()}")
        }
        is TransactionResult.Failure -> {
            println("Connection failed: ${result.e}")
        }
    }
}

suspend fun signTransaction(transaction: Transaction) {
    val result = walletAdapter.transact { session ->
        session.signAndSendTransactions(
            transactions = arrayOf(transaction.serialize())
        )
    }
    
    when (result) {
        is TransactionResult.Success -> {
            val signature = result.signatures[0]
            println("Transaction sent: $signature")
        }
        is TransactionResult.Failure -> {
            println("Transaction failed: ${result.e}")
        }
    }
}
```

### Flutter Integration

**Add Dependency:**
```yaml
# pubspec.yaml
dependencies:
  solana_mobile_client: ^1.0.0
```

**Setup and Connect:**
```dart
import 'package:solana_mobile_client/solana_mobile_client.dart';

class WalletService {
  final MobileWalletAdapter _adapter = MobileWalletAdapter();

  Future<String?> connectWallet() async {
    try {
      final result = await _adapter.authorize(
        identityName: 'My Solana App',
        identityUri: Uri.parse('https://myapp.com'),
        iconUri: Uri.parse('favicon.ico'),
      );
      
      return result.publicKey;
    } catch (e) {
      print('Connection failed: $e');
      return null;
    }
  }

  Future<String?> signTransaction(Transaction transaction) async {
    try {
      final signatures = await _adapter.signAndSendTransactions(
        transactions: [transaction.serialize()],
      );
      
      return signatures.first;
    } catch (e) {
      print('Transaction failed: $e');
      return null;
    }
  }
}
```

## Anchor Program Integration

Integrate Anchor programs ke mobile dApp untuk interact dengan custom on-chain programs.

**Install Anchor:**
```bash
npm install @coral-xyz/anchor
```

**Setup Program:**
```typescript
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { useMobileWallet } from '@wallet-ui/react-native-web3js';
import idl from './idl/counter.json';

function useCounterProgram() {
  const { connection, publicKey, signTransaction } = useMobileWallet();

  const provider = new AnchorProvider(
    connection,
    { publicKey, signTransaction },
    { commitment: 'confirmed' }
  );

  const program = new Program(idl, provider);
  return program;
}
```

**Call Program Instructions:**
```typescript
function CounterApp() {
  const program = useCounterProgram();
  const { publicKey } = useMobileWallet();

  const increment = async () => {
    const [counterPDA] = await PublicKey.findProgramAddress(
      [Buffer.from('counter'), publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .increment()
      .accounts({
        counter: counterPDA,
        user: publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  };

  return <Button title="Increment Counter" onPress={increment} />;
}
```

## Solana dApp Store

Crypto-friendly app store tanpa 30% fee dari Apple/Google.

### Publishing Workflow

**1. Build Signed APK:**
```bash
# For React Native
cd android
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

**2. Generate Keystore (first time):**
```bash
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**3. Sign APK:**
```bash
# Add to android/gradle.properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=****
MYAPP_RELEASE_KEY_PASSWORD=****

# Build signed APK
cd android && ./gradlew assembleRelease
```

**4. Install dApp Store CLI:**
```bash
npm install -g @solana-mobile/dapp-store-cli
```

**5. Mint App NFT (first time):**
```bash
# Connect wallet
dappstore init

# Mint App NFT
dappstore create \
  --name "My Solana App" \
  --symbol "MSA" \
  --description "Amazing Solana mobile dApp"
```

**6. Submit Release:**
```bash
# Mint Release NFT
dappstore publish submit \
  --apk ./android/app/build/outputs/apk/release/app-release.apk \
  --requestor-is-authorized \
  --complies-with-solana-dapp-store-policies
```

**7. Track Submission:**
```bash
# Check status
dappstore publish status

# View in Publisher Portal
# https://publish.solanamobile.com
```

### Publishing Updates

```bash
# Build new version (update versionCode in build.gradle)
cd android && ./gradlew assembleRelease

# Submit update
dappstore publish update \
  --apk ./android/app/build/outputs/apk/release/app-release.apk \
  --requestor-is-authorized \
  --complies-with-solana-dapp-store-policies
```

## Publishing Web Apps as PWA

Wrap web apps sebagai Progressive Web App (PWA) untuk publish ke dApp Store.

**1. Create PWA Wrapper:**
```bash
# Use Bubblewrap
npx @bubblewrap/cli init \
  --manifest https://myapp.com/manifest.json
```

**2. Build APK:**
```bash
npx @bubblewrap/cli build
```

**3. Submit to dApp Store:**
```bash
dappstore publish submit \
  --apk ./app-release-signed.apk \
  --requestor-is-authorized \
  --complies-with-solana-dapp-store-policies
```

## Mobile Wallet Adapter for Web

Enable mobile wallets untuk connect ke web apps via MWA.

**Install:**
```bash
npm install @solana-mobile/wallet-adapter-mobile
```

**Setup:**
```typescript
import { SolanaMobileWalletAdapter } from '@solana-mobile/wallet-adapter-mobile';
import { WalletProvider } from '@solana/wallet-adapter-react';

const wallets = [
  new SolanaMobileWalletAdapter({
    appIdentity: {
      name: 'My Web App',
      uri: 'https://myapp.com',
      icon: '/icon.png',
    },
    cluster: 'devnet',
  }),
];

function App() {
  return (
    <WalletProvider wallets={wallets} autoConnect>
      <YourApp />
    </WalletProvider>
  );
}
```

**Detect Mobile:**
```typescript
function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function WalletButton() {
  const { select, wallets } = useWallet();

  useEffect(() => {
    if (isMobile()) {
      // Auto-select Mobile Wallet Adapter
      const mobileWallet = wallets.find(
        w => w.adapter.name === 'Mobile Wallet Adapter'
      );
      if (mobileWallet) select(mobileWallet.adapter.name);
    }
  }, [isMobile, wallets, select]);

  return <WalletMultiButton />;
}
```

## Detecting Seeker Users

Seeker adalah Solana Mobile's latest Web3 phone.

**Method 1: User Agent Detection:**
```typescript
function isSeekerDevice() {
  const userAgent = navigator.userAgent || '';
  return userAgent.includes('Seeker') || userAgent.includes('SeekerBrowser');
}

if (isSeekerDevice()) {
  console.log('User is on Seeker device!');
  // Show Seeker-specific features
}
```

**Method 2: React Native Device Info:**
```bash
npm install react-native-device-info
```

```typescript
import DeviceInfo from 'react-native-device-info';

async function checkIfSeeker() {
  const brand = await DeviceInfo.getBrand();
  const model = await DeviceInfo.getModel();
  
  return brand === 'Solana Mobile' && model.includes('Seeker');
}
```

## Best Practices

### UX Guidelines

**1. Clear Wallet Connection:**
```typescript
// Show wallet status prominently
function WalletStatus() {
  const { connected, publicKey } = useMobileWallet();

  return (
    <View style={styles.header}>
      {connected ? (
        <Text>🟢 {publicKey.toBase58().slice(0, 8)}...</Text>
      ) : (
        <Text>🔴 Not Connected</Text>
      )}
    </View>
  );
}
```

**2. Transaction Feedback:**
```typescript
async function sendTransaction() {
  setLoading(true);
  setStatus('Preparing transaction...');

  try {
    setStatus('Waiting for wallet approval...');
    const signature = await signAndSendTransaction(tx);
    
    setStatus('Confirming transaction...');
    await connection.confirmTransaction(signature);
    
    setStatus('✅ Transaction confirmed!');
  } catch (error) {
    setStatus('❌ Transaction failed');
  } finally {
    setLoading(false);
  }
}
```

**3. Error Handling:**
```typescript
try {
  await signTransaction(tx);
} catch (error) {
  if (error.message.includes('User rejected')) {
    Alert.alert('Cancelled', 'Transaction was cancelled');
  } else if (error.message.includes('Insufficient funds')) {
    Alert.alert('Error', 'Not enough SOL for transaction');
  } else {
    Alert.alert('Error', 'Transaction failed. Please try again.');
  }
}
```

### Performance

**1. Cache Wallet Authorization:**
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

async function cacheAuthorization(authToken: string) {
  await AsyncStorage.setItem('wallet_auth', authToken);
}

async function getCachedAuthorization() {
  return await AsyncStorage.getItem('wallet_auth');
}
```

**2. Optimize RPC Calls:**
```typescript
// Use commitment levels wisely
const balance = await connection.getBalance(publicKey, 'confirmed');

// Batch multiple calls
const [balance, tokenAccounts] = await Promise.all([
  connection.getBalance(publicKey),
  connection.getParsedTokenAccountsByOwner(publicKey, {
    programId: TOKEN_PROGRAM_ID,
  }),
]);
```

### Security

**1. Validate Transactions:**
```typescript
function validateTransaction(tx: Transaction) {
  // Check recipient
  if (!isValidPublicKey(recipient)) {
    throw new Error('Invalid recipient address');
  }

  // Check amount
  if (amount <= 0 || amount > maxAmount) {
    throw new Error('Invalid amount');
  }

  // Verify transaction structure
  if (tx.instructions.length === 0) {
    throw new Error('Empty transaction');
  }
}
```

**2. Secure Key Storage:**
```typescript
// NEVER store private keys in AsyncStorage
// Always use wallet apps for signing

// For API keys, use secure storage
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('api_key', apiKey);
const apiKey = await SecureStore.getItemAsync('api_key');
```

## Testing

### Test on Any Android Device

```bash
# Enable USB debugging on device
# Settings > Developer Options > USB Debugging

# Connect device via USB
adb devices

# Run app on device
npm run android
```

### Test with Emulator

```bash
# Create Android Virtual Device (AVD)
# Android Studio > AVD Manager > Create Virtual Device

# Start emulator
emulator -avd Pixel_6_API_33

# Run app
npm run android
```

### Install Wallet Apps for Testing

**Phantom Wallet:**
- Download dari dApp Store atau Google Play
- Create/import wallet
- Switch to Devnet untuk testing

**Solflare Wallet:**
- Download dari dApp Store
- Create wallet
- Get Devnet SOL dari faucet

## Common Issues

### Wallet Not Found

```typescript
// Check if wallet apps are installed
import { getInstalledWallets } from '@wallet-ui/react-native-web3js';

const wallets = await getInstalledWallets();
if (wallets.length === 0) {
  Alert.alert(
    'No Wallet Found',
    'Please install Phantom or Solflare wallet',
    [
      {
        text: 'Install Phantom',
        onPress: () => Linking.openURL('market://details?id=app.phantom'),
      },
    ]
  );
}
```

### Transaction Timeout

```typescript
// Increase timeout and add retry logic
async function sendWithRetry(tx: Transaction, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const signature = await signAndSendTransaction(tx, {
        timeout: 60000, // 60 seconds
      });
      return signature;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 2000)); // Wait 2s
    }
  }
}
```

### Build Errors

```bash
# Clean build
cd android
./gradlew clean

# Clear cache
rm -rf node_modules
npm install

# Rebuild
npm run android
```

## Resources

- **Documentation**: https://docs.solanamobile.com
- **dApp Store**: https://dappstore.solanamobile.com
- **Publisher Portal**: https://publish.solanamobile.com
- **GitHub**: https://github.com/solana-mobile
- **Discord**: https://discord.gg/solanamobile
- **Sample Apps**: https://github.com/solana-mobile/tutorial-apps

## Next Steps

1. ✅ Setup development environment
2. ✅ Create project dengan template
3. ✅ Integrate Mobile Wallet Adapter
4. ✅ Build dan test on device/emulator
5. ✅ Add Anchor program integration
6. ✅ Generate signed APK
7. ✅ Mint App NFT
8. ✅ Submit to dApp Store
9. ✅ Monitor reviews dan publish updates

Solana Mobile membuka opportunities baru untuk building crypto-native mobile experiences tanpa restrictions dari traditional app stores! 📱🚀
