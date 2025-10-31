import { ref, Ref, onMounted } from 'vue'
import { createFhevmInstance } from '../core/instance'
import { FhevmInstance, FhevmConfig, EncryptionType } from '../types'

export interface UseFhevmOptions {
  config?: FhevmConfig
  network?: string
}

export function useFhevm(options: UseFhevmOptions = {}) {
  const fhevm: Ref<FhevmInstance | null> = ref(null)
  const isReady: Ref<boolean> = ref(false)
  const error: Ref<Error | null> = ref(null)

  const initialize = async () => {
    try {
      const instance = await createFhevmInstance(
        options.config || { network: options.network as any || 'sepolia' }
      )
      fhevm.value = instance
      isReady.value = true
    } catch (err) {
      error.value = err as Error
      console.error('Failed to initialize FHEVM:', err)
    }
  }

  const encrypt = async (value: number | bigint, type: EncryptionType = 'uint32') => {
    if (!fhevm.value) {
      throw new Error('FHEVM not initialized')
    }
    return await fhevm.value.encrypt(value, type)
  }

  const decrypt = async (encrypted: any, type: EncryptionType = 'uint32') => {
    if (!fhevm.value) {
      throw new Error('FHEVM not initialized')
    }
    return await fhevm.value.decrypt(encrypted, type)
  }

  onMounted(() => {
    initialize()
  })

  return {
    fhevm,
    isReady,
    error,
    encrypt,
    decrypt
  }
}
