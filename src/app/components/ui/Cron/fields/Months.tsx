import { Inset, Text, TextColor, TextWeight, Theme } from '@doordash/prism-react'
import React from 'react'

import { FormInputProps } from '../../Formik/types'
import { CustomSelect } from '../components/CustomSelect'
import { UNITS } from '../constants'
import { DEFAULT_LOCALE_EN } from '../locale'
import { FieldProps } from '../types'

import { Main } from './styles'

export type Props = {
  humanizeLabels?: boolean
} & FieldProps &
  FormInputProps

export const Months: React.FC<Props> = (props: Props) => {
  const { value, setValue, period, mode, isReadOnly } = props

  const optionsList = DEFAULT_LOCALE_EN.months

  return (
    <Main>
      <Inset>
        <Text
          size={Theme.usage.fontSize.medium}
          weight={TextWeight.regular}
          color={TextColor.text.subdued.default}
        >
          {DEFAULT_LOCALE_EN.prefixMonths}
        </Text>
      </Inset>

      <CustomSelect
        isReadOnly={isReadOnly}
        placeholder={DEFAULT_LOCALE_EN.emptyMonths}
        optionsList={optionsList}
        gridOptions={{ columnCount: 2 }}
        value={value}
        unit={{
          ...UNITS[3],
          // Allow translation of alternative labels when using "humanizeLabels"
          // Issue #3
          alt: DEFAULT_LOCALE_EN.altMonths,
        }}
        setValue={setValue}
        period={period}
        mode={mode}
      />
    </Main>
  )
}
