<template>
  <div class="app">
    <header class="header">
      <h1>🌱 Private Green Travel Rewards</h1>
      <p class="subtitle">Vue.js + FHEVM SDK Example</p>
    </header>

    <main class="main">
      <!-- Connection Status Card -->
      <div class="card">
        <h2>📡 Connection Status</h2>
        <div class="status-grid">
          <div class="status-item">
            <span class="label">Wallet:</span>
            <span :class="walletClass">{{ walletStatus }}</span>
          </div>
          <div class="status-item">
            <span class="label">FHEVM:</span>
            <span :class="fhevmClass">{{ fhevmStatus }}</span>
          </div>
          <div class="status-item">
            <span class="label">Network:</span>
            <span class="value">{{ network }}</span>
          </div>
          <div v-if="account" class="status-item full-width">
            <span class="label">Account:</span>
            <span class="address">{{ formatAddress(account) }}</span>
          </div>
        </div>
        <button
          v-if="!account"
          @click="connectWallet"
          class="btn btn-primary"
          :disabled="isConnecting"
        >
          {{ isConnecting ? 'Connecting...' : 'Connect Wallet' }}
        </button>
      </div>

      <!-- Submit Travel Data Card -->
      <div v-if="account && isFhevmReady" class="card">
        <h2>🚲 Submit Travel Data</h2>
        <p class="description">
          Enter your carbon savings (kg CO₂). Data is encrypted using FHE before submission.
        </p>

        <div class="input-group">
          <label for="carbonSaved">Carbon Saved (kg CO₂):</label>
          <input
            id="carbonSaved"
            v-model.number="carbonSaved"
            type="number"
            placeholder="Enter carbon saved..."
            min="0"
            step="0.1"
            :disabled="isSubmitting"
          />
        </div>

        <button
          @click="submitData"
          class="btn btn-primary"
          :disabled="isSubmitting || !carbonSaved || carbonSaved <= 0"
        >
          {{ isSubmitting ? 'Submitting...' : 'Submit Encrypted Data' }}
        </button>

        <div v-if="message" :class="messageClass" class="message">
          {{ message }}
        </div>

        <!-- Tier Information -->
        <div class="tier-info">
          <h3>Reward Tiers:</h3>
          <div class="tier-grid">
            <div class="tier">
              <span class="tier-name">Bronze</span>
              <span class="tier-value">&lt; 50 kg</span>
            </div>
            <div class="tier">
              <span class="tier-name">Silver</span>
              <span class="tier-value">50-99 kg</span>
            </div>
            <div class="tier">
              <span class="tier-name">Gold</span>
              <span class="tier-value">100+ kg</span>
            </div>
          </div>
        </div>
      </div>

      <!-- SDK Integration Example -->
      <div class="card">
        <h2>💻 Vue SDK Integration</h2>
        <div class="code-example">
          <pre><code>{{ sdkExample }}</code></pre>
        </div>
      </div>
    </main>

    <footer class="footer">
      <p>Built with FHEVM SDK • Zama Technology • Vue 3 + TypeScript</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFhevm } from './composables/useFhevm'

const CONTRACT_ADDRESS = '0xA15ED92d12d602e0f2024C7AFe3692F17bCe6FA2'
const CONTRACT_ABI = [
  'function submitTravelData(bytes calldata encryptedCarbonSaved) external',
  'event TravelDataSubmitted(address indexed user, uint256 timestamp)'
]

// State
const carbonSaved = ref<number>(0)
const message = ref('')
const messageType = ref<'success' | 'error' | 'info'>('info')
const isConnecting = ref(false)
const isSubmitting = ref(false)

// Use FHEVM composable
const {
  account,
  network,
  isFhevmReady,
  connectWallet: connect,
  encrypt,
  getContract
} = useFhevm()

