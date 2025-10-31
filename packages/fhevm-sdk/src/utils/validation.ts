import { EncryptionType } from '../types'

export function isValidEncryptionType(type: string): type is EncryptionType {
  const validTypes: EncryptionType[] = [
    'uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256',
    'int8', 'int16', 'int32', 'int64',
    'address', 'bool'
  ]
  return validTypes.includes(type as EncryptionType)
}

export function validateValue(value: number | bigint, type: EncryptionType): boolean {
  const numValue = typeof value === 'bigint' ? value : BigInt(value)

  switch (type) {
    case 'uint8':
      return numValue >= 0n && numValue <= 255n
    case 'uint16':
      return numValue >= 0n && numValue <= 65535n
    case 'uint32':
      return numValue >= 0n && numValue <= 4294967295n
    case 'uint64':
      return numValue >= 0n && numValue <= 18446744073709551615n
    case 'bool':
      return numValue === 0n || numValue === 1n
    case 'int8':
      return numValue >= -128n && numValue <= 127n
    case 'int16':
      return numValue >= -32768n && numValue <= 32767n
    case 'int32':
      return numValue >= -2147483648n && numValue <= 2147483647n
    case 'int64':
      return numValue >= -9223372036854775808n && numValue <= 9223372036854775807n
    default:
      return true
  }
}

export function validateAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function validateNetwork(network: string): boolean {
  const validNetworks = ['sepolia', 'mainnet', 'localhost']
  return validNetworks.includes(network.toLowerCase())
}
