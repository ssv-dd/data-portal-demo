import React from 'react';
import { Toggle, ToggleType } from '@doordash/prism-react';

interface SwitchProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked = false, onCheckedChange, disabled, className, style }, _ref) => {
    return (
      <div className={className} style={style}>
        <Toggle
          type={ToggleType.toggle}
          isSelected={checked}
          onChange={(value) => onCheckedChange?.(value)}
          label="Toggle"
          isLabelHidden
          isDisabled={disabled}
        />
      </div>
    );
  }
);

Switch.displayName = 'Switch';
