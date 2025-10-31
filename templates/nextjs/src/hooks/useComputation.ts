import { useState, useCallback } from 'react'
import { useFHE } from './useFHE'

export type ComputationOperation = 'add' | 'subtract' | 'multiply' | 'divide'

export interface ComputationResult {
  result: any
  operation: ComputationOperation
  timestamp: number
}

export function useComputation() {
  const { fhevm, isReady } = useFHE()
  const [isComputing, setIsComputing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const compute = useCallback(
    async (
      operation: ComputationOperation,
      operands: [any, any]
    ): Promise<ComputationResult | null> => {
      if (!isReady || !fhevm) {
        setError('FHEVM not ready')
        return null
      }

      setIsComputing(true)
      setError(null)

      try {
        let result

        switch (operation) {
          case 'add':
            result = await fhevm.add(operands[0], operands[1])
            break
          case 'subtract':
            result = await fhevm.subtract(operands[0], operands[1])
            break
          case 'multiply':
            result = await fhevm.multiply(operands[0], operands[1])
            break
          default:
            throw new Error(`Unsupported operation: ${operation}`)
        }

        return {
          result,
          operation,
          timestamp: Date.now()
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Computation failed'
        setError(errorMessage)
        console.error('Computation error:', err)
        return null
      } finally {
        setIsComputing(false)
      }
    },
    [fhevm, isReady]
  )

  const computeAPI = useCallback(
    async (
      operation: ComputationOperation,
      operands: [any, any],
      type: string = 'uint32'
    ): Promise<ComputationResult | null> => {
      setIsComputing(true)
      setError(null)

      try {
        const response = await fetch('/api/fhe/compute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            operation,
            operands,
            type
          })
        })

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Computation failed')
        }

        return {
          result: data.result,
          operation,
          timestamp: data.timestamp
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'API computation failed'
        setError(errorMessage)
        console.error('API computation error:', err)
        return null
      } finally {
        setIsComputing(false)
      }
    },
    []
  )

  return {
    compute,
    computeAPI,
    isComputing,
    error
  }
}
