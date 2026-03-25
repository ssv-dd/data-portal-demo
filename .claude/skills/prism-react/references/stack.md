`Stack` defines our rules for _vertical_ space after content.

## Exported Constants

* `StackSize`

## API

### `size`
| | |
|-----------|------------|
| Type | `**StackSize**` |
| Default | `StackSize.medium` |
| Description | Choose from an enum of sizes for Stack. |

### `tag`
| | |
|-----------|------------|
| Type | `string \| React.ComponentType` |
| Default | `div` |
| Description | Swap out the html element that is rendered. |

## Usage

### Default space around
```typescript
import { Stack } from '@doordash/prism-react'
…
<Stack>Hello there fam!</Stack>
```
### Specify another space value
```typescript
import { Stack, StackSize } from '@doordash/prism-react'
…
<Stack size={StackSize.large}>
  Hello there fam!
</Stack>
```