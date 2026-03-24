## Import
```tsx
import {
  SideNav,
  SideNavGroup,
  SideNavItem,
  SideNavExpandableItem,
  SideNavCell,
  SideNavChildCell,
  SideNavSize,
} from '@doordash/prism-react'
```
### Core Components

- `SideNav` — A wrapper around groups of navigation items for managing state and configuration.
- `SideNavGroup` — A group of `SideNavItem` components, optionally with a section label.
- `SideNavItem` — A container that must wrap any navigation control. Must be inside a `SideNavGroup`.
- `SideNavExpandableItem` — A container for expandable controls with nested navigation options.
- `SideNavCell` — An interactive control that triggers a navigation change or expandable event.
- `SideNavChildCell` — An interactive control for nesting inside `SideNavExpandableItem`.
- `SideNavSize` — Constant for controlling the size of the navigation.

## Usage

`SideNav` is a vertical navigation component built from a composable set of primitives. The declarative interface makes it easy to customize and extend.

### Basic Usage
```tsx
import {
  SideNav,
  SideNavGroup,
  SideNavItem,
  SideNavExpandableItem,
  SideNavCell,
  SideNavChildCell,
} from '@doordash/prism-react'

<SideNav label="Main navigation">
  <SideNavGroup>
    <SideNavItem id="home">
      <SideNavCell label="Home" />
    </SideNavItem>
    <SideNavItem id="retail">
      <SideNavCell label="Retail" />
    </SideNavItem>
    <SideNavExpandableItem
      id="pets"
      content={
        <>
          <SideNavItem id="convenience">
            <SideNavChildCell label="Convenience" />
          </SideNavItem>
        </>
      }
    >
      <SideNavCell label="Pets" />
    </SideNavExpandableItem>
  </SideNavGroup>
</SideNav>
```
### Controlled vs. Uncontrolled

`SideNav` supports both controlled and uncontrolled usage.

**Choose uncontrolled** when navigation is handled entirely by the router (e.g. `<Link>` components) and you don't need to respond to active item changes in parent component code.

**Choose controlled** when you need to: programmatically sync active state with routes, filter which item ids trigger navigation (e.g. skip expandable parent items), or integrate with external state management.

**Uncontrolled** — set initial state via `initialActiveItem` and `initialExpandedItems`, and handle navigation directly on each cell using the `as` prop:
```tsx
<SideNav label="Main navigation" initialActiveItem="home">
  <SideNavGroup>
    <SideNavItem id="home">
      <SideNavCell as={Link} to="home" label="Home" />
    </SideNavItem>
    <SideNavItem id="retail">
      <SideNavCell as={Link} to="retail" label="Retail" />
    </SideNavItem>
  </SideNavGroup>
</SideNav>
```
**Controlled** — provide state via `activeItem` and `expandedItems`, and manage changes in `onActiveItemChange` and `onExpandCollapseChange`:
```tsx
const [activeItem, setActiveItem] = React.useState<string | null>(null)

<SideNav
  label="Main navigation"
  activeItem={activeItem}
  onActiveItemChange={(value) => {
    setActiveItem(value)
    if (value) {
      // your route change logic
    }
  }}
>
  <SideNavGroup>
    <SideNavItem id="home">
      <SideNavCell label="Home" />
    </SideNavItem>
    <SideNavItem id="retail">
      <SideNavCell label="Retail" />
    </SideNavItem>
  </SideNavGroup>
</SideNav>
```
### Slots

In addition to `children`, `SideNav` provides three pre-defined content slots:

- `logo` — rendered at the top of the nav
- `leading` — rendered below the logo slot
- `trailing` — rendered at the bottom, below navigation children

> ℹ️ Use `SideNavCellInteractiveFrame` and `SideNavCellFrame` when creating custom slot content. These components automatically sync with `SideNav` state, implement collapsing behavior and animations, and handle size-specific layout.
```tsx
<SideNav
  label="Main navigation"
  logo={
    <SideNavCellFrame
      icon={<Logo type={LogoType.logoMark} size={LogoSize.small} />}
      label={<Text textStyle={TextStyle.label.large.strong}>Merchant</Text>}
    />
  }
  leading={
    <SideNavCellInteractiveFrame
      icon={<SomeCustomIcon />}
      label={<Text textStyle={TextStyle.label.large.strong}>{label}</Text>}
    />
  }
  trailing={
    <SideNavCellInteractiveFrame
      label={<Text textStyle={TextStyle.label.large.strong}>{label}</Text>}
      description={<SideNavCellDescription />}
    />
  }
>
  ...
</SideNav>
```
## Accessibility

