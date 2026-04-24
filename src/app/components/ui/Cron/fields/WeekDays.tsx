import { Inset, Text, TextWeight, TextColor, Theme } from '@doordash/prism-react'
import React, { useMemo } from 'react'

import { FormInputProps } from '../../Formik/types'
import { CustomSelect } from '../components/CustomSelect'
import { UNITS } from '../constants'
import { DEFAULT_LOCALE_EN } from '../locale'
import { FieldProps } from '../types'

import { Main } from './styles'

export type Props = {
  humanizeLabels: boolean
  monthDays?: number[]
} & FieldProps &
  FormInputProps

export const WeekDays: React.FC<Props> = (props: Props) => {
  const { value, setValue, humanizeLabels, monthDays, period, mode, isReadOnly } = props
  const {
    altWeekDays,
    prefixWeekDays,
    prefixWeekDaysForMonthAndYearPeriod,
    weekDays,
    emptyWeekDays,
    emptyWeekDaysShort,
  } = DEFAULT_LOCALE_EN

  const optionsList = weekDays

  const noMonthDays = period === 'week' || !monthDays || monthDays.length === 0

  const placeholder = useMemo(
    () => (noMonthDays ? emptyWeekDays : emptyWeekDaysShort),
    [emptyWeekDays, emptyWeekDaysShort, noMonthDays]
  )

  const isWeekDaysVisible =
    period === 'week' ||
    (value && value.length > 0) ||
    ((!value || value.length === 0) && (!monthDays || monthDays.length === 0))

  const isMonthDaysVisible =
    (monthDays && monthDays.length > 0) ||
    ((!monthDays || monthDays.length === 0) && (!value || value.length === 0))

  return isWeekDaysVisible ? (
    <Main>
      <Inset>
        {(period === 'week' || !isMonthDaysVisible) && (
          <Text
            size={Theme.usage.fontSize.medium}
            weight={TextWeight.regular}
            color={TextColor.text.subdued.default}
          >
            {prefixWeekDays}
          </Text>
        )}
        {period !== 'week' && isMonthDaysVisible && (
          <Text
            size={Theme.usage.fontSize.medium}
            weight={TextWeight.regular}
            color={TextColor.text.subdued.default}
          >
            {prefixWeekDaysForMonthAndYearPeriod}
          </Text>
        )}
      </Inset>

      <CustomSelect
        isReadOnly={isReadOnly}
        placeholder={placeholder}
        optionsList={optionsList}
        value={value}
        unit={{
          ...UNITS[4],
          alt: altWeekDays,
        }}
        setValue={setValue}
        humanizeLabels={humanizeLabels}
        period={period}
        mode={mode}
      />
    </Main>
  ) : null
}
