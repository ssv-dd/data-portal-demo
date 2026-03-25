# BottomSheet

> :warning: **NOTE:** BottomSheet requires that your app has a `LayerManager` at the top of it. Without this, the BottomSheet will not render.

## Type Definitions
```typescript
// CollarIconTypeValueType — accepts any IconType value from @doordash/design-language
// Usage: collarIconType={IconType.InfoCircleFill}
// Import IconType from '@doordash/design-language' or '@doordash/prism-react'
type CollarIconTypeValueType = ValueOf<typeof IconType>
```
## API

### `isOpen`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Determines if the BottomSheet is visible or not. |

### `isWrapped`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Determines if the sheet is wrapped. When true, detent-related props are disabled. |

### `smallDetent`
| | |
|-----------|------------|
| Type | `number` |
| Default | `25` |
| Description | The smallest detent (height percentage) for the sheet. Only applicable when `isWrapped` is false. |

### `defaultDentent`
| | |
|-----------|------------|
| Type | `**BottomSheetDetent**` |
| Default | `BottomSheetDetent.medium` |
| Description | The default detent position for the sheet. Only applicable when `isWrapped` is false. |

### `closeOnDrag`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Determines if the sheet should close when dragged down. |

### `isResizable`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Determines if the BottomSheet can be resized once opened. When false, the BottomSheet will be locked to the default detent, and the grabber will be hidden. |

### `footerIsFixed`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Determines if the footer is fixed to the bottom of the sheet. |

### `onEnter`
| | |
|-----------|------------|
| Type | `function (no parameters)` |
| Default | `undefined` |
| Description | A callback function that is called when the sheet enter animation has completed. |

### `onExit`
| | |
|-----------|------------|
| Type | `function (no parameters)` |
| Default | `undefined` |
| Description | A callback function that is called when the sheet exit animation has completed. |

### `onOpenChange`
| | |
|-----------|------------|
| Type | `(isOpen: boolean) => void` |
| Default | `undefined` |
| Description | A callback function that is called when the open state of the sheet changes. |

### `title`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | The title text of the BottomSheet. |

### `headerType`
| | |
|-----------|------------|
| Type | `**BottomSheetHeaderType**` |
| Default | `BottomSheetHeaderType.large` |
| Description | Controls text size and layout of the header. |

### `hasCloseButton`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Shows/hides the close button in the header. |

### `hasBackButton`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Shows/hides the back button in the header. |

### `onBackClick`
| | |
|-----------|------------|
| Type | `function (no parameters)` |
| Default | `undefined` |
| Description | Callback function when the back button is clicked. |

### `headerMedia`
| | |
|-----------|------------|
| Type | `Media \| React.ReactElement` |
| Default | `undefined` |
| Description | Media element to be displayed in the header. |

### `headerActions`
| | |
|-----------|------------|
| Type | `HeaderAction[]` |
| Default | `undefined` |
| Description | Header action buttons (maximum of 2). |

### `collarTitle`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | The title text of the collar section. |

### `collarDescription`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | The description text of the collar section. |

### `collarType`
| | |
|-----------|------------|
| Type | `**BottomSheetCollarType**` |
| Default | `BottomSheetCollarType.informational` |
| Description | The type of the collar section. |

### `collarIconType`
| | |
|-----------|------------|
| Type | `**CollarIconType**` |
| Default | `IconType.InfoCircleFill` |
| Description | The icon type of the collar section. |

### Usage
```tsx
import { BottomSheet } from '@doordash/prism-react'

const App = () => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <BottomSheet
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            title="Bottom Sheet Title"
            primaryAction={{
                label: 'Primary Action',
                onClick: () => setIsOpen(false),
            }}>
            <p>Bottom Sheet Content</p>
        </BottomSheet>
    )
}
```
### Event Bubbling

The BottomSheet relies on React Portals. Events in React Portals bubble up through the React tree instead of the DOM tree. This means events in a BottomSheet will trigger any event handlers attached to an ancestor in the React tree, even though the BottomSheet is not within the ancestor in the DOM tree. Our current guidance in this scenario is to filter out events that do not originate from within the ancestor's DOM tree using event.target.
```tsx
<div
    tabIndex={0}
    onFocus={event => {
        // without this conditional, this handler will run
        // every time focus changes inside the `BottomSheet`
        if ((event.target as HTMLElement).closest('.my-wrapper')) {
            console.log('focused')
        }
    }}
    className="my-wrapper"
>
    <BottomSheet ... />
</div>
```
# Sub-components

