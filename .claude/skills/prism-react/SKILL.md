---
name: prism-react
description: Provides API documentation, TypeScript prop types, and usage examples for @doordash/prism-react components. Use this skill whenever writing any DoorDash frontend UI code, looking up Prism component props or types, implementing designs with the design system, or asking about any @doordash/prism-react component — even for quick questions like "what props does X take?" or "how do I use Y?"
---

# Prism Web Components

API documentation, TypeScript prop types, and usage examples for `@doordash/prism-react` components.

```tsx
import { ComponentName } from '@doordash/prism-react'
```

## When to Use

- Implementing UI with Prism design system components
- Looking up component props, types, or default values
- Writing code that uses `@doordash/prism-react`
- Understanding component API contracts and usage patterns

## Component Catalog

### Buttons & Actions

- **Button** — Interactive button element for triggering actions, with multiple types, sizes, and loading states. See [references/button.md](references/button.md)
- **IconButton** — Icon-only button for triggering actions where a text label is not needed. See [references/iconbutton.md](references/iconbutton.md)
- **ButtonGroup** — Layout component for arranging primary, secondary, and tertiary action buttons in common grouping patterns. See [references/buttongroup.md](references/buttongroup.md)
- **ButtonTabs** — Compound tab component that provides tab controls to toggle visibility of associated content panels. See [references/buttontabs.md](references/buttontabs.md)
- **QuantityStepper** — Interactive stepper component for incrementing and decrementing numeric values with customizable controls. See [references/quantitystepper.md](references/quantitystepper.md)
- **Toggle** — Controlled selection component supporting toggle switch, checkbox, radio, and circle input types. See [references/toggle.md](references/toggle.md)

### Forms & Inputs

- **TextField** — Standard text input field for entering plain text with label, hint, and error support. See [references/textfield.md](references/textfield.md)
- **EmailField** — Form input field for entering email addresses. See [references/emailfield.md](references/emailfield.md)
- **PasswordField** — Form input field for password entry with a show/hide toggle for the field content. See [references/passwordfield.md](references/passwordfield.md)
- **PhoneField** — Phone number input with automatic formatting and optional international country code selector. See [references/phonefield.md](references/phonefield.md)
- **IntlPhoneField** — International phone number input with country code selector supporting all global phone number formats. See [references/intlphonefield.md](references/intlphonefield.md)
- **NumberField** — Form input field that restricts entry to positive integer values. See [references/numberfield.md](references/numberfield.md)
- **DateField** — Form input field for entering dates with automatic formatting, intended for past date entry without a calendar picker. See [references/datefield.md](references/datefield.md)
- **TimeField** — Time input field with separate hour, minute, and period selectors. See [references/timefield.md](references/timefield.md)
- **SearchField** — Text input field with search icon for filtering and searching content. See [references/searchfield.md](references/searchfield.md)
- **IdentificationField** — Form input for entering identification numbers like SSN or SIN with automatic formatting and masking. See [references/identificationfield.md](references/identificationfield.md)
- **Select** — Dropdown select field for choosing one or more options from a list, built on react-select. See [references/select.md](references/select.md)
- **SingleSelectGroup** — Group of selectable toggle buttons for picking a single option, similar to a radio group. See [references/singleselectgroup.md](references/singleselectgroup.md)
- **Autocomplete** — Combo field and dropdown list that displays filtered results based on user text input. See [references/autocomplete.md](references/autocomplete.md)
- **DatePicker** — Controlled calendar component for displaying and selecting dates, with support for ranges, multiple months, and localization. See [references/datepicker.md](references/datepicker.md)
- **Slider** — Range slider input that allows users to select a value from a visual range. See [references/slider.md](references/slider.md)
- **ErrorMessage** — Standalone validation error message component used by form fields or custom components. See [references/errormessage.md](references/errormessage.md)
- **FormElements** — Form components provide semantic structure for forms and form controls. See [references/formelements.md](references/formelements.md)

### Overlays & Dialogs

- **BottomSheet** — For displaying modal content from the bottom of the screen with drag interactions and detent support. See [references/bottomsheet.md](references/bottomsheet.md)
- **Modal** — Dialog overlay that displays content in a focused layer with header, body, footer, and navigation support. See [references/modal.md](references/modal.md)
- **Sidesheet** — For displaying modal content from the side of the screen with navigation and action support. See [references/sidesheet.md](references/sidesheet.md)
- **Popover** — Anchored floating container that displays interactive content like menus in response to a trigger element. See [references/popover.md](references/popover.md)
- **Tooltip** — Non-interactive informational popup that appears on hover or focus to provide supplemental context. See [references/tooltip.md](references/tooltip.md)
- **Toast** — Temporary notification that appears after an action and auto-dismisses, managed via ToastProvider and useToast hook. See [references/toast.md](references/toast.md)
- **Overlay** — Semi-transparent layer rendered above content for indicating modals, loading states, or background dimming. See [references/overlay.md](references/overlay.md)

