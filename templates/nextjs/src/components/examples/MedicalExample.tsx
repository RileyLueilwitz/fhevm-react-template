'use client'

import { useState } from 'react'
import { useFHE } from '@/hooks/useFHE'
import { useEncryption } from '@/hooks/useEncryption'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function MedicalExample() {
  const { isReady } = useFHE()
  const { encrypt, isEncrypting } = useEncryption()
  const [bloodPressure, setBloodPressure] = useState('')
  const [heartRate, setHeartRate] = useState('')
  const [result, setResult] = useState<string>('')

  const handleEncryptVitals = async () => {
    if (!bloodPressure || !heartRate) {
      setResult('Please enter both blood pressure and heart rate')
      return
    }

    try {
      const encryptedBP = await encrypt(parseInt(bloodPressure), 'uint32')
      const encryptedHR = await encrypt(parseInt(heartRate), 'uint32')

      setResult(
        `Medical data encrypted:\nBP: ${encryptedBP.substring(0, 15)}...\nHR: ${encryptedHR.substring(0, 15)}...`
      )
    } catch (error) {
      setResult('Encryption failed')
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-2xl font-bold text-white mb-4">Medical Records Example</h3>
      <p className="text-gray-300 mb-6">
        Securely encrypt and process sensitive medical data while preserving privacy.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Blood Pressure (mmHg)
          </label>
          <Input
            type="number"
            placeholder="e.g., 120"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
            disabled={!isReady}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Heart Rate (bpm)
          </label>
          <Input
            type="number"
            placeholder="e.g., 72"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            disabled={!isReady}
          />
        </div>

        <Button
          onClick={handleEncryptVitals}
          disabled={!isReady || !bloodPressure || !heartRate || isEncrypting}
          className="w-full"
        >
          {isEncrypting ? 'Encrypting...' : 'Encrypt Medical Data'}
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
