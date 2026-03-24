# `Tag`
A lightweight label that conveys the temporary status or the contentʼs characteristics

## Exported Constants

* `TagSize`
* `TagType`
* `TagIconType`

## API

### `text` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Text that will be displayed in the Tag |

### `tagType`
| | |
|-----------|------------|
| Type | `**TagType**` |
| Default | `TagType.informational` |
| Description | Specifies the type of tag that you want to display |

### `tagStyle`
| | |
|-----------|------------|
| Type | `**TagStyle**` |
| Default | `TagStyle.default` |
| Description | Specifies the visual style of the tag that you want to display |

### `size`
| | |
|-----------|------------|
| Type | `**TagSize**` |
| Default | `TagSize.small` |
| Description | Specifies the size of the tag |

### `textProps`
| | |
|-----------|------------|
| Type | `TagTextProps` |
| Default | `undefined` |
| Description | Any additional props to set in the rendered `Text` node. Should avoid using if possible! |

### `leadingIcon`
| | |
|-----------|------------|
| Type | `TagIconProps \| boolean` |
| Default | `false` |
| Description | Sets properties for a leading Icon. This prop overrides all other leadingIcon props. |

### `trailingIcon`
| | |
|-----------|------------|
| Type | `TagIconProps \| boolean` |
| Default | `false` |
| Description | Sets properties for a trailing Icon. This prop's properties override all other trailingIcon props. |

## Usage

### Tag - default state
```typescript
import { Tag } from '@doordash/prism-react'

<Tag text="Store Offline" />
```
### Tag - with specific type
```typescript
import { Tag, TagType } from '@doordash/prism-react'

<Tag tagType={TagType.highlight} text="Favorite" />
```
### Tag - with specific style
```typescript
import { Tag, TagStyle } from '@doordash/prism-react'

<Tag tagStyle={TagStyle.emphasis} text="Favorite" />
```
### Tag - with icon
```typescript
import { Tag } from '@doordash/prism-react'

<Tag leadingIcon text="Favorite" />
```
### Tag - with close button
```typescript
import { Tag, TagIconType } from '@doordash/prism-react'
...
const [tagShowing, setTagShowing] = React.useState(true)
...

<Tag
  trailingIcon={{
    accessibilityLabel: "Remove tag",
    type: TagIconType.Close,
    onClick: () => setTagShowing(false)
  }}
  text="Favorite"
/>
```
### Usage tips

* Keep your text short! Tags are meant to be used for quick and easily scannable information
* Each `Tag` `type` has a default IconType associated with it. Want to change it? Set the `leadingIcon.type` or `trailingIcon.type` prop to the desired IconType.