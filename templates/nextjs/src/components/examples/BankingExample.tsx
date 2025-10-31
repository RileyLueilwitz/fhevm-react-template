'use client'

import { useState } from 'react'
import { useFHE } from '@/hooks/useFHE'
import { useEncryption } from '@/hooks/useEncryption'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function BankingExample() {
  const { isReady } = useFHE()
  const { encrypt, isEncrypting } = useEncryption()
  const [balance, setBalance] = useState('')
  const [amount, setAmount] = useState('')
  const [result, setResult] = useState<string>('')

  const handleEncryptBalance = async () => {
    if (!balance) return

    try {
      const encrypted = await encrypt(parseInt(balance), 'uint32')
      setResult(`Balance encrypted: ${encrypted.substring(0, 20)}...`)
    } catch (error) {
      setResult('Encryption failed')
    }
  }

  const handlePrivateTransfer = async () => {
    if (!amount) return

    try {
      const encrypted = await encrypt(parseInt(amount), 'uint32')
      setResult(`Transfer amount encrypted: ${encrypted.substring(0, 20)}...`)
    } catch (error) {
      setResult('Transfer encryption failed')
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-2xl font-bold text-white mb-4">Banking Example</h3>
      <p className="text-gray-300 mb-6">
        Demonstrate private banking operations with encrypted balances and transfers.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Account Balance
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter balance"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              disabled={!isReady}
            />
            <Button
              onClick={handleEncryptBalance}
              disabled={!isReady || !balance || isEncrypting}
            >
              Encrypt
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Transfer Amount
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!isReady}
            />
            <Button
              onClick={handlePrivateTransfer}
              disabled={!isReady || !amount || isEncrypting}
            >
              Transfer
            </Button>
          </div>
        </div>

        {result && (
          <div className="p-4 bg-slate-800 rounded-lg">
            <p className="text-sm text-cyan-400 break-all">{result}</p>
          </div>
        )}
      </div>
    </Card>
  )
}