- `SideNav` renders a `<nav>` element. The `label` prop is required and provides a visually-hidden accessible name for screen reader users.
- Each `SideNavItem` and `SideNavExpandableItem` accepts an `id` prop used to autogenerate `aria-*` attributes.
- All components implement `React.forwardRef` and accept a `ref` prop.

## `SideNav` API

> ⚠️ The `label` prop is **required** to provide an accessible name for the navigation landmark.

### `label` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | A visually-hidden descriptive label for screen reader users. |

### `children`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | The navigation content to render. Should contain at least one `SideNavGroup` with a collection of items and/or expandable items. |

### `logo`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | Content rendered in the top "logo" slot. |

### `leading`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | Content rendered in the "leading" slot, below the logo slot. |

### `trailing`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | Content rendered in the bottom "trailing" slot, below navigation children. |

### `initialActiveItem`
| | |
|-----------|------------|
| Type | `string \| null` |
| Default | `undefined` |
| Description | An id pointing to a `SideNavItem`. Sets the corresponding item as "active" when active state is uncontrolled. |

### `activeItem`
| | |
|-----------|------------|
| Type | `string \| null` |
| Default | `undefined` |
| Description | An id pointing to a `SideNavItem`. Sets the corresponding item as "active" when state is controlled. |

### `onActiveItemChange`
| | |
|-----------|------------|
| Type | `(activeItem: string \| null, event: SideNavSelectEvent) => void` |
| Default | `undefined` |
| Description | Callback invoked when the active item changes. Required when active state is controlled. |

### `initialExpandedItems`
| | |
|-----------|------------|
| Type | `string \| string[] \| null` |
| Default | `undefined` |
| Description | An id or array of ids pointing to `SideNavItem` components. Sets the corresponding item(s) as "expanded" when expanded state is uncontrolled. |

### `expandedItems`
| | |
|-----------|------------|
| Type | `string \| string[] \| null` |
| Default | `undefined` |
| Description | An id or array of ids pointing to `SideNavItem` components. Sets the corresponding item(s) as "expanded" when expanded state is controlled. When an array is provided, `allowMultipleExpandedItems` is also enabled. |

### `onExpandCollapseChange`
| | |
|-----------|------------|
| Type | `(expandedItems: string \| string[] \| null, event: SideNavExpandCollapseEvent) => void` |
| Default | `undefined` |
| Description | Callback invoked when the expanded item(s) change. Required when expanded state is controlled. |

### `allowMultipleExpandedItems`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | When `false`, any open expandable closes when another opens. When `true`, open expandables remain open when a new one is opened. |

### `isSideNavCollapsed`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | When `true`, the `SideNav` collapses to show only icons within navigation cells. |

### `size`
| | |
|-----------|------------|
| Type | `**SideNavSize**` |
| Default | `SideNavSize.medium` |
| Description | The size of the `SideNav` and its child components. |

### `width`
| | |
|-----------|------------|
| Type | `string \| number` |
| Default | `256` |
| Description | Overrides the width of the `SideNav`. For responsive or complex width needs, use `shouldFillContainer` instead. |

### `shouldFillContainer`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | When `true`, the `SideNav` fills its container width across all breakpoints. Use with a wrapping element to manage custom widths or responsive behavior. |

### `id`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Applied to the underlying `<nav>` element. Also used as the base for autogenerated accessibility-related ids. |

## `SideNavGroup` API

### `children`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | A collection of `SideNavItem` and/or `SideNavExpandableItem` components. |

### `label`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Renders a section heading above the provided `children`. |

### `hasSeparator`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Shows or hides a bottom separator after the rendered `children`. |

### `id`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Applied to the underlying `<ul>` element. Also used to autogenerate accessibility-related ids. |

## `SideNavItem` API

