import { Dispatch, SetStateAction } from 'react'

export type ClearButtonAction = 'empty' | 'fill-with-every'
export type PeriodType = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'reboot'
export type AllowEmpty = 'always' | 'never' | 'for-default-value'
export type CronType = 'period' | 'months' | 'month-days' | 'week-days' | 'hours' | 'minutes'
export type LeadingZeroType = 'month-days' | 'hours' | 'minutes'
export type LeadingZero = boolean | LeadingZeroType[]
export type ClockFormat = '24-hour-clock' | '12-hour-clock'

export type SetValueNumbersOrUndefined = Dispatch<SetStateAction<number[] | undefined>>

export interface Unit {
  type: CronType
  min: number
  max: number
  total: number
  alt?: string[]
}

export interface Locale {
  everyText?: string
  emptyMonths?: string
  emptyMonthDays?: string
  emptyMonthDaysShort?: string
  emptyWeekDays?: string
  emptyWeekDaysShort?: string
  emptyHours?: string
  emptyMinutes?: string
  emptyMinutesForHourPeriod?: string
  yearOption?: string
  monthOption?: string
  weekOption?: string
  dayOption?: string
  hourOption?: string
  minuteOption?: string
  rebootOption?: string
  prefixPeriod?: string
  prefixMonths?: string
  prefixMonthDays?: string
  prefixWeekDays?: string
  prefixWeekDaysForMonthAndYearPeriod?: string
  prefixHours?: string
  prefixMinutes?: string
  prefixMinutesForHourPeriod?: string
  suffixMinutesForHourPeriod?: string
  errorInvalidCron?: string
  clearButtonText?: string
  weekDays?: string[]
  months?: string[]
  altWeekDays?: string[]
  altMonths?: string[]
}

export type SetValueFunction = (value: string) => void

export type SetValue = SetValueFunction | Dispatch<SetStateAction<string>>

export type CronError =
  | {
      type: 'invalid_cron'
      description: string
    }
  | undefined

export type OnErrorFunction = (error: CronError) => void

export type OnError = OnErrorFunction | Dispatch<SetStateAction<CronError>> | undefined

export type ShortcutsType =
  | '@yearly'
  | '@annually'
  | '@monthly'
  | '@weekly'
  | '@daily'
  | '@midnight'
  | '@hourly'
  | '@reboot'

export type Shortcuts = boolean | ShortcutsType[]

export interface ShortcutsValues {
  name: ShortcutsType
  value: string
}

export type Mode = 'multiple' | 'single'

// Internal props

export interface FieldProps {
  gridOptions?: { columnCount: number }
  value?: number[]
  setValue: SetValueNumbersOrUndefined
  className?: string
  period: PeriodType
  mode: Mode
}

export type SetValuePeriod = Dispatch<SetStateAction<PeriodType>>

export type SetInternalError = Dispatch<SetStateAction<boolean>>

export interface DefaultLocale {
  everyText: string
  emptyMonths: string
  emptyMonthDays: string
  emptyMonthDaysShort: string
  emptyWeekDays: string
  emptyWeekDaysShort: string
  emptyHours: string
  emptyMinutes: string
  emptyMinutesForHourPeriod: string
  yearOption: string
  monthOption: string
  weekOption: string
  dayOption: string
  hourOption: string
  minuteOption: string
  rebootOption: string
  prefixPeriod: string
  prefixMonths: string
  prefixMonthDays: string
  prefixWeekDays: string
  prefixWeekDaysForMonthAndYearPeriod: string
  prefixHours: string
  prefixMinutes: string
  prefixMinutesForHourPeriod: string
  suffixMinutesForHourPeriod: string
  errorInvalidCron: string
  clearButtonText: string
  weekDays: string[]
  months: string[]
  altWeekDays: string[]
  altMonths: string[]
}
export type CronValues = { [key in CronType]: number[] | string | undefined }
