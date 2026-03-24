## Import
```tsx
import {
  Sheet,
  SheetCloseEvent,
  SheetLayer,
  SheetViewportEdgeAttachment,
  SheetDimensionSize,
  SheetFocusManagement,
  SheetBackdropType,
  SheetAnimationType,

} from '@doordash/prism-react'
```
## Usage

`Sheet` is a composable, highly configurable primitive used to layer content over your application's viewport.

If you need to position your layered content relative to *another* element, then you **should not** use `Sheet`. You should instead use either `Popover` or `AnchoredLayer`.

It can be used as either a **controlled component**:
```tsx
import { Sheet, SheetCloseEvent} from '@doordash/component-layer-manage'
import { Button } from '@doordash/component-button'

...

const MySheet = () => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Open Sheet</Button>
            <Sheet
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                accessibilityLabel={'Descriptive label for screen reader users'}
                closeEvents={[SheetCloseEvent.esc, SheetCloseEvent.outsideClick]}
            >
                My Sheet Content
                <Button onClick={() => setIsOpen(false)}>Close Sheet</Button>
            </Sheet>
        </>
    )
}
```
or **uncontrolled component**:
```tsx
import { Sheet, SheetCloseEvent} from '@doordash/component-layer-manage'

...

const MySheet = () => {
    return (
        <Sheet
            accessibilityLabel={'Descriptive label for screen reader users'}
            defaultIsOpen={true}
            closeEvents={[SheetCloseEvent.esc, SheetCloseEvent.outsideClick]}
        >
            My Sheet Content
        </Sheet>
    )
}
```
### Event Bubbling

The `Sheet` relies on React Portals. **Events in React Portals bubble up through the React tree instead of the DOM tree**. This means events in a `Sheet` will trigger any event handlers attached to an ancestor in the React tree, even though the `Sheet` is not within the ancestor in the DOM tree. Our current guidance in this scenario is to filter out events that do not originate from within the ancestor’s DOM tree using event.target.
```tsx
<div
    tabIndex={0}
    onFocus={event => {
        // without this conditional, this handler will run
        //every time focus changes inside the `Sheet`
        if ((event.target as HTMLElement).closest('.my-wrapper')) {
            console.log('focused')
        }
    }}
    className="my-wrapper"
>
    <Sheet ... />
</div>
```
### Built-in Interactions
The `Sheet` component provides some built-in interactions to hide the `Sheet`. The `closeEvents` prop supports closing the component via pressing the escape key on the keyboard and/or clicking outside of the `Sheet` container. There is a `wasOutsideClick` prop that accepts a function that receives the `MouseEvent` target if you need custom logic to determine what should be considered an "outsideClick".

