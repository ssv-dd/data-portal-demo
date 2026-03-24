# `TimeField`

Takes in a value object with `hour`, `minute`, `period` properties, renders them as individual selects.

## Exported Constants
* `TimeFieldSize`
* `TimeFieldMinuteInterval`

## API

### `autoFocus`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Should this component be immediately focused on when rendered? |

### `isDisabled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Should this component allow editing? |

### `onFocus`
| | |
|-----------|------------|
| Type | `FocusEventHandler` |
| Default | `null` |
| Description | Callback for when the component is focused on. |

### `onBlur`
| | |
|-----------|------------|
| Type | `FocusEventHandler` |
| Default | `null` |
| Description | Callback for when the component is blurred out of. |

### `onChange` `required`
| | |
|-----------|------------|
| Type | `(value: TimeFieldValueType) => void` where `TimeFieldValueType = { hour: string, minute: string, period: string }` |
| Default | `null` |
| Description | Callback for when the component's value is changed. |

### `onKeyUp`
| | |
|-----------|------------|
| Type | `KeyboardEventHandler` |
| Default | `null` |
| Description | Callback for when the component keys up, even if a value has not changed. |

### `onKeyDown`
| | |
|-----------|------------|
| Type | `KeyboardEventHandler` |
| Default | `null` |
| Description | Callback for when the component keys down, even if a value has not changed. |

### `onClick`
| | |
|-----------|------------|
| Type | `MouseEventHandler` |
| Default | `null` |
| Description | Callback for when the component is clicked. |

### `value` `required`
| | |
|-----------|------------|
| Type | `{ hour: string, minute: string, period: string }` |
| Default | `null` |
| Description | The value of the component, rendered in the input. |

### `label` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | The name of the field; required for accessibility reasons. |

### `isLabelHidden`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Since label is required, you can hide the label with this. |

### `isRequired`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Passed down to the input to get native required error state. |

### `isRounded`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | By default false, allows you to have a rounded field container. |

### `error`
| | |
|-----------|------------|
| Type | `string \| boolean` |
| Default | `null` |
| Description | Error message rendered below the field. |

### `warning`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | Warning message rendered below the field; if `error` prop is given, warning message will not be presented. |

### `description`
| | |
|-----------|------------|
| Type | `string \| React.ReactNode` |
| Default | `null` |
| Description | Secondary message rendered after the label; describes constraints and additional information. |

### `hint`
| | |
|-----------|------------|
| Type | `string or node` |
| Default | `null` |
| Description | Tertiary message rendered below the field input; a way to provide additional help for user about what content should be in the input. |

### `accessibilityDescribedBy`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | A DOM ID that references an element (like a tooltip) that describes this field. |

### `placeholder`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | Message to display within the input before any value is set. |

### `title`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | Message to display when hovering over the input. |

### `renderBeforeContent`
| | |
|-----------|------------|
| Type | `() => JSX.Element \| string` |
| Default | `null` |
| Description | Render function to allow rendering inside input, on the left. |

### `renderAfterContent`
| | |
|-----------|------------|
| Type | `() => JSX.Element \| string` |
| Default | `null` |
| Description | Render function to allow rendering inside input, on the right. |

### `leadingIcon`
| | |
|-----------|------------|
| Type | `**FieldIconType**` |
| Default | `undefined` |
| Description | Icon rendered at the leading (left) edge inside the input; takes precedence over `renderBeforeContent` when both are provided. |
### `trailingIcon`
| | |
|-----------|------------|
| Type | `**FieldIconType**` |
| Default | `undefined` |
| Description | Icon rendered at the trailing (right) edge inside the input; takes precedence over `renderAfterContent` when both are provided. |

### `renderConnectedBefore`
| | |
|-----------|------------|
| Type | `() => JSX.Element \| string` |
| Default | `null` |
| Description | Render function to allow rendering on the left outside of the input. |

### `renderConnectedAfter`
| | |
|-----------|------------|
| Type | `() => JSX.Element \| string` |
| Default | `null` |
| Description | Render function to allow rendering on the right outside of the input. |

### `maxLength`
| | |
|-----------|------------|
| Type | `number` |
| Default | `null` |
| Description | Number of characters to allow in input. |

### `minLength`
| | |
|-----------|------------|
| Type | `number` |
| Default | `null` |
| Description | Minimum number of characters to allow in input. |

### `minuteInterval`
| | |
|-----------|------------|
| Type | `**TimeFieldMinuteInterval**` |
| Default | `TimeFieldMinuteInterval.fifteen` |
| Description | Interval for segmenting minutes into choices. Values: `one` (1 min), `five` (5 min), `ten` (10 min), `fifteen` (15 min), `twenty` (20 min), `thirty` (30 min). |

### `size`
| | |
|-----------|------------|
| Type | `**TimeFieldSize**` |
| Default | `TimeFieldSize.Medium` |
| Description | Determines the size and font-size of the input. |

## Usage

### TimeField - default use
```typescript
import { TimeField } from '@doordash/prism-react'

state = {
  time: {
    hour: '12',
    minute: '30',
    period: 'AM',
  },
}

<TimeField
  value={this.state.time}
  onChange={value => this.setState({ time: value })}
  label="Delivery Time"
/>
```
### TimeField - different minute intervals
```typescript
import { TimeField, TimeFieldMinuteInterval } from '@doordash/prism-react'

state = {
  time: {
    hour: '12',
    minute: '30',
    period: 'AM',
  },
}

<TimeField
  value={this.state.time}
  onChange={value => this.setState({ time: value })}
  label="Delivery Time"
  minuteInterval={TimeFieldMinuteInterval.ten}
  description="Select your preferred delivery time"
  error={timeError}
/>
```
## Usage tips

-   Use `minuteInterval` prop to control the available values for minutes