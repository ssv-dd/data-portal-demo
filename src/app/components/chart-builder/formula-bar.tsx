import styled from 'styled-components';
import { X } from 'lucide-react';
import { colors, radius, Theme } from '@/styles/theme';
import type { ChartBuilderField } from '@/types';

interface FormulaBarProps {
  measures: ChartBuilderField[];
  dimensions: ChartBuilderField[];
  dateField: ChartBuilderField | null;
  onRemoveMeasure: (fieldId: string) => void;
  onRemoveDimension: (fieldId: string) => void;
  onRemoveDateField: () => void;
}

const Bar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 40px;
  padding: 6px ${Theme.usage.space.xSmall};
  background: rgb(var(--app-muted-rgb) / 0.3);
  border-radius: ${radius.sm};
  border: 1px solid ${colors.border};
`;

const EmptyText = styled.span`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
  font-style: italic;
`;

const Pill = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: ${radius.full};
  background: ${({ $bg }) => $bg};
  font-size: 11px;
  font-weight: 500;
  color: ${({ $color }) => $color};
  white-space: nowrap;
`;

const PillRemove = styled.button<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: ${({ $color }) => $color};
  cursor: pointer;
  padding: 0;
  opacity: 0.7;
  transition: opacity 0.12s ease;

  &:hover {
    opacity: 1;
  }
`;

const MEASURE_BG = 'rgba(74, 222, 128, 0.15)';
const MEASURE_COLOR = '#4ade80';
const DIMENSION_BG = 'rgba(96, 165, 250, 0.15)';
const DIMENSION_COLOR = '#60a5fa';
const DATE_BG = 'rgba(250, 204, 21, 0.15)';
const DATE_COLOR = '#facc15';

export function FormulaBar({
  measures,
  dimensions,
  dateField,
  onRemoveMeasure,
  onRemoveDimension,
  onRemoveDateField,
}: FormulaBarProps) {
  const isEmpty = measures.length === 0 && dimensions.length === 0 && dateField === null;

  return (
    <Bar>
      {isEmpty ? (
        <EmptyText>Select fields from the source browser</EmptyText>
      ) : (
        <>
          {measures.map((m) => (
            <Pill key={m.id} $bg={MEASURE_BG} $color={MEASURE_COLOR}>
              {m.aggregation}({m.name})
              <PillRemove
                $color={MEASURE_COLOR}
                onClick={() => onRemoveMeasure(m.id)}
                title="Remove measure"
              >
                <X style={{ width: 10, height: 10 }} />
              </PillRemove>
            </Pill>
          ))}
          {dimensions.map((d) => (
            <Pill key={d.id} $bg={DIMENSION_BG} $color={DIMENSION_COLOR}>
              {d.name}
              <PillRemove
                $color={DIMENSION_COLOR}
                onClick={() => onRemoveDimension(d.id)}
                title="Remove dimension"
              >
                <X style={{ width: 10, height: 10 }} />
              </PillRemove>
            </Pill>
          ))}
          {dateField && (
            <Pill $bg={DATE_BG} $color={DATE_COLOR}>
              {dateField.name}
              <PillRemove
                $color={DATE_COLOR}
                onClick={onRemoveDateField}
                title="Remove date field"
              >
                <X style={{ width: 10, height: 10 }} />
              </PillRemove>
            </Pill>
          )}
        </>
      )}
    </Bar>
  );
}
