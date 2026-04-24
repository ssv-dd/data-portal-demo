import { MutableRefObject } from 'react'

import { SUPPORTED_SHORTCUTS, UNITS } from './constants'
import {
  Unit,
  PeriodType,
  LeadingZero,
  ClockFormat,
  SetInternalError,
  OnError,
  AllowEmpty,
  SetValueNumbersOrUndefined,
  SetValuePeriod,
  LeadingZeroType,
  Shortcuts,
} from './types'
import { range, sort, dedup, setError } from './utils'

/**
 * Replace all 7 with 0 as Sunday can be represented by both
 */
function fixSunday(values: number[], unit: Unit): number[] {
  let temp = [...values]

  if (unit.type === 'week-days') {
    temp = temp.map((value: number) => {
      if (value === 7) {
        return 0
      }

      return value
    })
  }

  return temp
}

/**
 * Returns true if the range can be represented as an interval
 */
function isInterval(values: number[], step: number): boolean {
  for (let i = 1; i < values.length; i += 1) {
    const prev = values[i - 1]
    const value = values[i]

    if (value - prev !== step) {
      return false
    }
  }

  return true
}

/**
 * Returns the smallest value in the range
 */
function getMin(values: number[]) {
  return values[0]
}

/**
 * Returns the largest value in the range
 */
function getMax(values: number[]) {
  return values[values.length - 1]
}

/**
 * Finds an element from values that is outside of the range of unit
 */
function outOfRange(values: number[], unit: Unit): number | undefined {
  const first = values[0]
  const last = values[values.length - 1]

  if (first < unit.min) {
    return first
  } else if (last > unit.max) {
    return last
  }

  return undefined
}

/**
 * Parses the step from a part string
 */
function parseStep(step: string, unit: Unit): number | undefined {
  if (typeof step !== 'undefined') {
    const parsedStep = parseInt(step, 10)

    if (isNaN(parsedStep) || parsedStep < 1) {
      throw new Error(`Invalid interval step value "${step}" for ${unit.type}`)
    }

    return parsedStep
  }
  return step
}

/**
 * Returns the range as an array of ranges
 * defined as arrays of positive integers
 */
function toRanges(values: number[]) {
  const retval: (number[] | number)[] = []
  let startPart: number | null = null

  values.forEach((value, index, self) => {
    if (value !== self[index + 1] - 1) {
      if (startPart !== null) {
        retval.push([startPart, value])
        startPart = null
      } else {
        retval.push(value)
      }
    } else if (startPart === null) {
      startPart = value
    }
  })

  return retval
}

/**
 * Returns the cron array as a string
 */
function cronToString(parts: string[]) {
  return parts.join(' ')
}

/**
 * Find the period from cron parts
 */
function getPeriodFromCronparts(cronParts: number[][]): PeriodType {
  if (cronParts[3].length > 0) {
    return 'year'
  } else if (cronParts[2].length > 0) {
    return 'month'
  } else if (cronParts[4].length > 0) {
    return 'week'
  } else if (cronParts[1].length > 0) {
    return 'day'
  } else if (cronParts[0].length > 0) {
    return 'hour'
  }
  return 'minute'
}

/**
 * Validates a range of positive integers
 */
export function parsePartArray(arr: number[], unit: Unit): number[] {
  const values = sort(dedup(fixSunday(arr, unit)))

  if (values.length === 0) {
    return values
  }

  const value = outOfRange(values, unit)

  if (typeof value !== 'undefined') {
    throw new Error(`Value "${value}" out of range for ${unit.type}`)
  }

  return values
}

/**
 * Returns true if range has all the values of the unit
 */
function isFull(values: number[], unit: Unit) {
  return values.length === unit.max - unit.min + 1
}

/**
 * Returns the difference between first and second elements in the range
 */
function getStep(values: number[]) {
  if (values.length > 2) {
    const step = values[1] - values[0]
    if (step > 1) {
      return step
    }
  }
  return 0
}

/**
 * Returns true if the range contains all the interval values
 */
function isFullInterval(values: number[], unit: Unit, step: number) {
  const min = getMin(values)
  const max = getMax(values)
  const haveAllValues = values.length === (max - min) / step + 1

  if (min === unit.min && max + step > unit.max && haveAllValues) {
    return true
  }

  return false
}

/**
 * Replaces the alternative representations of numbers in a string
 */
function replaceAlternatives(str: string, min: number, alt?: string[]) {
  let temp = str

  if (alt) {
    temp = temp.toUpperCase()

    for (let i = 0; i < alt.length; i += 1) {
      temp = temp.replace(alt[i], `${i + min}`)
    }
  }

  return temp
}

