# `Popover`
Interactive content, like a menu of options, displayed in response to tapping a button.

## Exported Constants

* `PopoverContentDisplayMode`
* `PopoverInteractionType`
* `PopoverBoundariesElement`
* `PopoverLayerPosition`
* `PopoverLayerOffset`

## API

### `content` `required`
| | |
|-----------|------------|
| Type | `string \| React.ReactNode` |
| Default | `` |
| Description | Content to be displayed within the Popover; can be a node or just a string. Default styling is provided for this content. |

### `children` `required`
| | |
|-----------|------------|
| Type | `(props: PopoverChildrenRenderProps) => ReactNode` |
| Default | `` |
| Description | A function that takes in an object providing a unique DOM ID that the returned node can use to link the Popover with the anchor, saying the anchor is described by the Popover. Additionally, passes along generic aria-* properties in accessibility attributes to be spread into the receiving component. |

### `isVisible`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `` |
| Description | Boolean to determine the visibility state of the Popover; used when in Controlled mode. |

### `defaultIsVisible`
| | |
|-----------|------------|
| Type | `bool` |
| Default | `false` |
| Description | Boolean to determine the initial visibility state of the Popover when not in Controlled mode. |

### `interactionType`
| | |
|-----------|------------|
| Type | `**PopoverInteractionType**` |
| Default | `PopoverInteractionType.toggleClick` |
| Description | One of: ToggleClick and Controlled. Determines how the Popover displays. If you want complete control, used Controlled. |

### `position`
| | |
|-----------|------------|
| Type | `**PopoverLayerPosition**` |
| Default | `` |
| Description | Ex. BottomLeft. Used to determine initial position of the Popover relative to its anchor. Popover automatically adjusts position to ensure it stays within the boundariesElement provided. |

### `boundariesElement`
| | |
|-----------|------------|
| Type | `PopoverBoundariesElement \| HTMLElement \| null` |
| Default | `PopoverBoundariesElement.ScrollParent` |
| Description | One of Viewport, ScrollParent, Window, or a given node. Used to determine how the Popover repositions itself to be visible. |

### `showContainerPointer`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Determines whether to visually show the arrow/notch in the Popover container. If undefined, this value will fall back to the value for `Popover.showContainerPointer` set in the closest `Theming` overrides. |

### `contentDisplayMode`
| | |
|-----------|------------|
| Type | `oneOf(PopoverContentDisplayMode)` |
| Default | `InlineFlex` |
| Description | Determines how the content wrapper around `children` is displayed. Set this when you want to make something inline in content, or if you want it to grow full-wdith, set it to `Flex`. |

### `isContentFullWidth`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Set the content container the same width as the boundary element, regardless of container content. |

### `onVisibilityChange`
| | |
|-----------|------------|
| Type | `(isVisible: boolean) => void` |
| Default | `undefined` |
| Description | Called when the Popover has changed its visibility state, with first parameter being the new state. |

### `customOffset`
| | |
|-----------|------------|
| Type | `PopoverLayerOffset[]` |
| Default | `undefined` |
| Description | Optional prop for setting custom X and Y coordinates for the Popover in relation to the control element. Passed through to the underlying `AnchoredLayer` component. This prop will be used in very rare instances: `Popover` has been built with optimized offsets for each of the possible positions in relation to the control component. These offsets have been built with consideration for the position of the Popover and the presence of the pointer element, and should meet the needs of most use-cases for components that utilize `Popover`. `customOffset` is made available for the rare cases where the default offsets don't meet the user's needs. |

### `setContentWidthAsAnchorWidth`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | If set to true, the container for the `content` prop will be set as the same width as the anchor (`children`) element. |

### `isPortaled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Whether or not to render the Popover in a portal or adjacent to the trigger. |

### `constrainContentHeightToBoundary`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Will constrain the popover content to the available remaining vertical height of the boundaryElement. |

### `anchoredLayerProps`
| | |
|-----------|------------|
| Type | `Omit<AnchoredLayerProps, 'children' \| 'content'>` |
| Default | `{}` |
| Description | Allows you to pass any override settings to the AnchoredLayer contained in Popover. |

## Usage

### Popover - default usage
```typescript
import { Popover, PopoverLayerPosition } from '@doordash/prism-react'
…
<Popover
  content={
    <div style={{ width: 240 }} role="radiogroup">
      <ListCell
        title="Breakfast"
        subtext="8:00 AM - 11:00 AM"
        onClick={() => {}}
        size={ListCellSize.Small}
        iconEnd={{ type: ListCellIconType.Check }}
        isToggleable
        isToggled
        isSquished
        accessibilityRole="radio"
      />
      <ListCell
        title="Lunch"
        subtext="11:00 AM - 3:00 PM"
        onClick={() => {}}
        size={ListCellSize.Small}
        isSquished
        accessibilityRole="radio"
      />
      <ListCell
        title="Dinner"
        subtext="5:00 PM - 11:00 PM"
        onClick={() => {}}
        size={ListCellSize.Small}
        isSeparatorVisible={false}
        isSquished
        accessibilityRole="radio"
      />
    </div>
  }
  position={PopoverLayerPosition.bottomLeft}
>
  {({ describedBy }) => <Button accessibilityDescribedBy={describedBy}>Menus</Button>}
</Popover>
```
### When using Popover in combination with other layered components

When using a version of Prism Web older than v5.60.0, there are several packages that use a library called [`focus-trap-react`](https://github.com/focus-trap/focus-trap-react). This library keeps focus contained within a high-priority area to help us ensure accessibility for these components for users using assistive technology (include non-mouse, keyboard usage). `focus-trap-react` (built on top of [`focus-trap`](https://github.com/focus-trap/focus-trap)) works by hooking into browser focus behavior and keeping it "trapped" within a specific area of the DOM tree.

We've encountered an issue where triggering focus to move between two components that use focus trap (for example, clicking an item in a `Popover` that triggers a `Modal` to open) results in some hair collisions. This happens because there are essentially two separate focus handlers that are colliding, because they're each trying to wrest focus control from the other.

**To solve this issue, you will need to do two things:**
1. Add the same version of `focus-trap-react` as a dependency in your project's `package.json` file.
2. Update your project's webpack config to resolve any dependencies on `focus-trap-react` to the root, project-level copy. This will essentially "force" all of the Prism libraries that rely on `focus-trap-react` to use the version you have downloaded in your root level `node_modules`, rather than their independent copies.
Example:

  ```
  'focus-trap-react': path.resolve(
            __dirname,
            'node_modules/focus-trap-react'
          ),
  ```
In v5.59.0 we introduced a new component, `component-focus-lock`, that allows us to no longer use `focus-trap-react` and in v5.60.0 we removed all uses of that legacy library.