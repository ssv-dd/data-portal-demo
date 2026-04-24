import { NumberField, StackChildren, StackSize } from '@doordash/prism-react'
import { FieldHookConfig, FieldValidator, useField } from 'formik'
import toNumber from 'lodash/toNumber'
import * as React from 'react'

import TextError from '../../TextError'
import ReadOnlyTextField from '../ReadOnlyTextField'
import { FormInputProps } from '../types'

export type Props = {
  name: string
  label: string
  validate?: FieldValidator
  placeholder?: string
  defaultValue?: number
  allowFloats?: boolean
  hint?: React.ReactNode
} & FormInputProps &
  FieldHookConfig<number>

const FormikNumberField: React.FC<Props> = ({ allowFloats = false, ...props }) => {
  const [field, meta, helpers] = useField<number>(props)
  const value = meta?.value ?? props?.defaultValue ?? 0

  return props.isReadOnly ? (
    <ReadOnlyTextField value={meta?.value} label={props.label} hint={props.hint} />
  ) : (
    <StackChildren size={StackSize.xxxSmall}>
      <NumberField
        {...field}
        {...props}
        allowFloats={allowFloats}
        value={toNumber(value)}
        error={Boolean(meta.touched && meta.error)}
        onBlur={() => helpers.setTouched(true)}
        onChange={(v: string) => {
          helpers.setValue(toNumber(v))
        }}
      />
      {meta.touched && meta.error ? <TextError message={meta.error} /> : null}
    </StackChildren>
  )
}

export default FormikNumberField
