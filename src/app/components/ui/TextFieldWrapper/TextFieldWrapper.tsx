import { TextField } from '@doordash/prism-react'
import React from 'react'

export type TextFieldWrapperProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> & {
  readonly onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export const TextFieldWrapper = React.forwardRef<HTMLDivElement, TextFieldWrapperProps>(
  ({ value, onChange, placeholder, disabled, id, className, style, readOnly, onFocus, onKeyDown }, ref) => (
    <div
      ref={ref}
      className={className}
      style={style}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      role="presentation"
    >
      <TextField
        value={String(value ?? '')}
        onChange={(v) => {
          const syntheticEvent = {
            target: { value: v },
            currentTarget: { value: v },
          } as React.ChangeEvent<HTMLInputElement>
          onChange?.(syntheticEvent)
        }}
        label="Input"
        isLabelHidden
        placeholder={placeholder}
        isDisabled={disabled}
        readOnly={readOnly}
        id={id}
      />
    </div>
  )
)

TextFieldWrapper.displayName = 'TextFieldWrapper'
