/**
 * Custom FHE Hook
 * Combines multiple SDK hooks for simplified usage
 */

import { useFhevmInstance, useEncrypt } from '@fhevm/sdk/react'
import { useState, useCallback } from 'react'

export interface UseFHEReturn {
  fhevm: any
  isReady: boolean
  encrypt: (value: number, type?: string) => Promise<string>
  isEncrypting: boolean
  error: string | null
}

export function useFHE(): UseFHEReturn {
  const { fhevm, isReady } = useFhevmInstance()
  const { encrypt: sdkEncrypt, isEncrypting } = useEncrypt()
  const [error, setError] = useState<string | null>(null)

  const encrypt = useCallback(async (value: number, type: string = 'uint32'): Promise<string> => {
    try {
      setError(null)
      const result = await sdkEncrypt(value, type)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Encryption failed'
      setError(errorMessage)
      throw err
    }
  }, [sdkEncrypt])

  return {
    fhevm,
    isReady,
    encrypt,
    isEncrypting,
    error
  }
}
