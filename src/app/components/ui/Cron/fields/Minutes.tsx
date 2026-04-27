import { Inset, Text, TextColor, TextWeight, Theme } from '@doordash/prism-react'
import React from 'react'

import { FormInputProps } from '../../Formik/types'
import { CustomSelect } from '../components/CustomSelect'
import { UNITS } from '../constants'
import { DEFAULT_LOCALE_EN } from '../locale'
import { LeadingZero, ClockFormat, FieldProps } from '../types'

import { Main } from './styles'

export type Props = {
  leadingZero: LeadingZero
  clockFormat?: ClockFormat
} & FieldProps &
  FormInputProps

export const Minutes: React.FC<Props> = (props: Props) => {
  const { value, setValue, leadingZero, clockFormat, period, mode, isReadOnly } = props
  const {
    emptyMinutesForHourPeriod,
    emptyMinutes,
    prefixMinutesForHourPeriod,
    prefixMinutes,
    suffixMinutesForHourPeriod,
  } = DEFAULT_LOCALE_EN

  return (
    <Main>
      <Inset>
        {period === 'hour' ? (
          <Text
            size={Theme.usage.fontSize.medium}
            weight={TextWeight.regular}
            color={TextColor.text.subdued.default}
          >
            {prefixMinutesForHourPeriod}
          </Text>
        ) : (
          <Text
            size={Theme.usage.fontSize.medium}
            weight={TextWeight.regular}
            color={TextColor.text.subdued.default}
          >
            {prefixMinutes}
          </Text>
        )}
      </Inset>

      <CustomSelect
        isReadOnly={isReadOnly}
        gridOptions={{ columnCount: 6 }}
        placeholder={period === 'hour' ? emptyMinutesForHourPeriod : emptyMinutes}
        value={value}
        unit={UNITS[0]}
        setValue={setValue}
        leadingZero={leadingZero}
        clockFormat={clockFormat}
        period={period}
        mode={mode}
      />

      {period === 'hour' && (
        <Text size={Theme.usage.fontSize.medium} weight={TextWeight.semibold} color={TextColor.text.default}>
          {suffixMinutesForHourPeriod}
        </Text>
      )}
    </Main>
  )
}
