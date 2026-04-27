import { Menu, StackChildren, StackChildrenSize, Text, Toggle, ToggleType } from '@doordash/prism-react'
import React, { useMemo } from 'react'

import { FormInputProps } from '../../Formik/types'
import { formatValue, partToString } from '../converter'
import { LeadingZero, ClockFormat, PeriodType, Unit, Mode, SetValueNumbersOrUndefined } from '../types'
import { sort } from '../utils'

import { MenuContent, Main } from './CustomSelect.styles'
import { MenuGrid } from './MenuGrid'

export type CustomSelectProps = {
  setValue: SetValueNumbersOrUndefined
  optionsList?: string[]
  value?: number[]
  humanizeLabels?: boolean
  leadingZero?: LeadingZero
  clockFormat?: ClockFormat
  period: PeriodType
  gridOptions?: { columnCount: number }
  unit: Unit
  mode: Mode
  placeholder: string
} & FormInputProps

export const CustomSelect: React.FC<CustomSelectProps> = (props: CustomSelectProps) => {
  const {
    value,
    gridOptions,
    optionsList,
    setValue,
    leadingZero,
    clockFormat,
    unit,
    mode,
    placeholder,
    isReadOnly,
    isDisabled,
    ...otherProps
  } = props

  const stringValue =
    value && Array.isArray(value) && value.length > 0
      ? partToString({
          cronPart: value,
          unit,
          leadingZero,
          clockFormat,
          humanize: true,
        })
      : undefined

  const options = useMemo(() => {
    if (optionsList) {
      return optionsList.map((option, index) => {
        const n = unit.min === 0 ? index : index + 1

        return {
          id: n,
          label: option,
          value: n,
        }
      })
    }

    return [...Array(unit.total)].map((e, index) => {
      const n1 = unit.min === 0 ? index : index + 1

      return {
        id: n1.toString(),
        value: index,
        label: formatValue({
          value: n1,
          unit,
          leadingZero,
          clockFormat,
        }) as unknown as string,
      }
    })
  }, [optionsList, unit, leadingZero, clockFormat])

  const handleOnClick = (newValueOption: number | number[]) => {
    const newValueOptions = Array.isArray(newValueOption) ? sort(newValueOption) : [newValueOption]
    let newValue: number[] = newValueOptions

    if (value) {
      newValue = mode === 'single' ? [] : [...value]

      newValueOptions.forEach((o) => {
        const newValueOptionNumber = Number(o)

        if (value.some((v) => v === newValueOptionNumber)) {
          newValue = newValue.filter((v) => v !== newValueOptionNumber)
        } else {
          newValue = sort([...newValue, newValueOptionNumber])
        }
      })
    }

    if (newValue.length === unit.total) {
      setValue([])
    } else {
      setValue(newValue)
    }
  }

  const renderColumnContent = () => (
    <MenuContent>
      <StackChildren size={StackChildrenSize.xSmall}>
        {options.map((opt) => (
          <Toggle
            key={String(opt.id)}
            type={ToggleType.checkbox}
            label={String(opt.label)}
            name={String(opt.id)}
            isDisabled={isDisabled}
            onClick={() => handleOnClick(Number(opt.id))}
            isSelected={!!value?.includes(Number(opt.id))}
          />
        ))}
      </StackChildren>
    </MenuContent>
  )

  const renderGridContent = (columnCount: number) => (
    <MenuGrid
      columnCount={columnCount}
      items={options.map((opt) => (
        <Toggle
          key={String(opt.id)}
          type={ToggleType.checkbox}
          label={String(opt.label)}
          name={String(opt.id)}
          isDisabled={isDisabled}
          onClick={() => handleOnClick(Number(opt.id))}
          isSelected={!!value?.includes(Number(opt.id))}
        />
      ))}
    />
  )

  const renderContent = () => {
    if (gridOptions) {
      return renderGridContent(gridOptions.columnCount)
    }
    return renderColumnContent()
  }

  return (
    <Main>
      {isReadOnly ? (
        <Text styles={Text.Styles.TextFieldText}>{stringValue ?? placeholder}</Text>
      ) : (
        <Menu
          controlText={stringValue ?? placeholder}
          content={[{ customContent: renderContent() }]}
          {...otherProps}
        />
      )}
    </Main>
  )
}
