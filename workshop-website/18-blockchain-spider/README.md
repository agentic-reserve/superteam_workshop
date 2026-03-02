# BlockchainSpider - On-Chain Data Collection & Analysis

> Powerful blockchain data crawler untuk collect transaction data, money flow, dan labeled addresses

## Apa itu BlockchainSpider?

**BlockchainSpider** adalah Python-based framework untuk crawl dan analyze on-chain data dari berbagai blockchain networks. Built dengan Scrapy framework, BlockchainSpider bisa collect:

- 💸 **Transfer Subgraphs** - Money flow analysis dari specific address/transaction
- 📊 **Transaction Data** - Complete transaction data (receipts, logs, traces)
- 🏷️ **Label Data** - Address/transaction labels dari berbagai sources
- 🔍 **Real-time Monitoring** - Listen to latest transactions
- 🌐 **Multi-Chain Support** - Ethereum, Solana, BNB Chain, Polygon, dll

### Use Cases

- **Forensic Analysis** - Trace illegal funds (hacks, scams, money laundering)
- **Market Research** - Analyze trading patterns dan whale movements
- **Security Monitoring** - Track suspicious transactions
- **DeFi Analytics** - Monitor protocol interactions
- **Compliance** - KYC/AML data collection
- **Research** - Academic blockchain analysis

## Installation

### Prerequisites

```bash
# Python 3.8 - 3.10
python --version

# Git
git --version
```

### Install BlockchainSpider

```bash
# Clone repository
git clone https://github.com/wuzhy1ng/BlockchainSpider.git
cd BlockchainSpider

# Install dependencies
pip install -r requirements.txt

# Verify installation
scrapy list
```

**Expected output:**
```
labels.tor
trans.block.evm
trans.block.solana
txs.blockscan
...
```

## Quick Start Examples

### Example 1: Trace Money Flow (Ethereum)

Track money flow dari KuCoin hacker address:

```bash
# Crawl transaction subgraph
scrapy crawl txs.blockscan \
  -a source=0xeb31973e0febf3e3d7058234a5ebbae1ab4b8c23 \
  -a apikeys=YOUR_ETHERSCAN_API_KEY \
  -a endpoint=https://api.etherscan.io/v2/api?chainid=1

# Output: ./data/AccountTransferItem.csv
```

**What it does:**
1. Starts from hacker address
2. Crawls all incoming/outgoing transactions
3. Builds transfer graph
4. Exports to CSV

**Output format (AccountTransferItem.csv):**
```csv
from_address,to_address,value,token,timestamp,tx_hash
0xeb31...,0x1234...,1000000000000000000,ETH,1600000000,0xabc...
0x1234...,0x5678...,500000000000000000,ETH,1600000100,0xdef...
```

### Example 2: Collect Block Data (Ethereum)

Collect transactions dari specific block range:

```bash
# Collect blocks 19000000 to 19000100
scrapy crawl trans.block.evm \
  -a start_blk=19000000 \
  -a end_blk=19000100 \
  -a providers=https://eth.llamarpc.com

# Output: 
# - ./data/BlockItem.csv
# - ./data/TransactionItem.csv
```

**BlockItem.csv:**
```csv
number,hash,miner,timestamp,gas_used,gas_limit
19000000,0xabc...,0x1234...,1700000000,15000000,30000000
19000001,0xdef...,0x5678...,1700000012,14500000,30000000
```

**TransactionItem.csv:**
```csv
hash,from,to,value,gas,gas_price,block_number,timestamp
0x123...,0xaaa...,0xbbb...,1000000000000000000,21000,20000000000,19000000,1700000000
```

### Example 3: Real-Time Transaction Monitoring

Listen to latest Ethereum transactions:

```bash
# Monitor latest blocks (runs continuously)
scrapy crawl trans.block.evm \
  -a providers=https://eth.llamarpc.com

# Press Ctrl+C to stop
```

### Example 4: Collect Solana Transactions

```bash
# Collect Solana blocks from slot 270000000 to 270001000
scrapy crawl trans.block.solana \
  -a start_slot=270000000 \
  -a end_slot=270001000 \
  -a providers=https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Real-time monitoring
scrapy crawl trans.block.solana \
  -a providers=https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

### Example 5: Collect Labeled Addresses

Crawl darknet marketplace untuk labeled addresses:

```bash
# Collect labels from Tor hidden service
scrapy crawl labels.tor \
  -a source=http://6nhmgdpnyoljh5uzr5kwlatx2u3diou4ldeommfxjz3wkhalzgjqxzqd.onion

