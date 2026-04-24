import { useRef, useEffect } from 'react'

import { DEFAULT_LOCALE_EN } from './locale'
import { OnError } from './types'

/**
 * Creates an array of integers from start to end, inclusive
 */
export function range(start: number, end: number): number[] {
  const array: number[] = []

  for (let i = start; i <= end; i += 1) {
    array.push(i)
  }

  return array
}

/**
 * Sorts an array of numbers
 */
export function sort(array: number[]): number[] {
  array.sort((a, b) => a - b)

  return array
}

/**
 * Removes duplicate entries from an array
 */
export function dedup(array: number[]): number[] {
  const result: number[] = []

  array.forEach((i) => {
    if (result.indexOf(i) < 0) {
      result.push(i)
    }
  })

  return result
}

/**
 * Handle onError prop to set the error
 */
export function setError(onError: OnError): void {
  if (onError) {
    onError({
      type: 'invalid_cron',
      description: DEFAULT_LOCALE_EN.errorInvalidCron,
    })
  }
}

/**
 * React useEffect hook to return the previous value
 */
export function usePrevious(value: boolean): React.ReactNode {
  const ref = useRef(value)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
