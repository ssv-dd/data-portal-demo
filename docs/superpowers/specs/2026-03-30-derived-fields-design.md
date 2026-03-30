# Derived Fields in Chart Builder

**Date:** 2026-03-30
**Status:** Design approved

## Problem

Users building charts in the chart builder can only select fields that exist on the source table. They cannot create calculated measures (e.g., `tips / delivery_fee * 100`) or conditional dimensions (e.g., `CASE WHEN store_type = 'Restaurant' THEN 'Dine-in' ELSE 'Other' END`) without modifying the underlying data source. This limits ad-hoc analysis.

## Solution

Add the ability to create **derived fields** directly in the chart builder's left panel (FieldInspector). Derived fields are user-defined expressions that produce either a new measure or a new dimension. They appear alongside source fields and can be selected for charting like any other field.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Formula input | Free-text SQL expression | Target audience is data-savvy; SQL is familiar |
| Entry point | Single "+ Add Derived Field" button below search bar | Keeps panel clean; one entry point |
| Creation flow | Inline form in left panel (no modal) | Fast, no context switch |
| Field placement | Mixed into Measures/Dimensions with orange "derived" badge | Feels native; field treated like any other of its role |
| Actions on derived fields | Edit (pencil icon) + Delete (trash icon) on hover | Standard CRUD; edit reopens inline form pre-filled |

## Type Changes

### `ChartBuilderField` (src/types/artifacts.ts)

Add two optional properties:

```typescript
export interface ChartBuilderField {
  id: string;
  name: string;
  role: 'measure' | 'dimension' | 'date';
  dataType: 'number' | 'string' | 'date';
  description?: string;
  aggregation?: 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX';
  isDerived?: boolean;      // NEW — true for user-created fields
  expression?: string;      // NEW — SQL expression (e.g., "tips / delivery_fee * 100")
}
```

No new interfaces needed. `isDerived` and `expression` are optional so all existing code continues to work without changes.

## Components

### New: `DerivedFieldForm`

**File:** `src/app/components/chart-builder/derived-field-form.tsx`

Inline form that renders inside the FieldInspector when the user clicks "+ Add Derived Field" or edits an existing derived field.

**Fields:**
1. **Name** — text input, required. Placeholder: "e.g., tip_percentage"
2. **Role toggle** — two pill buttons: "Measure" (green) / "Dimension" (blue). Default: Measure.
3. **Expression** — monospace textarea, required. Placeholder: "e.g., tips / delivery_fee * 100"
4. **Actions** — "Cancel" (text button) and "Add" / "Save" (orange filled button)

**Props:**
```typescript
interface DerivedFieldFormProps {
  /** If provided, form is in edit mode pre-filled with this field */
  editingField?: ChartBuilderField;
  onSubmit: (field: ChartBuilderField) => void;
  onCancel: () => void;
}
```

**Behavior:**
- On submit, generates a `ChartBuilderField` with `isDerived: true`, `expression` set to the textarea value, `id` set to `crypto.randomUUID()` (new) or preserved (edit), `role` from the toggle, `dataType` inferred from role (`number` for measure, `string` for dimension), `aggregation` defaulting to `'SUM'` for measures.
- **Name validation:** name is required, must be unique across all fields (source + derived) in the current source. Show inline error "Field name already exists" if duplicate.
- Expression is required; show inline error if empty on submit attempt.
- **Keyboard:** Enter in expression textarea submits (Shift+Enter for newline). Escape cancels.
- Cancel clears the form and hides it.