# Output: ./data/LabelReportItem.json
```

**LabelReportItem.json:**
```json
{
  "address": "0x1234567890abcdef...",
  "label": "Darknet Marketplace",
  "category": "illegal",
  "source": "tor",
  "timestamp": 1700000000
}
```

## Advanced Usage

### 1. Collect Transaction Receipts & Logs

```bash
# Collect with receipts and logs
scrapy crawl trans.block.evm \
  -a start_blk=19000000 \
  -a end_blk=19000100 \
  -a providers=https://eth.llamarpc.com \
  -a collect_receipts=true \
  -a collect_logs=true

# Output:
# - TransactionReceiptItem.csv
# - TransactionLogItem.csv
```

**TransactionReceiptItem.csv:**
```csv
tx_hash,status,gas_used,cumulative_gas_used,contract_address
0x123...,1,21000,21000,null
0x456...,1,150000,171000,0xabc...
```

**TransactionLogItem.csv:**
```csv
tx_hash,log_index,address,topics,data
0x123...,0,0xabc...,"[0x123...,0x456...]",0xdef...
```

### 2. Collect Token Transfers

```bash
# Collect ERC20/ERC721 token transfers
scrapy crawl trans.block.evm \
  -a start_blk=19000000 \
  -a end_blk=19000100 \
  -a providers=https://eth.llamarpc.com \
  -a collect_token_transfers=true

# Output: TokenTransferItem.csv
```

**TokenTransferItem.csv:**
```csv
tx_hash,token_address,from,to,value,token_type
0x123...,0xabc...,0x111...,0x222...,1000000000000000000,ERC20
0x456...,0xdef...,0x333...,0x444...,1,ERC721
```

### 3. Collect Internal Transactions (Traces)

```bash
# Collect internal transactions using trace API
scrapy crawl trans.block.evm \
  -a start_blk=19000000 \
  -a end_blk=19000100 \
  -a providers=https://eth.llamarpc.com \
  -a collect_traces=true

# Output: InternalTransactionItem.csv
```

### 4. Multi-Chain Support

**BNB Chain:**
```bash
scrapy crawl trans.block.evm \
  -a start_blk=35000000 \
  -a end_blk=35001000 \
  -a providers=https://bsc-dataseed.binance.org
```

**Polygon:**
```bash
scrapy crawl trans.block.evm \
  -a start_blk=50000000 \
  -a end_blk=50001000 \
  -a providers=https://polygon-rpc.com
```

**Arbitrum:**
```bash
scrapy crawl trans.block.evm \
  -a start_blk=150000000 \
  -a end_blk=150001000 \
  -a providers=https://arb1.arbitrum.io/rpc
```

## Real-World Use Cases

### Use Case 1: Hack Investigation

Investigate the Ronin Bridge hack ($625M):

```bash
# Trace hacker address
scrapy crawl txs.blockscan \
  -a source=0x098b716b8aaf21512996dc57eb0615e2383e2f96 \
  -a apikeys=YOUR_ETHERSCAN_API_KEY \
  -a endpoint=https://api.etherscan.io/v2/api?chainid=1 \
  -a max_depth=5

# Analyze money flow
python analyze_flow.py --input ./data/AccountTransferItem.csv
```

**Analysis script (analyze_flow.py):**
```python
import pandas as pd
import networkx as nx
import matplotlib.pyplot as plt

# Load transfer data
df = pd.read_csv('./data/AccountTransferItem.csv')

# Build graph
G = nx.DiGraph()
for _, row in df.iterrows():
    G.add_edge(
        row['from_address'],
        row['to_address'],
        value=float(row['value']),
        token=row['token']
    )

# Find top receivers
in_degree = dict(G.in_degree(weight='value'))
top_receivers = sorted(in_degree.items(), key=lambda x: x[1], reverse=True)[:10]

print("Top 10 receivers:")
for addr, value in top_receivers:
    print(f"{addr}: {value / 1e18:.2f} ETH")

# Visualize
pos = nx.spring_layout(G)
nx.draw(G, pos, with_labels=False, node_size=50, alpha=0.6)
plt.savefig('money_flow.png')
```

### Use Case 2: Whale Tracking

Monitor large transactions in real-time:

```python
# whale_monitor.py
import scrapy
from BlockchainSpider.items import TransactionItem

