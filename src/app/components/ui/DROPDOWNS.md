# Data Portal — dropdown components

All three listen for **outside dismiss** via `useOnClickOutside` from `src/hooks/useOnClickOutside.ts` with `{ enabled: isOpen }` so listeners attach only while the panel is open. Outside detection uses **`mousedown` and `touchstart`** on `document`.

## When to use which

| Component | Path | Use it for |
|-----------|------|------------|
| **FilterDropdown** | `components/ui/FilterDropdown` | **Single-select filter** with a **filled / brand-styled** pill trigger (e.g. toolbar filters). Options are a flat list with optional Lucide icons; supports **Framer Motion** enter/exit on the panel. Value is a controlled string `id`. |
| **CustomDropdown** | `components/ui/CustomDropdown` | **Single-select field** that behaves like a **compact form control**: full-width trigger, neutral border, **listbox** semantics (`aria-expanded` / `role="listbox"` / `role="option"`), optional **badges** per option, disabled rows, and **CSS** open/close (no motion library). |
| **MenuDropdown** | `components/ui/MenuDropdown` | **Command menu**: each row runs a **callback** (`onClick`) instead of committing a single scalar value. Neutral trigger, **elevated** panel (`background.elevated`), **right-aligned** menu (`right: 0` on the panel so its right edge lines up with the trigger). The root **wrapper shrink-wraps** (`inline-flex` column, `width: max-content`, `align-self: flex-start`) so the trigger stays **content-sized** inside column flex parents and `right: 0` on the panel still aligns to the button. Use for **actions** (export, rename, …), not for picking one of many enum values. |

## Choosing between FilterDropdown and CustomDropdown

Both are **single-choice from a list**. Prefer **CustomDropdown** when the control should read as a **form select** (settings, inline editors, optional `labelBadge`). Prefer **FilterDropdown** when the control should read as a **branded filter chip** in a filter bar and you want **motion** on the panel.

## Related

- For feature-built controls that only need outside-dismiss logic, call **`useOnClickOutside`** directly with `{ enabled: open }` instead of duplicating `mousedown` listeners.
