# `Loading`

Indeterminate loading spinner with success and error states.

## Exported Constants

* `LoadingSize`
* `LoadingColor`
* `LoadingState`

## API

### `size`
| | |
|-----------|------------|
| Type | `**LoadingSize**` |
| Default | `Medium` |
| Description | Choose from an enum of sizes for Loading. |

### `color`
| | |
|-----------|------------|
| Type | `**LoadingColor**` |
| Default | `Colors.LoadingDefault` |
| Description | Choose from an enum of colors for Loading. |

### `state`
| | |
|-----------|------------|
| Type | `**LoadingState**` |
| Default | `Loading` |
| Description | Choose from an enum of states for Loading. |

### `onAnimationEnd`
| | |
|-----------|------------|
| Type | `(loadingStateKey?: LoadingStateKey) => void` |
| Default | `noop` |
| Description | Called at the end of an animation |

### `onAnimationLoopEnd`
| | |
|-----------|------------|
| Type | `(loadingStateKey?: LoadingStateKey) => void` |
| Default | `noop` |
| Description | Called at the end of loop of an animation |

## Usage

### Loading - default state
```typescript
import { Loading } from '@doordash/prism-react'
<Loading />
```
### Loading - larger size
```typescript
import { Loading, LoadingSize } from '@doordash/prism-react'
<Loading size={LoadingSize.large}/>
```
### Loading - success state
```typescript
import { Loading, LoadingState } from '@doordash/prism-react'
<Loading state={LoadingState.success}/>
```
### Usage tips

-   Give enough space around the loader.
-   Use the animation hooks sparingly, only to convey positive or negative feedback.

### Bundle Size
To help with Bundle Size further, we export the `LoadingSpinner` primitive component.
It does not come with the Success and Error states and has minimal dependencies.
```typescript
import { LoadingSpinner } from '@doordash/prism-react'
<LoadingSpinner />
```