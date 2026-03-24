`Inline` defines our rules for _horizontal_ space after content.

## Exported Constants

* `InlineSize`

## API

### `size`
| | |
|-----------|------------|
| Type | `**InlineSize**` |
| Default | `InlineSize.medium` |
| Description | Choose from an enum of sizes for Inline. |

### `tag`
| | |
|-----------|------------|
| Type | `string \| React.ComponentType` |
| Default | `div` |
| Description | Swap out the html element that is rendered. |

## Usage

### Default space around
```typescript
import { Inline } from '@doordash/prism-react'
…
<Inline>Hello there fam!</Inline>
```
### Specify another space value
```typescript
import { Inline, InlineSize } from '@doordash/prism-react'
…
<Inline size={InlineSize.large}>
  Hello there fam!
</Inline>
```