import React from 'react';
import { TextField } from '@doordash/prism-react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, placeholder, disabled, id, className, style, type, readOnly }, _ref) => {
    if (type === 'file') {
      return (
        <input
          type="file"
          value={value}
          onChange={onChange}
          disabled={disabled}
          id={id}
          className={className}
          style={style}
        />
      );
    }

    return (
      <div className={className} style={style}>
        <TextField
          value={String(value ?? '')}
          onChange={(v) => {
            const syntheticEvent = {
              target: { value: v },
              currentTarget: { value: v },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange?.(syntheticEvent);
          }}
          label="Input"
          isLabelHidden
          placeholder={placeholder}
          isDisabled={disabled}
          readOnly={readOnly}
          id={id}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
