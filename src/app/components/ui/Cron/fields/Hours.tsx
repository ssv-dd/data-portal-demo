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

export const Hours: React.FC<Props> = (props: Props) => {
  const { value, setValue, leadingZero, clockFormat, period, mode, isReadOnly } = props

  return (
    <Main>
      <Inset>
        <Text
          size={Theme.usage.fontSize.medium}
          weight={TextWeight.regular}
          color={TextColor.text.subdued.default}
        >
          {DEFAULT_LOCALE_EN.prefixHours}
        </Text>
      </Inset>

      <CustomSelect
        isReadOnly={isReadOnly}
        gridOptions={{ columnCount: 4 }}
        placeholder={DEFAULT_LOCALE_EN.emptyHours}
        value={value}
        unit={UNITS[1]}
        setValue={setValue}
        leadingZero={leadingZero}
        clockFormat={clockFormat}
        period={period}
        mode={mode}
      />
    </Main>
  )
}
