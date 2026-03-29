import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
  BarChart3,
  TrendingUp,
  Circle,
  PieChart,
  Hash,
  Table2,
  ChevronDown,
} from 'lucide-react';
import { colors, radius, Theme } from '@/styles/theme';
import type { ChartType } from '@/types';

interface ChartTypeLibraryProps {
  activeType: ChartType;
  onTypeSelect: (type: ChartType) => void;
}

const Wrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const TriggerButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
  background: rgb(var(--app-muted-rgb) / 0.3);
  border: 1px solid ${colors.border};
  border-radius: ${radius.md};
  cursor: pointer;
  transition: border-color 0.15s;

  &:hover {
    border-color: ${colors.borderStrong};
  }

  svg { flex-shrink: 0; }
`;

const TriggerLabel = styled.span`
  font-size: 11px;
  color: ${colors.mutedForeground};
  font-weight: 400;
`;

const ActiveIcon = styled.span`
  display: flex;
  align-items: center;
  color: #FF3A00;
`;

const ChevronIcon = styled(ChevronDown)<{ $open: boolean }>`
  width: 12px;
  height: 12px;
  color: ${colors.mutedForeground};
  transition: transform 0.15s;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0)')};
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 50;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
  padding: 8px;
  background: var(--app-card);
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
`;

const TypeButton = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 8px 4px;
  border-radius: ${radius.sm};
  border: ${({ $active }) => ($active ? '2px solid #FF3A00' : '2px solid transparent')};
  background: ${({ $active }) =>
    $active ? 'rgba(255, 58, 0, 0.06)' : 'rgb(var(--app-muted-rgb) / 0.3)'};
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: ${({ $active }) => ($active ? '#FF3A00' : colors.border)};
    background: ${({ $active }) =>
      $active ? 'rgba(255, 58, 0, 0.08)' : 'rgb(var(--app-muted-rgb) / 0.5)'};
  }
`;

const TypeLabel = styled.span<{ $active: boolean }>`
  font-size: 9px;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ $active }) => ($active ? '#FF3A00' : colors.mutedForeground)};
  text-align: center;
  line-height: 1.2;
`;

function BarChartHorizontalIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="3" y2="18" />
      <rect x="3" y="5" width="12" height="4" rx="1" />
      <rect x="3" y="10" width="18" height="4" rx="1" />
      <rect x="3" y="15" width="8" height="4" rx="1" />
    </svg>
  );
}

function AreaChartIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M3 15l4-5 4 3 4-6 4 4" />
      <path d="M3 15l4-5 4 3 4-6 4 4V21H3z" fill="currentColor" opacity="0.15" stroke="none" />
    </svg>
  );
}

const CHART_TYPES: { type: ChartType; label: string; Icon: React.ElementType }[] = [
  { type: 'column', label: 'Column', Icon: BarChart3 },
  { type: 'bar', label: 'Bar', Icon: BarChartHorizontalIcon },
  { type: 'line', label: 'Line', Icon: TrendingUp },
  { type: 'area', label: 'Area', Icon: AreaChartIcon },
  { type: 'scatter', label: 'Scatter', Icon: Circle },
  { type: 'donut', label: 'Donut', Icon: PieChart },
  { type: 'kpi', label: 'KPI', Icon: Hash },
  { type: 'table', label: 'Table', Icon: Table2 },
];

export function ChartTypeLibrary({ activeType, onTypeSelect }: ChartTypeLibraryProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const active = CHART_TYPES.find((t) => t.type === activeType) ?? CHART_TYPES[0];

  return (
    <Wrapper ref={wrapperRef}>
      <TriggerButton onClick={() => setOpen((v) => !v)}>
        <TriggerLabel>Chart Type:</TriggerLabel>
        <ActiveIcon>
          <active.Icon size={14} />
        </ActiveIcon>
        {active.label}
        <ChevronIcon $open={open} />
      </TriggerButton>

      {open && (
        <Dropdown>
          {CHART_TYPES.map(({ type, label, Icon }) => {
            const isActive = activeType === type;
            return (
              <TypeButton
                key={type}
                $active={isActive}
                onClick={() => { onTypeSelect(type); setOpen(false); }}
                title={label}
              >
                <Icon size={14} style={{ color: isActive ? '#FF3A00' : colors.mutedForeground }} />
                <TypeLabel $active={isActive}>{label}</TypeLabel>
              </TypeButton>
            );
          })}
        </Dropdown>
      )}
    </Wrapper>
  );
}
