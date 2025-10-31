import { NextRequest, NextResponse } from 'next/server'
import { createFhevmInstance } from '@/lib/fhe/server'

export async function POST(request: NextRequest) {
  try {
    const { encrypted, type = 'uint32' } = await request.json()

    if (!encrypted) {
      return NextResponse.json(
        { success: false, error: 'Encrypted value is required' },
        { status: 400 }
      )
    }

    const fhevm = await createFhevmInstance()
    const decrypted = await fhevm.decrypt(encrypted, type)

    return NextResponse.json({
      success: true,
      decrypted,
      type,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('Decryption error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Decryption failed'
      },
      { status: 500 }
    )
  }
}
