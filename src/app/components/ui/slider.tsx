import React from 'react';
import { Slider as PrismSlider } from '@doordash/prism-react';

interface SliderProps {
  value?: number[];
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onValueChange?: (value: number[]) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ value = [50], min = 0, max = 100, step = 1, disabled, onValueChange, className, style }, _ref) => {
    return (
      <div className={className} style={style}>
        <PrismSlider
          value={value[0]}
          min={min}
          max={max}
          step={step}
          isDisabled={disabled}
          onChange={(v) => onValueChange?.([v])}
          label="Slider"
        />
      </div>
    );
  }
);

Slider.displayName = 'Slider';
