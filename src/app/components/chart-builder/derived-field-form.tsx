import { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { colors, radius, Theme } from '@/styles/theme';
import type { ChartBuilderField } from '@/types';

// --- Props ---

interface DerivedFieldFormProps {
  editingField?: ChartBuilderField;
  existingFieldNames: string[];
  onSubmit: (field: ChartBuilderField) => void;
  onCancel: () => void;
}

// --- Styled components ---

const FormContainer = styled.div`
  border: 1px solid #FF3A00;
  border-radius: ${radius.md};
  padding: 10px;
  margin: 8px;
  background: rgb(var(--app-muted-rgb) / 0.3);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NameInput = styled.input`
  width: 100%;
  padding: 6px 8px;
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.foreground};
  background: rgb(var(--app-muted-rgb) / 0.5);
  border: 1px solid ${colors.border};
  border-radius: 4px;
  outline: none;
  box-sizing: border-box;

  &::placeholder { color: ${colors.mutedForeground}; }
  &:focus { border-color: #FF3A00; }
`;

const RoleToggle = styled.div`
  display: flex;
  gap: 4px;
`;

const RolePill = styled.button<{ $active: boolean; $color: string }>`
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 9999px;
  border: 1px solid ${({ $color, $active }) => ($active ? $color : colors.border)};
  background: ${({ $color, $active }) => ($active ? `${$color}20` : 'transparent')};
  color: ${({ $color, $active }) => ($active ? $color : colors.mutedForeground)};
  cursor: pointer;
  transition: all 0.15s ease;
`;

const ExpressionArea = styled.textarea`
  width: 100%;
  min-height: 48px;
  padding: 6px 8px;
  font-size: ${Theme.usage.fontSize.xSmall};
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  color: ${colors.foreground};
  background: rgb(var(--app-overlay-rgb) / 0.15);
  border: 1px solid ${colors.border};
  border-radius: 4px;
  outline: none;
  resize: vertical;
  box-sizing: border-box;

  &::placeholder { color: ${colors.mutedForeground}; }
  &:focus { border-color: #FF3A00; }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 6px;
`;

const CancelBtn = styled.button`
  padding: 4px 10px;
  font-size: 11px;
  color: ${colors.mutedForeground};
  background: transparent;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  cursor: pointer;
`;

const SubmitBtn = styled.button`
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: #FF3A00;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  opacity: 1;
  &:hover { opacity: 0.9; }
`;

const ErrorText = styled.span`
  font-size: 10px;
  color: #ef4444;
`;

const MEASURE_COLOR = '#4ade80';
const DIMENSION_COLOR = '#60a5fa';

// --- Component ---

export function DerivedFieldForm({
  editingField,
  existingFieldNames,
  onSubmit,
  onCancel,
}: DerivedFieldFormProps) {
  const [name, setName] = useState(editingField?.name ?? '');
  const [role, setRole] = useState<'measure' | 'dimension'>(
    editingField?.role === 'dimension' ? 'dimension' : 'measure',
  );
  const [expression, setExpression] = useState(editingField?.expression ?? '');
  const [errors, setErrors] = useState<{ name?: string; expression?: string }>({});

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const validate = useCallback((): boolean => {
    const next: { name?: string; expression?: string } = {};
    const trimmedName = name.trim();
    if (!trimmedName) {
      next.name = 'Name is required';
    } else {
      const nameLower = trimmedName.toLowerCase();
      const isEditingSameName = editingField && editingField.name.toLowerCase() === nameLower;
      if (!isEditingSameName && existingFieldNames.some((n) => n.toLowerCase() === nameLower)) {
        next.name = 'Field name already exists';
      }
    }
    if (!expression.trim()) {
      next.expression = 'Expression is required';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [name, expression, existingFieldNames, editingField]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    const field: ChartBuilderField = {
      id: editingField?.id ?? crypto.randomUUID(),
      name: name.trim(),
      role,
      dataType: role === 'measure' ? 'number' : 'string',
      expression: expression.trim(),
      isDerived: true,
      aggregation: role === 'measure' ? 'SUM' : undefined,
    };
    onSubmit(field);
  }, [validate, editingField, name, role, expression, onSubmit]);

  const handleExpressionKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    },
    [handleSubmit, onCancel],
  );

  const handleNameKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    },
    [onCancel],
  );

  return (
    <FormContainer>
      <NameInput
        ref={nameRef}
        placeholder="e.g., tip_percentage"
        value={name}
        onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
        onKeyDown={handleNameKeyDown}
      />
      {errors.name && <ErrorText>{errors.name}</ErrorText>}

      <RoleToggle>
        <RolePill
          $active={role === 'measure'}
          $color={MEASURE_COLOR}
          onClick={() => setRole('measure')}
        >
          Measure
        </RolePill>
        <RolePill
          $active={role === 'dimension'}
          $color={DIMENSION_COLOR}
          onClick={() => setRole('dimension')}
        >
          Dimension
        </RolePill>
      </RoleToggle>

      <ExpressionArea
        placeholder="e.g., tips / delivery_fee * 100"
        value={expression}
        onChange={(e) => { setExpression(e.target.value); setErrors((p) => ({ ...p, expression: undefined })); }}
        onKeyDown={handleExpressionKeyDown}
      />
      {errors.expression && <ErrorText>{errors.expression}</ErrorText>}

      <Actions>
        <CancelBtn onClick={onCancel}>Cancel</CancelBtn>
        <SubmitBtn onClick={handleSubmit}>
          {editingField ? 'Save' : 'Add'}
        </SubmitBtn>
      </Actions>
    </FormContainer>
  );
}
