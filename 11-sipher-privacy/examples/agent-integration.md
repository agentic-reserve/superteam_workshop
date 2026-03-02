# Sipher Agent Integration Examples

## Example 1: Simple Private Payment

```typescript
// Agent sends private payment to another agent
async function sendPrivatePayment(
  recipientMetaAddress: MetaAddress,
  amount: string
) {
  const apiKey = process.env.SIPHER_API_KEY;
  const baseUrl = 'https://sipher.sip-protocol.org';

  // 1. Derive one-time stealth address
  const deriveRes = await fetch(`${baseUrl}/v1/stealth/derive`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify({ recipientMetaAddress })
  });
  
  const { stealthAddress } = (await deriveRes.json()).data;

  // 2. Build shielded transfer
  const transferRes = await fetch(`${baseUrl}/v1/transfer/shield`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify({
      senderAddress: 'YourSolanaAddress',
      recipientMetaAddress,
      amount,
      mint: 'So11111111111111111111111111111111111111112' // SOL
    })
  });

  const { transaction, commitment } = (await transferRes.json()).data;

  // 3. Sign and submit transaction
  // (use your Solana wallet to sign)
  
  return {
    stealthAddress,
    commitment,
    transaction
  };
}
```

## Example 2: Receive and Claim Private Payment

```typescript
// Agent checks for incoming payments and claims them
async function checkAndClaimPayments(
  spendingPrivateKey: string,
  viewingPrivateKey: string
) {
  const apiKey = process.env.SIPHER_API_KEY;
  const baseUrl = 'https://sipher.sip-protocol.org';

  // 1. Scan for incoming payments
  const scanRes = await fetch(`${baseUrl}/v1/scan/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify({
      spendingPrivateKey,
      viewingPrivateKey,
      chain: 'solana'
    })
  });

  const { payments } = (await scanRes.json()).data;

  // 2. Claim each payment
  for (const payment of payments) {
    const claimRes = await fetch(`${baseUrl}/v1/transfer/claim`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify({
        stealthAddress: payment.stealthAddress,
        spendingPrivateKey,
        viewingPrivateKey,
        destinationAddress: 'YourRealWalletAddress'
      })
    });

    const { transaction } = (await claimRes.json()).data;
    
    // Sign and submit claim transaction
    console.log(`Claiming ${payment.amount} from ${payment.stealthAddress}`);
  }

  return payments;
}
```

## Example 3: Compliance Disclosure

```typescript
// Agent discloses transaction to auditor
async function discloseToAuditor(
  transactionData: any,
  auditorPublicKey: string
) {
  const apiKey = process.env.SIPHER_API_KEY;
  const baseUrl = 'https://sipher.sip-protocol.org';

  // 1. Generate viewing key for auditor
  const keyRes = await fetch(`${baseUrl}/v1/viewing-key/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify({
      path: 'm/0/auditor'
    })
  });

  const { viewingKey } = (await keyRes.json()).data;

  // 2. Disclose transaction
  const discloseRes = await fetch(`${baseUrl}/v1/viewing-key/disclose`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify({
      viewingKey: viewingKey.privateKey,
      transactionData,
      recipientPublicKey: auditorPublicKey
    })
  });

  const { encryptedData } = (await discloseRes.json()).data;

  // 3. Send encrypted data to auditor
  return {
    encryptedData,
    viewingKey: viewingKey.publicKey
  };
}
```

## Example 4: Multi-Chain Stealth Addresses

```typescript
// Generate stealth addresses across multiple chains
async function generateMultiChainAddresses() {
  const apiKey = process.env.SIPHER_API_KEY;
  const baseUrl = 'https://sipher.sip-protocol.org';
  
  const chains = ['solana', 'ethereum', 'near', 'cosmos'];
  const addresses = {};

  for (const chain of chains) {
    const res = await fetch(`${baseUrl}/v1/stealth/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify({ chain })
    });

    const { metaAddress } = (await res.json()).data;
    addresses[chain] = metaAddress;
  }

  return addresses;
}
```

## Example 5: Privacy Score Analysis

```typescript
// Analyze wallet privacy score
async function analyzeWalletPrivacy(walletAddress: string) {
  const apiKey = process.env.SIPHER_API_KEY;
  const baseUrl = 'https://sipher.sip-protocol.org';

  const res = await fetch(`${baseUrl}/v1/privacy/score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify({
      address: walletAddress,
      chain: 'solana'
    })
  });

  const { score, factors, recommendations } = (await res.json()).data;

  console.log(`Privacy Score: ${score}/100`);
  console.log('Factors:', factors);
  console.log('Recommendations:', recommendations);

  return { score, factors, recommendations };
}
```

## Example 6: Batch Operations

```typescript
// Generate multiple stealth addresses in one call
async function batchGenerateAddresses(count: number) {
  const apiKey = process.env.SIPHER_API_KEY;
  const baseUrl = 'https://sipher.sip-protocol.org';

  const res = await fetch(`${baseUrl}/v1/stealth/generate/batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify({
      count,
      chain: 'solana'
    })
  });

  const { metaAddresses } = (await res.json()).data;
  return metaAddresses;
}
```

## Example 7: Session Management

```typescript
// Create persistent session for agent
async function createAgentSession(agentId: string) {
  const apiKey = process.env.SIPHER_API_KEY;
  const baseUrl = 'https://sipher.sip-protocol.org';

  const res = await fetch(`${baseUrl}/v1/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify({
      name: `agent-${agentId}`,
      defaults: {
        chain: 'solana',
        privacyLevel: 'high',
        backend: 'sipnative'
      },
      ttl: 86400 // 24 hours
    })
  });

  const { session } = (await res.json()).data;
  
  // Use session ID in subsequent requests
  return session.id;
}

// Use session in requests
async function useSession(sessionId: string) {
  const apiKey = process.env.SIPHER_API_KEY;
  const baseUrl = 'https://sipher.sip-protocol.org';

  const res = await fetch(`${baseUrl}/v1/stealth/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
      'X-Session-Id': sessionId
    },
    body: JSON.stringify({}) // Uses session defaults
  });

  return (await res.json()).data;
}
```

## Example 8: Error Handling

```typescript
// Robust error handling for agent operations
async function robustPrivateTransfer(params: any) {
  const apiKey = process.env.SIPHER_API_KEY;
  const baseUrl = 'https://sipher.sip-protocol.org';
  
  try {
    const res = await fetch(`${baseUrl}/v1/transfer/shield`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'Idempotency-Key': `transfer-${Date.now()}` // Safe retries
      },
      body: JSON.stringify(params)
    });

    const data = await res.json();

    if (!data.success) {
      const { code, message, details } = data.error;
      
      switch (code) {
        case 'RATE_LIMIT_EXCEEDED':
          console.log('Rate limit hit, waiting...');
          await new Promise(resolve => setTimeout(resolve, 60000));
          return robustPrivateTransfer(params); // Retry
          
        case 'VALIDATION_ERROR':
          console.error('Invalid parameters:', details);
          throw new Error(message);
          
        case 'INSUFFICIENT_BALANCE':
          console.error('Not enough funds');
          throw new Error(message);
          
        default:
          console.error('Unknown error:', code, message);
          throw new Error(message);
      }
    }

    return data.data;
  } catch (error) {
    console.error('Network error:', error);
    throw error;
  }
}
```

## Example 9: LangChain Integration

```typescript
import { StructuredTool } from 'langchain/tools';
import { z } from 'zod';

