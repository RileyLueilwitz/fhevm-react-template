# FHEVM SDK Examples

This directory contains usage examples demonstrating how to use the FHEVM SDK in various scenarios.

## Examples

### 1. Basic Encryption (`basic-encryption.ts`)

Demonstrates basic encryption operations using the vanilla JavaScript client.

```bash
npx ts-node examples/basic-encryption.ts
```

### 2. React Hook Usage (`react-hook-usage.tsx`)

Shows how to use FHEVM SDK hooks in React components.

```tsx
import { useFhevmInstance, useEncrypt } from '@fhevm/sdk'

function MyComponent() {
  const { fhevm, isReady } = useFhevmInstance()
  const { encrypt } = useEncrypt()
  // ...
}
```

### 3. Contract Interaction (`contract-interaction.ts`)

Demonstrates how to interact with FHE-enabled smart contracts.

```bash
npx ts-node examples/contract-interaction.ts
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run any example:
```bash
npx ts-node examples/<example-file>.ts
```

## Templates

For full application templates, see the `templates/` directory which contains:
- Next.js template
- React + Vite template
- Vue template
- Private Green Travel Rewards example

## Documentation

For more detailed documentation, see the `docs/` directory.