### `children`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | A navigation control, typically `SideNavCell` or `SideNavChildCell`. For custom controls, use `SideNavCellInteractiveFrame` or `SideNavCellFrame` as a base. |

### `id`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Applied to the underlying `<li>` element. Also used to autogenerate accessibility-related ids. |

## `SideNavExpandableItem` API

### `content` `required`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | The content rendered in the expandable panel. Typically a collection of `SideNavItem` components containing `SideNavChildCell` components. |

### `children`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | A `SideNavCell` that controls the expandable panel's visibility. For custom controls, use `SideNavCellInteractiveFrame` or `SideNavCellFrame` as a base. |

### `id`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Applied to the underlying `<li>` element. Also used to autogenerate accessibility-related ids. |

### `isExpanded`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Forces the expandable to be open or closed. It is recommended to manage expanded state at the top-level `SideNav`. This prop is available for specific one-off scenarios. |

### `onExpandCollapseChange`
| | |
|-----------|------------|
| Type | `(id: string, event: React.MouseEvent \| React.KeyboardEvent) => void` |
| Default | `undefined` |
| Description | Callback invoked when this expandable is opened or closed. It is recommended to manage expanded state at the top-level `SideNav`. This prop is available for specific one-off scenarios. |

## `SideNavCell` API

> ℹ️ `SideNavCell` is polymorphic and also accepts any props of the element passed to the `as` prop.

### `label` `required`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | The primary content/label of the navigation control. |

### `as`
| | |
|-----------|------------|
| Type | `ElementType` |
| Default | `button` |
| Description | The root HTML tag or component used to render the cell control. |

### `icon`
| | |
|-----------|------------|
| Type | `**SideNavCellIconType**` |
| Default | `undefined` |
| Description | The icon to render. |

### `description`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | A description string to render below the label. |

### `tag`
| | |
|-----------|------------|
| Type | `string \| SideNavCellTagProps` |
| Default | `undefined` |
| Description | When a string is provided, a default tag is rendered. Also accepts an object of tag props to customize the `Tag`. |

### `badge`
| | |
|-----------|------------|
| Type | `number` |
| Default | `undefined` |
| Description | Renders a notification badge with the provided number. |

### `isActive`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Makes the control visually active. It is recommended to manage active state at the top-level `SideNav`. This prop is available for specific one-off scenarios. |

### `isExpanded`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Controls the direction of the chevron. It is recommended to manage expanded state at the top-level `SideNav`. This prop is available for specific one-off scenarios. |

### `size`
| | |
|-----------|------------|
| Type | `**SideNavSize**` |
| Default | `SideNavSize.medium` |
| Description | The size of the cell. It is recommended to manage size at the top-level `SideNav`. This prop is available for specific one-off scenarios. |

## `SideNavChildCell` API

> ℹ️ `SideNavChildCell` is polymorphic and also accepts any props of the element passed to the `as` prop.

### `label` `required`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | The primary content/label of the navigation control. |

### `as`
| | |
|-----------|------------|
| Type | `ElementType` |
| Default | `button` |
| Description | The root HTML tag or component used to render the cell control. |

### `description`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | A description string to render below the label. |

### `tag`
| | |
|-----------|------------|
| Type | `string \| SideNavCellTagProps` |
| Default | `undefined` |
| Description | When a string is provided, a default tag is rendered. Also accepts an object of tag props to customize the `Tag`. |

### `badge`
| | |
|-----------|------------|
| Type | `number` |
| Default | `undefined` |
| Description | Renders a notification badge with the provided number. |

### `isActive`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Makes the control visually active. It is recommended to manage active state at the top-level `SideNav`. This prop is available for specific one-off scenarios. |

### `size`
| | |
|-----------|------------|
| Type | `**SideNavSize**` |
| Default | `SideNavSize.medium` |
| Description | The size of the cell. It is recommended to manage size at the top-level `SideNav`. This prop is available for specific one-off scenarios. |

## Further Reading

- [docs/examples.md](docs/examples.md) — React Router integration patterns (controlled and uncontrolled)
- [docs/extend-and-customize.md](docs/extend-and-customize.md) — Custom navigation cells, Popover composition, context hooks (`useSideNavContext`, `useSideNavItemContext`, `useSideNavExpandableItemContext`), advanced width/height control