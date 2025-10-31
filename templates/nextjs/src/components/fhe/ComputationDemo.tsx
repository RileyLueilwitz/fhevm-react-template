'use client'

import { useState } from 'react'
import { useFHE } from '@/hooks/useFHE'
import { useEncryption } from '@/hooks/useEncryption'
import { useComputation, ComputationOperation } from '@/hooks/useComputation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function ComputationDemo() {
  const { isReady } = useFHE()
  const { encrypt } = useEncryption()
  const { compute, isComputing } = useComputation()
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('')
  const [operation, setOperation] = useState<ComputationOperation>('add')
  const [result, setResult] = useState<string>('')

  const handleCompute = async () => {
    if (!value1 || !value2) {
      setResult('Please enter both values')
      return
    }

    try {
      // First encrypt both values
      const encrypted1 = await encrypt(parseInt(value1), 'uint32')
      const encrypted2 = await encrypt(parseInt(value2), 'uint32')

      // Then perform computation on encrypted values
      const computeResult = await compute(operation, [encrypted1, encrypted2])

      if (computeResult) {
        setResult(
          `Computation result: ${computeResult.result.substring(0, 20)}...\nOperation: ${operation}`
        )
      } else {
        setResult('Computation failed')
      }
    } catch (error) {
      setResult('Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-2xl font-bold text-white mb-4">Homomorphic Computation</h3>
      <p className="text-gray-300 mb-6">
        Perform computations on encrypted data without decrypting it first.
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Value 1
            </label>
            <Input
              type="number"
              placeholder="Enter first value"
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
              disabled={!isReady}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Value 2
            </label>
            <Input
              type="number"
              placeholder="Enter second value"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              disabled={!isReady}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Operation
          </label>
          <select
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={operation}
            onChange={(e) => setOperation(e.target.value as ComputationOperation)}
            disabled={!isReady}
          >
            <option value="add">Addition (+)</option>
            <option value="subtract">Subtraction (-)</option>
            <option value="multiply">Multiplication (×)</option>
          </select>
        </div>

        <Button
          onClick={handleCompute}
          disabled={!isReady || !value1 || !value2 || isComputing}
          className="w-full"
        >
          {isComputing ? 'Computing...' : 'Compute on Encrypted Data'}
        </Button>

        {result && (
          <div className="p-4 bg-slate-800 rounded-lg">
            <p className="text-sm text-cyan-400 whitespace-pre-wrap break-all">
              {result}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
