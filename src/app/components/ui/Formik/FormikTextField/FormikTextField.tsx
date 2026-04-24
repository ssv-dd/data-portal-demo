import {
  Loading,
  LoadingSize,
  StackChildren,
  StackSize,
  TextField,
  TextFieldProps,
} from '@doordash/prism-react'
import { FieldInputProps, FieldValidator, useField, FieldHookConfig } from 'formik'
import * as React from 'react'

import TextError from '../../TextError'
import ReadOnlyTextField from '../ReadOnlyTextField'
import { FormInputProps } from '../types'

export type Props = {
  isDisabled?: boolean
  name: string
  label?: string
  validate?: FieldValidator
  isMultiline?: number
  placeholder?: string
  description?: string
  hint?: React.ReactNode
  transformValue?: (value: string) => string
  onBlur?: () => void
  isLoading?: boolean
  isErrorMessageWrapped?: boolean
  /** When set, TextError is omitted here — render it outside the input shell and pass matching `id` for a11y. */
  isErrorMessageExternal?: boolean
  onChange?: (value: string) => void
} & FormInputProps &
  Partial<Omit<TextFieldProps, 'onChange'>> &
  Partial<Omit<FieldInputProps<string>, 'onChange'>> &
  Omit<FieldHookConfig<string>, 'onChange'>

const FormikTextField: React.FC<Props> = ({
  isLoading = undefined,
  onChange = () => {},
  label = '',
  isErrorMessageExternal = false,
  ...props
}) => {
  const [field, meta, helpers] = useField(props as FieldHookConfig<string>)
  const externalErrorDescribedBy =
    isErrorMessageExternal && props.id && meta.touched && meta.error ? `${props.id}-error` : undefined

  return props.isReadOnly ? (
    <ReadOnlyTextField value={meta?.value} label={label} isMultiline={props.isMultiline} hint={props.hint} />
  ) : (
    <StackChildren size={StackSize.xxxSmall}>
      <TextField
        {...field}
        {...props}
        label={label}
        readOnly={props.isReadOnly}
        value={meta.value ?? meta.initialValue ?? props.defaultValue ?? ''}
        error={!!(meta.touched && meta.error)}
        accessibilityDescribedBy={externalErrorDescribedBy ?? props.accessibilityDescribedBy}
        onBlur={() => {
          helpers.setTouched(true)
          if (props.onBlur) {
            props.onBlur()
          }
        }}
        onChange={(v: string) => {
          const value = props.transformValue ? props.transformValue(v) : v
          helpers.setValue(value)
          onChange(v)
        }}
        renderAfterContent={
          isLoading !== undefined
            ? () => (
                <div
                  style={{
                    visibility: isLoading === true ? 'visible' : 'hidden',
                  }}
                >
                  <Loading size={LoadingSize.small} />
                </div>
              )
            : undefined
        }
      />
      {/* we are showing error like this so that error message could wrap onto next line */}
      {meta.touched && meta.error && !isErrorMessageExternal ? <TextError message={meta.error} /> : null}
    </StackChildren>
  )
}

export default FormikTextField
