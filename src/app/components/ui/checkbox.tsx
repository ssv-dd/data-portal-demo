import React from 'react';
import { Toggle, ToggleType } from '@doordash/prism-react';

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ checked = false, onCheckedChange, disabled, className, style }, _ref) => {
    return (
      <div className={className} style={style}>
        <Toggle
          type={ToggleType.checkbox}
          isSelected={checked}
          onChange={(value) => onCheckedChange?.(value)}
          label="Checkbox"
          isLabelHidden
          isDisabled={disabled}
        />
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