In order to enable an easy way to build custom bottom sheet experiences, we have exposed the composable pieces that we use internally to build BottomSheet.

**Available Sub-components**
* `BottomSheetSheet`
* `BottomSheetFrame`
* `BottomSheetHeader`
* `BottomSheetBody`
* `BottomSheetButtonGroup`
* `BottomSheetCollar`

## `BottomSheetSheet`

BottomSheetSheet is a wrapper around the Sheet component that is preconfigured to enable a bottom sheet experience out of the box. This handles the portaling through layer-manager to the correct layer, as well as styling for rounded corners and flex layout.

### API
#### `isOpen`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Determines if the bottom sheet is visible or not. |

#### `onEnter`
| | |
|-----------|------------|
| Type | `() => void` |
| Default | `-` |
| Description | A callback function that is called when the sheet is opened and the animation has completed. |

#### `onExit`
| | |
|-----------|------------|
| Type | `() => void` |
| Default | `-` |
| Description | A callback function that is called when the sheet is closed and the animation has completed. |

#### `onOpenChange`
| | |
|-----------|------------|
| Type | `(visible: boolean) => void` |
| Default | `-` |
| Description | A callback function that is called when the sheet should be closed. |

#### `shouldAnimate`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Determines if the sheet should animate on open/close. |

#### `labelledBy`
| | |
|-----------|------------|
| Type | `string` |
| Default | `-` |
| Description | Specifies the ID of the element that labels the sheet. This is important for accessibility. |

#### `children`
| | |
|-----------|------------|
| Type | `React.ReactNode` |
| Default | `-` |
| Description | The content of the bottom sheet. |

## `BottomSheetFrame`

BottomSheetFrame is responsible for the layout and interactive behavior of the bottom sheet. It manages the sheet's height through detents, handles drag-to-resize functionality, and organizes content into a structured grid layout with collar, header, body, and footer sections.

### API
#### `id`
| | |
|-----------|------------|
| Type | `string` |
| Default | `-` |
| Description | The unique identifier for the sheet. |

#### `collar`
| | |
|-----------|------------|
| Type | `React.ReactNode` |
| Default | `-` |
| Description | Content for the collar section at the top of the sheet. |

#### `header`
| | |
|-----------|------------|
| Type | `React.ReactNode` |
| Default | `-` |
| Description | Content for the header section. |

#### `body`
| | |
|-----------|------------|
| Type | `React.ReactNode` |
| Default | `-` |
| Description | Main content of the sheet. |

#### `footer`
| | |
|-----------|------------|
| Type | `React.ReactNode` |
| Default | `-` |
| Description | Content for the footer section. |

#### `footerIsFixed`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Determines if the footer is fixed to the bottom of the sheet. |

#### `smallDetent`
| | |
|-----------|------------|
| Type | `number` |
| Default | `25` |
| Description | The smallest height (as percentage of viewport) for the sheet. |

#### `defaultDentent`
| | |
|-----------|------------|
| Type | `BottomSheetDetent` |
| Default | `BottomSheetDetent.medium` |
| Description | The default height position of the sheet. |

#### `closeOnDrag`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Whether dragging down past the smallest detent closes the sheet. |

#### `isWrapped`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | When true, the sheet height is determined by its content. |

#### `isResizable`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Enables or disables drag-to-resize functionality. |

#### `onOpenChange`
| | |
|-----------|------------|
| Type | `(isOpen: boolean) => void` |
| Default | `-` |
| Description | Callback when the sheet's open state changes. |

### Implementing Drag-to-Resize

The BottomSheetFrame uses `@dnd-kit` for its drag-to-resize functionality. To enable this feature, you need a trigger element that users can interact with. There are two ways to implement this:

1. **Using BottomSheetHeader**:
   The BottomSheetHeader component comes with built-in drag functionality and includes a visual grabber handle by default. Simply set `isResizable={true}` on the BottomSheetFrame and provide the BottomSheetHeader component.
   ```tsx
   <BottomSheetFrame
     isResizable={true}
     header={<BottomSheetHeader id={id} title="Title" />}
     // ... other props
   />
   ```
