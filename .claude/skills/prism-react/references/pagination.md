# `Pagination`

Indicators for paginated content.

## Exported Constants

* `PaginationColor`
* `PaginationShape`
* `PaginationSize`

## Usage

### Pagination - default state
```typescript
import { Pagination, PaginationColor, PaginationSize } from '@doordash/prism-react'

const MyPaginator = () => (
  <Pagination
    onSelect={index => console.log(index)}
    size={PaginationSize.medium}
    color={PaginationColor.primary}
    count={3}
    selectedIndex={0}
  />
)
```
## API

### `onSelect` `required`
| | |
|-----------|------------|
| Type | `(selectedIndex: number, event: MouseEvent<HTMLButtonElement, MouseEvent>) => void` |
| Default | `null` |
| Description | Called when an indicator is clicked. |

### `selectedIndex` `required`
| | |
|-----------|------------|
| Type | `number` |
| Default | `0` |
| Description | `selectedIndex` can be an integer or a float. If it's a float, then the selected indicator will live inbetween whole pagination indicators. This is useful for creating continuous animations (like swipes/scrolls) with the Pagination component. |

### `count` `required`
| | |
|-----------|------------|
| Type | `number` |
| Default | `3` |
| Description | The number of indicators to display. |

### `color`
| | |
|-----------|------------|
| Type | `**PaginationColor**` |
| Default | `PaginationColor.primary` |
| Description | The style of the indicator used. |

### `size`
| | |
|-----------|------------|
| Type | `**PaginationSize**` |
| Default | `PaginationSize.medium` |
| Description | The size of the indicator used. |

### `shape`
| | |
|-----------|------------|
| Type | `**PaginationShape**` |
| Default | `PaginationShape.dash` |
| Description | The shape of the indicators. |

### `accessibilityLabel` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `"Pagination"` |
| Description | How the pagination controls should be labelled for assistive technology. |

### `indicatorAccessibilityLabelPrefix` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `"Pagination"` |
| Description | How the individual pagination indicators should be labelled for assistive technology; serves as a prefix with the page number appended. |

### Usage tips

* Use `color={PaginationColor.light}` on dark backgrounds.
* If you're trying to implement a continuous animation with Pagination, pass a non-integer number to the `selectedIndex` property to continuously animate the value.