`StackChildren` defines our rules for _vertical_ space after content between the immediate children of this component. _By using this component you cede control over margins of your children._ If you can't afford that, use `Stack` on each child instead.

## Exported Constants

* `StackChildrenSize`

## API

### `size`
| | |
|-----------|------------|
| Type | `**StackChildrenSize**` |
| Default | `StackChildrenSize.medium` |
| Description | Choose from an enum of sizes for StackChildren. |

### `tag`
| | |
|-----------|------------|
| Type | `string \| React.ComponentType` |
| Default | `div` |
| Description | Swap out the html element that is rendered. |

### `display`
| | |
|-----------|------------|
| Type | `**StackChildrenDisplay**` |
| Default | `StackChildrenDisplay.block` |
| Description | Specify the display type for StackChildren. |

### `alignItems`
| | |
|-----------|------------|
| Type | `**StackChildrenAlignment**` |
| Default | `StackChildrenAlignment.flexStart` |
| Description | Specify the alignment for child items (if display === StackChildrenDisplay.flex). |

### `justifyContent`
| | |
|-----------|------------|
| Type | `**StackChildrenJustification**` |
| Default | `StackChildrenJustification.flexStart` |
| Description | Specify how to justify the content (if display === StackChildrenDisplay.flex). |

## Usage

### Default space around
```typescript
import { StackChildren } from '@doordash/prism-react'
…
<StackChildren>
  <div>
    Hello
  </div>
  <div>
    there
  </div>
  <div>
    fam!
  </div>
</StackChildren>
```
### Specify another space value
```typescript
import { StackChildren, StackChildrenSize } from '@doordash/prism-react'
…
<StackChildren size={StackChildrenSize.large}>
  <div>
    Hello
  </div>
  <div>
    there
  </div>
  <div>
    fam!
  </div>
</StackChildren>
```