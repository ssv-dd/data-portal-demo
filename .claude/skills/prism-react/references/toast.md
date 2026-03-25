# `Toast`
A temporary post-action feature that appears and disappears automatically. This component (and `ToastProvider` in particular) requires a `LayerManager` to exist higher in the component hierarchy.

## Exported Constants

* `ToastPosition`
* `ToastIconType`
* `ToastInsetSize`
* `ToastDuration`

## Basic Usage

### Setting up a toast system
```typescript
import {
  IconType ,
  LayerManager,
  ToastProvider,
  useToast
} from '@doordash/prism-react'

const MyPage = () => {
  const { displayToast } = useToast()
  return (
    <div>
      <button onClick={() => displayToast({
        icon: IconType.Check,
        text: "Action completed!"
      })}>Show Toast</button>
    </div>
  )
}

const MyApp = () => {
  return (
    <LayerManager>
      <ToastProvider>
        <MyPage />
      </ToastProvider>
    </LayerManager>
  )
}
```
## `useToast`
A hook to get a `displayToast` method that's shared from the `ToastProvider` to enable a deeply nested child in the hierarchy to call a toast on a higher level. There is also an alternative `ToastContext` exported by this project for class-based components.

### API

### `title`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | The title content of the toast, displayed above the text content |

### `text` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | The main content of the toast. This must be provided. |

### `icon`
| | |
|-----------|------------|
| Type | `ToastIconType` |
| Default | `undefined` |
| Description | The icon type to display at the start (left) of the toast. |

### `isLoading`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Set to `true` to display a Loader at the start (left) of the toast instead of an Icon. |

### `action`
| | |
|-----------|------------|
| Type | `{ text: string, onClick: () => void }` |
| Default | `undefined` |
| Description | The action and the text of the button displayed at the end of the toast. |

### `duration`
| | |
|-----------|------------|
| Type | `ToastDuration` |
| Default | `ToastDuration.short` |
| Description | The length this particular toast should be displayed on screen. |

### `delay`
| | |
|-----------|------------|
| Type | `ToastDuration \| number` |
| Default | `undefined` |
| Description | A delay before showing the toast. This can be helpful if you're immediately dismissing one toast before showing another and need to account for exit animations to avoid unsightly layout shifts. |

### `onHide`
| | |
|-----------|------------|
| Type | `(toastId: string, toastProps: ToastProps) => void` |
| Default | `undefined` |
| Description | Callback for when this specific toast is hidden, and the arguments provided are the `generatedId` for the toast and the `props` of the toast. |

### `insetFromEdge`
| | |
|-----------|------------|
| Type | `ToastInsetSize` |
| Default | `undefined` |
| Description | Optional. Use this lever if you would like your Toast to display the set amount away from the container's edge. |
```typescript
import {
  ToastProvider,
  ToastDuration,
  ToastInsetSize,
  useToast,
  InsetSize,
  IconType
} from '@doordash/prism-react'

const MyPage = () => {
  const { displayToast } = useToast()
  return (
    <div>
      <button onClick={() => displayToast({
        icon: IconType.Check,
        text: "Action completed!",
        action: {
          text: "Refresh",
          onClick: () => {},
        },
        duration: ToastDuration.long,
        onHide: (id, props) => {
          console.log(`this toast ${id} is hidden`, props)
        },
        insetFromEdge: ToastInsetSize.Medium
      })}>Show Toast</button>
    </div>
  )
}
```
## `ToastProvider`
A frame that specifies where toasts should be displayed, that provides context values down the line for components deeper in the hierarchy to call `displayToast` for showing a toast.

### API

### `children` `required`
| | |
|-----------|------------|
| Type | `React.ReactNode` |
| Default | `undefined` |
| Description | The container for the toast—the boundaries of this immediate element will be used to determine where the toast is displayed based on `position` |

### `position`
| | |
|-----------|------------|
| Type | `ToastPosition` |
| Default | `ToastPosition.bottomCenter` |
| Description | The location of the toasts that are displayed. Each toast provider only has one location for all toasts used under it. |

### `duration`
| | |
|-----------|------------|
| Type | `ToastDuration` |
| Default | `ToastDuration.short` |
| Description | The default global length a toast should be displayed on screen. When using `displayToast`, you can provide a specified duration for that specific toast. |

### `onDisplay`
| | |
|-----------|------------|
| Type | `(toastId: string, toastProps: ToastProps) => void` |
| Default | `undefined` |
| Description | Callback for when a toast is displayed, and the arguments provided are the `generatedId` for the toast and the `props` of the toast. |

### `onHide`
| | |
|-----------|------------|
| Type | `(toastId: string, toastProps: ToastProps) => void` |
| Default | `undefined` |
| Description | Callback for when a toast is hidden, and the arguments provided are the `generatedId` for the toast and the `props` of the toast. |

### `setContainerAsAnchor`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | If `true`, `Toast` elements will render based on `position` in relation to the **children node boundaries rather than the viewport** (see `children` prop Notes for more details). |

### `isPortaled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Whether or not to render Toasts in a portal or adjacent to the trigger. |

### `toastLimit`
| | |
|-----------|------------|
| Type | `number` |
| Default | `3` |
| Description | Limit the number of toasts that can be rendered at one time. |

`useToastProvider` is also available as an export for leveraging the display & hide logic from `ToastProvider`. However, `ToastProvider` and `ToastContext`/`useToast` should meet almost all needs for rendering Toasts in your project, so please reach out to the Design Infrastructure team for guidance or suggestions on how best to leverage the Prism Toast component.

## Usage

### ToastProvider with configurations
```typescript
import { ToastProvider, ToastPosition, ToastDuration } from '@doordash/prism-react'

<ToastProvider
  position={ToastPosition.bottomEnd}
  duration={ToastDuration.long}
  onDisplay={(id, props) => console.log(`this toast with id ${id} is displayed:`, props)}
  onHide={(id, props) => console.log(`this toast with id ${id} is hidden:`, props)}
>
  … // Children components
</ToastProvider>
```
### Using Toasts in a Modal
To use Toasts in a Modal, you're going to need to setup a ToastProvider inside of the modal content: this ensures that the toast is presented above the modal within the bounds of the modal.
```typescript
import { ToastProvider, Button, ButtonType } from '@doordash/prism-react'
<Modal isOpen title="Modals and Toasts">
  <ToastProvider>
    <ToastContext.Consumer>
      {({ displayToast: displayModalToast }) => (
        <Button
          type={ButtonType.primary}
          isInline
          onClick={() => {
            displayModalToast({…})
          }}
        >
          Show Toast in Modal
        </Button>
      )}
    </ToastContext.Consumer>
  </ToastProvider>
</Modal>
```
### Usage tips
* Set this up at the highest level possible for your app. We should only ever have one of these per page, if not per app.