### Navigation

- **Breadcrumbs** — For displaying hierarchical navigation with support for collapsed states and parent-only views. See [references/breadcrumbs.md](references/breadcrumbs.md)
- **Menu** — Layered dropdown menu triggered by a button that displays a list of selectable options. See [references/menu.md](references/menu.md)
- **NavBar** — Navigation bar for managing page-level context and actions, usable in full pages, modals, and popovers. See [references/navbar.md](references/navbar.md)
- **Pagination** — Visual pagination indicators for multi-step flows, carousels, and content navigation. See [references/pagination.md](references/pagination.md)
- **NumberedPagination** — Page navigation control that displays numbered page buttons with previous/next arrows and truncation. See [references/numberedpagination.md](references/numberedpagination.md)
- **SideNav** — Vertical sidebar navigation component for displaying a list of navigation choices. See [references/sidenav.md](references/sidenav.md)

### Feedback

- **Banner** — Contextual banner for displaying alerts, warnings, and informational messages with optional actions and dismiss. See [references/banner.md](references/banner.md)
- **Loading** — Indeterminate loading spinner with configurable size, color, and success/error animation states. See [references/loading.md](references/loading.md)
- **ProgressBar** — Horizontal bar that visually indicates completion progress as a percentage. See [references/progressbar.md](references/progressbar.md)
- **Timeline** — Visual timeline component for displaying sequential steps, progress tracking, and process flows. See [references/timeline.md](references/timeline.md)

### Data Display

- **Avatar** — For displaying user profile pictures, initials, or icons with optional badges and grouping functionality. See [references/avatar.md](references/avatar.md)
- **Tag** — Compact label for conveying status or categorization with configurable type, style, and optional icons. See [references/tag.md](references/tag.md)
- **Text** — Typography component for rendering styled text with design-system font sizes, weights, and colors. See [references/text.md](references/text.md)
- **Logo** — Brand logo component for displaying DoorDash and Caviar logos with customizable styling. See [references/logo.md](references/logo.md)
- **Icon** — SVG icon component with built-in icon library, configurable size and color, and automatic RTL support. See [references/icon.md](references/icon.md)
- **Svg** — Lightweight wrapper around the native SVG element for rendering scalable vector graphics. See [references/svg.md](references/svg.md)
- **EmptyState** — For displaying placeholder content when no data is available, with optional media and actions. See [references/emptystate.md](references/emptystate.md)
- **ResponsivePicture** — Image component that renders optimized responsive images using srcset with automatic CDN resizing per breakpoint. See [references/responsivepicture.md](references/responsivepicture.md)
- **Table** — Data table with sortable columns, pagination, editable cells, and row click handling. See [references/table.md](references/table.md)

### Layout

- **Canvas** — Full-viewport layout shell for dashboard and admin-style apps, with optional SideNav, leading/trailing rails, integrated grid context, and per-route CanvasHeader. See [references/canvas.md](references/canvas.md)
- **Grid** — Flexible 12-column responsive grid system using GridContainer and GridContent for organizing page layouts. See [references/grid.md](references/grid.md)
- **Separator** — Visual separator component for dividing content sections with customizable styling and spacing. See [references/separator.md](references/separator.md)
- **ListCell** — Versatile list item component with variants for checkbox, radio, navigation, switch, and icon button interactions. See [references/listcell.md](references/listcell.md)
- **CheckboxListCell** — ListCell variant for checkbox-based selection using CheckboxListCell and CheckboxList. See [references/checkboxlistcell.md](references/checkboxlistcell.md)
- **RadioListCell** — ListCell variant for radio-based selection using RadioListCell and RadioList. See [references/radiolistcell.md](references/radiolistcell.md)
- **SelectionListCell** — ListCell variant for checkmark-style selection using SelectionListCell and SelectionList. See [references/selectionlistcell.md](references/selectionlistcell.md)
- **SwitchListCell** — ListCell variant for toggle switch interfaces using SwitchListCell. See [references/switchlistcell.md](references/switchlistcell.md)
- **IconButtonListCell** — ListCell variant with an icon button action using IconButtonListCell. See [references/iconbuttonlistcell.md](references/iconbuttonlistcell.md)
- **NavigationListCell** — ListCell variant for navigation links using NavigationListCell with polymorphic router support. See [references/navigationlistcell.md](references/navigationlistcell.md)
- **QuantityStepperListCell** — ListCell variant with a quantity stepper control using QuantityStepperListCell. See [references/quantitystepperlistcell.md](references/quantitystepperlistcell.md)
- **Inline** — Layout primitive that adds horizontal spacing between sibling elements in a row. See [references/inline.md](references/inline.md)
- **InlineChildren** — Layout primitive that distributes equal horizontal spacing between all direct children. See [references/inlinechildren.md](references/inlinechildren.md)
- **Inset** — Layout primitive that applies consistent internal padding around its content. See [references/inset.md](references/inset.md)
- **Stack** — Layout primitive that adds vertical spacing between sibling elements in a column. See [references/stack.md](references/stack.md)
- **StackChildren** — Layout primitive that distributes equal vertical spacing between all direct children. See [references/stackchildren.md](references/stackchildren.md)

