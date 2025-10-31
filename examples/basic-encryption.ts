/**
 * Basic Encryption Example
 *
 * This example demonstrates how to use the FHEVM SDK to encrypt data
 */

import { createFhevmClient } from '../packages/fhevm-sdk/src/adapters/vanilla'

async function basicEncryption() {
  // Create FHEVM client instance
  const client = createFhevmClient({
    network: 'sepolia'
  })

  // Initialize the client
  await client.init()

  // Encrypt a value
  const valueToEncrypt = 42
  const encryptedValue = await client.encrypt(valueToEncrypt, 'uint32')

  console.log('Original value:', valueToEncrypt)
  console.log('Encrypted value:', encryptedValue)

  // Get public key
  const publicKey = await client.getPublicKey()
  console.log('Public key:', publicKey.substring(0, 20) + '...')
}

basicEncryption().catch(console.error)