/**
 * Parses a range string
 */
function parseRange(rangeStr: string, context: string, unit: Unit) {
  const subparts = rangeStr.split('-')

  if (subparts.length === 1) {
    const value = parseInt(subparts[0], 10)

    if (isNaN(value)) {
      throw new Error(`Invalid value "${context}" for ${unit.type}`)
    }

    return [value]
  } else if (subparts.length === 2) {
    const minValue = parseInt(subparts[0], 10)
    const maxValue = parseInt(subparts[1], 10)

    // Fix to allow equal min and max range values
    // cf: https://github.com/roccivic/cron-converter/pull/15
    if (maxValue < minValue) {
      throw new Error(`Max range is less than min range in "${rangeStr}" for ${unit.type}`)
    }

    return range(minValue, maxValue)
  }
  throw new Error(`Invalid value "${rangeStr}" for ${unit.type}`)
}

/**
 * Applies an interval step to a collection of values
 */
function applyInterval(values: number[], step?: number) {
  let temp = [...values]

  if (step) {
    const minVal = temp[0]

    temp = temp.filter((value) => value % step === minVal % step || value === minVal)
  }

  return temp
}

/**
 * Format the value
 */
export function formatValue({
  value,
  unit,
  humanize,
  leadingZero,
  clockFormat,
}: {
  value: number
  unit: Unit
  humanize?: boolean
  leadingZero?: LeadingZero
  clockFormat?: ClockFormat
}): string | undefined {
  let cronPartString: string | undefined = value.toString()
  const { type, alt, min } = unit
  const needLeadingZero =
    leadingZero && (leadingZero === true || leadingZero.includes(type as LeadingZeroType))
  const need24HourClock = clockFormat === '24-hour-clock' && (type === 'hours' || type === 'minutes')

  if ((humanize && type === 'week-days') || (humanize && type === 'months')) {
    cronPartString = alt?.[value - min]
  } else if (value < 10 && (needLeadingZero || need24HourClock)) {
    cronPartString = cronPartString.padStart(2, '0')
  }

  if (type === 'hours' && clockFormat === '12-hour-clock') {
    const suffix = value >= 12 ? 'PM' : 'AM'
    let hour: number | string = value % 12 || 12

    if (hour < 10 && needLeadingZero) {
      hour = hour.toString().padStart(2, '0')
    }

    cronPartString = `${hour}${suffix}`
  }

  return cronPartString
}

/**
 * Returns the cron part array as a string.
 */
export const partToString = ({
  cronPart,
  unit,
  humanize,
  leadingZero,
  clockFormat,
}: {
  cronPart: number[]
  unit: Unit
  humanize?: boolean
  leadingZero?: LeadingZero
  clockFormat?: ClockFormat
}): string => {
  let retval = ''

  if (isFull(cronPart, unit) || cronPart.length === 0) {
    retval = '*'
  } else {
    const step = getStep(cronPart)

    if (step && isInterval(cronPart, step)) {
      if (isFullInterval(cronPart, unit, step)) {
        retval = `*/${step}`
      } else {
        retval = `${formatValue({
          value: getMin(cronPart),
          unit,
          humanize,
          leadingZero,
          clockFormat,
        })}-${formatValue({
          value: getMax(cronPart),
          unit,
          humanize,
          leadingZero,
          clockFormat,
        })}/${step}`
      }
    } else {
      retval = toRanges(cronPart)
        .map((range: number | number[]) => {
          if (Array.isArray(range)) {
            return `${formatValue({
              value: range[0],
              unit,
              humanize,
              leadingZero,
              clockFormat,
            })}-${formatValue({
              value: range[1],
              unit,
              humanize,
              leadingZero,
              clockFormat,
            })}`
          }

          return formatValue({
            value: range,
            unit,
            humanize,
            leadingZero,
            clockFormat,
          })
        })
        .join(',')
    }
  }
  return retval
}

/**
 * Parses a string as a range of positive integers
 */
function parsePartString(str: string, unit: Unit) {
  if (str === '*' || str === '*/1') {
    return []
  }

  const stringParts = str.split('/')

  if (stringParts.length > 2) {
    throw new Error(`Invalid value "${unit.type}"`)
  }

  const rangeString = replaceAlternatives(stringParts[0], unit.min, unit.alt)
  let parsedValues: number[]

  if (rangeString === '*') {
    parsedValues = range(unit.min, unit.max)
  } else {
    parsedValues = sort(
      dedup(
        fixSunday(
          rangeString
            .split(',')
            .map((range) => parseRange(range, str, unit))
            .flat(),
          unit
        )
      )
    )

    const value = outOfRange(parsedValues, unit)

    if (typeof value !== 'undefined') {
      throw new Error(`Value "${value}" out of range for ${unit.type}`)
    }
  }

  const step = parseStep(stringParts[1], unit)
  const intervalValues = applyInterval(parsedValues, step)

  if (intervalValues.length === unit.total) {
    return []
  } else if (intervalValues.length === 0) {
    throw new Error(`Empty interval value "${str}" for ${unit.type}`)
  }

  return intervalValues
}

