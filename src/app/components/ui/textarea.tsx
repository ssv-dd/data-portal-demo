import React from 'react';
import { TextField } from '@doordash/prism-react';

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ value, onChange, placeholder, disabled, id, className, style, rows, ...rest }, _ref) => {
    void rest;
    return (
      <div className={className} style={style}>
        <TextField
          value={String(value ?? '')}
          onChange={(v) => {
            const syntheticEvent = {
              target: { value: v },
              currentTarget: { value: v },
            } as React.ChangeEvent<HTMLTextAreaElement>;
            onChange?.(syntheticEvent);
          }}
          label=""
          isLabelHidden
          isMultiline={rows || 3}
          placeholder={placeholder}
          isDisabled={disabled}
          id={id}
        />
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
