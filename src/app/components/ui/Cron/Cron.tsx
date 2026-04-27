import { Button, ButtonType } from '@doordash/prism-react'
import { Spacing } from '@doordash/prism-react'
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'

import { FormInputProps } from '../Formik/types'

import { Main, PeriodSection } from './Cron.styles'
import { setValuesFromCronString, getCronStringFromValues } from './converter'
import { Hours } from './fields/Hours'
import { Minutes } from './fields/Minutes'
import { MonthDays } from './fields/MonthDays'
import { Months } from './fields/Months'
import { Period } from './fields/Period'
import { WeekDays } from './fields/WeekDays'
import { DEFAULT_LOCALE_EN } from './locale'
import { PeriodType, SetValue, LeadingZero, AllowEmpty, ClockFormat, OnError, Shortcuts, Mode } from './types'
import { usePrevious } from './utils'

export type Props = {
  /**
   * Cron value, the component is by design a controled component.
   * The first value will be the default value.
   */
  value: string
  /**
   * Set the cron value, similar to onChange.
   * The naming tells you that you have to set the value by yourself.
   */
  setValue: SetValue
  /**
   * Humanize the labels in the cron component, SUN-SAT and JAN-DEC.
   *
   * Default: true
   */
  humanizeLabels?: boolean
  /**
   * Humanize the value, SUN-SAT and JAN-DEC.
   *
   * Default: false
   */
  humanizeValue?: boolean
  /**
   * Add a "0" before numbers lower than 10.
   *
   * Default: false
   */
  leadingZero?: LeadingZero
  /**
   * Define the default period when the default value is empty.
   *
   * Default: 'day'
   */
  defaultPeriod?: PeriodType
  allowEmpty?: AllowEmpty
  shortcuts?: Shortcuts
  clockFormat?: ClockFormat
  onError?: OnError
  mode?: Mode
} & FormInputProps

