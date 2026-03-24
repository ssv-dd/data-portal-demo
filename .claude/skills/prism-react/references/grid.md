## Import
```tsx
import {
  GridContainer,
  GridContent,
  GridRowBreak,
  GridContainerSpacing,
  GridContentSpacing,
  GridContainerAlignment,
  GridContentWidth,
} from '@doordash/prism-react'
```
## Usage

`GridContainer`, `GridContent`, and `GridRowBreak` are flexible, responsive grid wrappers for organizing page layouts using CSS Grid.

`GridContainer` establishes the grid context and controls the number of columns, gutters, and margins. `GridContent` wraps each item and declares how many columns it spans. By default, `GridContainer` uses 12 columns and fills the width of its parent element.

`GridContent` defaults to a single-column span. The `columnWidthDefault` prop accepts a semantic value from the `GridContentWidth` enum (e.g. `GridContentWidth.half`) or a numeric column count. Semantic widths automatically adapt to the active column count — `GridContentWidth.half` of an 8-column grid spans 4 columns, not 6.

## Exported Components

- `GridContainer` — establishes the grid context
- `GridContent` — wraps content and declares its column span
- `GridRowBreak` — forces subsequent items onto a new row

## Exported Constants

- `GridContainerSpacing` — spacing tokens for external margin and column gutter
- `GridContainerAlignment` — alignment values for fixed-width grids (`start`, `center`, `end`)
- `GridContentWidth` — semantic column span values (`full`, `half`, `third`, `quarter`, `single`, `double`, `triple`, `hidden`)
- `GridContentSpacing` — spacing tokens for internal padding inside grid items

> ℹ️ **Using Grid inside Canvas?** When `GridContainer` is rendered inside a `Canvas` component, it automatically inherits column counts, gutters, fixed-width, and container queries from Canvas's grid configuration — no extra props needed. See the [Canvas documentation](../Canvas/README.md) for details.

## Examples

### Basic Usage
```tsx
import { GridContainer, GridContent, GridContentWidth } from '@doordash/prism-react'

<GridContainer>
  <GridContent columnWidthDefault={GridContentWidth.half}>
    {/* left column */}
  </GridContent>
  <GridContent columnWidthDefault={GridContentWidth.half}>
    {/* right column */}
  </GridContent>
</GridContainer>
```
### Responsive Layout

Breakpoint-specific props override the base value at that breakpoint and all narrower breakpoints:
```tsx
<GridContainer>
  <GridContent
    columnWidthDefault={GridContentWidth.third}
    columnWidthTablet={GridContentWidth.half}
    columnWidthMobile={GridContentWidth.full}
  >
    Card 1
  </GridContent>
  <GridContent
    columnWidthDefault={GridContentWidth.third}
    columnWidthTablet={GridContentWidth.half}
    columnWidthMobile={GridContentWidth.full}
  >
    Card 2
  </GridContent>
  <GridContent
    columnWidthDefault={GridContentWidth.third}
    columnWidthTablet={GridContentWidth.half}
    columnWidthMobile={GridContentWidth.full}
  >
    Card 3
  </GridContent>
</GridContainer>
```
### Custom Numeric Column Spans
```tsx
<GridContainer>
  <GridContent columnWidthDefault={8}>
    Main content (8 of 12 columns)
  </GridContent>
  <GridContent columnWidthDefault={4}>
    Sidebar (4 of 12 columns)
  </GridContent>
</GridContainer>
```
### Hiding Content at a Breakpoint

Use `GridContentWidth.hidden` to remove an item from the layout at a specific breakpoint:
```tsx
<GridContainer>
  <GridContent columnWidthTablet={GridContentWidth.hidden}>
    {/* Sidebar disappears on tablet and smaller */}
    <Sidebar />
  </GridContent>
  <GridContent columnWidthDefault={GridContentWidth.full} columnWidthWideScreen={11}>
    Main content
  </GridContent>
</GridContainer>
```
### Forcing Row Breaks

`GridRowBreak` forces subsequent items to start on a new row regardless of available space:
```tsx
<GridContainer>
  <GridContent columnWidthDefault={GridContentWidth.full}>
    <h1>Page Header</h1>
  </GridContent>

  <GridRowBreak />

  <GridContent columnWidthDefault={6}>Main content</GridContent>
  <GridContent columnWidthDefault={6}>Sidebar</GridContent>

  <GridRowBreak />

  <GridContent columnWidthDefault={GridContentWidth.full}>
    <footer>Footer content</footer>
  </GridContent>
</GridContainer>
```
### Nested Grids

