## Import
```tsx
import {
  Avatar,
  AvatarGroup,
  AvatarBorderColor,
  AvatarBorderWidth,
  AvatarBackgroundColor,
  AvatarIconBadgeType,
  AvatarIconBadgeBackgroundColor,
  AvatarIconBadgeColor,
  AvatarSize,
  AvatarBadgeStyle,
  AvatarShape
} from '@doordash/prism-react'
```
## Usage

`Avatar` is a component used to display a user's profile picture, initials, or an icon.

### Basic Usage
```tsx
import { Avatar } from '@doordash/prism-react'

const MyAvatar = () => (
  <Avatar
    accessibilityLabel="Kyoshi"
    image={{ src: "https://example.com/user-image.jpg" }}
  />
)
```
### With Initials

If an image is not available, you can display a first initial instead:
```tsx
import { Avatar, AvatarBackgroundColor } from '@doordash/prism-react'

const MyAvatar = () => (
  <Avatar
    accessibilityLabel="Korra"
    initial="K"
    backgroundColor={AvatarBackgroundColor['3']}
  />
)
```
### With Badge

You can add different types of badges to the Avatar:
```tsx
import { Avatar, AvatarBadgeStyle } from '@doordash/prism-react'

// Dot badge
const DotBadgeAvatar = () => (
  <Avatar
    accessibilityLabel="User with active status"
    image={{ src: "https://example.com/user-image.jpg" }}
    badge={{
      style: AvatarBadgeStyle.dot,
      accessibilityLabel: () => "Online"
    }}
  />
)

// Number badge
const NumberBadgeAvatar = () => (
  <Avatar
    accessibilityLabel="User with notifications"
    image={{ src: "https://example.com/user-image.jpg" }}
    badge={{
      style: AvatarBadgeStyle.number,
      value: 3,
      accessibilityLabel: (value) => `${value} notifications`
    }}
  />
)

// Icon badge
const IconBadgeAvatar = () => (
  <Avatar
    accessibilityLabel="User with verified status"
    image={{ src: "https://example.com/user-image.jpg" }}
    badge={{
      style: AvatarBadgeStyle.icon,
      type: AvatarIconBadgeType.checkmark,
      accessibilityLabel: () => "Verified user"
    }}
  />
)
```
#### Badge Size Support Table

| Avatar Size | `dot` | `number` | `icon` |
|------------------|--------|----------------|---------------------|
| `small` | ✅ | ❌ | ❌ |
| `medium` | ✅ | ❌ | ❌ |
| `large` | ✅ | ❌ | ❌ |
| `xLarge` | ✅ | ❌ | ❌ |
| `xxLarge` | ✅ | ❌ | ❌ |
| `xxxLarge` | ✅ | ✅ | ✅ |
| `4xlarge` | ✅ | ✅ | ✅ |
| `5xlarge` | ✅ | ✅ | ✅ |
| `6xlarge` | ✅ | ✅ | ✅ |
| `7xlarge` | ✅ | ✅ | ✅ |
| `8xlarge` | ✅ | ✅ | ✅ |

> ⚠️ Badges not supported for a given size will be silently omitted.

## Avatar Group

You can group multiple avatars together using the `AvatarGroup` component. When the number of avatars exceeds 5, the component will show a "+N" element to indicate additional avatars. You can define an accessible label for this element via the `moreItemsAccessibilityLabel` prop.
```tsx
import { AvatarGroup } from '@doordash/prism-react'

const MyAvatarGroup = () => (
  <AvatarGroup
    accessibilityLabel="Team Aang"
    avatars={[
      {
        accessibilityLabel: "Aang",
        image: { src: "https://example.com/aang.jpg" }
      },
      {
        accessibilityLabel: "Katara",
        image: { src: "https://example.com/katara.jpg" }
      },
      {
        accessibilityLabel: "Sokka",
        initial: "S",
        backgroundColor: AvatarBackgroundColor['3']
      },
      {
        accessibilityLabel: "Toph",
        image: { src: "https://example.com/toph.jpg" }
      },
      {
        accessibilityLabel: "Zuko",
        image: { src: "https://example.com/zuko.jpg" }
      },
      {
        accessibilityLabel: "Suki",
        initial: "S",
        backgroundColor: AvatarBackgroundColor['5']
      }
    ]}
  />
)
```
## Accessibility

