# `Logo`

Our logo! Can be used as just a mark (`type={LogoType.logoMark}`) or as our full
logo with mark and text (by default or by `type={LogoType.logo}`). Can also additionally take in text to display alongside it. Uses theming to render the correct brand everywhere.

## Exported Constants

* `LogoBrand`
* `LogoSize`
* `LogoType`
* `LogoColor`
* `LogoTextColor`

## API

### `size`
| | |
|-----------|------------|
| Type | `**LogoSize**` |
| Default | `LogoSize.base` |
| Description | Choose from an enum of sizes for the logo to fit. These values are specified based on brand. |

### `textColor`
| | |
|-----------|------------|
| Type | `**LogoTextColor**` |
| Default | `LogoTextColor.textTertiary` |
| Description | Choose from an enum of colors from `design-language`. |

### `color`
| | |
|-----------|------------|
| Type | `**LogoColor**` |
| Default | `LogoColor.default` |
| Description | An enum of colors. Default uses the specified brand color for the brand that's rendered (DoorDash red, Caviar orange.) |

### `type`
| | |
|-----------|------------|
| Type | `**LogoType**` |
| Default | `LogoType.logo` |
| Description | Show the `LogoText` ('DoorDash' or Caviar) when set `Logo`, show's just the mark when set to `LogoMark` |

### `brand`
| | |
|-----------|------------|
| Type | `**LogoBrand**` |
| Default | `undefined` |
| Description | Specifies what Brand to show here. If not explicitly set, then we'll use the Brand that comes from theming. |

### `text`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | Additional text to show alongside the logo. |

Any other props get forwarded to the root container `div` of the component.

## Usage

### Logo with just the mark
```typescript
import { Logo } from '@doordash/prism-react'
…
<Logo type={LogoType.logoMark} />
```
### Logo with additional text, no `LogoText`
```typescript
import { Logo, LogoType, LogoSize, LogoColor, Theme } from '@doordash/prism-react'
…
<Logo
  type={LogoType.logoMark}
  text="DRIVE"
  size={LogoSize.huge}
  color={Theme.usage.color.icon.default}
  textColor={Theme.usage.color.highlight}
/>
```
### Logo with brand set through theming
```typescript
import { Logo, LogoSize, Theme, PrismConfig, Brand } from '@doordash/prism-react'
…
<PrismConfig
  config={{
    Logo: {
      Brand: LogoBrand.caviar
    }
  }}
>
  <Logo
    size={LogoSize.huge}
  />
</PrismConfig>
```
### Logo with specified brand, supercedes any theme value for logo
```typescript
import { Logo, LogoBrand, LogoSize } from '@doordash/prism-react'
…
<Logo
  brand={LogoBrand.caviar}
  size={LogoSize.Huge}
/>
```
### Usage tips

- Always give appropriate padding around the logo
- If on a dark background, use the white variant
- If on light background, use the default variant.
- Height of the component is 1.5x the size given.