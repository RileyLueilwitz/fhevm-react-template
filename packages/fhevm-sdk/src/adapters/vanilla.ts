import { createFhevmInstance } from '../core/instance'
import { FhevmInstance, FhevmConfig, EncryptionType } from '../types'

export class FhevmClient {
  private fhevm: FhevmInstance | null = null
  private initPromise: Promise<void> | null = null
  private config: FhevmConfig

  constructor(config: FhevmConfig = { network: 'sepolia' }) {
    this.config = config
  }

  async init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = this.initialize()
    return this.initPromise
  }

  private async initialize(): Promise<void> {
    try {
      this.fhevm = await createFhevmInstance(this.config)
    } catch (error) {
      console.error('Failed to initialize FHEVM:', error)
      throw error
    }
  }

  async encrypt(value: number | bigint, type: EncryptionType = 'uint32'): Promise<string> {
    await this.ensureInitialized()
    const result = await this.fhevm!.encrypt(value, type)
    return result.data.toString()
  }

  async decrypt(encrypted: any, type: EncryptionType = 'uint32'): Promise<number | bigint> {
    await this.ensureInitialized()
    return await this.fhevm!.decrypt(encrypted, type)
  }

  async getPublicKey(): Promise<string> {
    await this.ensureInitialized()
    return await this.fhevm!.getPublicKey()
  }

  isReady(): boolean {
    return this.fhevm !== null
  }

  getInstance(): FhevmInstance | null {
    return this.fhevm
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.fhevm) {
      await this.init()
    }
  }
}

export function createFhevmClient(config?: FhevmConfig): FhevmClient {
  return new FhevmClient(config)
}
