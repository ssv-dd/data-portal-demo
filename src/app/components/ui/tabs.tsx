import React, { useState } from 'react';
import styled from 'styled-components';
import { Theme } from '@doordash/prism-react';
import { colors } from '@/styles/theme';

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const TabsContext = React.createContext<{
  value: string;
  onChange: (v: string) => void;
}>({ value: '', onChange: () => {} });

export function Tabs({ defaultValue = '', value, onValueChange, children, style, className }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value !== undefined ? value : internalValue;
  const handleChange = (v: string) => {
    if (value === undefined) setInternalValue(v);
    onValueChange?.(v);
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, onChange: handleChange }}>
      <div style={style} className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

const TabsListWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: rgb(var(--app-overlay-rgb) / 0.04);
  border-radius: ${Theme.usage.borderRadius.medium};
  padding: ${Theme.usage.space.xxxSmall};
  gap: ${Theme.usage.space.xxxSmall};
`;

const TabButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  padding: 6px ${Theme.usage.space.medium};
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 150ms ease;
  background-color: ${({ $active }) => $active ? colors.background : 'transparent'};
  color: ${({ $active }) => $active ? colors.foreground : colors.mutedForeground};
  box-shadow: ${({ $active }) => $active ? '0 1px 2px rgb(var(--app-overlay-rgb) / 0.06)' : 'none'};

  &:hover {
    color: ${colors.foreground};
  }
`;

export function TabsList({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <TabsListWrapper style={style} className={className}>
      {children}
    </TabsListWrapper>
  );
}

export function TabsTrigger({ value, children, style }: { value: string; children: React.ReactNode; style?: React.CSSProperties }) {
  const { value: currentValue, onChange } = React.useContext(TabsContext);
  return (
    <TabButton $active={currentValue === value} onClick={() => onChange(value)} style={style}>
      {children}
    </TabButton>
  );
}

export function TabsContent({ value, children, style, className }: { value: string; children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  const ctx = React.useContext(TabsContext);
  if (ctx.value !== value) return null;
  return <div style={style} className={className}>{children}</div>;
}
