export interface FhevmConfig {
  network: 'sepolia' | 'mainnet' | 'localhost'
  gatewayUrl?: string
  contractAddress?: string
}

export interface FhevmInstance {
  encrypt: (value: number | bigint, type: EncryptionType) => Promise<EncryptedValue>
  decrypt: (encrypted: EncryptedValue, type: EncryptionType) => Promise<number | bigint>
  getPublicKey: () => Promise<string>
  createEIP712: (contractAddress: string, userAddress: string) => any
}

export type EncryptionType =
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'uint128'
  | 'uint256'
  | 'int8'
  | 'int16'
  | 'int32'
  | 'int64'
  | 'address'
  | 'bool'

export interface EncryptedValue {
  data: Uint8Array
  type: EncryptionType
}

export interface EncryptionResult {
  encrypted: string
  handles: string
  inputProof: string
}

export interface DecryptionParams {
  contractAddress: string
  encrypted: string
  userAddress: string
}

export interface NetworkConfig {
  chainId: number
  name: string
  rpcUrl: string
  gatewayUrl: string
  explorer?: string
}

export const NETWORK_CONFIGS: Record<string, NetworkConfig> = {
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/',
    gatewayUrl: 'https://gateway.sepolia.zama.ai',
    explorer: 'https://sepolia.etherscan.io'
  },
  localhost: {
    chainId: 31337,
    name: 'Localhost',
    rpcUrl: 'http://localhost:8545',
    gatewayUrl: 'http://localhost:8080'
  }
}

export interface FhevmError extends Error {
  code?: string
  details?: unknown
}

export interface ProviderOptions {
  pollingInterval?: number
  timeout?: number
}
