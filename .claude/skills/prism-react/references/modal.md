> :warning: **NOTE:** Modal requires that your app has a `LayerManager` at the top of it. Without this, the Modal will not render.

## Type Definitions
```typescript
// ModalHeaderType — controls NavBar title size
type ModalHeaderType = 'small' | 'medium' | 'large'
// Import as: ModalHeaderType.small | ModalHeaderType.medium | ModalHeaderType.large
```
> ℹ️ If you are creating a multiple view/step process with multiple `Modal` components, be sure to [wrap your `Modal` components with `ModalManager`](https://prism.doordash.com/latest/web/components/modal-next/modal-next.html). `ModalManager` will combine nested `Modal` components into a single Modal and create a useable, accessible experience for screen reader and keyboard users.

## API
### `isOpen`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Determines if the Modal is visible or not. While not technically required, in practice will be needed for every implementation. |

### `hasBackButton`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Pass through prop to the NavBar component, enabling a leading back button within the navbar component. |

### `headerActions`
| | |
|-----------|------------|
| Type | `Array` |
| Default | `undefined` |
| Description | An array of actions to passthrough to the navbar component. There is a max-length of 2 actions. These actions will be rendered on the trailing edge of the NavBar component. |

### `headerMedia`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | A pass through prop to add media to the NavBar component such as an image. |

### `headerType`
| | |
|-----------|------------|
| Type | `**ModalHeaderType**` |
| Default | `ModalHeaderType.large` |
| Description | This is a pass through prop to the titleSize prop on NavBar. Changes the font size, and depending on the configuration of the consuming app, can render the title on a new line. |

### `hasFixedHeader`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Determines if the modal has a fixed header or not. NOTE: The fixed header only appears after the main header has scrolled off the screen. |

### `hasFixedButtonGroup`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Determines if the modal has a fixed ButtonGroup or not. |

### `onEnter`
| | |
|-----------|------------|
| Type | `function (no parameters)` |
| Default | `undefined` |
| Description | A callback function that is called when the modal is opened and the animation has completed. |

### `onExit`
| | |
|-----------|------------|
| Type | `function (no parameters)` |
| Default | `undefined` |
| Description | A callback function that is called when the modal is closed and the animation has completed. |

### `onOpenChange`
| | |
|-----------|------------|
| Type | `(visible: boolean) => void` |
| Default | `undefined` |
| Description | A callback function that is called when the modal should be closed. |

### `onBack`
| | |
|-----------|------------|
| Type | `function (no parameters)` |
| Default | `undefined` |
| Description | A callback function that is called when the back button is clicked. |

### `subtitle`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | A pass through prop to the NavBar component subtext or parentTitle props depending on the subtitlePosition prop. |

### `subtitlePosition`
| | |
|-----------|------------|
| Type | `**ModalHeaderSubtitlePosition**` |
| Default | `SubtitlePosition.below` |
| Description | Determines if the subtitle is rendered above or below the title. Controls which prop the subtitle value is passed through to the navbar component. |

### `title` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | The title of the Modal, is used for the accessibility label of the dialog, as well as a passthrough prop to the NavBar component. |

### `children`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | The content of the Modal. |

### `size`
| | |
|-----------|------------|
| Type | `**ModalSize**` |
| Default | `ModalSize.medium` |
| Description | Determines the size of the modal. |

### `closeOnBackdropClick`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Determines if the modal should close when the backdrop is clicked. |

### `hasCloseButton`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Adds a close button to the navbar component within modal. |

### `primaryAction`
| | |
|-----------|------------|
| Type | `{ content: string \| React.ReactElement onClick?: () => void buttonProps?: ButtonGroupButtonProps } \| (() => React.ReactElement)` |
| Default | `undefined` |
| Description | The primary action to be rendered in the modal. This action will be rendered in the ModalButtonGroup. *Required when hasCloseButton is false. |

### `secondaryAction`
| | |
|-----------|------------|
| Type | `{ content: string \| React.ReactElement onClick?: () => void buttonProps?: ButtonGroupButtonProps } \| (() => React.ReactElement)` |
| Default | `undefined` |
| Description | The secondary action to be rendered in the modal. This action will be rendered in the ModalButtonGroup. |

### `tertiaryAction`
| | |
|-----------|------------|
| Type | `{ content: string \| React.ReactElement onClick?: () => void buttonProps?: ButtonGroupButtonProps } \| (() => React.ReactElement)` |
| Default | `undefined` |
| Description | The tertiary action to be rendered in the modal. This action will be rendered in the ModalButtonGroup. |

### `exitAction`
| | |
|-----------|------------|
| Type | `{ content: string \| React.ReactElement onClick?: () => void buttonProps?: ButtonGroupButtonProps } \| (() => React.ReactElement)` |
| Default | `undefined` |
| Description | The exit action to be rendered in the modal. This action will be rendered in the ModalButtonGroup. |

### `actionsLayout`
| | |
|-----------|------------|
| Type | `**ModalButtonGroupLayout**` |
| Default | `ModalButtonGroupActionsLayout.split` |
| Description | The layout of the actions in the ModalButtonGroup. |

### `renderHeader`
| | |
|-----------|------------|
| Type | `(props: ModalHeaderRenderProps) => React.ReactNode` |
| Default | `undefined` |
| Description | Provide a function that returns a custom header. Function will receive all header-related props used to render the default Prism `ModalHeader` for usage in your custom header. Prism will add and manage a close button when `hasCloseButton` is true. **We generally recommend using the composition pattern instead of render props when customizing `Modal`, unless something makes that approach impractical or not possible (like a difficult to migrate legacy `Modal`)** |

### `renderFixedHeader`
| | |
|-----------|------------|
| Type | `(props: ModalFixedHeaderRenderProps) => React.ReactNode` |
| Default | `undefined` |
| Description | Provide a function that returns a custom fixedheader when `hasFixedHeader` is true. Function will receive all header-related props used to render the default Prism `ModalHeader` for usage in your your custom fixed header.Prism will add and manage a close button when `hasCloseButton` is true. **We generally recommend using the composition pattern instead of render props when customizing `Modal`, unless something makes that approach impractical or not possible (like a difficult to migrate legacy `Modal`)** |

### `renderButtonGroup`
| | |
|-----------|------------|
| Type | `(props: ModalButtonGroupRenderProps) => React.ReactNode` |
| Default | `undefined` |
| Description | Provide a function that returns a custom button group. Function will receive all props used to render the Prism `ModalButtonGroup` for usage in your custom button group. **We generally recommend using the composition pattern instead of render props when customizing `Modal`, unless something makes that approach impractical or not possible (like a difficult to migrate legacy `Modal`)** |
### `visibilityMode`
| | |
|-----------|------------|
| Type | `**ModalVisibilityMode**` |
| Default | `ModalVisibilityMode.propBased` |
| Description | Determines whether the visibility of the `Modal` is determined by the `isOpen` prop or by conditional rendering within your application. When `propBased`, you must wrap the `Modal` in an `AnimatePresence` component in order for animations to function correctly. **Note, the Prism team strongly recommends using `propBased`, and `conditionalRendering` should only be used in cases where `propBased` is not possible, or when migrating legacy `Modal` components that are too costly and impractical to refactor.** |

## Usage

### Basic Usage
```tsx
import { Modal } from '@doordash/prism-react'

const App = () => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Modal Title"
        primaryAction={{
            label: 'Primary Action',
            onClick: () => setIsOpen(false),
        }}>
            <p>Modal Content</p>
        </Modal>
    )
}
```
### Event Bubbling

The Modal relies on React Portals. **Events in React Portals bubble up through the React tree instead of the DOM tree**. This means events in a Modal will trigger any event handlers attached to an ancestor in the React tree, even though the Modal is not within the ancestor in the DOM tree. Our current guidance in this scenario is to filter out events that do not originate from within the ancestor's DOM tree using event.target.
```tsx
<div
    tabIndex={0}
    onFocus={event => {
        // without this conditional, this handler will run
        //every time focus changes inside the `Modal`
        if ((event.target as HTMLElement).closest('.my-wrapper')) {
            console.log('focused')
        }
    }}
    className="my-wrapper"
>
    <Modal ... />
</div>
```
### Conditional Rendering

When hiding/showing a `Modal`, **it is highly recommended to use the `isOpen` prop** as demonstrated in the "[Basic Usage](#basic-usage)" section above. However, there may be a situation where prop-based toggling is not possible (perhaps because of some third party constraint) or impractical (migrating conditionally rendered Legacy `Modal` components that would be too costly to refactor). For these scenarios, you can enable conditional rendering. To enable conditional rendering you must:

* Set the `visibilityMode` prop to `ModalVisibilityMode.conditionalRendering`
* Nest `Modal` in `AnimationProvider` (from `@doordash/prism-react`). **`Modal` must be an immediate child of `AnimationProvider**.
```tsx
import { AnimationProvider, Modal, ModalVisibilityMode } from '@doordash/prism-react'

const MyModal = (props) => {
    const [ isOpen, setIsOpen ] = React.useState(false)

    return (
        <AnimationProvider>
            {/* Modal must be an immediate child of AnimationProvider!  */}
            {isOpen ? (
                <Modal visibilityMode={ModalVisibilityMode.conditionalRendering} {...props}>
                    ...
                <Modal>
            ) : undefined}
        </AnimationProvider>
    )
}
```
### Usage tips
* Always provide as much context as possible through `title` and `subtitle` for accessibility reasons.
* When using `Modal` you are required to either have a close button (present by default), or a primary action. This is to ensure that we meet the web accessibility guidelines of having an interactive element to pass focus to.
* If you are looking to do something more custom than what is enabled via the Modal component, we have exposed all the composable pieces for you to build a custom modal. Learn more about these components below.
* If something prevents you from being able to leverage the composition model (like a difficult to migrate legacy `Modal`), we provide render props for the header, fixed/sticky header and footer (button group). **Please note that creating custom `Modal` components through composition is the recommended approach**, and these render props are provided to 1) reduce migration friction and 2) as an escape hatch when limited by other constraints.

### Resources
* <https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/dialog.html>
* <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_alertdialog_role>
* <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_dialog_role>
* <https://www.w3.org/TR/wai-aria-1.1/#alertdialog>
* <https://www.w3.org/TR/wai-aria-1.1/#dialog>
* <https://medium.com/@matuzo/writing-javascript-with-accessibility-in-mind-a1f6a5f467b9>
* <https://www.marcozehe.de/2015/02/05/advanced-aria-tip-2-accessible-modal-dialogs/>
* <https://marcysutton.com/button-focus-hell/>

# Sub-components

In order to enable an easy way to build custom modal like experiences, we have exposed the composable pieces that we use internally to build Modal.

**Available Sub-components**
* `ModalSheet`
* `ModalFrame`
* `ModalHeader`
* `ModalBody`
* `ModalButtonGroup`

## `ModalSheet`

ModalSheet is a wrapper around the Sheet component, that is preconfigured to enable a Modal experience out of the box. This does all the portaling through layer-manager to the correct layer, as well as the container styles.

### API

#### `isOpen`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `-` |
| Description | Determines if the Modal is visible or not. While not technically required, in practice will be needed for every implementation. |

#### `onEnter`
| | |
|-----------|------------|
| Type | `() => void` |
| Default | `-` |
| Description | A callback function that is called when the modal is opened and the animation has completed. |

#### `onExit`
| | |
|-----------|------------|
| Type | `() => void` |
| Default | `-` |
| Description | A callback function that is called when the modal is closed and the animation has completed. |

#### `onOpenChange`
| | |
|-----------|------------|
| Type | `(visible: boolean) => void` |
| Default | `-` |
| Description | A callback function that is called when the modal should be closed. |

#### `size`
| | |
|-----------|------------|
| Type | `ModalSize` |
| Default | `ModalSize.medium` |
| Description | Determines the size of the modal. |

#### `closeOnBackdropClick`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Determines if the modal should close when the backdrop is clicked. |

#### `labelledBy` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `-` |
| Description | Specifies the ID of the element that labels the modal sheet. This is important for accessibility. |

#### `children` `required`
| | |
|-----------|------------|
| Type | `React.ReactNode` |
| Default | `-` |
| Description | The content of the Modal Sheet. |

## `ModalFrame`

ModalFrame is responsible for the layout of Modal, as well as the fixed header and button group.

### API

#### `header`
| | |
|-----------|------------|
| Type | `React.ReactNode` |
| Default | `-` |
| Description | The content to be displayed in the header of the modal. |

#### `fixedHeader`
| | |
|-----------|------------|
| Type | `React.ReactNode` |
| Default | `-` |
| Description | The content to be displayed in a fixed header of the modal, typically shown after scrolling. |

#### `body`
| | |
|-----------|------------|
| Type | `React.ReactNode` |
| Default | `-` |
| Description | The main content of the modal. |

#### `buttonGroup`
| | |
|-----------|------------|
| Type | `React.ReactNode` |
| Default | `-` |
| Description | The group of buttons to be displayed in the modal, usually at the bottom. |

#### `buttonGroupIsFixed`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `-` |
| Description | Determines whether the button group should be fixed at the bottom of the modal. |

## `ModalHeader`

ModalHeader is a wrapper around the NavBar component, that is preconfigured to enable a Modal experience out of the box. This component is used to display the title, subtitle, and more.

#### `title` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `-` |
| Description | The main title of the modal header. |

#### `subtitle`
| | |
|-----------|------------|
| Type | `string` |
| Default | `-` |
| Description | A subtitle or additional text to display in the header. |

#### `subtitlePosition`
| | |
|-----------|------------|
| Type | `ModalHeaderSubtitlePosition` |
| Default | `-` |
| Description | Determines the position of the subtitle relative to the title. |

#### `headerType`
| | |
|-----------|------------|
| Type | `ModalHeaderType` |
| Default | `-` |
| Description | Specifies the type or style of the header. |

#### `hasBackButton`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `-` |
| Description | Determines whether to show a back button in the header. |

#### `onBackButtonClick`
| | |
|-----------|------------|
| Type | `() => void` |
| Default | `-` |
| Description | Callback function to be called when the back button is clicked. |

#### `hasNavButton`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `-` |
| Description | Determines whether to show a navigation button in the header. |

#### `navigationType`
| | |
|-----------|------------|
| Type | `ModalHeaderNavigationType` |
| Default | `-` |
| Description | Specifies the type of navigation button to display. |

#### `onNavigationClick`
| | |
|-----------|------------|
| Type | `() => void` |
| Default | `-` |
| Description | Callback function to be called when the navigation button is clicked. |

#### `media`
| | |
|-----------|------------|
| Type | `Media \| ReactElement` |
| Default | `-` |
| Description | Media content to be displayed in the header, such as an image or icon. |

#### `actions`
| | |
|-----------|------------|
| Type | `Action[]` |
| Default | `-` |
| Description | An array of action items to be displayed in the header. |

## `ModalBody`

Modal body ensures that there is the correct amount of spacing in and around the main content of the Modal.

### API

#### `isAttached`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Determines if the body should be attached to the header or button group. When `true`, it removes the default padding on the top of the body. |

#### `children`
| | |
|-----------|------------|
| Type | `React.ReactNode` |
| Default | `-` |
| Description | The content to be rendered within the modal body. |

## `ModalButtonGroup`

ModalButtonGroup is a wrapper around the ButtonGroup component, that is preconfigured to enable a Modal experience out of the box. This component is used to display the primary, secondary, tertiary, and exit actions.

### API

#### `primaryAction` `required`
| | |
|-----------|------------|
| Type | `Action` |
| Default | `-` |
| Description | The primary action to be displayed in the button group. |

#### `secondaryAction`
| | |
|-----------|------------|
| Type | `Action` |
| Default | `-` |
| Description | The secondary action to be displayed in the button group. |

#### `tertiaryAction`
| | |
|-----------|------------|
| Type | `Action` |
| Default | `-` |
| Description | The tertiary action to be displayed in the button group. |

#### `exitAction`
| | |
|-----------|------------|
| Type | `Action` |
| Default | `-` |
| Description | The exit action to be displayed in the button group. |

#### `actionsLayout`
| | |
|-----------|------------|
| Type | `ModalButtonGroupActionsLayout` |
| Default | `ModalButtonGroupActionsLayout.split` |
| Description | Specifies the layout of the actions in the button group. |