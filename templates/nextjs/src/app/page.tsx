'use client'

import { FHEProvider } from '@/components/fhe/FHEProvider'
import { EncryptionDemo } from '@/components/fhe/EncryptionDemo'
import { KeyManager } from '@/components/fhe/KeyManager'
import { BankingExample } from '@/components/examples/BankingExample'
import { MedicalExample } from '@/components/examples/MedicalExample'

export default function Home() {
  return (
    <FHEProvider>
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            FHEVM Next.js Example
          </h1>

          <div className="grid gap-8 lg:grid-cols-2">
            <EncryptionDemo />
            <KeyManager />
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-bold text-white mb-6">Use Cases</h2>
            <div className="grid gap-8 lg:grid-cols-2">
              <BankingExample />
              <MedicalExample />
            </div>
          </div>
        </div>
      </main>
    </FHEProvider>
  )
}
