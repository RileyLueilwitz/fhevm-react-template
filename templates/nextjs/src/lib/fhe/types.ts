/**
 * FHE Type Definitions
 */

export type FHEType = 'uint32' | 'uint64' | 'uint128' | 'uint256'

export interface FHEConfig {
  network: 'sepolia' | 'mainnet'
  chainId?: number
  gatewayUrl?: string
}

export interface EncryptedInput {
  data: string
  type: FHEType
  contractAddress: string
}

export interface DecryptionRequest {
  encryptedData: string
  signature: string
  publicKey: string
}

export interface FHEInstance {
  publicKey: string
  encrypt: (value: number, type: FHEType) => Promise<string>
  decrypt: (data: string) => Promise<number>
  isReady: boolean
}