### Foundations

- **FocusLock** — Utility component that traps keyboard focus within its children, with support for layered focus management. See [references/focuslock.md](references/focuslock.md)
- **LayerManager** — Context provider that manages z-index layering for portaled components like Modal, Popover, Tooltip, and Toast. See [references/layermanager.md](references/layermanager.md)
- **AnchoredLayer** — Positioning primitive that renders floating content anchored relative to a trigger element within LayerManager. See [references/anchoredlayer.md](references/anchoredlayer.md)
- **Sheet** — Configurable primitive for layering content over the viewport with edge attachment, backdrop, and animation options. See [references/sheet.md](references/sheet.md)
- **Portal** — Renders children into a specified LayerManager layer using React portals. See [references/portal.md](references/portal.md)
- **config** — Global configuration provider for setting product-wide defaults, color mode, reduced motion, and component overrides. See [references/config.md](references/config.md)

## Common Patterns

### LayerManager Requirement

Modal, BottomSheet, Toast, and Popover require a `<LayerManager>` at the top of your app:

```tsx
import { LayerManager } from '@doordash/prism-react'

const App = () => (
  <LayerManager>
    <YourApp />
  </LayerManager>
)
```

### React Portals Event Bubbling

Components that use React portals (Modal, BottomSheet, Popover) will still bubble events through the React tree, not the DOM tree. This means `onClick` handlers on parent React components will catch clicks from portal content.

## onChange Callback Signatures

All field components use TypeScript generics where the component infers the value type. The standard format is `(value: V, e: React.ChangeEvent<T>) => void`.

| Component(s) | onChange signature | V resolves to | T resolves to |
|-------------|-------------------|---------------|---------------|
| TextField, SearchField, EmailField, PasswordField | `(value: V, e: React.ChangeEvent<T>) => void` | `string` | `HTMLInputElement` |
| NumberField | `(value: V, e: React.ChangeEvent<T>, valueAsNumber: number) => void` | `string` | `HTMLInputElement` |
| PhoneField | `(value: V, formattedValue: string \| PhoneFieldFormattedValueType, e: React.ChangeEvent<T>) => void` | `string` | `HTMLInputElement` |
| IdentificationField | `(value: V, formattedValue: string, e: React.ChangeEvent<T>) => void` | `string` | `HTMLInputElement` |
| DateField | `(formattedValue: V, value: string, e: React.ChangeEvent<T>, date?: Date) => void` | `string` | `HTMLInputElement` |
| Select, Autocomplete | `(value: V, e: React.ChangeEvent<T>) => void` | `string \| string[]` | `HTMLSelectElement` |

## Layout Primitives

Use these components for spacing and layout instead of custom CSS:

| Need | Component |
|------|-----------|
| Padding around content | `Inset` |
| Space after a single element (vertical) | `Stack` |
| Space after a single element (horizontal) | `Inline` |
| Equal spacing between all children (vertical) | `StackChildren` |
| Equal spacing between all children (horizontal) | `InlineChildren` |
| Responsive column grid | `GridContainer` + `GridContent` |

## Choosing Between Similar Components

### Date input
- **`DatePicker`** — calendar UI, best for selecting future dates, date ranges, or with complex date constraints
- **`DateField`** — text input with auto-formatting, best for past dates where users know the value (birthdate, DOB)

### Overlay / dialog
- **`Modal`** — centered dialog, general purpose
- **`BottomSheet`** — slides up from the bottom edge, common in mobile-first flows
- **`SideSheet`** — slides in from the side, best for detail panels or edit flows
- **`Popover`** — small anchored overlay triggered by a specific element; closes on outside click
- **`Tooltip`** — non-interactive, hover/focus-only contextual hint; no actions

## Instructions

- When a component is requested, read the corresponding reference file for full API details and examples
- Use grep to search across reference files when looking for specific props or patterns
- For `Icon` types, grep `references/icon.md` for the concept name to find the right `IconType` value (e.g. `grep -i "cart" references/icon.md`)
- **Bold types** (e.g., `**ButtonSize**`) are importable constants from `@doordash/prism-react`
- All components are imported from `@doordash/prism-react`
