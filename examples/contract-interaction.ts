/**
 * Smart Contract Interaction Example
 *
 * This example shows how to interact with FHE-enabled smart contracts
 */

import { BrowserProvider, Contract } from 'ethers'
import { createFhevmClient } from '../packages/fhevm-sdk/src/adapters/vanilla'

const CONTRACT_ADDRESS = '0xYourContractAddress'
const CONTRACT_ABI = [
  'function submitEncryptedValue(bytes calldata encryptedValue) external',
  'function getEncryptedBalance(address user) external view returns (bytes memory)'
]

async function contractInteraction() {
  // Initialize FHEVM client
  const fhevmClient = createFhevmClient({ network: 'sepolia' })
  await fhevmClient.init()

  // Connect to wallet
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask not installed')
  }

  const provider = new BrowserProvider(window.ethereum)
  await provider.send('eth_requestAccounts', [])
  const signer = await provider.getSigner()

  // Create contract instance
  const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

  // Encrypt value
  const valueToEncrypt = 1000
  const encryptedValue = await fhevmClient.encrypt(valueToEncrypt, 'uint32')

  // Submit encrypted value to contract
  console.log('Submitting encrypted value to contract...')
  const tx = await contract.submitEncryptedValue(encryptedValue)
  await tx.wait()

  console.log('Transaction successful:', tx.hash)

  // Query encrypted balance
  const userAddress = await signer.getAddress()
  const encryptedBalance = await contract.getEncryptedBalance(userAddress)

  console.log('Encrypted balance retrieved:', encryptedBalance)
}

contractInteraction().catch(console.error)
