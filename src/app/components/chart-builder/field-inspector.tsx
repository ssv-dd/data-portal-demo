import { useState } from 'react';
import styled from 'styled-components';
import { ChevronRight, Search, Pencil, Trash2 } from 'lucide-react';
import { colors, radius, Theme } from '@/styles/theme';
import type { ChartBuilderField } from '@/types';
import type { SourceFields } from '@/app/data/mock/chart-builder-data';
import { DerivedFieldForm } from './derived-field-form';

interface FieldInspectorProps {
  fields: SourceFields;
  selectedMeasures: ChartBuilderField[];
  selectedDimensions: ChartBuilderField[];
  selectedDateField: ChartBuilderField | null;
  onMeasureToggle: (field: ChartBuilderField) => void;
  onDimensionToggle: (field: ChartBuilderField) => void;
  onDateFieldSelect: (field: ChartBuilderField | null) => void;
  onAggregationChange: (fieldId: string, agg: ChartBuilderField['aggregation']) => void;
  onAddDerivedField: (field: ChartBuilderField) => void;
  onEditDerivedField: (field: ChartBuilderField) => void;
  onDeleteDerivedField: (fieldId: string) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: ${Theme.usage.space.xSmall};
  border-bottom: 1px solid ${colors.border};
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 18px;
  width: 13px;
  height: 13px;
  color: ${colors.mutedForeground};
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 7px 10px 7px 30px;
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.foreground};
  background: rgb(var(--app-muted-rgb) / 0.4);
  border: 1px solid ${colors.border};
  border-radius: ${radius.sm};
  outline: none;
  transition: border-color 0.15s ease;

  &::placeholder {
    color: ${colors.mutedForeground};
  }

  &:focus {
    border-color: #FF3A00;
  }
`;

const Section = styled.div`
  border-bottom: 1px solid ${colors.border};
`;

const SectionHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: 10px ${Theme.usage.space.xSmall};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: rgb(var(--app-muted-rgb) / 0.3);
  }
`;

const SectionChevron = styled(ChevronRight)<{ $open: boolean }>`
  width: 14px;
  height: 14px;
  color: ${colors.mutedForeground};
  transition: transform 0.2s ease;
  transform: ${({ $open }) => ($open ? 'rotate(90deg)' : 'rotate(0deg)')};
  flex-shrink: 0;
`;

const SectionLabel = styled.span`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 600;
  color: ${colors.foreground};
  flex: 1;
  text-align: left;
`;

const CountBadge = styled.span<{ $color: string }>`
  font-size: 10px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => `${$color}20`};
  padding: 1px 6px;
  border-radius: 9999px;
`;

const FieldList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px 0 8px;
`;

const HoverActions = styled.div`
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.12s ease;
  flex-shrink: 0;
`;

const ActionIcon = styled.button<{ $hoverColor?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: ${colors.mutedForeground};

  &:hover {
    background: rgb(var(--app-muted-rgb) / 0.5);
    color: ${({ $hoverColor }) => $hoverColor ?? colors.foreground};
  }
`;

