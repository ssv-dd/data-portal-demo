# `Toggle`

A yes or no toggle meant for use as confirmation or selection.

-   Used as a controlled component. Pass in `isSelected` to control, and `onChange` to update passed in state.
-   Has five types: `Toggle`, `Checkbox`, `Radio`, `Circle`, and `Custom`
    -   Use `Toggle` for picking between two modes or states
    -   Use `Checkbox` for selecting 0 or more from a group
    -   Use `Radio` with prop `name` provided to select 1 option from a group
    -   As of now, `Circle` is mostly a specialized edge case and should not be used elsewhere without discussing further with Design
    -   For custom toggles, you can use `Custom` in combination with `renderLabel` and `inputType` to create a custom toggle component.

## Exported Constants

* `ToggleType`
* `ToggleInputType`
* `ToggleAlignment`
* `ToggleJustification`
* `ToggleSize`
* `ToggleLabelSide`

## API

### `type`
| | |
|-----------|------------|
| Type | `**ToggleType**` |
| Default | `ToggleType.checkbox` |
| Description | The visual type of the toggle. See above for more information on each. |

### `inputType`
| | |
|-----------|------------|
| Type | `**ToggleInputType**` |
| Default | `undefined` |
| Description | The type of the toggle passed to the underlying input. Must be provided when `type={ToggleType.custom}`, otherwise an error will throw. |

### `alignToggle`
| | |
|-----------|------------|
| Type | `**ToggleAlignment**` |
| Default | `ToggleAlignment.start` |
| Description | Set the flex alignment of the toggle with the rendered label |

### `justifyToggle`
| | |
|-----------|------------|
| Type | `**ToggleJustification**` |
| Default | `ToggleJustification.start` |
| Description | Set the flex justification of the toggle with the rendered label |

### `size`
| | |
|-----------|------------|
| Type | `**ToggleSize**` |
| Default | `ToggleSize.large` |
| Description | Set the size of the toggle and the line-height of the rendered label |

### `labelSide`
| | |
|-----------|------------|
| Type | `**ToggleLabelSide**` |
| Default | `ToggleLabelSide.trailing` |
| Description | Set which side of the toggle the label should render on. |

### `isSelected` `required`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Pass in true/false value to control toggle.  Required since this is a controlled component. |

### `isIndeterminate`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Pass in true/false value to control set a checkbox to an indeterminate state. If both `isSelected` and `isIndeterminate` are true, the checkbox will remain in an `indeterminate` state. Only valid for `ToggleType.checkbox` and `ToggleType.custom`. When using `ToggleType.custom`, visual state must be managed in external application, while the Prism component will use this flag to set the underlying `input[type="checkbox"]` element's `indeterminate` property. |

### `isLabelHidden`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Prevent visible label from rendering. If true, `aria-label` is applied to input. |

### `isDisabled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Disables Toggle if set to `true`. |

### `error`
| | |
|-----------|------------|
| Type | `string` |
| Default | `false` |
| Description | Display an error message below the label of the component. |

### `label` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `false` |
| Description | The label to name the component. Required for accessibility reasons, even if visibly hidden.  For the Circle toggle, this will show in the circle and currently only text is supported. |

### `accessibilityDescribedBy`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | A DOM ID that references an element (like a tooltip) that describes this toggle. |

### `labelColor`
| | |
|-----------|------------|
| Type | `**ToggleLabelColor**` |
| Default | `ToggleLabelColor.black` |
| Description | Set the color of the label. |

### `name`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | Use with radio groups to enable default single-select behavior. |

### `onBlur`
| | |
|-----------|------------|
| Type | `FocusEventHandler` |
| Default | `null` |
| Description | Callback when the input is blurred |

### `onChange`
| | |
|-----------|------------|
| Type | `(isSelected: boolean, event: ChangeEvent) => void` |
| Default | `null` |
| Description | Get the value of the component after it's been toggled. |

### `onClick`
| | |
|-----------|------------|
| Type | `(isSelected: boolean, event: MouseEvent) => void` |
| Default | `null` |
| Description | Runs when the toggle element or label is clicked; receives the _current_ value of the toggle, as well as the event. You should prefer using `onChange` unless your intent is to use this component as more of a button or link that navigates elsewhere. |

### `onFocus`
| | |
|-----------|------------|
| Type | `FocusEventHandler` |
| Default | `null` |
| Description | Callback when the input is focused on |

### `renderLabel`
| | |
|-----------|------------|
| Type | `(props: ToggleRenderLabelProps) => ReactNode` |
| Default | `null` |
| Description | Render function for displaying the label. Allows you to customize how a label will look and work, while providing the label props from the Toggle. |

## Usage

