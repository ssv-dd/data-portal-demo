import React from 'react';
import styled from 'styled-components';
import { Theme } from '@doordash/prism-react';
import { colors, radius, shadows } from '@/styles/theme';

const StyledCard = styled.div`
  background-color: ${colors.card};
  color: ${colors.cardForeground};
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.large};
  border-radius: ${radius['2xl']};
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: ${shadows.card};
`;

const StyledCardHeader = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  align-items: start;
  gap: ${Theme.usage.space.xxSmall};
  padding: ${Theme.usage.space.large} ${Theme.usage.space.large} 0;
`;

const StyledCardTitle = styled.h4`
  leading: none;
  letter-spacing: -0.2px;
`;

const StyledCardDescription = styled.p`
  color: ${colors.mutedForeground};
  font-size: ${Theme.usage.fontSize.xSmall};
`;

const StyledCardAction = styled.div`
  grid-column-start: 2;
  grid-row: 1 / span 2;
  align-self: start;
  justify-self: end;
`;

const StyledCardContent = styled.div`
  padding: 0 ${Theme.usage.space.large};
  &:last-child {
    padding-bottom: ${Theme.usage.space.large};
  }
`;

const StyledCardFooter = styled.div`
  display: flex;
  align-items: center;
  padding: 0 ${Theme.usage.space.large} ${Theme.usage.space.large};
`;

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <StyledCard ref={ref} {...props} />
);

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <StyledCardHeader ref={ref} {...props} />
);

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  (props, ref) => <StyledCardTitle ref={ref} {...props} />
);

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  (props, ref) => <StyledCardDescription ref={ref} {...props} />
);

export const CardAction = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <StyledCardAction ref={ref} {...props} />
);

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <StyledCardContent ref={ref} {...props} />
);

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <StyledCardFooter ref={ref} {...props} />
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardAction.displayName = 'CardAction';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';
