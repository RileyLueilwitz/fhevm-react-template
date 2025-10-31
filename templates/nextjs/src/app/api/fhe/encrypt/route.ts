import { NextRequest, NextResponse } from 'next/server'
import { createFhevmInstance } from '@/lib/fhe/server'

export async function POST(request: NextRequest) {
  try {
    const { value, type = 'uint32' } = await request.json()

    if (value === undefined || value === null) {
      return NextResponse.json(
        { success: false, error: 'Value is required' },
        { status: 400 }
      )
    }

    const fhevm = await createFhevmInstance()
    const encrypted = await fhevm.encrypt(value, type)

    return NextResponse.json({
      success: true,
      encrypted,
      type,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('Encryption error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Encryption failed'
      },
      { status: 500 }
    )
  }
}
