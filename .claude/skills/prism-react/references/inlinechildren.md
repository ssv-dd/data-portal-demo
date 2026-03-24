`InlineChildren` defines our rules for _horizontal_ space after content between the immediate children. _By using this component you cede control over margins of your children._ If you can't afford that, use `Inline` on each child instead.

## Exported Constants

* `InlineChildrenSize`
* `InlineChildrenAlignment`
* `InlineChildrenJustification`
* `InlineChildrenDirection`

## API

### `size`
| | |
|-----------|------------|
| Type | `**InlineChildrenSize**` |
| Default | `InlineChildrenSize.medium` |
| Description | Choose from an enum of sizes for InlineChildren. |

### `alignItems`
| | |
|-----------|------------|
| Type | `**InlineChildrenAlignment**` |
| Default | `InlineChildrenAlignment.stretch` |
| Description | Specify the alignment for child items (flex-box based). |

### `justifyContent`
| | |
|-----------|------------|
| Type | `**InlineChildrenJustification**` |
| Default | `InlineChildrenJustification.flexStart` |
| Description | Specify how to justify the content (flex-box based). |

### `direction`
| | |
|-----------|------------|
| Type | `**InlineChildrenDirection**` |
| Default | `InlineChildrenDirection.ltr` |
| Description | Specify the direction the content should flow, either from left-to-right (LTR) or right-to-left (RTL). |

### `tag`
| | |
|-----------|------------|
| Type | `string \| React.ComponentType` |
| Default | `div` |
| Description | Swap out the html element that is rendered. |

### `shouldWrap`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Applies `flex-wrap: wrap` to container when true. Note: the margin on the children will move from the left side to the right. |

## Usage

### Default space around
```typescript
import { InlineChildren } from '@doordash/prism-react'
…
<InlineChildren>
  <div>
    Hello
  </div>
  <div>
    there
  </div>
  <div>
    fam!
  </div>
</InlineChildren>
```
### Specify another space value
```typescript
import { InlineChildren, InlineChildrenSize } from '@doordash/prism-react'
…
<InlineChildren size={InlineChildrenSize.large}>
  <div>
    Hello
  </div>
  <div>
    there
  </div>
  <div>
    fam!
  </div>
</InlineChildren>
```
### Justify content
```typescript
import { InlineChildren, InlineChildrenJustification } from '@doordash/prism-react'
…
<InlineChildren justifyContent={InlineChildrenJustification.center}>
  <div>
    Hello
  </div>
  <div>
    there
  </div>
  <div>
    fam!
  </div>
</InlineChildren>
```
### Wrap children
```typescript
import { InlineChildren } from '@doordash/prism-react'
…
<InlineChildren shouldWrap>
  <div>
    Hello
  </div>
  <div>
    there
  </div>
  <div>
    fam!
  </div>
</InlineChildren>
```