// Computed
const walletStatus = computed(() => account.value ? 'Connected' : 'Not Connected')
const fhevmStatus = computed(() => isFhevmReady.value ? 'Ready' : 'Initializing...')
const walletClass = computed(() => account.value ? 'status-connected' : 'status-disconnected')
const fhevmClass = computed(() => isFhevmReady.value ? 'status-connected' : 'status-pending')
const messageClass = computed(() => `message-${messageType.value}`)

const sdkExample = computed(() => `// Vue 3 Composition API
import { useFhevm } from './composables/useFhevm'

const {
  account,
  isFhevmReady,
  encrypt
} = useFhevm()

// Encrypt data
const encrypted = await encrypt(value, 'uint32')

// Submit to contract
const contract = getContract(address, abi)
await contract.submitTravelData(encrypted)`)

// Methods
const formatAddress = (address: string): string => {
  return `${address.substring(0, 6)}...${address.substring(38)}`
}

const connectWallet = async () => {
  isConnecting.value = true
  try {
    await connect()
    message.value = 'Wallet connected successfully!'
    messageType.value = 'success'
  } catch (error) {
    message.value = `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    messageType.value = 'error'
  } finally {
    isConnecting.value = false
  }
}

const submitData = async () => {
  if (!carbonSaved.value || carbonSaved.value <= 0) {
    message.value = 'Please enter a valid carbon savings amount'
    messageType.value = 'error'
    return
  }

  isSubmitting.value = true
  message.value = 'Encrypting data with FHE...'
  messageType.value = 'info'

  try {
    // Step 1: Encrypt the data
    const encryptedValue = await encrypt(carbonSaved.value, 'uint32')
    message.value = 'Data encrypted! Submitting to blockchain...'

    // Step 2: Get contract instance
    const contract = getContract(CONTRACT_ADDRESS, CONTRACT_ABI)

    // Step 3: Submit transaction
    const tx = await contract.submitTravelData(encryptedValue)
    message.value = 'Transaction submitted! Waiting for confirmation...'

    // Step 4: Wait for confirmation
    await tx.wait()

    message.value = `✅ Success! Encrypted ${carbonSaved.value} kg CO₂ submitted to blockchain.`
    messageType.value = 'success'
    carbonSaved.value = 0
  } catch (error) {
    console.error('Submission error:', error)
    message.value = `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    messageType.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  // Auto-connect if wallet was previously connected
  if (window.ethereum) {
    window.ethereum.request({ method: 'eth_accounts' })
      .then((accounts: string[]) => {
        if (accounts.length > 0) {
          connect()
        }
      })
      .catch(console.error)
  }
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.main {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.card h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.status-item.full-width {
  grid-column: 1 / -1;
}

.label {
  font-weight: 600;
  color: #666;
}

.value {
  color: #333;
}

.address {
  font-family: monospace;
  color: #667eea;
  font-size: 0.9rem;
}

.status-connected {
  color: #10b981;
  font-weight: 600;
}

.status-disconnected {
  color: #ef4444;
  font-weight: 600;
}

.status-pending {
  color: #f59e0b;
  font-weight: 600;
}

.description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.input-group input:focus {
  outline: none;
  border-color: #667eea;
}

.input-group input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.btn {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 500;
}

.message-success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #10b981;
}

.message-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #ef4444;
}

.message-info {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #3b82f6;
}

.tier-info {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.tier-info h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.tier-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.tier {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border-radius: 8px;
  border: 2px solid #667eea30;
}

.tier-name {
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.tier-value {
  color: #666;
  font-size: 0.9rem;
}

.code-example {
  background: #1e293b;
  border-radius: 8px;
  padding: 1.5rem;
  overflow-x: auto;
}

.code-example pre {
  margin: 0;
}

.code-example code {
  color: #e2e8f0;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
}

.footer {
  text-align: center;
  color: white;
  margin-top: 2rem;
  padding: 1rem;
  opacity: 0.9;
}

@media (max-width: 640px) {
  .header h1 {
    font-size: 1.75rem;
  }

  .card {
    padding: 1.5rem;
  }

  .status-grid {
    grid-template-columns: 1fr;
  }
}
</style>
