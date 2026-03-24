`Inset` defines our rules for space _around_ content.

## Exported Constants

* `InsetSize`

## API

### `size`
| | |
|-----------|------------|
| Type | `**InsetSize**` |
| Default | `InsetSize.medium` |
| Description | Choose from an enum of sizes for Inset. |

### `isSquished`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | If `true`, the vertical padding is half the `size`. |

### `isStretched`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | If `true`, the vertical padding is double the `size`. |

### `horizontalSize`
| | |
|-----------|------------|
| Type | `**InsetSize**` |
| Default | `undefined` |
| Description | If set, `horizontalSize` value will be used for the horizontal padding. |

### `verticalSize`
| | |
|-----------|------------|
| Type | `**InsetSize**` |
| Default | `undefined` |
| Description | If set, `verticalSize` value will be used for the vertical padding. |

### `tag`
| | |
|-----------|------------|
| Type | `string` |
| Default | `div` |
| Description | Swap out the html element that is rendered. |

## Usage

### Default space around
```typescript
import { Inset } from '@doordash/prism-react'
…
<Inset>Hello there fam!</Inset>
```
#### Specify another space value
```typescript
import { Inset, InsetSize } from '@doordash/prism-react'
…
<Inset size={InsetSize.large}>
  Hello there fam!
</Inset>
```
#### Squished
```typescript
import { Inset } from '@doordash/prism-react'
…
<Inset isSquished>
  Hello there fam!
</Inset>
```