`GridContainer` takes up 100% of its parent's width and can be nested inside any `GridContent`:
```tsx
<GridContainer>
  <GridContent columnWidthDefault={GridContentWidth.third}>
    Left column
  </GridContent>
  <GridContent columnWidthDefault={GridContentWidth.third}>
    <GridContainer externalMargin={GridContainerSpacing.none}>
      <GridContent columnWidthDefault={GridContentWidth.half}>Nested left</GridContent>
      <GridContent columnWidthDefault={GridContentWidth.half}>Nested right</GridContent>
    </GridContainer>
  </GridContent>
  <GridContent columnWidthDefault={GridContentWidth.third}>
    Right column
  </GridContent>
</GridContainer>
```
### Fixed-Width Centered Grid
```tsx
<GridContainer
  isFixed={true}
  customFixedWidth={1200}
  alignGrid={GridContainerAlignment.center}
>
  <GridContent columnWidthDefault={GridContentWidth.third}>Column 1</GridContent>
  <GridContent columnWidthDefault={GridContentWidth.third}>Column 2</GridContent>
  <GridContent columnWidthDefault={GridContentWidth.third}>Column 3</GridContent>
</GridContainer>
```
### Container Queries

By default, the grid uses CSS media queries that respond to the **viewport width**. Enable `useContainerQueries={true}` to switch to CSS container queries, which respond to the **container's width** instead. This is useful for reusable components that appear in multiple layouts with different container sizes.
```tsx
<ResizablePanel>
  <GridContainer useContainerQueries={true}>
    <GridContent
      columnWidthDefault={GridContentWidth.quarter}
      columnWidthTablet={GridContentWidth.half}
      columnWidthMobile={GridContentWidth.full}
    >
      Adapts to the container
    </GridContent>
  </GridContainer>
</ResizablePanel>
```
> ℹ️ Container queries are automatically enabled when `GridContainer` is rendered inside a `Canvas` component.

## Accessibility

The Grid components render as plain `div` elements and do not apply ARIA roles or attributes. Accessibility responsibilities lie with the content placed inside `GridContent` items.

`GridRowBreak` renders with `visibility: hidden` and `height: 0`, making it invisible to both sighted users and screen readers.

## `GridContainer` API

> ℹ️ **Breakpoint variant pattern** — Most `GridContainer` props accept per-breakpoint overrides using the suffix pattern `{propName}{Breakpoint}`, where breakpoint is one of `UltraWideScreen`, `WideScreen`, `Desktop`, `Tablet`, or `Mobile`. A breakpoint override applies at that breakpoint and all narrower breakpoints until a narrower override is set. The per-breakpoint props for each base prop are listed under their base prop below.

### `columns`
| | |
|-----------|------------|
| Type | `number` |
| Default | `12` |
| Description | Base number of columns. Clamped to `[1, 24]`. Common values: 4, 6, 8, 12. Inherited from `Canvas.gridConfig` if inside a Canvas. |

Breakpoint overrides: `columnsUltraWideScreen`, `columnsWideScreen`, `columnsDesktop`, `columnsTablet`, `columnsMobile` — each accepts `number` and overrides `columns` at that breakpoint.

### `externalMargin`
| | |
|-----------|------------|
| Type | `**GridContainerSpacing**` |
| Default | `GridContainerSpacing.xxxLarge` |
| Description | Horizontal padding (left and right) applied to the grid at all breakpoints. Inherited from `Canvas.gridConfig.*.safeArea` if inside a Canvas. |

Breakpoint overrides: `externalMarginUltraWideScreen`, `externalMarginWideScreen`, `externalMarginDesktop`, `externalMarginTablet`, `externalMarginMobile` — each accepts `GridContainerSpacingValueType`.

> ℹ️ `externalMarginMobile` defaults to `GridContainerSpacing.xLarge` if `externalMargin` is not explicitly set.

### `columnGutter`
| | |
|-----------|------------|
| Type | `**GridContainerSpacing**` |
| Default | `GridContainerSpacing.large` |
| Description | Space between columns and rows. Inherited from `Canvas.gridConfig.*.gutter` if inside a Canvas. |

Breakpoint overrides: `columnGutterUltraWideScreen`, `columnGutterWideScreen`, `columnGutterDesktop`, `columnGutterTablet`, `columnGutterMobile` — each accepts `GridContainerSpacingValueType`.

