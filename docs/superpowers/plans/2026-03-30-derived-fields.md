# Derived Fields Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow users to create calculated measures and conditional dimensions inline in the chart builder's field panel.

**Architecture:** Extend `ChartBuilderField` with optional `isDerived`/`expression` props. Add a new `DerivedFieldForm` component for inline creation/editing. Modify `FieldInspector` to show the form and render derived fields with badges/actions. Wire state in `ChartBuilderPage`.

**Tech Stack:** React 18, TypeScript, styled-components, Lucide icons

**Spec:** `docs/superpowers/specs/2026-03-30-derived-fields-design.md`

---

## File Structure

| File | Role |
|------|------|
| `src/types/artifacts.ts` | Add `isDerived?` and `expression?` to `ChartBuilderField` |
| `src/app/components/chart-builder/derived-field-form.tsx` | **New** — inline form for creating/editing derived fields |
| `src/app/components/chart-builder/field-inspector.tsx` | Add "+ Add" button, derived badge, hover edit/delete actions, new props |
| `src/app/pages/chart-builder-page.tsx` | Add `derivedFields` state, handlers, merge logic, clear on source change, restore on edit |

---

### Task 1: Extend `ChartBuilderField` type

**Files:**
- Modify: `src/types/artifacts.ts:174-181`

- [ ] **Step 1: Add `isDerived` and `expression` to the interface**

In `src/types/artifacts.ts`, add two optional properties to `ChartBuilderField`:

```typescript
export interface ChartBuilderField {
  id: string;
  name: string;
  role: 'measure' | 'dimension' | 'date';
  dataType: 'number' | 'string' | 'date';
  description?: string;
  aggregation?: 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX';
  isDerived?: boolean;
  expression?: string;
}
```

- [ ] **Step 2: Verify build still passes**

Run: `npm run build`
Expected: No errors. Existing code is unaffected since both fields are optional.

- [ ] **Step 3: Commit**

```bash
git add src/types/artifacts.ts
git commit -m "feat: add isDerived and expression to ChartBuilderField type"
```

---

### Task 2: Create `DerivedFieldForm` component

**Files:**
- Create: `src/app/components/chart-builder/derived-field-form.tsx`

- [ ] **Step 1: Create the component file**

Create `src/app/components/chart-builder/derived-field-form.tsx` with the following implementation:

