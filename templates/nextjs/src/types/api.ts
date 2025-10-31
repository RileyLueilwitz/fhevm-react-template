/**
 * API Type Definitions
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface ContractCallParams {
  contractAddress: string
  functionName: string
  args: any[]
}

export interface TransactionResult {
  hash: string
  blockNumber: number
  status: 'success' | 'failed'
  gasUsed: string
}

export interface EncryptionApiRequest {
  value: number
  type: string
}

export interface EncryptionApiResponse {
  encryptedData: string
  timestamp: number
}
