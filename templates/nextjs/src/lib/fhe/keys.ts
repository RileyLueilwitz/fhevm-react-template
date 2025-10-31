import { createFhevmInstance } from './client'

export interface KeyPair {
  publicKey: string
  privateKey?: string
}

export async function generateKeyPair(): Promise<KeyPair> {
  const fhevm = await createFhevmInstance()
  const publicKey = await fhevm.getPublicKey()

  return {
    publicKey
  }
}

export async function getPublicKey(): Promise<string> {
  const fhevm = await createFhevmInstance()
  return await fhevm.getPublicKey()
}

export async function refreshKeys(): Promise<void> {
  const fhevm = await createFhevmInstance()
  await fhevm.refreshKeys()
}