You can also detect clicks to the backdrop element via the `onBackdropClick` event.
```tsx
import { Sheet, SheetCloseEvent} from '@doordash/component-layer-manage'

...

const MySheet = () => {
    return (
        <Sheet
            accessibilityLabel={'Descriptive label for screen reader users'}
            defaultIsOpen={true}
            closeEvents={[SheetCloseEvent.esc, SheetCloseEvent.outsideClick]}
        >
            My Sheet Content
        </Sheet>
    )
}
```
### Positioning
By default, the `Sheet` container will be centered in the viewport. The container can instead be attached to any side or corner via the `attachTo` prop.
```tsx
import { Sheet, SheetViewportEdgeAttachment} from '@doordash/component-layer-manage'

...

const MySheet = () => {
    return (
        <Sheet
            accessibilityLabel={'Descriptive label for screen reader users'}
            defaultIsOpen={true}
            // This will pin the container in the bottom right corner of the viewport
            attachTo={SheetViewportEdgeAttachment.bottomEnd}
        >
            My Sheet Content
        </Sheet>
    )
}
```
The `attachTo` prop also supports different positions for different viewport breakpoints.
```tsx
import { Sheet, SheetViewportEdgeAttachment} from '@doordash/component-layer-manage'

...

const MySheet = () => {
    return (
        <Sheet
            accessibilityLabel={'Descriptive label for screen reader users'}
            defaultIsOpen={true}
            // This will pin the container in the bottom right corner of the viewport
            // when the screen is desktop size or larger, and center the container
            // when mobile or tablet sized
            attachTo={{
                mobile: SheetViewportEdgeAttachment.center,
                tablet: SheetViewportEdgeAttachment.center,
                desktop: SheetViewportEdgeAttachment.bottomEnd,
                wideScreen: SheetViewportEdgeAttachment.bottomEnd,
                ultraWideScreen:SheetViewportEdgeAttachment.bottomEnd
            }}
        >
            My Sheet Content
        </Sheet>
    )
}
```
### Sizing
The `Sheet` size will be deteremined by the content within the container "out of the box". You can customize the `width`, `height`, `maxWidth` and `maxHeight` to whatever your project requires. The sizing props accept any valid CSS size dimension. You are also provided some pre-configured sizes via the `SheetsizeDimension` enum. The enum contains options to make your `Sheet` full-size or match the Prism Modal or Sidesheet.
```tsx
import { Sheet, SheetDimensionSize} from '@doordash/component-layer-manage'

...

const MySheet = () => {
    return (
        <Sheet
            accessibilityLabel={'Descriptive label for screen reader users'}
            defaultIsOpen={true}
            // This will make the `Sheet` container width match the width of your
            // application's Prism SideSheet
            width={SheetDimensionSize.sidesheet}
        >
            My Sheet Content
        </Sheet>
    )
}
```
The dimension props also support responsive configurations that allow you to render the container at different sizes for different breakpoints
```tsx
import { Sheet, SheetDimensionSize} from '@doordash/component-layer-manage'

...

const MySheet = () => {
    return (
        <Sheet
            accessibilityLabel={'Descriptive label for screen reader users'}
            defaultIsOpen={true}
            // The will make the container width sized by its content for mobile and tablet sizes,
            // match large Prism Modals for desktop and wideScreen,
            // and 90vw units for ultraWideScreen and above
            width={{
                mobile: SheetDimensionSize.content,
                tablet: SheetDimensionSize.content,
                desktop: SheetDimensionSize.modalLarge,
                wideScreen: SheetDimensionSize.modalLarge,
                ultraWideScreen: '90vw'
            }}
        >
            My Sheet Content
        </Sheet>
    )
}
```
### Styling
Prism provides baseline styles for the container and backdrop that align with system standards. Alternatively, both the container and backdrop can be customized to meet any custom needs your project may have.

#### Container Styles

You can customize the container styled by wrapping the `Sheet` in a custom `styled-component`:
```tsx
import { Sheet } from '@doordash/component-layer-manage'
import { Text } from '@doordash/design-language'
import styled from 'styled-components'

const StyledSheet = styled(Sheet)`
    background: pink;
    border-radius: 0;
`
const MyApp = () => {
    return (
        <StyledSheet defaultIsOpen labelledBy={'label'}>
            <Text id={'label'}>My Styled Sheet</Text>
        </StyledSheet>
    )
}
```
You can also remove all container styled via the `clearContainerStyles` prop.

#### Backdrop Styles
The `backdropType` prop provides three different backdrop styles via the `SheetBackdropType` enum: `light`, `dark` and `none`. Note that when using the light or dark backdrop, it is **highly** recommended to also set `focusManagement` to `trapAndCapture` (via the `SheetFocusManagement` enum). Since your application will be visually inert, you should also prevent keyboard users from being able to access the content below the `Sheet`.

You can also customize the backdrop styles with the `backdropStyles` prop:
```tsx
import { Sheet, SheetBackdropType } from '@doordash/component-layer-manage'
import { Text } from '@doordash/design-language'

const MySheet = () => {
    return (
        <Sheet
            defaultIsOpen
            labelledBy={'label'}
            backdropType={SheetBackdropType.dark}
            backdropStyles={{
                background: 'pink'
            }}
        >
            <Text id={'label'}>My Styled Sheet</Text>
        </Sheet>
    )
}
```
### Transitions
The backdrop and container support the following transitions:

