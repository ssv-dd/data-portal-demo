# `Tooltip`

Informational content displayed in a layer; not meant to be interactive elements (like a menu).

## Exported Constants

* `TooltipBoundariesElement`
* `TooltipContentAlignment`
* `TooltipContentWrapperDisplayMode`
* `TooltipInteractionType`
* `TooltipPosition`
* `TooltipSize`
* `TooltipType`

## API

### `title`
| | |
|-----------|------------|
| Type | `string \| React.ReactNode` |
| Default | `` |
| Description | Content to be displayed as a title within the tooltip; can be a node or just a string. Default styling is provided for this content. |

### `content`
| | |
|-----------|------------|
| Type | `string \| React.ReactNode` |
| Default | `` |
| Description | Content to be displayed within the tooltip; can be a node or just a string. Default styling is provided for this content. |

### `type`
| | |
|-----------|------------|
| Type | `**TooltipType**` |
| Default | `TooltipType.informational` |
| Description | How the content will be displayed. One of Informational or Highlight. Use Highlight for educational or exceptional UI. |

### `size`
| | |
|-----------|------------|
| Type | `**TooltipSize**` |
| Default | `TooltipSize.large` |
| Description | How the content will be displayed in terms of sizing of tooltip. One of Small, Large. |

### `leadingIcon`
| | |
|-----------|------------|
| Type | `**IconType**` |
| Default | `undefined` |
| Description | The icon to display at the start of the tooltip, aligned with the top of the tooltip. |

### `children`
| | |
|-----------|------------|
| Type | `(props: TooltipChildrenRenderProps) => ReactNode` |
| Default | `` |
| Description | A function that takes in an object providing a unique DOM ID that the returned node can use to link the tooltip with the anchor, saying the anchor is described by the tooltip. |

### `isVisible`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `` |
| Description | Boolean to determine the visibility state of the Tooltip; used when in Controlled mode. |

### `defaultIsVisible`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Boolean to determine the initial visibility state of the Tooltip when not in Controlled mode. |

### `interactionType`
| | |
|-----------|------------|
| Type | `**TooltipInteractionType**` |
| Default | `TooltipInteractionType.toggleHover` |
| Description | One of: Hover, Click, Focus, ToggleHover, ToggleClick, ToggleFocus, and Controlled. Determines how the Tooltip displays. If you want complete control, used Controlled. |

### `position`
| | |
|-----------|------------|
| Type | `**TooltipPosition**` |
| Default | `` |
| Description | Ex. BottomLeft. Used to determine initial position of the Tooltip relative to its anchor. Tooltip automatically adjusts position to ensure it stays within the boundariesElement provided |

### `alignContent`
| | |
|-----------|------------|
| Type | `**TooltipContentAlignment**` |
| Default | `TooltipContentAlignment.Stretch` |
| Description | Used to determine how to align the content of the Tooltip. |

### `boundariesElement`
| | |
|-----------|------------|
| Type | `TooltipBoundariesElement \| null` |
| Default | `ScrollParent` |
| Description | One of Viewport, ScrollParent, Window, or a given node. Used to determine how the Tooltip repositions itself to be visible. |

### `shouldCloseBeVisible`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Determines when to show the close button. By default, is determined by the `interactionType` used, but this prop supercedes that if provided. |

### `contentDisplayMode`
| | |
|-----------|------------|
| Type | `**TooltipContentDisplayMode**` |
| Default | `TooltipContentDisplayMode.inlineFlex` |
| Description | Determines how the content wrapper around `children` is displayed. Set this when you want to make something inline in content, or if you want it to grow full-width, set it to `Flex`. |

### `onVisibilityChange`
| | |
|-----------|------------|
| Type | `(isVisible: boolean) => void` |
| Default | `undefined` |
| Description | Called when the tooltip has changed its visibility state, with first parameter being the new state. |

### `onClose`
| | |
|-----------|------------|
| Type | `(event: Event) => void` |
| Default | `undefined` |
| Description | Called when the tooltip's close button is clicked. |

### `titleMaxLines`
| | |
|-----------|------------|
| Type | `number` |
| Default | `undefined` |
| Description | The number of lines to restrict the title content to. |

### `contentMaxLines`
| | |
|-----------|------------|
| Type | `number` |
| Default | `undefined` |
| Description | The number of lines to restrict the main content to. |

### `isPortaled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Whether or not to render the Tooltip in a portal or adjacent to the trigger. |

### `disableInteractiveHover`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | When set to false, Tooltips using the toggleHover interaction will close if the hover moves away from the trigger. Setting it to true keeps the Tooltip content open, allowing continued user interaction. |

### `contentRef`
| | |
|-----------|------------|
| Type | `Ref<HTMLDivElement>` |
| Default | `undefined` |
| Description | Used to attach a ref to the tooltip container that displays when the tooltip is visible (The `ref` prop will be attached to the tooltip trigger). |

## Usage
### Tooltip - default usage
```typescript
import { Tooltip, TooltipPosition } from '@doordash/prism-react'
…
<Tooltip
  content={
    <>
      Hello, welcome to DashPass!<br />
      It's the best!<br />
      Try DashPass for free today!<br />
    </>
  }
  position={TooltipPosition.bottomLeft}
>
  {({ describedBy }) => <Button accessibilityDescribedBy={describedBy}>DashPass</Button>}
</Tooltip>
```
### Tooltip - open on click, keep open until explicitly closed
```typescript
import { Tooltip, TooltipPosition, TooltipInteractionType } from '@doordash/prism-react'
…
<Tooltip
  content={
    <>
      Hello, welcome to DashPass!<br />
      It's the best!<br />
      Try DashPass for free today!<br />
    </>
  }
  position={TooltipPosition.bottomLeft}
  interactionType={TooltipInteractionType.click}
>
  {({ describedBy }) => <Button accessibilityDescribedBy={describedBy}>DashPass</Button>}
</Tooltip>
```
### When using Tooltip in combination with other layered components

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