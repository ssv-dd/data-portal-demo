## Exported Constants

* `TextAlignment`
* `TextColor`
* `TextDecoration`
* `TextDisplayMode`
* `TextFontFamily`
* `TextLineHeight`
* `TextOverflow`
* `TextSize`
* `TextStyle`
* `TextTransform`
* `TextWeight`

`Text` is used to display all text in Prism. Its `textStyle` prop is the primary interface you should use to configure it. That prop provides values for all the text styling, and you can use the other props to provide easy overrides for particular styles.

You can also set styles for different breakpoints—`wideScreenTextStyle`, `desktopTextStyle`, `tabletTextStyle`, and `mobileTextStyle` allow you to set styles that override the base `textStyle` passed. Order of priority goes from `textStyle` -> largest breakpoint styles -> smallest breakpoint styles.

## API

### `textStyle`
| | |
|-----------|------------|
| Type | `**TextStyle**` |
| Default | `TextStyle.body.medium.default` |
| Description | An object of style definitions that is named for a particular usecase. |

### `wideScreenStyles`
| | |
|-----------|------------|
| Type | `**TextStyle**` |
| Default | `null` |
| Description | An object of style definitions that overrides `textStyle` at our wideScreen breakpoint. |

### `desktopStyles`
| | |
|-----------|------------|
| Type | `**TextStyle**` |
| Default | `null` |
| Description | An object of style definitions that overrides `textStyle` at our desktop breakpoint. |

### `tabletStyles`
| | |
|-----------|------------|
| Type | `**TextStyle**` |
| Default | `null` |
| Description | An object of style definitions that overrides `textStyle` at our tablet breakpoint. |

### `mobileStyles`
| | |
|-----------|------------|
| Type | `**TextStyle**` |
| Default | `null` |
| Description | An object of style definitions that overrides `textStyle` at our mobile breakpoint. |

### `size`
| | |
|-----------|------------|
| Type | `**TextSize**` |
| Default | `null` |
| Description | Choose from a constant of sizes for Text. |

### `weight`
| | |
|-----------|------------|
| Type | `**TextWeight**` |
| Default | `null` |
| Description | Choose from a constant of font weights for Text. |

### `fontFamily`
| | |
|-----------|------------|
| Type | `**TextFontFamily**` |
| Default | `null` |
| Description | Choose from theme-based options of font families for Text, either `default` or `brand` (note that these are typically the same for most preset theme definitions). |

### `textTransform`
| | |
|-----------|------------|
| Type | `**TextTransform**` |
| Default | `TextTransform.normal` |
| Description | Choose from an enum of text transforms for Text, either `normal` or `upperCase`. |

### `color`
| | |
|-----------|------------|
| Type | `**TextColor**` |
| Default | `null` |
| Description | A value from our Colors. |

### `lineHeight`
| | |
|-----------|------------|
| Type | `**TextLineHeight**` |
| Default | `null` |
| Description | A value from our `LineHeights`, defines space between lines of text. |

### `textAlign`
| | |
|-----------|------------|
| Type | `**TextAlignment**` |
| Default | `TextAlignment.left` |
| Description | A value from our `TextAlignment`, defines how text is aligned. |

### `textDecoration`
| | |
|-----------|------------|
| Type | `TextDecoration[] \| TextDecoration` |
| Default | `undefined` |
| Description | A value from our `TextDecorations`, defines how text decoration styles are applied to text. |

### `textDecorationColor`
| | |
|-----------|------------|
| Type | `**TextColor**` |
| Default | `undefined` |
| Description | An optional property to include if you are setting `textDecoration`. If defined, this color will be used for the decoration instead of the `Text`'s current color. |

### `display`
| | |
|-----------|------------|
| Type | `**TextDisplayMode**` |
| Default | `null` |
| Description | A value from `DisplayModes`, defines how text is displayed—as `Block`, `InlineBlock`, `Flex`, or `Inline`. |

### `overflow`
| | |
|-----------|------------|
| Type | `**TextOverflow**` |
| Default | `null` |
| Description | A value from our `Overflows` enum that defines how the truncates or wraps. |

### `maxLines`
| | |
|-----------|------------|
| Type | `number` |
| Default | `null` |
| Description | A value that defines how many lines of text to display; must be paired with `overflow={TextOverflow.Truncate}` to work. |

### `children`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `null` |
| Description | Typically text, the content of title. |

### `as`
| | |
|-----------|------------|
| Type | `keyof HTMLElementTagNameMap \| React.ComponentType<any>` |
| Default | `span` |
| Description | Swap out the html element that is rendered. |

### `className`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | Provide a class to style this element with, for advanced cases only. |

## Usage

### Default title
```typescript
import { Text } from '@doordash/prism-react'
…
<Text>Hello there fam!</Text>
```
### Title with styles applied
```typescript
import { Text, TextStyle } from '@doordash/prism-react'
…
<Text textStyle={TextStyle.display.large}>
  Order List
</Text>
```
### Title with overrides
```typescript
import { Text, TextStyle, TextColor } from '@doordash/prism-react'
…
<Text
  textStyle={TextStyle.title.large}
  color={TextColor.highlight.default}
>
  Order List
</Text>
```
### Title with styles at different breakpoints applied
```typescript
import { Text, TextStyle } from '@doordash/prism-react'
…
<Text
  textStyle={TextStyle.display.large}
  desktopTextStyle={TextStyle.display.medium}
  mobileTextStyle={TextStyle.title.large}
>
  Order List
</Text>
```
### Use CurrentColor to take color context from container
If you need the text to take on the current color of it's context (especially with hover/active states also handled) you should consider using `TextColor.currentColor` so that you don't need explicit handling of the color or how it changes given state.

For example, in the code below, the containing, decorative text is `usage.action.primary.default`, then on Hover is `usage.action.primary.hovered`, and on active is `usage.action.primary.active`.
```typescript
import { Text, TextColor, IconSize, IconType, IconColor, Button, ButtonType } from '@doordash/prism-react'

<Button type={ButtonType.flatPrimary}>
  Sort
  <Text useDefaultColors color={TextColor.currentColor}>|</Text>
  <Icon
    size={IconSize.small}
    type={IconType.ChevronDown}
    color={IconColor.currentColor}
    accessibilityLabel="Show Menu"
  />
</Button>
```
## Usage tips

-   Either check Figma or work with design to figure out what to pass to `textStyle` — most of the time, you'll only need this instead of using any overrides.
-   Use `display` and `as` prop rather than passing in custom styles via `className`