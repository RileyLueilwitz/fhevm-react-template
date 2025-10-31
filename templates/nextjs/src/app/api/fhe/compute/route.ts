import { NextRequest, NextResponse } from 'next/server'
import { createFhevmInstance } from '@/lib/fhe/server'

export async function POST(request: NextRequest) {
  try {
    const { operation, operands, type = 'uint32' } = await request.json()

    if (!operation || !operands || !Array.isArray(operands)) {
      return NextResponse.json(
        { success: false, error: 'Invalid computation parameters' },
        { status: 400 }
      )
    }

    const fhevm = await createFhevmInstance()

    // Perform homomorphic computation
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
        return NextResponse.json(
          { success: false, error: 'Unsupported operation' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      result,
      operation,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('Computation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Computation failed'
      },
      { status: 500 }
    )
  }
}
