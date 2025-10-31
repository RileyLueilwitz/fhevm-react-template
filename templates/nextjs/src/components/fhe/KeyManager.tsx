/**
 * Key Manager Component
 * Displays FHEVM public key information
 */

import { useFhevmInstance } from '@fhevm/sdk/react'
import { Card } from '../ui/Card'

export const KeyManager: React.FC = () => {
  const { fhevm, isReady } = useFhevmInstance()

  return (
    <Card title="🔑 Key Manager">
      <div className="key-info">
        <div className="info-item">
          <span className="label">Status:</span>
          <span className={`status ${isReady ? 'ready' : 'loading'}`}>
            {isReady ? '✅ Ready' : '⏳ Initializing...'}
          </span>
        </div>

        {isReady && fhevm && (
          <>
            <div className="info-item">
              <span className="label">Public Key:</span>
              <code className="key-value">
                {fhevm.publicKey.substring(0, 30)}...
              </code>
            </div>

            <div className="info-item">
              <span className="label">Network:</span>
              <span className="value">Sepolia Testnet</span>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .key-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .label {
          font-weight: 600;
          color: #495057;
        }

        .status {
          font-weight: 600;
        }

        .status.ready {
          color: #10b981;
        }

        .status.loading {
          color: #f59e0b;
        }

        .value {
          color: #333;
        }

        .key-value {
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
          color: #667eea;
          background: #ede9fe;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }
      `}</style>
    </Card>
  )
}
