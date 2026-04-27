import {
  InlineChildren,
  InlineChildrenAlignment,
  InlineChildrenSize,
  Menu,
  Text,
  TextColor,
  TextWeight,
  Theme,
  type MenuItemProps,
} from '@doordash/prism-react'
import React, { useCallback, useMemo } from 'react'

import { FormInputProps } from '../../Formik/types'
import { DEFAULT_LOCALE_EN } from '../locale'
import { FieldProps, PeriodType } from '../types'

import { Main } from './styles'

export type Props = {
  value: PeriodType
  setValue: React.Dispatch<React.SetStateAction<PeriodType>>
} & Omit<FieldProps, 'value' | 'setValue' | 'period' | 'mode'> &
  FormInputProps

export const Period: React.FC<Props> = (props: Props) => {
  const { value, setValue, isReadOnly } = props

  const handleChange = useCallback(
    (newValue: PeriodType) => {
      setValue(newValue)
    },
    [setValue]
  )

  const menuContent = useMemo((): MenuItemProps[] => {
    return [
      {
        title: DEFAULT_LOCALE_EN.yearOption,
        onClick: () => handleChange('year'),
      },
      {
        title: DEFAULT_LOCALE_EN.monthOption,
        onClick: () => handleChange('month'),
      },
      {
        title: DEFAULT_LOCALE_EN.weekOption,
        onClick: () => handleChange('week'),
      },
      {
        title: DEFAULT_LOCALE_EN.dayOption,
        onClick: () => handleChange('day'),
      },
      {
        title: DEFAULT_LOCALE_EN.hourOption,
        onClick: () => handleChange('hour'),
      },
      {
        title: DEFAULT_LOCALE_EN.minuteOption,
        onClick: () => handleChange('minute'),
      },
    ]
  }, [handleChange])

  return (
    <Main>
      <InlineChildren alignItems={InlineChildrenAlignment.center} size={InlineChildrenSize.xSmall}>
        <Text
          size={Theme.usage.fontSize.medium}
          weight={TextWeight.regular}
          color={TextColor.text.subdued.default}
        >
          {DEFAULT_LOCALE_EN.prefixPeriod}
        </Text>
        {isReadOnly ? (
          <Text
            size={Theme.usage.fontSize.medium}
            weight={TextWeight.regular}
            color={TextColor.text.subdued.default}
          >
            {value}
          </Text>
        ) : (
          <Menu
            key={JSON.stringify(DEFAULT_LOCALE_EN.prefixPeriod)}
            controlText={value}
            content={menuContent}
          />
        )}
      </InlineChildren>
    </Main>
  )
}