The Avatar component handles the following accessibility considerations:
- Requires an `accessibilityLabel` for screen reader users
- Badge elements include their own accessibility labels to provide context

The AvatarGroup component:
- Requires an `accessibilityLabel` for screen reader users
- Provides a default accessible label for the truncated avatars indicator that can be defined via the `moreItemsAccessibilityLabel` prop
- If interactive, an `interactiveControlAccessibilityLabel` can be provided to customize the accessibilty label for the interactive control.

## `Avatar` API

> ⚠️ Note that an `accessibilityLabel` **is required**, especially when `onClick` is provided.

### `accessibilityLabel` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Alternative text to describe the Avatar for screen reader and other assistive technology users |

### `initial`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | The letter to display in the Avatar |

### `image`
| | |
|-----------|------------|
| Type | `{ src: string }` |
| Default | `undefined` |
| Description | The image to display in the Avatar |

### `backgroundColor`
| | |
|-----------|------------|
| Type | `**AvatarBackgroundColor**` |
| Default | `undefined` |
| Description | The background color of the Avatar, used with `initial` |

### `badge`
| | |
|-----------|------------|
| Type | `{ style: AvatarBadgeStyle.dot; accessibilityLabel: () => string } \| { style: AvatarBadgeStyle.number; value: number; accessibilityLabel: (value: number) => string } \| ({ style: AvatarBadgeStyle.icon backgroundColor?: AvatarIconBadgeBackgroundColorValueType accessibilityLabel: () => string }& Omit<AvatarIconBadgeProps, 'accessibilityLabel'>)` |
| Default | `undefined` |
| Description | Adds a status indicator to the Avatar. Can either be a dot, a number, or an icon |

### `shape`
| | |
|-----------|------------|
| Type | `**AvatarShape**` |
| Default | `AvatarShape.circle` |
| Description | The shape of the Avatar |

### `size`
| | |
|-----------|------------|
| Type | `**AvatarSize**` |
| Default | `AvatarSize.medium` |
| Description | The size of the Avatar |

### `borderColor`
| | |
|-----------|------------|
| Type | `**AvatarBorderColor**` |
| Default | `AvatarBorderColor.border.default` |
| Description | Override the color of the border around the Avatar |

### `borderWidth`
| | |
|-----------|------------|
| Type | `**AvatarBorderWidth**` |
| Default | `AvatarBorderWidth.default` |
| Description | Override the width of the border around the Avatar |

### `isDisabled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Disables the Avatar |

### `onClick`
| | |
|-----------|------------|
| Type | `(event: MouseEvent) => void` |
| Default | `undefined` |
| Description | Click event handler for the Avatar |

## `AvatarGroup` API

> ⚠️ Note that an `accessibilityLabel` **is required**, especially when `onClick` is provided.

### `accessibilityLabel` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Alternative text to describe the AvatarGroup for screen reader and other assistive technology users |

### `avatars` `required`
| | |
|-----------|------------|
| Type | `Omit<AvatarProps, 'size' \| 'borderColor' \| 'borderWidth' \| 'shape' \| 'badge' \| 'onClick' \| 'isDisabled'>[]` |
| Default | `undefined` |
| Description | Avatars to render in the group |

### `onClick`
| | |
|-----------|------------|
| Type | `(event: MouseEvent) => void` |
| Default | `undefined` |
| Description | Event handler for click events on the group |

### `shape`
| | |
|-----------|------------|
| Type | `**AvatarShape**` |
| Default | `AvatarShape.circle` |
| Description | The shape of the Avatars in the group |

### `size`
| | |
|-----------|------------|
| Type | `**AvatarSize**` |
| Default | `AvatarSize.medium` |
| Description | The size of the Avatars in the group |

### `isDisabled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Disables the AvatarGroup |

### `moreItemsAccessibilityLabel`
| | |
|-----------|------------|
| Type | `(props: { truncatedAmount: number }) => string` |
| Default | `({ truncatedAmount }) => \`${truncatedAmount} item${truncatedAmount === 1 ? '' : 's'} hidden\`` |
| Description | Accessible text for the "+N" item when the number of avatars exceeds 5 |

### `interactiveControlAccessibilityLabel`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Accessible text to describe the interactive element AvatarGroup for screen reader and other assistive technology users. Required when `onClick` is provided |