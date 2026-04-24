import {
  DatePicker,
  InlineChildren,
  InlineChildrenSize,
  InlineChildrenAlignment,
  Menu,
  MenuInteractionType,
  StackChildren,
  StackChildrenSize,
  Text,
  IconSize,
  Theme,
  TextWeight,
} from '@doordash/prism-react'
import { useField, useFormikContext } from 'formik'
import { XCircle } from 'lucide-react'
import * as React from 'react'

import { colors } from '../../../../styles/dataPortalAppTheme'
import { FormInputProps } from '../types'

import { FormikDateFieldMain } from './FormikDateField.styles'

export type Props = FormInputProps & {
  name: string
  label: string
  shouldSetAsInitialDate?: boolean
  displayValueTransform?: (d: Date | string) => string
  hint?: string
  isInline?: boolean
  disabledDays?: { before?: Date; after?: Date }
}

export const FormikDateField: React.FC<Props> = ({
  displayValueTransform = null,
  shouldSetAsInitialDate = false,
  isReadOnly = false,
  hint = '',
  isInline = true,
  disabledDays = { before: new Date() },
  ...props
}) => {
  const [, meta, helpers] = useField<Date | string>({ name: props.name })
  const formik = useFormikContext()

  const value: Date | undefined = React.useMemo(() => {
    if (meta.value && meta.value instanceof Date) {
      return meta.value
    }

    if (meta.value && typeof meta.value === 'string') {
      const parsedDate = new Date(meta.value)
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate
      }
    }

    if (meta.initialValue && meta.initialValue instanceof Date) {
      return meta.initialValue
    }

    if (typeof meta.initialValue === 'string') {
      const parsedInitialDate = new Date(meta.initialValue)

      if (!isNaN(parsedInitialDate.getTime())) {
        return parsedInitialDate
      }
    }

    return undefined
  }, [meta.value, meta.initialValue])

  const displayValue: string = React.useMemo(() => {
    if (typeof displayValueTransform === 'function' && value) {
      return displayValueTransform(value)
    }
    if (value && value instanceof Date) {
      return value.toLocaleDateString('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }
    return 'Select a date'
  }, [displayValueTransform, value])

  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const initialDate = shouldSetAsInitialDate && value instanceof Date ? value : undefined

  return (
    <FormikDateFieldMain isError={!!((formik.submitCount > 0 || meta.touched) && meta.error)}>
      <StackChildren size={StackChildrenSize.xxxSmall}>
        <Text weight={TextWeight.semibold} size={Theme.usage.fontSize.medium}>
          {props.label}
        </Text>
        {isReadOnly && <Text>{displayValue}</Text>}
        {!isReadOnly && (
          <Menu
            isInline={isInline}
            interactionType={MenuInteractionType.controlled}
            isVisible={isMenuOpen}
            onControlClick={() => setIsMenuOpen((prev) => !prev)}
            onVisibilityChange={(isVisible) => {
              if (isVisible && !isMenuOpen) {
                helpers.setTouched(true)
              }
              setIsMenuOpen(isVisible)
            }}
            controlText={displayValue}
            content={[
              {
                customContent: (
                  <DatePicker
                    initialDate={initialDate}
                    selectedDays={value}
                    disabledDays={disabledDays}
                    onDayClick={({ date }) => {
                      helpers.setValue(date)
                      helpers.setTouched(true, false)
                      setIsMenuOpen(false)
                    }}
                  />
                ),
              },
            ]}
          />
        )}
        {(formik.submitCount > 0 || meta.touched) && meta.error && (
          <InlineChildren alignItems={InlineChildrenAlignment.center} size={InlineChildrenSize.xxxSmall}>
            <XCircle color={colors.ddError} size={IconSize.small} />
            <Text styles={Text.Styles.FieldMediumError} color={Text.Colors.TextError}>
              {meta.error}
            </Text>
          </InlineChildren>
        )}
        {hint && (
          <Text styles={Text.Styles.FieldSmallHint} color={Text.Colors.SystemGrey60}>
            {hint}
          </Text>
        )}
      </StackChildren>
    </FormikDateFieldMain>
  )
}

export default FormikDateField
