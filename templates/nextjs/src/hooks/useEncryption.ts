/**
 * Encryption Hook
 * Simplified hook for encryption operations
 */

import { useEncrypt as useSDKEncrypt } from '@fhevm/sdk/react'
import { useState, useCallback } from 'react'
import { validateCarbonSavings } from '../lib/utils/validation'

export interface UseEncryptionReturn {
  encryptValue: (value: number) => Promise<string>
  isEncrypting: boolean
  error: string | null
  clearError: () => void
}

export function useEncryption(): UseEncryptionReturn {
  const { encrypt, isEncrypting } = useSDKEncrypt()
  const [error, setError] = useState<string | null>(null)

  const encryptValue = useCallback(async (value: number): Promise<string> => {
    // Validate input
    const validation = validateCarbonSavings(value)
    if (!validation.isValid) {
      setError(validation.error || 'Invalid value')
      throw new Error(validation.error)
    }

    try {
      setError(null)
      const encrypted = await encrypt(value, 'uint32')
      return encrypted
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Encryption failed'
      setError(errorMsg)
      throw err
    }
  }, [encrypt])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    encryptValue,
    isEncrypting,
    error,
    clearError
  }
}
