import React from 'react';
import styled from 'styled-components';
import { Theme } from '@doordash/prism-react';
import { colors } from '@/styles/theme';

const StyledLabel = styled.label`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  line-height: 1;
  color: ${colors.foreground};

  &[data-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  (props, ref) => <StyledLabel ref={ref} {...props} />
);

Label.displayName = 'Label';
