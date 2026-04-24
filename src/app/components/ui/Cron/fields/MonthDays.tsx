import { Inset, Text, TextColor, TextWeight, Theme } from '@doordash/prism-react'
import React, { useMemo } from 'react'

import { FormInputProps } from '../../Formik/types'
import { CustomSelect } from '../components/CustomSelect'
import { UNITS } from '../constants'
import { DEFAULT_LOCALE_EN } from '../locale'
import { FieldProps, LeadingZero } from '../types'

import { Main } from './styles'

export type Props = {
  weekDays?: number[]
  leadingZero: LeadingZero
} & FieldProps &
  FormInputProps

export const MonthDays: React.FC<Props> = (props: Props) => {
  const { value, setValue, weekDays, leadingZero, period, mode, isReadOnly } = props
  const { emptyMonthDays, emptyMonthDaysShort, prefixMonthDays } = DEFAULT_LOCALE_EN
  const noWeekDays = !weekDays || weekDays.length === 0

  const placeholder = useMemo(
    () => (noWeekDays ? emptyMonthDays : emptyMonthDaysShort),
    [emptyMonthDays, emptyMonthDaysShort, noWeekDays]
  )

  const displayMonthDays =
    (value && value.length > 0) || ((!value || value.length === 0) && (!weekDays || weekDays.length === 0))

  return displayMonthDays ? (
    <Main>
      <Inset>
        <Text
          size={Theme.usage.fontSize.medium}
          weight={TextWeight.regular}
          color={TextColor.text.subdued.default}
        >
          {prefixMonthDays}
        </Text>
      </Inset>

      <CustomSelect
        isReadOnly={isReadOnly}
        gridOptions={{ columnCount: 4 }}
        placeholder={placeholder}
        value={value}
        setValue={setValue}
        unit={UNITS[2]}
        leadingZero={leadingZero}
        period={period}
        mode={mode}
      />
    </Main>
  ) : null
}
