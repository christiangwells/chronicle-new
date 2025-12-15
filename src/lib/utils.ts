import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function assertUnreachable(
  value: never,
  message: string = 'Unexpected value encountered',
): never {
  throw new Error(`${message}: ${value as string}`)
}