**Styling:**
- DoorDash brand orange (`#FF3A00` / `var(--app-dd-primary)`) border on the form container to distinguish from field list
- Monospace font for the expression textarea
- Role toggle pills use MEASURE_COLOR (#4ade80) and DIMENSION_COLOR (#60a5fa)
- Uses existing styled-components patterns from FieldInspector (colors, radius, Theme imports)

### Modified: `FieldInspector`

**File:** `src/app/components/chart-builder/field-inspector.tsx`

Changes:

1. **"+ Add Derived Field" button** — rendered between the SearchWrapper and the first Section. Dashed orange border, orange text. Clicking it shows the `DerivedFieldForm` inline (replaces the button while open).

2. **Derived fields in sections** — the `fields` prop's `measures` and `dimensions` arrays will include derived fields (merged by the parent). Derived fields render with:
   - An orange "derived" badge (small pill) next to the field name
   - On hover: edit (Pencil icon) and delete (Trash2 icon) action buttons on the right side of the FieldRow
   - Edit click opens the `DerivedFieldForm` pre-filled with the field's data (form appears at the top of the panel, replacing the "+ Add" button area — consistent position regardless of which field is being edited)
   - Delete click removes the field (with no confirmation — it's easily re-created)

3. **New props:**
```typescript
interface FieldInspectorProps {
  // ... existing props unchanged ...
  onAddDerivedField: (field: ChartBuilderField) => void;
  onEditDerivedField: (field: ChartBuilderField) => void;
  onDeleteDerivedField: (fieldId: string) => void;
}
```

4. **Search** — derived fields are searchable by name and expression. Update the filter to also check `f.expression`:
```typescript
const filteredMeasures = fields.measures.filter(
  (f) => !q || f.name.toLowerCase().includes(q)
    || (f.description ?? '').toLowerCase().includes(q)
    || (f.expression ?? '').toLowerCase().includes(q)
);
// Same pattern for filteredDimensions
```

### Modified: `ChartBuilderPage`

**File:** `src/app/pages/chart-builder-page.tsx`

New state and handlers:

```typescript
const [derivedFields, setDerivedFields] = useState<ChartBuilderField[]>([]);

const handleAddDerivedField = (field: ChartBuilderField) => {
  setDerivedFields((prev) => [...prev, field]);
};

const handleEditDerivedField = (updated: ChartBuilderField) => {
  setDerivedFields((prev) =>
    prev.map((f) => (f.id === updated.id ? updated : f))
  );
  // On role change: deselect from old bucket (user can re-select in new section)
  setSelectedMeasures((prev) => prev.filter((m) => m.id !== updated.id));
  setSelectedDimensions((prev) => prev.filter((d) => d.id !== updated.id));
};

const handleDeleteDerivedField = (fieldId: string) => {
  setDerivedFields((prev) => prev.filter((f) => f.id !== fieldId));
  // Also remove from selectedMeasures/selectedDimensions if currently selected
  setSelectedMeasures((prev) => prev.filter((m) => m.id !== fieldId));
  setSelectedDimensions((prev) => prev.filter((d) => d.id !== fieldId));
};
```

**Merging derived fields into source fields:**

Before passing `fields` to `FieldInspector`, merge derived fields into the appropriate arrays:

```typescript
const mergedFields: SourceFields = {
  measures: [
    ...currentSourceFields.measures,
    ...derivedFields.filter((f) => f.role === 'measure'),
  ],
  dimensions: [
    ...currentSourceFields.dimensions,
    ...derivedFields.filter((f) => f.role === 'dimension'),
  ],
  dateFields: currentSourceFields.dateFields,
};
```

Derived fields are appended after source fields in each section.

**Clearing on source/tab change:**

Derived fields are scoped to the current source. Clear `derivedFields` whenever the source changes:

```typescript
// In handleSourceSelect and handleTabChange:
setDerivedFields([]);
```

This matches the existing pattern where `selectedMeasures`, `selectedDimensions`, and `selectedDateField` are already cleared on source change.

**Edit Chart flow:**

When restoring a pinned widget via "Edit Chart", derive the `derivedFields` state from the saved query:

```typescript
const restoredDerived = [
  ...(widget.query?.measures ?? []),
  ...(widget.query?.dimensions ?? []),
].filter((f) => f.isDerived);
setDerivedFields(restoredDerived);
```

No changes to `WidgetConfig` are needed — derived fields are already stored as `ChartBuilderField` objects in `query.measures` and `query.dimensions` (they have `isDerived: true` and `expression` set).

## Mock Data Behavior

No changes to `generateMockChartData`. Derived fields are `ChartBuilderField` objects like any other — the mock data generator uses field names to seed random data. A derived measure named `tip_percentage` will get mock numeric data just like `delivery_fee`. No expression evaluation is needed (this is a UI prototype with mock data).

## What This Does NOT Include

- **Expression validation/parsing** — no syntax checking. The expression is stored as a plain string.
- **Autocomplete in the expression textarea** — future enhancement. For now, users type field names manually.
- **Persistence** — derived fields live in React state only. They're lost on page navigation (same as all other chart builder state currently).
- **Date-role derived fields** — derived fields can only be measures or dimensions, not date fields.

## Files Changed

| File | Change |
|------|--------|
| `src/types/artifacts.ts` | Add `isDerived?` and `expression?` to `ChartBuilderField` |
| `src/app/components/chart-builder/derived-field-form.tsx` | **New file** — inline form component |
| `src/app/components/chart-builder/field-inspector.tsx` | Add button, derived badge, hover actions, new props |
| `src/app/pages/chart-builder-page.tsx` | Add `derivedFields` state, handlers, merge logic |
