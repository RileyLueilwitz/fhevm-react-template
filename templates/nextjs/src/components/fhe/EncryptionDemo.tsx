/**
 * Encryption Demo Component
 * Demonstrates FHE encryption capabilities
 */

import { useState } from 'react'
import { useEncrypt } from '@fhevm/sdk/react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card } from '../ui/Card'

export const EncryptionDemo: React.FC = () => {
  const { encrypt, isEncrypting } = useEncrypt()
  const [value, setValue] = useState<number>(0)
  const [encryptedResult, setEncryptedResult] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleEncrypt = async () => {
    if (!value || value <= 0) {
      setError('Please enter a valid positive number')
      return
    }

    try {
      setError('')
      const encrypted = await encrypt(value, 'uint32')
      setEncryptedResult(encrypted.substring(0, 100) + '...')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed')
    }
  }

  return (
    <Card title="🔐 Encryption Demo">
      <p className="description">
        Test FHE encryption by entering a value below. The value will be encrypted
        on the client side before any submission.
      </p>

      <Input
        type="number"
        label="Value to Encrypt:"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        placeholder="Enter a number..."
        min="0"
        error={error}
      />

      <Button
        onClick={handleEncrypt}
        disabled={isEncrypting}
      >
        {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
      </Button>

      {encryptedResult && (
        <div className="result-box">
          <h4>Encrypted Result:</h4>
          <code className="encrypted-value">{encryptedResult}</code>
        </div>
      )}

      <style jsx>{`
        .description {
          margin-bottom: 1.5rem;
          color: #666;
          line-height: 1.6;
        }

        .result-box {
          margin-top: 1.5rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .result-box h4 {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 0.9rem;
        }

        .encrypted-value {
          display: block;
          padding: 0.75rem;
          background: #1e293b;
          color: #10b981;
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
          word-break: break-all;
        }
      `}</style>
    </Card>
  )
}
