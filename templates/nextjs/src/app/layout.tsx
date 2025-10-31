import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FHEVM Next.js Example',
  description: 'Fully Homomorphic Encryption with Next.js App Router',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
