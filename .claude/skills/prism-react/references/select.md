# `Select`

Select an option from a list. Select a number of options from a list.

This component is a wrapper on react-select.

## Exported Constants
* `SelectSize`
* `SelectMultiValueStyle`

## API

| Prop | PropType | Default | Notes |
| ------------------------------ | --------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `isDisabled` | `boolean` | `false` | Should this component allow editing? |
| `onChange` `required` | `(value: V, e: React.ChangeEvent<T>) => void`<br>*`V` = `string \| string[]`, `T` = `HTMLSelectElement`* | `null` | Callback for when the component's value is changed |
| `value` `required` | `Option OR Option[] OR string OR string[]` | `null` | The value of the component, rendered in the input; can take a simple value or a complete option |
| `label` `required` | `string` | `null` | The name of the field; required for accessibility reasons |
| `isLabelHidden` | `boolean` | `false` | Since label is required, you can hide the label with this |
| `isRequired` | `boolean` | `false` | Passed down to the input to get native required error state |
| `isRounded` | `boolean` | `false` | By default false, allows you to have a rounded field container |
| `isMultiple` | `boolean` | `false` | Set `true` to allow multiple selection; if true, `value` must be an array. |
| `multiSelectedValueStyle` | `**SelectMultiValueStyle**` | `SelectMultiValueStyle.compact` | Determines rendering of selected values when `isMultiple`. |
| `isSearchable` | `boolean` | `false` | Allow filtering of options by typing |
| `isClearable` | `boolean` | `false` | Allow clearing of select value |
| `error` | `string OR boolean` | `null` | Error message rendered below the field; if given as a boolean, will cause the field to be highlighted as having an error. |
| `warning` | `string` | `null` | Warning message rendered below the field; if `error` prop is given, warning message will not be presented. |
| `description` | `string OR ReactNode` | `null` | Secondary message rendered after the label; describes constraints and additional information |
| `hint` | `string OR ReactNode` | `null` | Tertiary message rendered below the field input; a way to provide additional help for user about what content should be in the input |
| `isSelectedItemRemovalEnabled` | `boolean` | `false` | Allow items to be removed from selected values by clicking on values or using backspace key. |
| `accessibilityDescribedBy` | `string` | `undefined` | A DOM ID that references an element (like a tooltip) that describes this field. |
| `placeholder` | `string` | `null` | Message to display within the input before any value is set |
| `title` | `string` | `null` | Message to display when hovering over the input |
| `name` | `string` | `null` | Provided as the input's [name](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attributes) attribute |
| `id` | `string` | `undefined` | String that will be set as the rendered `react-select` element's `id` attribute. Field components will automatically generate a unique id if prop is not provided. |
| `renderBeforeContent` | `JSX.Element OR string` | `null` | Render function to allow rendering inside input, on the left |
| `renderAfterContent` | `JSX.Element OR string` | `null` | Render function to allow rendering inside input, on the right |
| `leadingIcon` | `**FieldIconType**` | `undefined` | Icon rendered at the leading (left) edge inside the input; takes precedence over `renderBeforeContent` when both are provided |
| `renderConnectedBefore` | `JSX.Element OR string` | `null` | Render function to allow rendering on the left outside of the input |
| `renderConnectedAfter` | `JSX.Element OR string` | `null` | Render function to allow rendering on the right outside of the input |
| `hasConnectedContentAbove` | `boolean` | `undefined` | If true, the field will render with zeroed out border radii on its top edge. |
| `hasConnectedContentBelow` | `boolean` | `undefined` | If true, the field will render with zeroed out border radii on its bottom edge. |
| `size` | `**SelectSize**` | `SelectSize.Medium` | Determines the size and font-size of the input. |
| `options` `required` | `{ label: string, value: string, isDisabled?: boolean, data?: any }[]` | `[]` | Array of options to show in the dropdown |
| `renderOption` | `function (returns value)` | `null` | Custom render function for options in list |
| `renderSelectedValue` | `function (returns value)` | `null` | Custom render function for selected value, if any |
| `formatOptionLabel` | `(option: any, context: { context: "menu" OR "value" }) => ReactNode` | `undefined` | Custom function for generating a label in a dropdown option. If defined, this function will be passed to [React Select](https://react-select.com/advanced#custom-option-component) as the `formatOptionLabel` prop |
| `inputMode` | `InputElementType['inputMode']` | `undefined` | Hints at the type of data that might be entered by the user while editing the element or its contents https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute |
| `interfaceRef` | `React.RefObject` | `null` | Provides access to underlying `DOM` methods (i.e. `focus`) via `ref` |

## Usage

### Select - default use
```typescript
import { Select } from '@doordash/prism-react'
…
<Select
  value="1"
  onChange={value => this.setState({ value })}
  label="Doordash Preference"
  options={[
    { label: 'One', value: '1' },
    { label: 'Two', value: '2' },
    { label: 'Three', value: '3' },
  ]}
/>
…
```
### Select - select multiple
```typescript
import { Select } from '@doordash/prism-react'
…
<Select
  value={['1', '2']}
  isMultiple
  onChange={value => this.setState({ value })}
  label="Doordash Preferences"
  options={[
    { label: 'One', value: '1' },
    { label: 'Two', value: '2' },
    { label: 'Three', value: '3' },
  ]}
/>
…
```
## Usage tips

-   Use simple values for options (string, numbers) if you don't need more complex data. The onChange will be called with the simple value when selected.
-   Use renderOption and renderSelectedValue for customizing the display