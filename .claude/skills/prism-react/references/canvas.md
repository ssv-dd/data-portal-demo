## Import
```tsx
import {
  Canvas,
  CanvasHeader,
  CanvasPageTitle,
  CanvasHeaderMenuButton,
  CanvasContainerSpacing,
  useCanvasContext,
  useCanvasSideNavCollapsedState,
} from '@doordash/prism-react'
```
## Usage

`Canvas` is a full-viewport layout shell for dashboard and admin-style applications. It provides a structured, responsive page frame that composes a main content area with optional SideNav, leading rail, and trailing rail regions. Canvas also owns the grid configuration context consumed by nested `GridContainer` components, so breakpoints and column counts flow down automatically without manual prop threading.
```
[ leadingRail ] [ sideNav ] [ trailingRail ] [ content area ]
```
### Component Relationships

Canvas composes with two other Prism components:

- **SideNav** — Pass a `SideNav` to the `sideNav` slot. Canvas manages its sizing, scrolling, and theming automatically. Use `useCanvasSideNavCollapsedState` inside the SideNav tree to wire the collapsed/expanded icon-only state.
- **GridContainer / GridContent** — Render these as Canvas children. Canvas provides grid configuration (columns, gutters, breakpoints) via context — `GridContainer` inherits these automatically without manual prop threading. Container queries are also enabled by default inside Canvas.

> ⚠️ **`isSideNavSlotOpen` vs `isSideNavCollapsed`** — These control different things. `isSideNavSlotOpen` (Canvas prop) controls whether the SideNav **slot** is **visible**. `isSideNavCollapsed` (SideNav prop) controls whether the nav is **collapsed to icon-only mode**. Use `useCanvasSideNavCollapsedState` to manage the latter inside a Canvas tree.

### Basic Usage
```tsx
import { Canvas, CanvasHeader } from '@doordash/prism-react'
import { GridContainer, GridContent, GridContentWidth } from '@doordash/prism-react'

function MyPage() {
  return (
    <Canvas>
      <CanvasHeader title="Dashboard" />
      <GridContainer>
        <GridContent columnWidthDefault={GridContentWidth.full}>
          <p>Page content</p>
        </GridContent>
      </GridContainer>
    </Canvas>
  )
}
```
### With SideNav

Canvas manages the width, height, scroll, and theming of whatever is passed to the `sideNav` slot. When the Prism `SideNav` component is used, the `canvas-rail` theming scope automatically applies `comp.color.canvas.*` tokens to the navigation surface. Manage `SideNav` collapsed state (different than the Canvas sideNav **slot** visibility state!) with the `useCanvasSideNavCollapsedState` hook instead of `React.useState`. This allows the Canvas to influence the collapsed state when needed. For example, if the viewport changes from large to small, where the sideNav slot is hidden, the SideNav collapsed state should be false. Using the `useCanvasSideNavCollapsedState` will provide this automatically.
```tsx
import {
  Canvas,
  CanvasHeader,
  SideNav,
  SideNavGroup,
  SideNavItem,
  SideNavCell,
  useCanvasSideNavCollapsedState,
} from '@doordash/prism-react'
import { IconType } from '@doordash/prism-react'

const AppNav = () => {
  const [isCollapsed, setIsCollapsed] = useCanvasSideNavCollapsedState(false)

  return (
    <SideNav label="Main navigation" isSideNavCollapsed={isCollapsed}>
      <SideNavGroup label="Navigation">
        <SideNavItem id="home">
          <SideNavCell label="Home" icon={IconType.HomeLine} />
        </SideNavItem>
        <SideNavItem id="orders">
          <SideNavCell label="Orders" icon={IconType.OrderBagLine} />
        </SideNavItem>
      </SideNavGroup>
    </SideNav>
  )
}

function MyApp() {
  return (
    <Canvas sideNav={<AppNav />}>
      <CanvasHeader title="Home" />
      <GridContainer>
        {/* page content */}
      </GridContainer>
    </Canvas>
  )
}
```
### Managing the SideNav Slot

Canvas owns the slot's open/closed state by default. The right tool depends on how much control you need:

