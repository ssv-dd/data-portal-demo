# `Separator`
A consistent visual separator for content

## Exported Constants

* `SeparatorInset`
* `SeparatorSize`
* `SeparatorType`
* `SeparatorVerticalMargin`

## API

### `type`
| | |
|-----------|------------|
| Type | `**SeparatorType**` |
| Default | `SeparatorType.separator` |
| Description | Determines what type of separator you're using. |

### `inset`
| | |
|-----------|------------|
| Type | `**SeparatorInset**` |
| Default | `SeparatorInset.small` |
| Description | Determines the amount of left inset you want when you're using the `InsetBorder` type. |

### `verticalMargin`
| | |
|-----------|------------|
| Type | `**SeparatorVerticalMargin**` |
| Default | `SeparatorVerticalMargin.none` |
| Description | Determines the amount of vertical margin you want above and below your spacer. |

### `separatorHeight`
| | |
|-----------|------------|
| Type | `**SeparatorSize**` |
| Default | `SeparatorSize.small` |
| Description | Determines the amount of vertical height your separator takes. |

## Usage

### Separator - default type
```typescript
import { Separator } from '@doordash/prism-react'
<Separator />
```
### Separator - `InsetBorder`
```typescript
import { Separator, SeparatorType } from '@doordash/prism-react'
<Separator type={SeparatorType.insetBorder} />
```
### Separator - `FullBorder`
```typescript
import { Separator, SeparatorType } from '@doordash/prism-react'
<Separator type={SeparatorType.fullBorder} />
```
### Example - Separating content
```typescript
import {
  Separator,
  Inset,
  StackChildren,
  StackChildrenSize,
  Text,
  TextStyle
} from '@doordash/prism-react'

<StackChildren>
  <Inset>
    <StackChildren size={StackChildrenSize.xxSmall}>
      <Text styles={TextStyle.display.medium.default}>My Section Title</Text>
      <Text styles={TextStyle.label.medium.default}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
        ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat. Duis aute irure dolor in
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
        culpa qui officia deserunt mollit anim id est laborum.
      </Text>
    </StackChildren>
  </Inset>
  <Separator />
  <Inset>
    <StackChildren size={StackChildrenSize.xxSmall}>
      <Text styles={TextStyle.display.medium.default}>My Section Title</Text>
      <Text styles={TextStyle.label.medium.default}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
        ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat. Duis aute irure dolor in
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
        culpa qui officia deserunt mollit anim id est laborum.
      </Text>
    </StackChildren>
  </Inset>
</div>
```
### Usage tips
* For larger sections separation, you should use the default type—`SeparatorType.separator`
* For list items, use the `insetBorder` or `fullBorder`