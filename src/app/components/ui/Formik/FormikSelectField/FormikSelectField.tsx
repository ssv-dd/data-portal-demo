import { Select, StackChildren, StackSize } from '@doordash/prism-react'
import { FieldHookConfig, useField } from 'formik'
import * as React from 'react'

import TextError from '../../TextError'
import ReadOnlyTextField from '../ReadOnlyTextField'
import { FormInputProps } from '../types'

type Props = {
  options: { name: string; value: string }[]
  label: string
  name: string
  hint?: React.ReactNode
  onChange?: (value: string) => void
} & FormInputProps &
  FieldHookConfig<string>

const FormikSelectField: React.FC<Props> = ({ onChange, ...props }) => {
  const [, meta, helpers] = useField<string>(props)
  const value = meta.value ?? meta.initialValue ?? props.defaultValue ?? ''
  const optionIndex = props.options.findIndex((opt: { name: string; value: string }) => opt.value === value)

  const shouldShowError = Boolean(meta.touched && meta.error)

  return props.isReadOnly ? (
    <ReadOnlyTextField value={props?.options?.[optionIndex]?.name} label={props.label} />
  ) : (
    <StackChildren size={StackSize.xxxSmall}>
      <Select
        label={props.label}
        value={value}
        onBlur={() => {
          void helpers.setTouched(true)
        }}
        onChange={(v: string) => {
          void helpers.setValue(v)
          onChange?.(v)
        }}
        options={props.options.map((o: { name: string; value: string }) => ({
          value: o.value,
          name: o.name,
        }))}
        isDisabled={props.isDisabled}
      />
      {shouldShowError && meta.error ? <TextError message={meta.error} /> : null}
    </StackChildren>
  )
}

export default FormikSelectField