```typescript
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
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: No errors (component is created but not yet imported anywhere).

- [ ] **Step 3: Commit**

```bash
git add src/app/components/chart-builder/derived-field-form.tsx
git commit -m "feat: add DerivedFieldForm inline component for derived fields"
```

---

### Task 3: Update `FieldInspector` — button, badge, hover actions

**Files:**
- Modify: `src/app/components/chart-builder/field-inspector.tsx`

- [ ] **Step 1: Add new imports and props**

At the top of the file, add `Pencil` and `Trash2` imports and the `DerivedFieldForm` import:

```typescript
import { ChevronRight, Search, Pencil, Trash2 } from 'lucide-react';
```

```typescript
import { DerivedFieldForm } from './derived-field-form';
```

Update the `FieldInspectorProps` interface to add three new props:

```typescript
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
```

- [ ] **Step 2: Add styled components for the button, badge, and hover actions**

Add these styled components **before the existing `FieldRow`** definition (important: `HoverActions` must be declared before `FieldRow` so the `&:hover ${HoverActions}` selector works in styled-components):

```typescript
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
```

Then add the remaining new styled components after `FieldRow` (before `AGG_OPTIONS`):

```typescript
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
```

Update the existing `FieldRow` styled component to show `HoverActions` on hover. Replace the existing `FieldRow`:

```typescript
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
```

- [ ] **Step 3: Add form state and update search filters**

Inside the `FieldInspector` function, add state for the form and update the filter logic:

After the existing `useState` calls for `search`, `measuresOpen`, etc., add:

```typescript
const [formOpen, setFormOpen] = useState(false);
const [editingField, setEditingField] = useState<ChartBuilderField | null>(null);
```

Update the three filter functions to also check `f.expression`:

```typescript
const filteredMeasures = fields.measures.filter(
  (f) => !q || f.name.toLowerCase().includes(q) || (f.description ?? '').toLowerCase().includes(q) || (f.expression ?? '').toLowerCase().includes(q)
);
const filteredDimensions = fields.dimensions.filter(
  (f) => !q || f.name.toLowerCase().includes(q) || (f.description ?? '').toLowerCase().includes(q) || (f.expression ?? '').toLowerCase().includes(q)
);
const filteredDates = fields.dateFields.filter(
  (f) => !q || f.name.toLowerCase().includes(q) || (f.description ?? '').toLowerCase().includes(q)
);
```

Compute `existingFieldNames` for validation:

```typescript
const existingFieldNames = [
  ...fields.measures.map((f) => f.name),
  ...fields.dimensions.map((f) => f.name),
  ...fields.dateFields.map((f) => f.name),
];
```

Add handlers for form open/close/submit:

```typescript
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
```

- [ ] **Step 4: Update the JSX — add button/form and derived badges**

In the return JSX, add the derived field button/form between `SearchWrapper` and the first `Section`:

```tsx
{/* After SearchWrapper, before Measures Section */}
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
```

In the Measures section, update each `FieldRow` for measures to show the derived badge and hover actions. Replace the measure map callback body:

```tsx
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
```

Apply the same pattern in the Dimensions section — add `DerivedBadge` and `HoverActions` for derived dimension fields. The dimensions version is simpler (no `AggSelect`):

```tsx
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
```

- [ ] **Step 5: Do NOT commit yet**

The build will fail because `ChartBuilderPage` doesn't pass the new props yet. We'll commit Tasks 3 and 4 together to avoid a broken intermediate state.

---

### Task 4: Wire state and handlers in `ChartBuilderPage`

**Files:**
- Modify: `src/app/pages/chart-builder-page.tsx`

- [ ] **Step 1: Add `derivedFields` state**

After the existing `useState` calls (around line 330), add:

```typescript
const [derivedFields, setDerivedFields] = useState<ChartBuilderField[]>(() => {
  // Restore derived fields from editing widget if present
  if (editingWidget?.query) {
    return [
      ...(editingWidget.query.measures ?? []),
      ...(editingWidget.query.dimensions ?? []),
    ].filter((f) => f.isDerived);
  }
  return [];
});
```

- [ ] **Step 2: Add derived field handlers**

After the existing `handleAggregationChange` (around line 400), add:

```typescript
const handleAddDerivedField = useCallback((field: ChartBuilderField) => {
  setDerivedFields((prev) => [...prev, field]);
}, []);

const handleEditDerivedField = useCallback((updated: ChartBuilderField) => {
  setDerivedFields((prev) =>
    prev.map((f) => (f.id === updated.id ? updated : f))
  );
  // Update in-place if role unchanged, deselect if role changed
  setSelectedMeasures((prev) => {
    const idx = prev.findIndex((m) => m.id === updated.id);
    if (idx === -1) return prev;
    if (updated.role !== 'measure') return prev.filter((m) => m.id !== updated.id);
    return prev.map((m) => (m.id === updated.id ? updated : m));
  });
  setSelectedDimensions((prev) => {
    const idx = prev.findIndex((d) => d.id === updated.id);
    if (idx === -1) return prev;
    if (updated.role !== 'dimension') return prev.filter((d) => d.id !== updated.id);
    return prev.map((d) => (d.id === updated.id ? updated : d));
  });
}, []);

const handleDeleteDerivedField = useCallback((fieldId: string) => {
  setDerivedFields((prev) => prev.filter((f) => f.id !== fieldId));
  setSelectedMeasures((prev) => prev.filter((m) => m.id !== fieldId));
  setSelectedDimensions((prev) => prev.filter((d) => d.id !== fieldId));
}, []);
```

- [ ] **Step 3: Clear derived fields on source/tab change**

Add `setDerivedFields([])` to the three existing handlers:

In `handleSourceSelect` (around line 347), add after `setSelectedDateField(null)`:
```typescript
setDerivedFields([]);
```

In `handleTabChange` (around line 356), add after `setSelectedDateField(null)`:
```typescript
setDerivedFields([]);
```

In `handleChangeSource` (around line 365), add after `setSelectedDateField(null)`:
```typescript
setDerivedFields([]);
```

- [ ] **Step 4: Compute merged fields**

Replace the existing `fields` constant (around line 451):

```typescript
const sourceFields = selectedSource ? SOURCE_FIELDS[selectedSource.id] : null;