### `isFixed`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | When `true`, the grid's maximum width is capped at 1352px (or `customFixedWidth`). When `false`, the grid expands to fill its container. Inherited from `Canvas.isFixedWidth` if inside a Canvas. |

### `customFixedWidth`
| | |
|-----------|------------|
| Type | `number` |
| Default | `undefined` |
| Description | Pixel value to use as the maximum width when `isFixed` is `true`, instead of the default 1352px. |

### `alignGrid`
| | |
|-----------|------------|
| Type | `**GridContainerAlignment**` |
| Default | `GridContainerAlignment.center` |
| Description | Controls how a fixed-width grid is aligned within its parent. Values: `start`, `center`, `end`. |

### `useContainerQueries`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` (automatically `true` inside `Canvas`) |
| Description | When `true`, responsive breakpoints use CSS container queries (responding to the container's width) instead of media queries (responding to the viewport width). |

### `children`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | Grid items. `GridContent` and `GridRowBreak` are valid children. `GridContent` elements must be **direct children** — wrapping them in an intermediate element will break column sizing. |

## `GridContent` API

> ⚠️ `GridContent` elements must be **direct children** of `GridContainer`. Wrapping them in intermediate elements will break column sizing.

> ℹ️ **Breakpoint variant pattern** — Column width and padding props accept per-breakpoint overrides listed under their base prop below.

### `columnWidthDefault`
| | |
|-----------|------------|
| Type | `GridContentWidth \| number` |
| Default | `GridContentWidth.single` |
| Description | Column span at all breakpoints where no more specific override is set. Semantic widths adapt to the active column count. Numeric values are clamped to `[1, totalColumns]`. |

#### `GridContentWidth` values

| Value | Description |
|-------|-------------|
| `GridContentWidth.full` | Spans all columns. |
| `GridContentWidth.half` | Spans `Math.floor(columns / 2)`. |
| `GridContentWidth.third` | Spans `Math.floor(columns / 3)`. |
| `GridContentWidth.quarter` | Spans `Math.floor(columns / 4)`. |
| `GridContentWidth.single` | Spans 1 column. This is the default. |
| `GridContentWidth.double` | Spans 2 columns. |
| `GridContentWidth.triple` | Spans 3 columns. |
| `GridContentWidth.hidden` | Applies `display: none`. |

#### Semantic width reference

| Semantic Width | 12 columns | 8 columns | 6 columns | 4 columns |
|----------------|------------|-----------|-----------|-----------|
| `full` | 12 | 8 | 6 | 4 |
| `half` | 6 | 4 | 3 | 2 |
| `third` | 4 | 2 | 2 | 1 |
| `quarter` | 3 | 2 | 1 | 1 |

Breakpoint overrides: `columnWidthUltraWideScreen`, `columnWidthWideScreen`, `columnWidthDesktop`, `columnWidthTablet`, `columnWidthMobile` — each accepts `GridContentWidth | number` and overrides `columnWidthDefault` at that breakpoint.

### `internalPadding`
| | |
|-----------|------------|
| Type | `**GridContentSpacing**` |
| Default | `GridContentSpacing.none` |
| Description | Uniform padding (top, right, bottom, left) inside the grid item. |

Breakpoint overrides: `internalPaddingUltraWideScreen`, `internalPaddingWideScreen`, `internalPaddingDesktop`, `internalPaddingTablet`, `internalPaddingMobile`.

### `horizontalPadding`
| | |
|-----------|------------|
| Type | `**GridContentSpacing**` |
| Default | `undefined` |
| Description | Horizontal (left and right) padding. Overrides the horizontal component of `internalPadding` when set. |

Breakpoint overrides: `horizontalPaddingUltraWideScreen`, `horizontalPaddingWideScreen`, `horizontalPaddingDesktop`, `horizontalPaddingTablet`, `horizontalPaddingMobile`.

### `verticalPadding`
| | |
|-----------|------------|
| Type | `**GridContentSpacing**` |
| Default | `undefined` |
| Description | Vertical (top and bottom) padding. Overrides the vertical component of `internalPadding` when set. |

Breakpoint overrides: `verticalPaddingUltraWideScreen`, `verticalPaddingWideScreen`, `verticalPaddingDesktop`, `verticalPaddingTablet`, `verticalPaddingMobile`.

### `children`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | Content to render inside the grid item. |

## `GridRowBreak`

`GridRowBreak` accepts no props. It renders a zero-height, visually hidden `div` that spans the full grid width (`grid-column: 1 / -1`), forcing all subsequent children onto a new row.