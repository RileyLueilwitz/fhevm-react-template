import { NextRequest, NextResponse } from 'next/server'
import { createFhevmInstance } from '@/lib/fhe/server'

export async function GET(request: NextRequest) {
  try {
    const fhevm = await createFhevmInstance()

    // Get public keys for encryption
    const publicKey = await fhevm.getPublicKey()

    return NextResponse.json({
      success: true,
      publicKey,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('Key retrieval error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve keys'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    const fhevm = await createFhevmInstance()

    switch (action) {
      case 'generate':
        await fhevm.generateKeys()
        return NextResponse.json({
          success: true,
          message: 'Keys generated successfully'
        })

      case 'refresh':
        await fhevm.refreshKeys()
        return NextResponse.json({
          success: true,
          message: 'Keys refreshed successfully'
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Key management error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Key management failed'
      },
      { status: 500 }
    )
  }
}