### Toggle - default state (checkbox)
```typescript
import { Toggle } from '@doordash/prism-react'
…
<Toggle
  isSelected={this.state.selected === 'Kathryn G'}
  label="Kathryn G"
  onChange={value =>
    value ?
    this.setState({ selected: 'Kathryn G' }) :
    this.setState({ selected: '' })
  }
/>
…
```
### Toggle - modal toggle
```typescript
import { Toggle, ToggleType } from '@doordash/prism-react'
…
<Toggle
  type={ToggleType.toggle}
  isSelected={this.state.subscribeToEmails}
  label="Subscribe to marketing emails"
  onChange={value =>
    this.setState({ subscribeToEmails: value })
  }
/>
…
```
### Toggle - custom label
```typescript
import { Toggle, StackSize, TextStyle, Theme } from '@doordash/prism-react'
…
<Toggle
  label="Chicken Fried Rice"
  onChange={value => action(`Toggled: ${value}`)}
  renderLabel={({ htmlFor, label, size, isFocused }) => (
    <label htmlFor={htmlFor}> // Allow whole thing to be clickable
      <Stack size={StackSize.xxSmall}>
        <Text tag="span" styles={TextStyle.label.small.default}>{label}</Text> // Make sure label isn't duplicated, use a span instead
      </Stack>
      <Text
        color={isFocused ? Theme.usage.color.highlight.default : Theme.usage.color.text.subdued.default}
        styles={TextStyle.label.small.default}
      >
        Delicious classic made with real chicken. Delicious classic made with real chicken. Delicious classic made with real chicken.
      </Text>
    </label>
  )}
/>
…
```
### Toggle - color label
If you want to override the default behavior of the toggle's label turning red when selected, you can provide an explicit override with `labelColor` that will prevent the color from changing.
```typescript
import { Toggle, ToggleLabelColor } from '@doordash/prism-react'
…
<Toggle
  label="Casper"
  onChange={value => action(`Toggled: ${value}`)}
  labelColor={ToggleLabelColor.ghost}
/>
…
```
### Toggle - implement a RadioGroup
```typescript
import { Toggle, ToggleLabelColor, ToggleType } from '@doordash/prism-react'
import { StackSize } from '@doordash/design-language'

class RadioGroup extends React.Component {
  state = {
    checked: '',
  }
  render() {
    return (
      <div role="radiogroup">
        <Stack size={StackSize.XSmall}>
          <Toggle
            label="Daily"
            name="email-frequency"
            isDisabled
            isSelected={this.state.checked === 'daily'}
            labelColor={this.state.checked === 'daily' ? ToggleLabelColor.red : undefined} // fall back to default
            type={ToggleType.radio}
            onChange={() => this.setState({ checked: 'daily' })}
          />
        </Stack>
        <Stack size={StackSize.XSmall}>
          <Toggle
            label="Weekly"
            name="email-frequency"
            isSelected={this.state.checked === 'weekly'}
            labelColor={this.state.checked === 'weekly' ? ToggleLabelColor.red : undefined}
            type={ToggleType.radio}
            onChange={() => this.setState({ checked: 'weekly' })}
          />
        </Stack>
        <Stack size={StackSize.XSmall}>
          <Toggle
            label="Hourly"
            name="email-frequency"
            isSelected={this.state.checked === 'hourly'}
            labelColor={this.state.checked === 'hourly' ? ToggleLabelColor.red : undefined}
            type={ToggleType.radio}
            onChange={() => this.setState({ checked: 'hourly' })}
          />
        </Stack>
        <Toggle
          label="No Emails"
          name="email-frequency"
          isSelected={this.state.checked === 'none'}
          labelColor={this.state.checked === 'none' ? ToggleLabelColor.red : undefined}
          type={ToggleType.radio}
          onChange={() => this.setState({ checked: 'none' })}
        />
      </div>
    )
  }
}
```
### Usage tips

-   When creating a custom label, prefer providing `renderLabel` method over using `isLabelHidden` and implementing a label separately. No access to accessibility id (passed as `htmlFor`) with the latter method.
-   Use the correct `type` for the given use case. See the first section for details on when to use what.
-   For radio groups, always provide a default value.
-   For circle types, any text passed to `label` will show inside the circle.  Icons are not currently supported. `isLabelHidden` defaults to True meaning no label will be shown outside of the circle.

## Resources

Some articles on check boxes and radio groups that were useful:

<https://www.nngroup.com/articles/checkboxes-vs-radio-buttons/>
<https://uxplanet.org/radio-buttons-ux-design-588e5c0a50dc>
<https://www.w3.org/TR/wai-aria/states_and_properties#aria-checked>
<http://danieldelaney.net/checkboxes/>
<https://inclusive-components.design/toggle-button/>