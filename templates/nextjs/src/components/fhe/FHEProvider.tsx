/**
 * FHE Provider Component
 * Wraps the application with FHEVM SDK provider
 */

import { FhevmProvider as SDKProvider } from '@fhevm/sdk/react'
import React from 'react'

interface FHEProviderProps {
  children: React.ReactNode
  network?: 'sepolia' | 'mainnet'
}

export const FHEProvider: React.FC<FHEProviderProps> = ({
  children,
  network = 'sepolia'
}) => {
  return (
    <SDKProvider config={{ network }}>
      {children}
    </SDKProvider>
  )
}