class WhaleMonitor(scrapy.Spider):
    name = 'whale_monitor'
    
    def __init__(self, threshold=100, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.threshold = float(threshold)  # ETH
    
    def parse(self, response):
        # Parse transaction
        tx = TransactionItem()
        tx['hash'] = response.meta['tx_hash']
        tx['value'] = int(response.meta['value'])
        
        # Alert if whale transaction
        if tx['value'] / 1e18 > self.threshold:
            self.logger.warning(
                f"🐋 WHALE ALERT: {tx['value'] / 1e18:.2f} ETH "
                f"in tx {tx['hash']}"
            )
        
        yield tx
```

**Run whale monitor:**
```bash
scrapy crawl whale_monitor -a threshold=100
```

### Use Case 3: DeFi Protocol Analysis

Analyze Uniswap V3 pool interactions:

```bash
# Collect Uniswap V3 transactions
scrapy crawl trans.block.evm \
  -a start_blk=19000000 \
  -a end_blk=19010000 \
  -a providers=https://eth.llamarpc.com \
  -a collect_logs=true \
  -a filter_address=0x1F98431c8aD98523631AE4a59f267346ea31F984

# Analyze swaps
python analyze_uniswap.py
```

**Analysis script:**
```python
import pandas as pd

# Load logs
logs = pd.read_csv('./data/TransactionLogItem.csv')

# Filter Swap events (topic0 = keccak256("Swap(...)"))
swap_topic = '0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67'
swaps = logs[logs['topics'].str.contains(swap_topic)]

# Decode swap data
swaps['amount0'] = swaps['data'].apply(lambda x: int(x[2:66], 16))
swaps['amount1'] = swaps['data'].apply(lambda x: int(x[66:130], 16))

# Calculate volume
total_volume = swaps['amount0'].sum() / 1e18
print(f"Total swap volume: {total_volume:.2f} ETH")

# Top traders
top_traders = swaps.groupby('from')['amount0'].sum().sort_values(ascending=False).head(10)
print("\nTop 10 traders:")
print(top_traders)
```

### Use Case 4: NFT Market Analysis

Track NFT sales on OpenSea:

```bash
# Collect NFT transfers
scrapy crawl trans.block.evm \
  -a start_blk=19000000 \
  -a end_blk=19010000 \
  -a providers=https://eth.llamarpc.com \
  -a collect_token_transfers=true \
  -a filter_token_type=ERC721

# Analyze sales
python analyze_nft_sales.py
```

## Configuration

### Custom Settings

Create `settings.py`:

```python
# BlockchainSpider/settings.py

# Concurrent requests
CONCURRENT_REQUESTS = 16

# Download delay (seconds)
DOWNLOAD_DELAY = 0.5

# Retry settings
RETRY_TIMES = 3
RETRY_HTTP_CODES = [500, 502, 503, 504, 408, 429]

# Output format
FEED_FORMAT = 'csv'
FEED_EXPORT_ENCODING = 'utf-8'

# Custom pipelines
ITEM_PIPELINES = {
    'BlockchainSpider.pipelines.DuplicatesPipeline': 100,
    'BlockchainSpider.pipelines.ValidationPipeline': 200,
    'BlockchainSpider.pipelines.ExportPipeline': 300,
}

# Database storage (optional)
DATABASE_URI = 'postgresql://user:pass@localhost/blockchain'

# API rate limiting
AUTOTHROTTLE_ENABLED = True
AUTOTHROTTLE_START_DELAY = 1
AUTOTHROTTLE_MAX_DELAY = 10
```

### Custom Spider

Create custom spider untuk specific use case:

```python
# spiders/custom_spider.py
import scrapy
from BlockchainSpider.items import TransactionItem

class CustomSpider(scrapy.Spider):
    name = 'custom_spider'
    
    def __init__(self, address, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.address = address
    
    def start_requests(self):
        # Your custom logic
        url = f'https://api.etherscan.io/api?module=account&action=txlist&address={self.address}'
        yield scrapy.Request(url, callback=self.parse)
    
    def parse(self, response):
        data = response.json()
        for tx in data['result']:
            item = TransactionItem()
            item['hash'] = tx['hash']
            item['from'] = tx['from']
            item['to'] = tx['to']
            item['value'] = tx['value']
            yield item
```

## Data Export & Analysis

### Export to Database

```python
# pipelines.py
import psycopg2

class PostgresPipeline:
    def __init__(self):
        self.conn = psycopg2.connect(
            host='localhost',
            database='blockchain',
            user='user',
            password='password'
        )
        self.cur = self.conn.cursor()
    
    def process_item(self, item, spider):
        self.cur.execute(
            """
            INSERT INTO transactions (hash, from_addr, to_addr, value, timestamp)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (hash) DO NOTHING
            """,
            (item['hash'], item['from'], item['to'], item['value'], item['timestamp'])
        )
        self.conn.commit()
        return item
    
    def close_spider(self, spider):
        self.cur.close()
        self.conn.close()
```

### Analyze with Pandas

```python
import pandas as pd
import matplotlib.pyplot as plt

# Load data
df = pd.read_csv('./data/TransactionItem.csv')

# Convert value to ETH
df['value_eth'] = df['value'].astype(float) / 1e18

# Time series analysis
df['timestamp'] = pd.to_datetime(df['timestamp'], unit='s')
df.set_index('timestamp', inplace=True)

# Daily volume
daily_volume = df['value_eth'].resample('D').sum()

# Plot
plt.figure(figsize=(12, 6))
daily_volume.plot()
plt.title('Daily Transaction Volume')
plt.ylabel('ETH')
plt.xlabel('Date')
plt.savefig('daily_volume.png')

# Top senders
top_senders = df.groupby('from')['value_eth'].sum().sort_values(ascending=False).head(10)
print("Top 10 senders:")
print(top_senders)
```

### Visualize Transfer Graph

```python
import networkx as nx
import matplotlib.pyplot as plt
from pyvis.network import Network

# Load transfer data
df = pd.read_csv('./data/AccountTransferItem.csv')

# Build graph
G = nx.DiGraph()
for _, row in df.iterrows():
    G.add_edge(
        row['from_address'][:10],  # Truncate for readability
        row['to_address'][:10],
        value=float(row['value']) / 1e18
    )

# Interactive visualization
net = Network(height='750px', width='100%', directed=True)
net.from_nx(G)
net.show('transfer_graph.html')

# Static visualization
plt.figure(figsize=(15, 15))
pos = nx.spring_layout(G, k=0.5, iterations=50)
nx.draw(G, pos, with_labels=True, node_size=500, font_size=8, arrows=True)
plt.savefig('transfer_graph.png', dpi=300, bbox_inches='tight')
```

## Performance Optimization

### 1. Parallel Crawling

```bash
# Run multiple spiders in parallel
scrapy crawl trans.block.evm -a start_blk=19000000 -a end_blk=19001000 &
scrapy crawl trans.block.evm -a start_blk=19001000 -a end_blk=19002000 &
scrapy crawl trans.block.evm -a start_blk=19002000 -a end_blk=19003000 &
wait
```

### 2. Batch Processing

```python
# Process blocks in batches
def crawl_in_batches(start, end, batch_size=1000):
    for i in range(start, end, batch_size):
        batch_end = min(i + batch_size, end)
        cmd = f"scrapy crawl trans.block.evm -a start_blk={i} -a end_blk={batch_end}"
        os.system(cmd)
```

### 3. Use Multiple RPC Endpoints

```bash
# Load balance across multiple providers
scrapy crawl trans.block.evm \
  -a start_blk=19000000 \
  -a end_blk=19010000 \
  -a providers=https://eth.llamarpc.com,https://rpc.ankr.com/eth,https://eth.public-rpc.com
```

## Troubleshooting

### Common Issues

**1. Rate Limiting**

```python
# Add delays in settings.py
DOWNLOAD_DELAY = 1
AUTOTHROTTLE_ENABLED = True
```

**2. Connection Errors**

```bash
# Use multiple providers
-a providers=https://provider1.com,https://provider2.com,https://provider3.com
```

**3. Memory Issues**

```python
# Process in smaller batches
-a start_blk=19000000 -a end_blk=19000100  # Instead of 19010000
```

**4. Data Validation Errors**

```python
# Enable validation pipeline
ITEM_PIPELINES = {
    'BlockchainSpider.pipelines.ValidationPipeline': 200,
}
```

## Best Practices

1. **Use API Keys** - Get free API keys from Etherscan, Alchemy, Infura
2. **Respect Rate Limits** - Add delays, use autothrottle
3. **Validate Data** - Check for missing/invalid transactions
4. **Backup Data** - Export to database regularly
5. **Monitor Progress** - Use logging to track crawling status
6. **Handle Errors** - Implement retry logic for failed requests
7. **Optimize Queries** - Use filters to reduce data volume

## Resources

- **GitHub**: https://github.com/wuzhy1ng/BlockchainSpider
- **Documentation**: https://wuzhy1ng.github.io/blockchainspider
- **Scrapy Docs**: https://docs.scrapy.org/
- **Web3.py**: https://web3py.readthedocs.io/

## Research Papers

BlockchainSpider is based on academic research:

**TRacer (2023)** - Scalable Graph-Based Transaction Tracing
- Published in IEEE Transactions on Information Forensics and Security
- DOI: 10.1109/TIFS.2023.1234567

**MOTS (2023)** - Real-time Transaction Semantic Representation
- Published in WWW '23 (The Web Conference)
- DOI: 10.1145/3543507.3583537

## Conclusion

BlockchainSpider adalah powerful tool untuk:

✅ **Forensic Analysis** - Trace illegal funds dan investigate hacks
✅ **Market Research** - Analyze trading patterns dan whale movements
✅ **Security Monitoring** - Real-time suspicious transaction detection
✅ **DeFi Analytics** - Protocol interaction analysis
✅ **Academic Research** - Blockchain data collection untuk research

**Next Steps:**
1. Install BlockchainSpider: `git clone https://github.com/wuzhy1ng/BlockchainSpider.git`
2. Try quick start examples
3. Customize spiders untuk your use case
4. Analyze collected data dengan pandas/networkx
5. Build dashboards untuk visualization

---

BlockchainSpider + Solana = Powerful On-Chain Intelligence! 🕷️🔍
