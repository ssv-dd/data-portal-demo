import React from 'react';
import styled from 'styled-components';
import { colors } from '@/styles/theme';

const ScrollAreaRoot = styled.div`
  position: relative;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.border};
    border-radius: 3px;
  }
`;

export const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <ScrollAreaRoot ref={ref} {...props} />
);

export const ScrollBar = () => null;

ScrollArea.displayName = 'ScrollArea';
