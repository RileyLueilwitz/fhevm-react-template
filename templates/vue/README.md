# FHEVM Vue.js Example

A complete Vue 3 + TypeScript example demonstrating FHEVM SDK integration for building privacy-preserving applications.

## Features

- ✨ Vue 3 Composition API with TypeScript
- 🔐 Full FHEVM SDK integration
- 🎣 Custom composable (`useFhevm`) for FHE operations
- 🚀 Vite for fast development and building
- 💼 MetaMask wallet integration
- 🌱 Green Travel Rewards demo application
- 📦 Production-ready build configuration

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3002`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
vue/
├── src/
│   ├── App.vue                    # Main application component
│   ├── main.ts                    # Application entry point
│   ├── composables/
│   │   └── useFhevm.ts           # FHEVM composable (Vue hook)
│   └── styles/
│       └── globals.css           # Global styles
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                # Vite configuration
└── README.md                      # This file
```

## FHEVM SDK Integration

### Using the useFhevm Composable

```vue
<script setup lang="ts">
import { useFhevm } from './composables/useFhevm'

const {
  account,
  network,
  isFhevmReady,
  connectWallet,
  encrypt,
  getContract
} = useFhevm()

// Connect wallet
await connectWallet()

// Encrypt data
const encryptedValue = await encrypt(42, 'uint32')

// Interact with smart contract
const contract = getContract(contractAddress, contractABI)
await contract.submitData(encryptedValue)
</script>
```

### Available Composable Methods

- `account` - Connected wallet address (reactive)
- `network` - Current network name (reactive)
- `isFhevmReady` - FHEVM initialization status (reactive)
- `connectWallet()` - Connect MetaMask wallet
- `encrypt(value, type)` - Encrypt data using FHE
- `getContract(address, abi)` - Get contract instance with signer

## Smart Contract Integration

This example connects to a deployed Green Travel Rewards contract:

```typescript
const CONTRACT_ADDRESS = '0xA15ED92d12d602e0f2024C7AFe3692F17bCe6FA2'
const CONTRACT_ABI = [
  'function submitTravelData(bytes calldata encryptedCarbonSaved) external',
  'event TravelDataSubmitted(address indexed user, uint256 timestamp)'
]
```

## Technologies Used

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Next-generation frontend tooling
- **FHEVM SDK** - Fully homomorphic encryption for blockchain
- **Ethers.js v6** - Ethereum library
- **fhevmjs** - Core FHE functionality

## Network Configuration

Configured for **Sepolia Testnet**:
- Chain ID: 11155111
- RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
- Gateway: https://gateway.sepolia.zama.ai

## Development Tips

### Type Checking

```bash
npm run typecheck
```

### Hot Module Replacement

Vite provides instant HMR - changes appear immediately in the browser without full page reload.

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_CONTRACT_ADDRESS=0xA15ED92d12d602e0f2024C7AFe3692F17bCe6FA2
VITE_NETWORK_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
VITE_GATEWAY_URL=https://gateway.sepolia.zama.ai
```

Access in code:

```typescript
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
```

## Key Differences from React

Vue uses the Composition API instead of React hooks:

| React | Vue |
|-------|-----|
| `useState` | `ref` / `reactive` |
| `useEffect` | `onMounted` / `watch` |
| `useMemo` | `computed` |
| Custom hooks | Composables |

Example:

```typescript
// React
const [count, setCount] = useState(0)
useEffect(() => { /* ... */ }, [])

// Vue
const count = ref(0)
onMounted(() => { /* ... */ })
```

## Troubleshooting

### MetaMask Not Detected

Ensure MetaMask browser extension is installed and enabled.

### FHEVM Initialization Failed

Check console for errors. Verify network connectivity to Sepolia testnet and Zama gateway.

### Wrong Network

The app will prompt you to switch to Sepolia if you're on a different network.

## Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [FHEVM SDK Documentation](https://docs.zama.ai/fhevm)
- [Ethers.js Documentation](https://docs.ethers.org/v6/)

## License

MIT
