/**
 * React Hook Usage Example
 *
 * This example shows how to use FHEVM SDK hooks in a React component
 */

import { useState } from 'react'
import { useFhevmInstance, useEncrypt } from '../packages/fhevm-sdk'

export function EncryptionComponent() {
  const { fhevm, isReady } = useFhevmInstance()
  const { encrypt, isEncrypting, error } = useEncrypt()
  const [value, setValue] = useState('')
  const [encrypted, setEncrypted] = useState('')

  const handleEncrypt = async () => {
    if (!value) return

    try {
      const result = await encrypt(parseInt(value), 'uint32')
      setEncrypted(result)
    } catch (err) {
      console.error('Encryption failed:', err)
    }
  }

  return (
    <div>
      <h2>Encrypt Data</h2>
      {!isReady && <p>Initializing FHEVM...</p>}

      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter a number"
        disabled={!isReady}
      />

      <button
        onClick={handleEncrypt}
        disabled={!isReady || !value || isEncrypting}
      >
        {isEncrypting ? 'Encrypting...' : 'Encrypt'}
      </button>

      {encrypted && (
        <div>
          <h3>Encrypted Result:</h3>
          <code>{encrypted.substring(0, 50)}...</code>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </div>
  )
}
