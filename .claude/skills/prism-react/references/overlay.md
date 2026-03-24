# `Overlay`

A semi-transparent layer to be used above content.

Types of overlay available:

-   `dark`: used primarily for indicating layering for modals.
-   `light`: used for sidebars, etc.
-   `loading`: used for indicating content is meant to be loading.
-   `transparent`: used for times when you want background content visible.

**Note: `Overlay` children will be given the `inert` attribute to make it unreachable when the `Overlay` is visible and NOT `transparent`. If the `Overlay` is hidden or the type is `transparent`, `inert` will NOT be added.**

When a `Portal` is used to position an `Overlay` over content, it is the host application's responsibility to set the `inert` attribute as needed.

## Exported Constants

* `OverlayType`

## API

### `isVisible`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Determines whether the Overlay is visible and clickable. Must explicitly be set to have overlay be visible. |

### `isAnimated`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Determines whether the Overlay should animate in, or should just appear. |

### `children`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `null` |
| Description | Content to layer the overlay on top of. |

### `content`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `null` |
| Description | Content to display center aligned on top of the overlay. |

### `type`
| | |
|-----------|------------|
| Type | `**OverlayType**` |
| Default | `OverlayType.dark` |
| Description | The type of overlay to display. |

## Usage

### Overlay - default dark state, visible
```typescript
import { Overlay, OverlayType } from '@doordash/prism-react'
…
<Overlay
  isVisible
  onClick={() => alert('clicked!')}
  type={OverlayType.dark}
>
  <Inset>
    <Text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
      eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
      ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
      aliquip ex ea commodo consequat. Duis aute irure dolor in
      reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
      culpa qui officia deserunt mollit anim id est laborum.
    </Text>
  </Inset>
</Overlay>
```
### Overlay - content includes high z-index elements

The Overlay component creates stacking contexts to ensure that content passed into
the component _always_ allows the `OverlayLayer` to be layered above the content.
```typescript
import { Overlay, OverlayType } from '@doordash/prism-react'
…
<Overlay
  isVisible
  onClick={() => alert('overlay clicked!')}
  type={OverlayType.dark}
>
  <Inset>
    <Text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
      eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
      ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
      aliquip ex ea commodo consequat. Duis aute irure dolor in
      reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
      culpa qui officia deserunt mollit anim id est laborum.
    </Text>
  </Inset>
  <div
    style={{
      position: 'absolute',
      zIndex: '100000',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      margin: 'auto',
      height: '72px',
      width: '72px',
      border: '4px solid red',
    }}
  >
    Z-INDEX: 100000
  </div>
</Overlay>
```
### Usage tips

-   Use the `OverlayType.loading` style of overlay on pages and components that need to fetch data.
-   Use the `OverlayType.transparent` when you need to have an overlay that catches clicks but doesn't look visible.
-   You should use the component by passing in content to be overlayed, but if you need to manage the layering manually, you should wrap overlay in a container that manages the stacking itself.