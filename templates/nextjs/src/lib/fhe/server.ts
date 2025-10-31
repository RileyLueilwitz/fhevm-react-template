import { createInstance } from 'fhevmjs'

let fhevmInstance: any = null

export async function createFhevmInstance() {
  if (fhevmInstance) {
    return fhevmInstance
  }

  try {
    fhevmInstance = await createInstance({
      network: 'sepolia',
      gatewayUrl: process.env.GATEWAY_URL || 'https://gateway.sepolia.zama.ai'
    })

    return fhevmInstance
  } catch (error) {
    console.error('Failed to create FHEVM instance:', error)
    throw new Error('FHEVM initialization failed')
  }
}

export async function encrypt(value: number, type: string = 'uint32') {
  const fhevm = await createFhevmInstance()
  return await fhevm.encrypt(value, type)
}

export async function decrypt(encrypted: any, type: string = 'uint32') {
  const fhevm = await createFhevmInstance()
  return await fhevm.decrypt(encrypted, type)
}
