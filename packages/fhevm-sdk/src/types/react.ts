import { ReactNode } from 'react'
import { FhevmConfig, FhevmInstance, EncryptionType, EncryptedValue } from './index'

export interface FhevmProviderProps {
  children: ReactNode
  config?: FhevmConfig
  network?: string
}

export interface UseFhevmInstanceReturn {
  fhevm: FhevmInstance | null
  isReady: boolean
  error: Error | null
}

export interface UseEncryptReturn {
  encrypt: (value: number | bigint, type: EncryptionType) => Promise<string>
  isEncrypting: boolean
  error: Error | null
}

export interface UseDecryptReturn {
  decrypt: (encrypted: string, type: EncryptionType) => Promise<number | bigint>
  isDecrypting: boolean
  error: Error | null
}