const FieldRow = styled.div<{ $borderColor: string; $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: 6px ${Theme.usage.space.xSmall};
  border-left: 3px solid ${({ $borderColor, $selected }) =>
    $selected ? $borderColor : 'transparent'};
  cursor: pointer;
  transition: background 0.12s ease, border-color 0.12s ease;
  background: ${({ $selected }) =>
    $selected ? 'rgb(var(--app-muted-rgb) / 0.3)' : 'transparent'};

  &:hover {
    background: rgb(var(--app-muted-rgb) / 0.3);
    border-left-color: ${({ $borderColor }) => $borderColor};
  }

  &:hover ${HoverActions} {
    opacity: 1;
  }
`;

const FieldCheckbox = styled.input`
  accent-color: #FF3A00;
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  cursor: pointer;
`;

const FieldRadio = styled.input`
  accent-color: #FF3A00;
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  cursor: pointer;
`;

const FieldInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FieldName = styled.span`
  display: block;
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FieldDesc = styled.span`
  display: block;
  font-size: 10px;
  color: ${colors.mutedForeground};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AggSelect = styled.select`
  font-size: 10px;
  color: ${colors.mutedForeground};
  background: rgb(var(--app-muted-rgb) / 0.5);
  border: 1px solid ${colors.border};
  border-radius: 4px;
  padding: 2px 4px;
  cursor: pointer;
  outline: none;
  flex-shrink: 0;

  &:focus {
    border-color: #FF3A00;
  }
`;

const AddDerivedButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: calc(100% - 16px);
  margin: 6px 8px;
  padding: 6px 0;
  font-size: 11px;
  font-weight: 500;
  color: #FF3A00;
  background: transparent;
  border: 1px dashed #FF3A00;
  border-radius: ${radius.sm};
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: rgb(255 58 0 / 0.08);
  }
`;

const DerivedBadge = styled.span`
  font-size: 9px;
  font-weight: 600;
  color: #FF3A00;
  background: rgb(255 58 0 / 0.15);
  padding: 0 5px;
  border-radius: 3px;
  flex-shrink: 0;
  line-height: 16px;
`;

const AGG_OPTIONS: ChartBuilderField['aggregation'][] = ['SUM', 'COUNT', 'AVG', 'MIN', 'MAX'];

const MEASURE_COLOR = '#4ade80';
const DIMENSION_COLOR = '#60a5fa';
const DATE_COLOR = '#facc15';

export function FieldInspector({
  fields,
  selectedMeasures,
  selectedDimensions,
  selectedDateField,
  onMeasureToggle,
  onDimensionToggle,
  onDateFieldSelect,
  onAggregationChange,
  onAddDerivedField,
  onEditDerivedField,
  onDeleteDerivedField,
}: FieldInspectorProps) {
  const [search, setSearch] = useState('');
  const [measuresOpen, setMeasuresOpen] = useState(true);
  const [dimensionsOpen, setDimensionsOpen] = useState(true);
  const [datesOpen, setDatesOpen] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingField, setEditingField] = useState<ChartBuilderField | null>(null);

  const q = search.toLowerCase();

  const filteredMeasures = fields.measures.filter(
    (f) => !q || f.name.toLowerCase().includes(q) || (f.description ?? '').toLowerCase().includes(q) || (f.expression ?? '').toLowerCase().includes(q)
  );
  const filteredDimensions = fields.dimensions.filter(
    (f) => !q || f.name.toLowerCase().includes(q) || (f.description ?? '').toLowerCase().includes(q) || (f.expression ?? '').toLowerCase().includes(q)
  );
  const filteredDates = fields.dateFields.filter(
    (f) => !q || f.name.toLowerCase().includes(q) || (f.description ?? '').toLowerCase().includes(q)
  );

  const existingFieldNames = [
    ...fields.measures.map((f) => f.name),
    ...fields.dimensions.map((f) => f.name),
    ...fields.dateFields.map((f) => f.name),
  ];

  const handleOpenAdd = () => {
    setEditingField(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (field: ChartBuilderField) => {
    setEditingField(field);
    setFormOpen(true);
  };

  const handleFormSubmit = (field: ChartBuilderField) => {
    if (editingField) {
      onEditDerivedField(field);
    } else {
      onAddDerivedField(field);
    }
    setFormOpen(false);
    setEditingField(null);
  };

  const handleFormCancel = () => {
    setFormOpen(false);
    setEditingField(null);
  };

  const isMeasureSelected = (id: string) => selectedMeasures.some((m) => m.id === id);
  const isDimensionSelected = (id: string) => selectedDimensions.some((d) => d.id === id);
  const isDateSelected = (id: string) => selectedDateField?.id === id;

  const getMeasureAgg = (id: string): ChartBuilderField['aggregation'] => {
    return selectedMeasures.find((m) => m.id === id)?.aggregation ?? 'SUM';
  };

  return (
    <Container>
      <SearchWrapper>
        <SearchIcon />
        <SearchInput
          placeholder="Filter fields..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchWrapper>

      {formOpen ? (
        <DerivedFieldForm
          editingField={editingField ?? undefined}
          existingFieldNames={existingFieldNames}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : (
        <AddDerivedButton onClick={handleOpenAdd}>
          + Add Derived Field
        </AddDerivedButton>
      )}

      {/* Measures */}
      <Section>
        <SectionHeader onClick={() => setMeasuresOpen((v) => !v)}>
          <SectionChevron $open={measuresOpen} />
          <SectionLabel>Measures</SectionLabel>
          <CountBadge $color={MEASURE_COLOR}>{filteredMeasures.length}</CountBadge>
        </SectionHeader>
        {measuresOpen && (
          <FieldList>
            {filteredMeasures.map((field) => {
              const selected = isMeasureSelected(field.id);
              return (
                <FieldRow
                  key={field.id}
                  $borderColor={MEASURE_COLOR}
                  $selected={selected}
                  onClick={() => onMeasureToggle(field)}
                >
                  <FieldCheckbox
                    type="checkbox"
                    checked={selected}
                    onChange={() => onMeasureToggle(field)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <FieldInfo>
                    <FieldName>{field.name}</FieldName>
                    {field.isDerived && <DerivedBadge>derived</DerivedBadge>}
                    {field.description && !field.isDerived && <FieldDesc>{field.description}</FieldDesc>}
                    {field.isDerived && field.expression && (
                      <FieldDesc>{field.expression}</FieldDesc>
                    )}
                  </FieldInfo>
                  {selected && (
                    <AggSelect
                      value={getMeasureAgg(field.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        onAggregationChange(field.id, e.target.value as ChartBuilderField['aggregation']);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {AGG_OPTIONS.map((agg) => (
                        <option key={agg} value={agg}>{agg}</option>
                      ))}
                    </AggSelect>
                  )}
                  {field.isDerived && (
                    <HoverActions>
                      <ActionIcon
                        onClick={(e) => { e.stopPropagation(); handleOpenEdit(field); }}
                        title="Edit derived field"
                      >
                        <Pencil style={{ width: 12, height: 12 }} />
                      </ActionIcon>
                      <ActionIcon
                        $hoverColor="#ef4444"
                        onClick={(e) => { e.stopPropagation(); onDeleteDerivedField(field.id); }}
                        title="Delete derived field"
                      >
                        <Trash2 style={{ width: 12, height: 12 }} />
                      </ActionIcon>
                    </HoverActions>
                  )}
                </FieldRow>
              );
            })}
            {filteredMeasures.length === 0 && (
              <FieldDesc style={{ padding: '6px 12px' }}>No measures found</FieldDesc>
            )}
          </FieldList>
        )}
      </Section>

      {/* Dimensions */}
      <Section>
        <SectionHeader onClick={() => setDimensionsOpen((v) => !v)}>
          <SectionChevron $open={dimensionsOpen} />
          <SectionLabel>Dimensions</SectionLabel>
          <CountBadge $color={DIMENSION_COLOR}>{filteredDimensions.length}</CountBadge>
        </SectionHeader>
        {dimensionsOpen && (
          <FieldList>
            {filteredDimensions.map((field) => {
              const selected = isDimensionSelected(field.id);
              return (
                <FieldRow
                  key={field.id}
                  $borderColor={DIMENSION_COLOR}
                  $selected={selected}
                  onClick={() => onDimensionToggle(field)}
                >
                  <FieldCheckbox
                    type="checkbox"
                    checked={selected}
                    onChange={() => onDimensionToggle(field)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <FieldInfo>
                    <FieldName>{field.name}</FieldName>
                    {field.isDerived && <DerivedBadge>derived</DerivedBadge>}
                    {field.description && !field.isDerived && <FieldDesc>{field.description}</FieldDesc>}
                    {field.isDerived && field.expression && (
                      <FieldDesc>{field.expression}</FieldDesc>
                    )}
                  </FieldInfo>
                  {field.isDerived && (
                    <HoverActions>
                      <ActionIcon
                        onClick={(e) => { e.stopPropagation(); handleOpenEdit(field); }}
                        title="Edit derived field"
                      >
                        <Pencil style={{ width: 12, height: 12 }} />
                      </ActionIcon>
                      <ActionIcon
                        $hoverColor="#ef4444"
                        onClick={(e) => { e.stopPropagation(); onDeleteDerivedField(field.id); }}
                        title="Delete derived field"
                      >
                        <Trash2 style={{ width: 12, height: 12 }} />
                      </ActionIcon>
                    </HoverActions>
                  )}
                </FieldRow>
              );
            })}
            {filteredDimensions.length === 0 && (
              <FieldDesc style={{ padding: '6px 12px' }}>No dimensions found</FieldDesc>
            )}
          </FieldList>
        )}
      </Section>

      {/* Date Fields */}
      <Section>
        <SectionHeader onClick={() => setDatesOpen((v) => !v)}>
          <SectionChevron $open={datesOpen} />
          <SectionLabel>Date Fields</SectionLabel>
          <CountBadge $color={DATE_COLOR}>{filteredDates.length}</CountBadge>
        </SectionHeader>
        {datesOpen && (
          <FieldList>
            {filteredDates.map((field) => {
              const selected = isDateSelected(field.id);
              return (
                <FieldRow
                  key={field.id}
                  $borderColor={DATE_COLOR}
                  $selected={selected}
                  onClick={() =>
                    onDateFieldSelect(selected ? null : field)
                  }
                >
                  <FieldRadio
                    type="radio"
                    checked={selected}
                    onChange={() => onDateFieldSelect(field)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <FieldInfo>
                    <FieldName>{field.name}</FieldName>
                    {field.description && <FieldDesc>{field.description}</FieldDesc>}
                  </FieldInfo>
                </FieldRow>
              );
            })}
            {filteredDates.length === 0 && (
              <FieldDesc style={{ padding: '6px 12px' }}>No date fields found</FieldDesc>
            )}
          </FieldList>
        )}
      </Section>
    </Container>
  );
}