// Sipher as LangChain tool
class SipherPrivateTransfer extends StructuredTool {
  name = 'sipher_private_transfer';
  description = 'Send a private payment using Sipher stealth addresses';
  
  schema = z.object({
    recipientSpendingKey: z.string(),
    recipientViewingKey: z.string(),
    amount: z.string(),
    chain: z.string().optional()
  });

  async _call(input: z.infer<typeof this.schema>) {
    const apiKey = process.env.SIPHER_API_KEY!;
    const baseUrl = 'https://sipher.sip-protocol.org';

    // Derive stealth address
    const deriveRes = await fetch(`${baseUrl}/v1/stealth/derive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify({
        recipientMetaAddress: {
          spendingKey: input.recipientSpendingKey,
          viewingKey: input.recipientViewingKey,
          chain: input.chain || 'solana'
        }
      })
    });

    const { stealthAddress } = (await deriveRes.json()).data;

    return JSON.stringify({
      success: true,
      stealthAddress,
      message: `Private payment of ${input.amount} prepared to stealth address`
    });
  }
}

// Use in agent
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { ChatOpenAI } from 'langchain/chat_models/openai';

const tools = [new SipherPrivateTransfer()];
const model = new ChatOpenAI({ temperature: 0 });

const executor = await initializeAgentExecutorWithOptions(tools, model, {
  agentType: 'structured-chat-zero-shot-react-description'
});

const result = await executor.call({
  input: 'Send 1 SOL privately to the recipient with spending key ABC and viewing key XYZ'
});
```

## Example 10: CrewAI Integration

```python
from crewai import Agent, Task, Crew
import requests
import os

class SipherTool:
    def __init__(self):
        self.api_key = os.getenv('SIPHER_API_KEY')
        self.base_url = 'https://sipher.sip-protocol.org'
    
    def generate_stealth_address(self, chain='solana'):
        """Generate a stealth meta-address for private payments"""
        response = requests.post(
            f'{self.base_url}/v1/stealth/generate',
            headers={
                'Content-Type': 'application/json',
                'X-API-Key': self.api_key
            },
            json={'chain': chain}
        )
        return response.json()['data']['metaAddress']
    
    def send_private_payment(self, recipient_meta, amount):
        """Send a private payment using stealth addresses"""
        # Derive stealth address
        derive_res = requests.post(
            f'{self.base_url}/v1/stealth/derive',
            headers={
                'Content-Type': 'application/json',
                'X-API-Key': self.api_key
            },
            json={'recipientMetaAddress': recipient_meta}
        )
        
        stealth_address = derive_res.json()['data']['stealthAddress']
        
        return {
            'success': True,
            'stealth_address': stealth_address,
            'amount': amount
        }

# Create privacy agent
privacy_agent = Agent(
    role='Privacy Specialist',
    goal='Handle all private transactions securely',
    backstory='Expert in blockchain privacy and stealth addresses',
    tools=[SipherTool()],
    verbose=True
)

# Create task
privacy_task = Task(
    description='Generate a stealth address and send 1 SOL privately',
    agent=privacy_agent
)

# Execute
crew = Crew(agents=[privacy_agent], tasks=[privacy_task])
result = crew.kickoff()
```

## Best Practices

1. **Always use idempotency keys** for mutation operations
2. **Store viewing keys securely** for compliance
3. **Batch operations** when possible to save API calls
4. **Use sessions** for persistent agent defaults
5. **Handle rate limits** gracefully with exponential backoff
6. **Validate responses** before using data
7. **Log operations** for audit trail (without exposing keys)
8. **Test on devnet** before mainnet deployment
9. **Monitor usage** to avoid quota exhaustion
10. **Rotate API keys** regularly for security
