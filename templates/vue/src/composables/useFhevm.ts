import { ref, onMounted, type Ref } from 'vue'
import { BrowserProvider, Contract, type Eip1193Provider } from 'ethers'
import { createInstance, type FhevmInstance } from 'fhevmjs'

declare global {
  interface Window {
    ethereum?: Eip1193Provider
  }
}

export interface UseFhevmReturn {
  account: Ref<string | null>
  network: Ref<string>
  isFhevmReady: Ref<boolean>
  fhevmInstance: Ref<FhevmInstance | null>
  provider: Ref<BrowserProvider | null>
  connectWallet: () => Promise<void>
  encrypt: (value: number, type: string) => Promise<string>
  getContract: (address: string, abi: any[]) => Contract
}

export function useFhevm(): UseFhevmReturn {
  const account = ref<string | null>(null)
  const network = ref<string>('Sepolia')
  const isFhevmReady = ref<boolean>(false)
  const fhevmInstance = ref<FhevmInstance | null>(null)
  const provider = ref<BrowserProvider | null>(null)

  const initializeFhevm = async () => {
    try {
      console.log('Initializing FHEVM instance...')

      const instance = await createInstance({
        chainId: 11155111, // Sepolia
        networkUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
        gatewayUrl: 'https://gateway.sepolia.zama.ai'
      })

      fhevmInstance.value = instance
      isFhevmReady.value = true
      console.log('FHEVM instance ready!')
    } catch (error) {
      console.error('Failed to initialize FHEVM:', error)
      isFhevmReady.value = false
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed')
    }

    try {
      const browserProvider = new BrowserProvider(window.ethereum)
      provider.value = browserProvider

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      }) as string[]

      if (accounts.length > 0) {
        account.value = accounts[0]

        // Get network
        const network = await browserProvider.getNetwork()
        if (network.chainId === 11155111n) {
          // Already on Sepolia
        } else {
          // Request switch to Sepolia
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xaa36a7' }] // Sepolia chainId in hex
            })
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              throw new Error('Please add Sepolia network to MetaMask')
            }
            throw switchError
          }
        }
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      throw error
    }
  }

  const encrypt = async (value: number, type: string = 'uint32'): Promise<string> => {
    if (!fhevmInstance.value) {
      throw new Error('FHEVM instance not initialized')
    }

    if (!provider.value || !account.value) {
      throw new Error('Wallet not connected')
    }

    try {
      const signer = await provider.value.getSigner()

      // Create encryption input
      const input = fhevmInstance.value.createEncryptedInput(
        '0xA15ED92d12d602e0f2024C7AFe3692F17bCe6FA2', // Contract address
        account.value
      )

      // Add the value to encrypt
      if (type === 'uint32') {
        input.add32(value)
      } else if (type === 'uint64') {
        input.add64(value)
      } else {
        throw new Error(`Unsupported type: ${type}`)
      }

      const encryptedInput = input.encrypt()

      return encryptedInput.data
    } catch (error) {
      console.error('Encryption error:', error)
      throw error
    }
  }

  const getContract = (address: string, abi: any[]): Contract => {
    if (!provider.value) {
      throw new Error('Provider not initialized')
    }

    return new Contract(
      address,
      abi,
      provider.value.getSigner() as any
    )
  }

  onMounted(() => {
    initializeFhevm()

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on?.('accountsChanged', (accounts: unknown) => {
        const accountArray = accounts as string[]
        account.value = accountArray.length > 0 ? accountArray[0] : null
      })

      window.ethereum.on?.('chainChanged', () => {
        window.location.reload()
      })
    }
  })

  return {
    account,
    network,
    isFhevmReady,
    fhevmInstance,
    provider,
    connectWallet,
    encrypt,
    getContract
  }
}