2. **Using dnd-kit to create a custom element**:
   For custom implementations, you can use the dnd-kit library directly to create a draggable element:
   ```tsx
   import { useDraggable } from '@dnd-kit/core'

   const MyDraggableElement: React.FC<{ id: string }> = ({ id }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
      id,
    })

    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{
          width: '20px',
          height: '8px',
          margin: '0 auto',
          cursor: 'ns-resize',
          backgroundColor: 'purple',
        }}
      />
    )
   }
   ```
When drag-to-resize is enabled, users can drag the sheet to snap between different height detents. The sheet will automatically snap to the nearest detent when released.

## `BottomSheetCollar`

BottomSheetCollar is a component that appears at the top of the bottom sheet, providing a visually distinct area for important information or highlights. It supports different visual styles and includes an icon alongside text content.

### API
#### `type`
| | |
|-----------|------------|
| Type | `BottomSheetCollarType` |
| Default | `informational` |
| Description | Visual style of the collar. Can be either 'informational' (dark background) or 'highlight' (accent color background). |

#### `title`
| | |
|-----------|------------|
| Type | `string` |
| Default | `-` |
| Description | The main text displayed in the collar. Rendered in a larger, bold style. |

#### `description`
| | |
|-----------|------------|
| Type | `string` |
| Default | `-` |
| Description | Additional text displayed below the title. |

#### `iconType`
| | |
|-----------|------------|
| Type | `CollarIconTypeValueType` |
| Default | `InfoCircleFill` |
| Description | The icon to display. Uses the IconType enum from design-language. |

## `BottomSheetHeader`

BottomSheetHeader manages the top section of the bottom sheet, providing space for a title, optional media content, and action buttons. It supports different layout variations and includes drag-to-resize functionality.

### API
#### `id`
| | |
|-----------|------------|
| Type | `string` |
| Default | `-` |
| Description | The unique identifier for the sheet. Used for accessibility and drag functionality. |

#### `title`
| | |
|-----------|------------|
| Type | `string` |
| Default | `-` |
| Description | The title text displayed in the header. |

#### `headerType`
| | |
|-----------|------------|
| Type | `BottomSheetHeaderType` |
| Default | `large` |
| Description | Controls text size and layout. Can be either 'small' or 'large'. |

#### `hasCloseButton`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Shows/hides the close button in the header. |

#### `hasBackButton`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Shows/hides the back button in the header. |

#### `hasGrabber`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Shows/hides the drag handle at the top of the header. |

#### `headerMedia`
| | |
|-----------|------------|
| Type | `Media \| React.ReactElement` |
| Default | `-` |
| Description | Media element to display above the header. Can be an image or custom element. |

#### `actions`
| | |
|-----------|------------|
| Type | `HeaderAction[]` |
| Default | `[]` |
| Description | Header action buttons (maximum of 2). |

#### `onCloseClick`
| | |
|-----------|------------|
| Type | `() => void` |
| Default | `-` |
| Description | Callback function when the close button is clicked. |

#### `onBackClick`
| | |
|-----------|------------|
| Type | `() => void` |
| Default | `-` |
| Description | Callback function when the back button is clicked. |

## `BottomSheetBody`

BottomSheetBody is a simple container component that provides consistent padding and layout for the main content area of the bottom sheet.

### API
#### `children`
| | |
|-----------|------------|
| Type | `React.ReactNode` |
| Default | `-` |
| Description | The content to be rendered within the body section. |

## `BottomSheetButtonGroup`

BottomSheetButtonGroup manages the action buttons in the bottom sheet's footer. It wraps the ButtonGroup component with additional layout handling and provides responsive defaults based on screen size.

### API
#### `primaryAction`
| | |
|-----------|------------|
| Type | `ButtonGroupSlotInput` |
| Default | `-` |
| Description | The primary action button configuration. |

#### `secondaryAction`
| | |
|-----------|------------|
| Type | `ButtonGroupSlotInput` |
| Default | `-` |
| Description | The secondary action button configuration. |

#### `tertiaryAction`
| | |
|-----------|------------|
| Type | `ButtonGroupSlotInput` |
| Default | `-` |
| Description | The tertiary action button configuration. |

#### `exitAction`
| | |
|-----------|------------|
| Type | `ButtonGroupSlotInput` |
| Default | `-` |
| Description | The exit action button configuration. |

#### `actionsLayout`
| | |
|-----------|------------|
| Type | `BottomSheetButtonGroupLayoutValueType` |
| Default | Responsive (see features) |
| Description | Controls the layout of the action buttons. |