export const Cron: React.FC<Props> = React.memo((props: Props) => {
  const {
    isReadOnly,
    value = '',
    setValue,
    onError,
    defaultPeriod = 'day',
    allowEmpty = 'for-default-value',
    humanizeLabels = true,
    humanizeValue = false,
    leadingZero = false,
    clockFormat = '12-hour-clock',
    mode = 'multiple',
    shortcuts = false,
  } = props

  const internalValueRef = useRef<string>(value)
  const defaultPeriodRef = useRef<PeriodType>(defaultPeriod)
  const [period, setPeriod] = useState<PeriodType>(defaultPeriod)
  const [monthDays, setMonthDays] = useState<number[] | undefined>()
  const [months, setMonths] = useState<number[] | undefined>()
  const [weekDays, setWeekDays] = useState<number[] | undefined>()
  const [hours, setHours] = useState<number[] | undefined>()
  const [minutes, setMinutes] = useState<number[] | undefined>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setInternalError] = useState<boolean>(false)
  const [valueCleared, setValueCleared] = useState<boolean>(false)
  const previousValueCleared = usePrevious(valueCleared)
  const localeJSON = JSON.stringify(DEFAULT_LOCALE_EN)

  useEffect(() => {
    setValuesFromCronString({
      cronString: value,
      setInternalError,
      onError,
      allowEmpty,
      internalValueRef,
      firstRender: true,
      setMinutes,
      setHours,
      setMonthDays,
      setMonths,
      setWeekDays,
      setPeriod,
      shortcuts,
    })
  }, [allowEmpty, onError, shortcuts, value])

  useEffect(() => {
    if (value !== internalValueRef.current) {
      setValuesFromCronString({
        cronString: value,
        setInternalError,
        onError,
        allowEmpty,
        internalValueRef,
        firstRender: false,
        setMinutes,
        setHours,
        setMonthDays,
        setMonths,
        setWeekDays,
        setPeriod,
        shortcuts,
      })
    }
  }, [value, internalValueRef, localeJSON, allowEmpty, onError, shortcuts])

  useEffect(() => {
    // Only change the value if a user touched a field
    // and if the user didn't use the clear button
    if (
      (period || minutes || months || monthDays || weekDays || hours) &&
      !valueCleared &&
      !previousValueCleared
    ) {
      const cron = getCronStringFromValues({
        period: period || defaultPeriodRef.current,
        months,
        monthDays,
        weekDays,
        hours,
        minutes,
      })

      // this condition prevents unnecessary re-rendering
      if (internalValueRef.current !== cron) {
        setValue(cron)
        internalValueRef.current = cron
      }

      if (onError) {
        onError(undefined)
      }
      setInternalError(false)
    } else if (valueCleared) {
      setValueCleared(false)
    }
  }, [
    period,
    monthDays,
    months,
    weekDays,
    hours,
    minutes,
    humanizeValue,
    valueCleared,
    previousValueCleared,
    setValue,
    onError,
  ])

  const handleClear = useCallback(() => {
    setMonthDays(undefined)
    setMonths(undefined)
    setWeekDays(undefined)
    setHours(undefined)
    setMinutes(undefined)

    // When clearButtonAction is 'empty'
    let newValue = ''

    const newPeriod = period !== 'reboot' && period ? period : defaultPeriodRef.current

    if (newPeriod !== period) {
      setPeriod(newPeriod)
    }

    // When clearButtonAction is 'fill-with-every'
    const cron = getCronStringFromValues({
      period: newPeriod,
    })
    newValue = cron
    setValue(newValue)
    internalValueRef.current = newValue

    setValueCleared(true)
  }, [period, setValue])

  const clearButtonNode = useMemo(
    () =>
      !isReadOnly ? (
        <div
          style={{
            maxHeight: '30px',
            paddingLeft: `${Spacing.small}px`,
            display: 'flex',
            alignItems: 'center',
            marginTop: period === 'minute' ? '10px' : undefined,
          }}
        >
          <Button type={ButtonType.primary} isInline onClick={handleClear}>
            {DEFAULT_LOCALE_EN.clearButtonText}
          </Button>
        </div>
      ) : null,
    [isReadOnly, period, handleClear]
  )

  const periodForRender = period || defaultPeriodRef.current

  return (
    <Main>
      <Period value={periodForRender} setValue={setPeriod} isReadOnly={isReadOnly} />
      <>
        {periodForRender === 'year' && (
          <Months
            isReadOnly={isReadOnly}
            value={months}
            setValue={setMonths}
            humanizeLabels={humanizeLabels}
            period={periodForRender}
            mode={mode}
          />
        )}

        {(periodForRender === 'year' || periodForRender === 'month') && (
          <MonthDays
            isReadOnly={isReadOnly}
            value={monthDays}
            setValue={setMonthDays}
            weekDays={weekDays}
            leadingZero={leadingZero}
            period={periodForRender}
            mode={mode}
          />
        )}

        {(periodForRender === 'year' || periodForRender === 'month' || periodForRender === 'week') && (
          <WeekDays
            isReadOnly={isReadOnly}
            value={weekDays}
            setValue={setWeekDays}
            humanizeLabels={humanizeLabels}
            monthDays={monthDays}
            period={periodForRender}
            mode={mode}
          />
        )}

        <PeriodSection>
          {periodForRender !== 'minute' && periodForRender !== 'hour' && (
            <Hours
              isReadOnly={isReadOnly}
              value={hours}
              setValue={setHours}
              leadingZero={leadingZero}
              clockFormat={clockFormat}
              period={periodForRender}
              mode={mode}
            />
          )}

          {periodForRender !== 'minute' && (
            <Minutes
              isReadOnly={isReadOnly}
              value={minutes}
              setValue={setMinutes}
              period={periodForRender}
              leadingZero={leadingZero}
              clockFormat={clockFormat}
              mode={mode}
            />
          )}

          {clearButtonNode}
        </PeriodSection>
      </>
    </Main>
  )
})

Cron.displayName = 'Cron'
