/**
 * FHE Type Definitions for React
 */

export type FHEDataType = 'uint32' | 'uint64' | 'uint128' | 'uint256'

export interface FHEConfig {
  network: 'sepolia' | 'mainnet'
  chainId?: number
  gatewayUrl?: string
}

export interface EncryptedData {
  value: string
  type: FHEDataType
  timestamp: number
}

export interface FHEStatus {
  isReady: boolean
  publicKey: string | null
  error: string | null
}
