/**
 * Input Validation Utilities
 */

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateCarbonSavings(value: number): ValidationResult {
  if (typeof value !== 'number' || isNaN(value)) {
    return { isValid: false, error: 'Value must be a number' }
  }

  if (value <= 0) {
    return { isValid: false, error: 'Value must be positive' }
  }

  if (value > 1000000) {
    return { isValid: false, error: 'Value exceeds maximum limit' }
  }

  return { isValid: true }
}

export function validateWalletConnection(account: string | null): ValidationResult {
  if (!account) {
    return { isValid: false, error: 'Wallet not connected' }
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(account)) {
    return { isValid: false, error: 'Invalid wallet address' }
  }

  return { isValid: true }
}

export function validateNetwork(chainId: number, expectedChainId: number = 11155111): ValidationResult {
  if (chainId !== expectedChainId) {
    return { isValid: false, error: `Wrong network. Please switch to Sepolia (chainId: ${expectedChainId})` }
  }

  return { isValid: true }
}
