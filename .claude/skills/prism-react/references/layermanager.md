# LayerManager

The `LayerManager` provider uses React Context and Portals to render components as siblings of your root application layer. This helps you manage z-index without having to think about it.

There are additional utility/primitive components for creating layered interfaces.

* [AnchoredLayer](https://prism.doordash.com/latest/web/components/layer-manager/anchored-layer.html)
* [Portal](https://prism.doordash.com/latest/web/components/layer-manager/portal-gdgKSgBL.html)
* [Sheet](https://prism.doordash.com/latest/web/components/layer-manager/sheet-m4gOQNJH.html)
* [Transitions](https://prism.doordash.com/latest/web/components/layer-manager/transitions-ZkOstStM.html)

## Dependent Components
-   `Modal`
-   `Alert`
-   `Confirm`
-   `Popover`
-   `Tooltip`
-   `Toast`
-   `Autocomplete`
-   `AnchoredLayer`
-   `Portal`

## Important Notes:
- You must include LayerManager in your project for LayerManager dependent components to work.
- You should place a ***single*** `LayerManager` provider as high in your project's hiearchy as possible. Placing multiple `LayerManagers` in an app may cause strange layering behavior.

### Event Bubbling
**Events in React Portals bubble up through the React tree instead of the DOM tree**. This means events in a layered component (like a Modal) will trigger any event handlers attached to an ancestor in the React tree, even though the component is not within the ancestor in the DOM tree. Our current guidance in this scenario is to filter out events that do not originate from within the ancestor's DOM tree using event.target.
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
## Exported Constants

-   `AnchoredLayerAnimationTypes`
-   `AnchoredLayerAnimationDirection`
-   `AnchoredLayerBoundariesElement`
-   `AnchoredLayerOffset`
-   `AnchoredLayerFlippedPosition`
-   `AnchoredLayerSpacing`
-   `AnchoredLayerPosition`
-   `AnchoredLayerPositionStrategy`
-   `LayerManagerLayer`

## `<LayerManager>` API

### `children`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `null` |
| Description | This is your application content that you want overlayed by the modal. |

### `consolidateNestedLayerManagers`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | If true, will not add extra layer manager destinations to the dom and will attempt to only use the highest layer set available. |
```typescript
import { LayerManager } from '@doordash/prism-react'

const App = () => (
  <LayerManager>
    <MyApp />
  </LayerManager>
)
```
## Layers

### `Layers.PopoverContent`

This layer is the lowest layer that sits above main project content, and is used by `AnchoredLayer` (and all future dependent components) to dynamically render a layer to the right level over content.

This layer is used by these components:

-   `AnchoredLayer`
-   `Popover`
-   `Tooltip`
-   `Autocomplete`

### `LayerManagerLayer.Sheet`

This layer is second in the Layer hierarchy, sitting above the `PopoverContent` but below the `Modal` Layers.

This is used by these components when they are contained in a `Sheet`:

-   `AnchoredLayer`
-   `Popover`
-   `Tooltip`
-   `Autocomplete`

### `LayersManagerLayer.Modal`

This layer is third in the Layer hierarchy, and sits above main project content, PopoverContent, and Sheet content.

This layer is used for all modal experiences:

-   `Modal`
-   `Alert`
-   `Confirm`

### `LayerManagerLayer.PopoverModal`

This layer is the layer that sits above Modal content, and is used by `AnchoredLayer` (and all future dependent components) to dynamically render a layer to the right level over modal content when leveraged inside of a `Modal`.

This is used by these components when they are contained in a `Modal`:

-   `AnchoredLayer`
-   `Popover`
-   `Tooltip`
-   `Autocomplete`

### `LayersManagerLayer.Root`

This layer is the highest layer and can be leveraged for displaying content at the highest level in the system.