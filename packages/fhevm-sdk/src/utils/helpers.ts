export function toHex(value: number | bigint): string {
  return '0x' + value.toString(16)
}

export function fromHex(hex: string): bigint {
  return BigInt(hex)
}

export function formatAddress(address: string): string {
  if (address.length !== 42) return address
  return `${address.substring(0, 6)}...${address.substring(38)}`
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function retry<T>(
  fn: () => Promise<T>,
  options: {
    retries: number
    delay: number
    backoff?: number
  }
): Promise<T> {
  return fn().catch(error => {
    if (options.retries <= 0) {
      throw error
    }

    return sleep(options.delay).then(() =>
      retry(fn, {
        retries: options.retries - 1,
        delay: options.backoff ? options.delay * options.backoff : options.delay,
        backoff: options.backoff
      })
    )
  })
}

export function createError(message: string, code?: string, details?: unknown): Error {
  const error = new Error(message) as any
  if (code) error.code = code
  if (details) error.details = details
  return error
}
