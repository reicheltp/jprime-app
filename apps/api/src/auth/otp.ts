import { createHash, randomInt } from 'node:crypto'

export function generateOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0')
}

export function hashOtp(code: string): string {
  return createHash('sha256').update(code).digest('hex')
}