/**
 * Parses a cron string to an array of parts
 */
function parseCronString(str: string) {
  if (typeof str !== 'string') {
    throw new Error('Invalid cron string')
  }

  const parts = str.replace(/\s+/g, ' ').trim().split(' ')

  if (parts.length === 5) {
    return parts.map((partStr, idx) => parsePartString(partStr, UNITS[idx]))
  }

  throw new Error('Invalid cron string format')
}

/**
 * Parses a 2-dimentional array of integers as a cron schedule
 */
function parseCronArray(cronArr: number[][], humanize?: boolean) {
  if (cronArr.length === 5) {
    return cronArr.map((partArr, idx) => {
      const unit = UNITS[idx]
      const parsedArray = parsePartArray(partArr, unit)

      return partToString({ cronPart: parsedArray, unit, humanize })
    })
  }

  throw new Error('Invalid cron array')
}

/**
 * Set values from cron string
 */
export const setValuesFromCronString = ({
  cronString,
  setInternalError,
  onError,
  allowEmpty,
  internalValueRef,
  firstRender,
  setMinutes,
  setHours,
  setMonthDays,
  setMonths,
  setWeekDays,
  setPeriod,
  shortcuts,
}: {
  shortcuts: Shortcuts
  cronString: string
  setInternalError: SetInternalError
  onError: OnError
  allowEmpty: AllowEmpty
  internalValueRef: MutableRefObject<string>
  firstRender: boolean
  setMinutes: SetValueNumbersOrUndefined
  setHours: SetValueNumbersOrUndefined
  setMonthDays: SetValueNumbersOrUndefined
  setMonths: SetValueNumbersOrUndefined
  setWeekDays: SetValueNumbersOrUndefined
  setPeriod: SetValuePeriod
}): void => {
  let temp = cronString

  if (onError) {
    onError(undefined)
  }

  setInternalError(false)

  let error = false

  // Handle empty cron string
  if (!temp) {
    if (allowEmpty === 'always' || (firstRender && allowEmpty === 'for-default-value')) {
      return
    }

    error = true
  }

  if (!error) {
    // Shortcuts management
    if (
      shortcuts &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (shortcuts === true || shortcuts.includes(cronString as any))
    ) {
      // Convert a shortcut to a valid cron string
      const shortcutObject = SUPPORTED_SHORTCUTS.find(
        (supportedShortcut) => supportedShortcut.name === cronString
      )

      if (shortcutObject) {
        temp = shortcutObject.value
      }
    }

    try {
      const cronParts = parseCronString(temp)
      const period = getPeriodFromCronparts(cronParts)

      setPeriod(period)
      setMinutes(cronParts[0])
      setHours(cronParts[1])
      setMonthDays(cronParts[2])
      setMonths(cronParts[3])
      setWeekDays(cronParts[4])
    } catch {
      // Specific errors are not handle (yet)
      error = true
    }
  }
  if (error) {
    internalValueRef.current = temp
    setInternalError(true)
    setError(onError)
  }
}

/**
 * Get cron string from values
 */
export function getCronStringFromValues({
  period,
  months,
  monthDays,
  weekDays,
  hours,
  minutes,
  humanizeValue,
}: {
  period: PeriodType
  months?: number[]
  monthDays?: number[]
  weekDays?: number[]
  hours?: number[]
  minutes?: number[]
  humanizeValue?: boolean
}): string {
  if (period === 'reboot') {
    return '@reboot'
  }

  const newMonths = period === 'year' && months ? months : []
  const newMonthDays = (period === 'year' || period === 'month') && monthDays ? monthDays : []
  const newWeekDays =
    (period === 'year' || period === 'month' || period === 'week') && weekDays ? weekDays : []
  const newHours = period !== 'minute' && period !== 'hour' && hours ? hours : []
  const newMinutes = period !== 'minute' && minutes ? minutes : []

  const parsedArray = parseCronArray(
    [newMinutes, newHours, newMonthDays, newMonths, newWeekDays],
    humanizeValue
  )

  return cronToString(parsedArray)
}
/** eslint-enable */