* Fade
* Slide
* SlideFade
* None (no transition)
```tsx
import { Sheet, SheetAnimationType } from '@doordash/component-layer-manage'
import { Text } from '@doordash/design-language'

const MySheet = () => {
    return (
        <Sheet
            defaultIsOpen
            labelledBy={'label'}
            containerAnimation={SheetAnimationType.slideFade}
            backdropAnimation={SheetAnimationType.fade}
        >
            <Text id={'label'}>My Styled Sheet</Text>
        </Sheet>
    )
}
```
You can further customize the animations be providing an [object of Transition props](https://prism.doordash.com/latest/web/components/layer-manager.html#section-transitions-23).

Additionally, you can pass callback functions for the following transition events:

* onContainerEnter
* onContainerExit
* onBackdropEnter
* onBackdropExit
```tsx
import { Sheet, SheetAnimationType } from '@doordash/component-layer-manage'
import { Text } from '@doordash/design-language'

const MySheet = () => {
    return (
        <Sheet
            defaultIsOpen
            labelledBy={'label'}
            containerAnimation={{
                type: SheetAnimationType.slideFade,
                delay: 300
            }}
            backdropAnimation={SheetAnimationType.fade}
            onContainerEnter={() => { console.log('container has appeared!) }}
            onBackdropExit={() => { console.log('backdrop has disappeared!) }}
        >
            <Text id={'label'}>My Styled Sheet</Text>
        </Sheet>
    )
}
```
### Conditional Rendering
When hiding/showing a `Sheet`, **it is highly recommended to use the `isOpen` prop** as demonstrated in the "[Usage](#usage)" section above. However, there may be a situation where prop-based toggling is not possible (perhaps because of some third party constraint). For these scenarios, you can enable conditional rendering. To enable conditional rendering you must:
* Set the `visibilityMode` prop to `SheetVisibilityMode.conditionalRendering`
* Nest `Sheet` in `AnimationProvider`. **`Sheet` must be an immediate child of `AnimationProvider**.
```tsx
import {
    AnimationProvider,
    Sheet,
    SheetVisibilityMode
} from '@doordash/prism-react'
const MySheet = (props) => {
    const [ isOpen, setIsOpen ] = React.useState(false)
    return (
        <AnimationProvider>
            {/* Sheet must be an immediate child of AnimationProvider!  */}
            {isOpen ? (
                <Sheet visibilityMode={SheetVisibilityMode.conditionalRendering} {...props}>
                    ...
                <Sheet>
            ) : undefined}
        </AnimationProvider>
    )
}
```
### Accessibility
The `Sheet` component handles the following accessibility considerations for you:

* When using `capture` or `trapAndCapture` focus management
    * the `role=dialog`attribute is added to the container
    * `Esc` presses and outside container clicks will close the `Sheet`
    * scrolling on the `body` will be disabled (can be overridden via the `lockBodyScroll` prop)
    * initial focus will move to the first interactive element in the container
    * initial focus can move to a custom element via `initialFocusElement`
    * When the `Sheet` closes, focus will be transferred back to the element that had focus before the `Sheet` was opened
* When using `trapAndCapture` focus management with a `light` or `dark` backdrop, the `aria-modal=true` attribute is added to the container
If `backdropType` is `light` or `dark`, clicks to the content under the `Sheet` **will** be blocked
* If `backdropType` is `none`, clicks to the content under the `Sheet` will **not** be blocked. This `backdropType` should **not** be used with `trapAndCapture` focus management

All of these defaults can be overridden and customized to meet your custom needs.

## Additional Capabilities
`Sheet` supports:

* Polymorphic types (props of `as` element will also be permitted)
* `forwardRef`
* `styled-components`

## Resources
* <https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/dialog.html>
* <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_alertdialog_role>
* <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_dialog_role>
* <https://www.w3.org/TR/wai-aria-1.1/#alertdialog>
* <https://www.w3.org/TR/wai-aria-1.1/#dialog>
* <https://medium.com/@matuzo/writing-javascript-with-accessibility-in-mind-a1f6a5f467b9>
* <https://www.marcozehe.de/2015/02/05/advanced-aria-tip-2-accessible-modal-dialogs/>
* <https://marcysutton.com/button-focus-hell/>

## `Sheet` API

*⚠️ Note that either an `accessibilityLabel` **or** `labelledBy` **is required**.*

> **Responsive props** (`attachTo`, `width`, `height`, `maxWidth`, `maxHeight`, `backdropStyles`) accept either a single value or a breakpoint map: `{ mobile?, tablet?, desktop?, wideScreen?, ultraWideScreen? }`. See usage examples above for the breakpoint object pattern.

### `accessibilityLabel`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | An accessible label for assistive technology users |

### `labelledBy`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | An id pointing to an element to use as the label for assistive technology users |

### `children` `required`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | Content to render in the container |

### `isOpen`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Determines if the Sheet is visible or not |

### `defaultIsOpen`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Determines if the Sheet is visible on initial render (only used in uncontrolled mode) |

### `onOpenChange`
| | |
|-----------|------------|
| Type | `(isOpen: boolean) => void` |
| Default | `undefined` |
| Description | Callback to run when the Sheet visibility changes |

### `closeEvents`
| | |
|-----------|------------|
| Type | `SheetCloseEvent[]` |
| Default | `undefined` |
| Description | An array of events that should close the Sheet |

### `wasClickOutside`
| | |
|-----------|------------|
| Type | `(event: MouseEvent) => boolean` |
| Default | `undefined` |
| Description | A function to determine if a click event should be considered an "outside click" and close the Sheet when the `outsideClick` close event is present |

### `portalTo`
| | |
|-----------|------------|
| Type | `**SheetLayerType**` |
| Default | `SheetLayer.modal` |
| Description | Which layer the Sheet should render in |

### `attachTo`
| | |
|-----------|------------|
| Type | `**SheetAttachToPropType**` |
| Default | `SheetViewportEdgeAttachment.none` |
| Description | Which edge the Sheet should attach to (or none to center the Sheet). Can be configured per viewport breakpoint of globally. |

### `width`
| | |
|-----------|------------|
| Type | `**SheetDimensionPropType**` |
| Default | `SheetDimensionSize.content` |
| Description | How the width of the Sheet should be determined. Accepts a `SheetDimensionSize` value or provide a static value as a string. Can be configured per viewport breakpoint of globally. |

### `height`
| | |
|-----------|------------|
| Type | `**SheetDimensionPropType**` |
| Default | `SheetDimensionSize.content` |
| Description | How the height of the Sheet should be determined. Accepts a `SheetDimensionSize` value or provide a static value as a string. Can be configured per viewport breakpoint of globally. |

### `maxWidth`
| | |
|-----------|------------|
| Type | `**SheetDimensionPropType**` |
| Default | `SheetDimensionSize.content` |
| Description | How the max-width of the Sheet should be determined. Accepts a `SheetDimensionSize` value or provide a static value as a string. Can be configured per viewport breakpoint of globally. |

### `maxHeight`
| | |
|-----------|------------|
| Type | `**SheetDimensionPropType**` |
| Default | `SheetDimensionSize.content` |
| Description | How the max-height of the Sheet should be determined. Accepts a `SheetDimensionSize` value or provide a static value as a string. Can be configured per viewport breakpoint of globally. |

### `clearContainerStyles`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Removes all container styles when true. Wrap the `Sheet` component in a `styled-component` to add your own custom styles to the container: ``` const MySheet = styled(Sheet)` ... custom styles here ` ``` |

### `focusManagement`
| | |
|-----------|------------|
| Type | `**SheetFocusManagement**` |
| Default | `none` |
| Description | Determines how the `Sheet` should manage focus when open. Initial focus will be passed to either the element returned by `initialFocusElement`, or the first interactive element inside the `Sheet`. `capture` will bring focus in to the `Sheet` on open. `trapAndCapture` will capture focus as well as keep the focus trapped within the `Sheet` until it is closed. Focus will return to the element that had focus before the `Sheet` was opened. `none` will not manage focus at all and keep the `Sheet` in the natural DOM focus order. |

### `initialFocusElement`
| | |
|-----------|------------|
| Type | `React.MutableRefObject<HTMLElement \| null> \| ((container: HTMLElement) => HTMLElement \| null)` |
| Default | `undefined` |
| Description | The returned element will receive focus when the `Sheet` opens and `focusManagement` is either `capture` or `trapAndCapture` |

### `lockBodyScroll`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | When true, prevents the viewport from scrolling. If `trapAndCapture`, `lockBodyScroll` will be true by default. |

### `backdropType`
| | |
|-----------|------------|
| Type | `**SheetBackdropType**` |
| Default | `SheetBackdropType.default` |
| Description | The type of backdrop to render: default, light or none. If `focusManagement` is `trapAndCapture`, `none` is not allowed. |

### `backdropStyles`
| | |
|-----------|------------|
| Type | `SheetBackdropStyleType \| { mobile: SheetBackdropStyleType, tablet: SheetBackdropStyleType, desktop: SheetBackdropStyleType, wideScreen: SheetBackdropStyleType, ultraWideScreen: SheetBackdropStyleType }` |
| Default | `undefined` |
| Description | Style overrides for the backdrop behind the container when `backdropType` is not `none` |

### `onBackdropClick`
| | |
|-----------|------------|
| Type | `(event: MouseEvent) => void` |
| Default | `undefined` |
| Description | Callback to fire when the backdrop has a click event |

### `containerAnimation`
| | |
|-----------|------------|
| Type | `SheetAnimationType \| SheetAnimationProps` |
| Default | `'fade'` |
| Description | Enter/exit animation for container |

### `backdropAnimation`
| | |
|-----------|------------|
| Type | `SheetAnimationType \| SheetAnimationProps` |
| Default | `'fade'` |
| Description | Enter/exit animation for backdrop |

### `onContainerEnter`
| | |
|-----------|------------|
| Type | `function (no parameters)` |
| Default | `undefined` |
| Description | Callback to run when container enters |

### `onContainerExit`
| | |
|-----------|------------|
| Type | `function (no parameters)` |
| Default | `undefined` |
| Description | Callback to run when container exits |

### `onBackdropEnter`
| | |
|-----------|------------|
| Type | `function (no parameters)` |
| Default | `undefined` |
| Description | Callback to run when backdrop enters |

### `onBackdropExit`
| | |
|-----------|------------|
| Type | `function (no parameters)` |
| Default | `undefined` |
| Description | Callback to run when backdrop exits |

### `isContainerFocusable`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | When true, the container element will be in the document's tab order. This can be useful in scenarios when the `Sheet` has interactive elements that do not appear until a user interacts with the `Sheet`. |

### `isPortaled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | When `false` the `Sheet` will not be portaled to a Prism Layer, but instead rendered in the DOM tree in the same place it exists in the React tree. Positioning and z-index will need to be managed in the application |

### `containerOverflow`
| | |
|-----------|------------|
| Type | `'auto' \| 'hidden' \| 'scroll' \| 'visible' \| 'clip'` |
| Default | `visible` |
| Description | Sets the `overflow` behavior for the Sheet container element. When `maxHeight` is defined the default value will be set to `scroll` |

### `visibilityMode`
| | |
|-----------|------------|
| Type | `**SheetVisibilityMode**` |
| Default | `SheetVisibilityMode.propBased` |
| Description | Determines whether the visibility of the `Sheet` is determined by the `isOpen` prop or by conditional rendering within your application. When `propBased`, you must wrap the `Sheet` in an `AnimatePresence` component in order for animations to function correctly. **Note, the Prism team strongly recommends using `propBased`, and `conditionalRendering` should only be used in cases where `propBased` is not possible.**` |