| Scenario | Approach |
|----------|----------|
| Default mobile toggle via page title | Nothing — `CanvasHeader title` wires `CanvasHeaderMenuButton` automatically |
| Custom toggle button or close on route change | `useCanvasContext` action methods — Canvas keeps owning the state |
| Override responsive defaults entirely | `isSideNavSlotOpen` + `onSideNavSlotOpenChange` — you own the state |

#### Context action methods

`useCanvasContext` exposes three imperative methods. Canvas still owns the state and responsive defaults (desktop always visible, mobile hidden until opened) — you're just driving it from elsewhere in the tree.

| Method | Description |
|--------|-------------|
| `toggleSideNavSlot()` | Flips the slot open/closed. Use this for hamburger-style buttons. |
| `openSideNavSlot()` | Always opens the slot. |
| `closeSideNavSlot()` | Always closes the slot. |

To trigger the slot from a custom control anywhere in the Canvas tree, call `toggleSideNavSlot` from `useCanvasContext`:
```tsx
import { useCanvasContext } from '@doordash/prism-react'

const MyCustomTrigger = () => {
  const { toggleSideNavSlot } = useCanvasContext()

  return (
    <button onClick={toggleSideNavSlot}>
      Menu
    </button>
  )
}
```
If you're building a custom header layout and want a Prism-styled button that's already wired up, see [`CanvasHeaderMenuButton`](#canvasheadermenubutton-api).

To close the slot on route change without taking controlled ownership of the prop:
```tsx
import { useCanvasContext } from '@doordash/prism-react'
import { useLocation } from 'react-router-dom'

const RouteChangeCloser = () => {
  const { closeSideNavSlot } = useCanvasContext()
  const location = useLocation()

  React.useEffect(() => {
    closeSideNavSlot()
  }, [location.pathname, closeSideNavSlot])

  return null
}
```
#### Controlled SideNav Slot

Use `isSideNavSlotOpen` and `onSideNavSlotOpenChange` when you need to own the state externally. This bypasses Canvas's responsive defaults entirely — the slot shows or hides exactly as you direct at every breakpoint. Reach for this when default behaviour isn't sufficient, for example keeping the slot closed on desktop until an explicit user action.
```tsx
import { Canvas, CanvasHeader } from '@doordash/prism-react'
import { useLocation } from 'react-router-dom'

function MyApp() {
  const location = useLocation()
  const [isNavOpen, setIsNavOpen] = React.useState(false)

  React.useEffect(() => {
    setIsNavOpen(false)
  }, [location.pathname])

  return (
    <Canvas
      sideNav={<AppNav />}
      isSideNavSlotOpen={isNavOpen}
      onSideNavSlotOpenChange={setIsNavOpen}
    >
      <CanvasHeader title="Page" />
    </Canvas>
  )
}
```
### With Leading and Trailing Rails

Rails are optional side columns. Toggling between a node and `undefined` slides the rail in or out with an animated transition by default.
```tsx
import { Canvas, CanvasHeader } from '@doordash/prism-react'

function MyApp() {
  const [showDetails, setShowDetails] = React.useState(false)

  return (
    <Canvas
      trailingRail={
        showDetails ? (
          <div style={{ padding: '16px', width: '280px' }}>
            <p>Detail panel content</p>
          </div>
        ) : undefined
      }
    >
      <CanvasHeader title="Overview" />
      <button onClick={() => setShowDetails((v) => !v)}>
        {showDetails ? 'Hide' : 'Show'} Details
      </button>
    </Canvas>
  )
}
```
Set `animateLeadingRailPresence={false}` or `animateTrailingRailPresence={false}` to disable the slide animations.

### Custom Grid Configuration

Override any breakpoint tier by providing a `gridConfig` prop. Only the fields you specify are overridden — the rest continue to use the [defaults](#default-grid-configuration). Memoize `gridConfig` when computed at render time.
```tsx
import { Canvas, CanvasHeader, CanvasContainerSpacing } from '@doordash/prism-react'
import { useMemo } from 'react'

function MyApp() {
  const gridConfig = useMemo(
    () => ({
      desktop: { columns: 8 },
      mobile: { columns: 2, gutter: CanvasContainerSpacing.none },
    }),
    []
  )

  return (
    <Canvas gridConfig={gridConfig}>
      <CanvasHeader title="Custom Grid" />
    </Canvas>
  )
}
```
### Global Header Defaults

Use `headerDefaults` to inject content into every `CanvasHeader` without threading props through each route. Memoize `headerDefaults` when computed at render time.
```tsx
import { Canvas, CanvasHeader } from '@doordash/prism-react'
import { useMemo } from 'react'

function MyApp() {
  const headerDefaults = useMemo(
    () => ({
      startContent: <Breadcrumbs />,
      endContent: <TabBar />,
    }),
    []
  )

  return (
    <Canvas headerDefaults={headerDefaults}>
      <CanvasHeader title="Page One" />
    </Canvas>
  )
}
```
Individual `CanvasHeader` instances can replace a slot by passing a `ReactNode`, or augment the global value using a render function:
```tsx
{/* Replace global endContent entirely */}
<CanvasHeader title="Settings" endContent={<SettingsTabs />} />

{/* Augment global endContent by appending local content */}
<CanvasHeader
  title="Reports"
  endContent={({ globalEndContent }) => (
    <>
      {globalEndContent}
      <ExportButton />
    </>
  )}
/>
```
### Fully Custom Header Content

When `children` is passed to `CanvasHeader`, all other props are ignored:
```tsx
<CanvasHeader>
  <div className="my-custom-header">
    <MyLogo />
    <MySearchBar />
  </div>
</CanvasHeader>
```
## `useCanvasSideNavCollapsedState`

A Canvas-aware `useState` wrapper for managing `SideNav`'s `isSideNavCollapsed` prop. Returns a `[collapsed, setCollapsed]` tuple identical to `useState`. On mobile viewports, the resolved value is always `false` (expanded) regardless of the stored state. The stored value is remembered and restored when returning to a desktop viewport.

Must be called inside a `Canvas` component tree.
```ts
useCanvasSideNavCollapsedState(initialCollapsed?: boolean): [boolean, React.Dispatch<React.SetStateAction<boolean>>]
```
### `initialCollapsed`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Initial collapsed state for desktop viewports. Ignored on mobile (always expanded). |

## Default Grid Configuration

The following defaults apply when no `gridConfig` prop is provided. Providing a `gridConfig` deep-merges over these values, so you only need to specify what you want to override.

| Tier | Breakpoint | Columns | Fixed Max Width | Gutter | Safe Area |
|------|-----------|---------|----------------|--------|-----------|
| `default` | (base) | 12 | 1280px | medium | xxLarge |
| `ultraWideScreen` | 1399px | 12 | 1280px | medium | xxLarge |
| `wideScreen` | 1279px | 12 | 1120px | medium | xxLarge |
| `desktop` | 1023px | 4 | 960px | medium | xLarge |
| `tablet` | 767px | 4 | 100% | medium | xLarge |
| `mobile` | 480px | 4 | 100% | medium | medium |

## Theming

Canvas applies a dedicated theming scope (`canvas-rail`) to all rail containers and the sideNav container. Within this scope, all `usage.color.*` tokens are overridden with values from the `comp.color.canvas.*` token group, giving the rail and navigation surface a visually distinct background that follows the active theme.

| Category | States |
|----------|--------|
| `background` | default, hovered, pressed, disabled, subdued, strong, inverse, elevated, transparent |
| `text` | default, hovered, pressed, disabled, subdued, inverse |
| `icon` | default, hovered, pressed, disabled, subdued, inverse |
| `border` | default, hovered, pressed, disabled, strong, focused, inverse.focused |

These tokens are defined per theme in `design-language/themes-next/<Theme>/default/comp/color.ts` and `dark/comp/color.ts`. The main content area uses standard `usage.color.*` tokens and is unaffected by the canvas-rail scope.

## Accessibility

- `CanvasHeader` renders the page title as an `<h1>` when a string `title` prop is used, preserving correct document heading hierarchy.
- The built-in `CanvasHeaderMenuButton` (visible only on mobile) receives an `accessibilityLabel` defaulting to `"Menu"`.
- When `SideNav` is provided in the `sideNav` slot, it retains its own `aria-labelledby` association — ensure the `label` prop on `SideNav` is meaningful (e.g. `"Main navigation"`).
- Rail containers are plain `div` elements with no inherent ARIA role; add roles or labels to the content passed into `leadingRail` / `trailingRail` as appropriate.
- To disable presence animations for users who prefer reduced motion, set `animateLeadingRailPresence={false}` and `animateTrailingRailPresence={false}`.

## `Canvas` API

### `children`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | Content rendered inside the main scrollable content area. |

### `sideNav`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | Content for the SideNav slot. Canvas manages width, height, scroll, and theming. |

### `initialSideNavSlotOpen`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Uncontrolled initial open state of the sideNav slot on mobile. On desktop the slot always renders regardless of this value. |

### `isSideNavSlotOpen`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Controlled open state of the sideNav slot. When provided, Canvas does not apply the default responsive behaviour (desktop = always open, mobile = toggle). |

### `onSideNavSlotOpenChange`
| | |
|-----------|------------|
| Type | `(isOpen: boolean) => void` |
| Default | `undefined` |
| Description | Called whenever Canvas internally requests a change to the sideNav slot open state (e.g. when `CanvasHeaderMenuButton` is tapped on mobile). |

### `animateSideNavSlotPresence`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Animate the sideNav slot sliding in and out. Set to `false` to remove the animation. |

### `leadingRail`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | Content for the leading (start-side) rail column. Omit the prop to hide the rail entirely. |

### `trailingRail`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | Content for the trailing (end-side) rail column. Omit the prop to hide the rail entirely. |

### `animateLeadingRailPresence`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Animate the leading rail sliding in/out when it is added or removed. |

### `animateTrailingRailPresence`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Animate the trailing rail sliding in/out when it is added or removed. |

### `isContentFrameVisible`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Toggles the small border and rounded corners that frame the main content area. |

### `isFixedWidth`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | When `true`, the content area respects `fixedContentMaxWidth` from `gridConfig` at each breakpoint. When `false`, the content area stretches to fill all available space. |

### `gridConfig`
| | |
|-----------|------------|
| Type | `Partial<Record<BreakpointKey, GridBreakpointConfig>> & {
  default?: GridBreakpointConfig
}` |
| Default | (see [Default Grid Configuration](#default-grid-configuration)) |
| Description | Per-breakpoint grid configuration. Deep-merged over the built-in defaults. Accepts keys `default`, `ultraWideScreen`, `wideScreen`, `desktop`, `tablet`, `mobile`, each with a `GridBreakpointConfig` value. Memoize if computed. |

#### `GridBreakpointConfig` fields

| Field | Type | Description |
|-------|------|-------------|
| `breakpoint` | `string \| number` | Max-width at which this tier activates. Numbers are treated as `px`. Not used on the `default` tier. |
| `width` | `string \| number` | Width of the grid container at this tier. |
| `fixedContentMaxWidth` | `string \| number` | Max content area width when `isFixedWidth` is `true`. |
| `columns` | `number` | Number of grid columns. |
| `gutter` | `GridContainerSpacingValueType` | Space between columns. Use `CanvasContainerSpacing` values. |
| `safeArea` | `GridContainerSpacingValueType` | Horizontal padding on the outer edges. Use `CanvasContainerSpacing` values. |

### `headerDefaults`
| | |
|-----------|------------|
| Type | `**CanvasHeaderDefaults**` |
| Default | `{}` |
| Description | Global content injected into every `CanvasHeader` within this Canvas. Individual `CanvasHeader` instances can override or augment these values. Memoize if computed. |

#### `CanvasHeaderDefaults` fields

| Field | Type | Description |
|-------|------|-------------|
| `startContent` | `React.ReactNode` | Global content rendered above the title in every `CanvasHeader`. |
| `trailingTitleContent` | `React.ReactNode` | Global content rendered inline after the title in every `CanvasHeader`. |
| `endContent` | `React.ReactNode` | Global content rendered below the title in every `CanvasHeader`. |

## `CanvasHeader` API

> ⚠️ `CanvasHeader` must be rendered as a descendant of `Canvas` — it reads `CanvasContext` to access the merged `gridConfig` and `headerDefaults`.

### `title`
| | |
|-----------|------------|
| Type | `string \| React.ReactNode` |
| Default | `undefined` |
| Description | Page title. A `string` is rendered via `CanvasPageTitle` (an `<h1>` with `CanvasHeaderMenuButton` prepended on mobile). Pass a `ReactNode` for fully custom title content — use `CanvasPageTitle` inside that `ReactNode` if you want to preserve the standard layout alongside other elements. |

### `titleTextProps`
| | |
|-----------|------------|
| Type | `TextProps` |
| Default | `undefined` |
| Description | Additional props forwarded to the `Text` component used for the title string. Ignored when `title` is a `ReactNode`. |

### `startContent`
| | |
|-----------|------------|
| Type | `React.ReactNode \| ((props: { globalStartContent?: React.ReactNode }) => React.ReactNode)` |
| Default | `undefined` |
| Description | Content rendered above the title row (e.g. breadcrumbs, back navigation). A `ReactNode` replaces the global default; a render function receives the global value so you can augment it. |

### `trailingTitleContent`
| | |
|-----------|------------|
| Type | `React.ReactNode \| ((props: { globalTrailingTitleContent?: React.ReactNode }) => React.ReactNode)` |
| Default | `undefined` |
| Description | Content rendered inline after the title on the same row (e.g. status badges). A `ReactNode` replaces the global default; a render function receives the global value so you can augment it. |

### `endContent`
| | |
|-----------|------------|
| Type | `React.ReactNode \| ((props: { globalEndContent?: React.ReactNode }) => React.ReactNode)` |
| Default | `undefined` |
| Description | Content rendered below the title row (e.g. tabs, filter bars). A `ReactNode` replaces the global default; a render function receives the global value so you can augment it. |

### `children`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | Escape hatch for fully custom header content. When provided, all other props are ignored and `children` are rendered directly inside a plain `<div>`. |

## `CanvasPageTitle` API

> ⚠️ Must be rendered inside a `Canvas` tree.

Exported as a convenience for engineers who need to eject from `CanvasHeader`'s default title rendering but still want the same `<h1>` + mobile hamburger atom for consistency. In most cases you won't import this directly — passing a string to `CanvasHeader title` renders it automatically.

`CanvasPageTitleProps` is an alias for `TextProps`, so you can pass any `Text` props to override the default title styles (e.g. `textStyle`, `color`).

Use it when you're passing a `ReactNode` to `CanvasHeader title` and need the standard layout as part of a custom composition:
```tsx
import { CanvasHeader, CanvasPageTitle } from '@doordash/prism-react'
import { TextStyle } from '@doordash/prism-react'

<CanvasHeader
  title={
    <>
      <CanvasPageTitle textStyle={TextStyle.display.small}>Dashboard</CanvasPageTitle>
      <StatusBadge status="live" />
    </>
  }
/>
```
## `CanvasHeaderMenuButton` API

> ⚠️ Must be rendered inside a `Canvas` tree.

Exported as a convenience for engineers who need to eject from `CanvasHeader`'s default title layout but still want the same Prism-styled mobile toggle atom for consistency. In most cases you won't import this directly — `CanvasPageTitle` (and therefore `CanvasHeader title`) renders it automatically.

Use it when you're building a fully custom header layout and want the mobile hamburger to stay consistent with the rest of Canvas:
```tsx
import { CanvasHeaderMenuButton } from '@doordash/prism-react'

const MyCustomHeader = () => (
  <div>
    <CanvasHeaderMenuButton />
    <MyLogo />
  </div>
)
```
Automatically wired to `toggleSideNavSlot` — no `useCanvasContext` needed. Only visible below the mobile breakpoint. Accepts all `IconButtonProps` as optional overrides:

### `iconType`
| | |
|-----------|------------|
| Type | `**IconType**` |
| Default | `IconType.Menu` |
| Description | Icon to display. |

### `accessibilityLabel`
| | |
|-----------|------------|
| Type | `string` |
| Default | `"Menu"` |
| Description | Accessible label for the button. |