const fields: SourceFields | null = sourceFields
  ? {
      measures: [
        ...sourceFields.measures,
        ...derivedFields.filter((f) => f.role === 'measure'),
      ],
      dimensions: [
        ...sourceFields.dimensions,
        ...derivedFields.filter((f) => f.role === 'dimension'),
      ],
      dateFields: sourceFields.dateFields,
    }
  : null;
```

**Important:** Add `SourceFields` to the import from chart-builder-data. It's not currently imported in this file. Update the existing import (around line 20):

```typescript
import {
  CHART_BUILDER_SOURCES,
  SOURCE_FIELDS,
  SOURCE_META,
  generateMockChartData,
  generateMockKpiData,
  type SourceItem,
  type SourceFields,   // ADD THIS
} from '@/app/data/mock/chart-builder-data';
```

- [ ] **Step 5: Pass new props to FieldInspector**

Update the `<FieldInspector>` JSX (around line 491) to include the three new props:

```tsx
<FieldInspector
  fields={fields}
  selectedMeasures={selectedMeasures}
  selectedDimensions={selectedDimensions}
  selectedDateField={selectedDateField}
  onMeasureToggle={handleMeasureToggle}
  onDimensionToggle={handleDimensionToggle}
  onDateFieldSelect={handleDateFieldSelect}
  onAggregationChange={handleAggregationChange}
  onAddDerivedField={handleAddDerivedField}
  onEditDerivedField={handleEditDerivedField}
  onDeleteDerivedField={handleDeleteDerivedField}
/>
```

- [ ] **Step 6: Verify build passes**

Run: `npm run build`
Expected: Clean build, no errors.

- [ ] **Step 7: Commit Tasks 3 + 4 together**

```bash
git add src/app/components/chart-builder/field-inspector.tsx src/app/pages/chart-builder-page.tsx
git commit -m "feat: add derived field UI to FieldInspector and wire state in ChartBuilderPage"
```

---

### Task 5: Manual smoke test

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

- [ ] **Step 2: Test creation flow**

1. Navigate to `http://localhost:5180/#/dashboard/draft` → click "Add Chart"
2. Select the "fact_deliveries" source under SQL tab
3. Verify the "+ Add Derived Field" button appears below the search bar
4. Click it — verify the inline form appears (name, role toggle, expression textarea)
5. Type name: `tip_percentage`, keep role as Measure, expression: `tips / delivery_fee * 100`
6. Click "Add" — verify:
   - Form closes
   - `tip_percentage` appears at the bottom of the Measures section with an orange "derived" badge
   - The expression text shows below the field name
   - Count badge updates from 4 to 5

- [ ] **Step 3: Test selection**

1. Check the `tip_percentage` checkbox — verify it appears in the FormulaBar and chart preview renders
2. Verify the aggregation dropdown (SUM) appears when selected

- [ ] **Step 4: Test edit flow**

1. Hover over `tip_percentage` — verify pencil and trash icons appear
2. Click pencil — verify form opens pre-filled with name, role, and expression
3. Change name to `tip_pct`, click Save — verify the field updates in the list

- [ ] **Step 5: Test delete flow**

1. Select `tip_pct` (check it), then hover and click trash icon
2. Verify it disappears from the Measures section and the FormulaBar

- [ ] **Step 6: Test validation**

1. Click "+ Add Derived Field" again
2. Click "Add" without filling anything — verify both error messages appear
3. Type name: `delivery_fee` (existing field) — click Add — verify "Field name already exists" error

- [ ] **Step 7: Test source change clears derived fields**

1. Create a derived field, then click the back arrow to change source
2. Select a different source — verify derived fields are gone
3. Go back to fact_deliveries — derived fields should not reappear

- [ ] **Step 8: Test keyboard shortcuts**

1. Open the form, press Escape — verify form closes
2. Open form, fill name and expression, press Enter in expression — verify it submits

- [ ] **Step 9: Commit all final adjustments**

If any fixes were needed during testing, commit them:

```bash
git add -A
git commit -m "fix: polish derived fields based on smoke testing"
```
