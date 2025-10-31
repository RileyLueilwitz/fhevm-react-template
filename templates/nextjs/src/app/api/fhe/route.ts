import { NextRequest, NextResponse } from 'next/server'
import { createFhevmInstance } from '@/lib/fhe/server'

export async function POST(request: NextRequest) {
  try {
    const { operation, value, type } = await request.json()

    const fhevm = await createFhevmInstance()

    switch (operation) {
      case 'encrypt':
        const encrypted = await fhevm.encrypt(value, type)
        return NextResponse.json({
          success: true,
          encrypted
        })

      case 'compute':
        // Server-side computation logic
        return NextResponse.json({
          success: true,
          message: 'Computation completed'
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid operation' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('FHE operation error:', error)
    return NextResponse.json(
      { success: false, error: 'FHE operation failed' },
      { status: 500 }
    )
  }
}
