/**
 * Security Utilities
 */

export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '')
}

export function validateAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function validateNumber(value: number, min: number = 0, max: number = Number.MAX_SAFE_INTEGER): boolean {
  return typeof value === 'number' && !isNaN(value) && value >= min && value <= max
}

export function truncateAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (!validateAddress(address)) {
    return address
  }
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`
}

export function isValidTransactionHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
}
