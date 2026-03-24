# `Svg`

Scalable Vector Graphics (SVG) is an XML-based markup language for describing two-dimensional vector graphics. SVG is essentially to graphics what HTML is to text.

This component is a light-weight wrapper around the native html `<svg>` element, accepting only a limited number of properties.

## API

Any other props passed to this component would be forwarded to the underlying `svg` tag (eg: `onClick`)

### `children`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `` |
| Description | React node representing the Svg's inner content. |

### `fill`
| | |
|-----------|------------|
| Type | `string` |
| Default | `` |
| Description | Defines the color of the interior of the given graphical element. What is called the "interior" depends on the shape itself and the value of the fill-rule attribute. |

### `height`
| | |
|-----------|------------|
| Type | `number` |
| Default | `` |
| Description | Height of the Svg. |

### `viewBox`
| | |
|-----------|------------|
| Type | `string` |
| Default | `0 0 ${height} ${width}` |
| Description | The value of the viewBox attribute is a list of four numbers min-x, min-y, width and height, separated by whitespace and/or a comma, which specify a rectangle in user space which should be mapped to the bounds of the viewport established by the given element, taking into account attribute preserveAspectRatio. Negative values for width or height are not permitted and a value of zero disables rendering of the element. |

### `width`
| | |
|-----------|------------|
| Type | `number` |
| Default | `` |
| Description | Width of the Svg. |

(https://developer.mozilla.org/en-US/docs/Web/SVG)

## Usage

### Svg
```typescript
import { Svg, Theme } from '@doordash/prism-react'

<Svg fill={Theme.usage.color.brand.primary} height={24} width={24}>
  <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4"/>
</Svg>
```
### Usage tips

- Prefer using our `<Svg>` over `<svg>` for better defaults.