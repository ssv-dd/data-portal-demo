## `Portal` API

### `children`
| | |
|--|--|
| Type | `React.ReactNode` |
| Default | `undefined` |
| Description | The content to be portaled. |

### `portalTo`
| | |
|--|--|
| Type | `LayerManagerLayer` |
| Default | `undefined` |
| Description | The LayerManager destination layer. |
```typescript
import { LayerManager, LayerManagerLayer, Portal } from '@doordash/prism-react'

const App = () => (
  <LayerManager>
    <Portal portalTo={LayerManagerLayer.modal}>
       Content to portal.
    </Portal>
  </LayerManager>
)
```