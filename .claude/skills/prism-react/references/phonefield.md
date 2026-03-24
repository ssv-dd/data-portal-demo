# `PhoneField`

**NOTICE**: There is now an improved and simplified, international-first
phone field component `IntlPhoneField`, to better support international phone input
requirements. We recommend using `IntlPhoneField` in your projects.

Take in phone numbers, renders them in the input with formatting.

In international mode (`isInternationalEnabled=true`), renders a dropdown to select a country/dial code. Supports all countries/dial codes specified [here](https://datahub.io/JohnSnowLabs/iso-3166-country-codes-itu-dialing-codes-iso-4217-currency-codes). Renders a small subset of country codes as options unless other country shortnames are provided in `availableCountries` parameter.

## Exported Constants
* `PhoneFieldSize`

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
| Type | `function` |
| Default | `null` |
| Description | Callback for when the component is focused on. |

### `onBlur`
| | |
|-----------|------------|
| Type | `function` |
| Default | `null` |
| Description | Callback for when the component is blurred out of. |

### `onChange` `required`
| | |
|-----------|------------|
| Type | `(value: V, formattedValue: string \| PhoneFieldFormattedValueType, e: React.ChangeEvent<T>) => void`<br>*`V` = `string`, `T` = `HTMLInputElement`* |
| Default | `null` |
| Description | Callback for when the component's value is changed; called with unformatted number as first argument and formatted as second. |

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
| Type | `string` |
| Default | `null` |
| Description | The value of the component, rendered in the input. |

### `label` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | The name of the field; required for accessibility reasons. |

### `countryLabel` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `Country` |
| Description | The name of the country field; only required for an internationally-enabled PhoneField for accessibility reasons. |

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
| Type | `string` |
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
| Type | `string \| node` |
| Default | `null` |
| Description | Secondary message rendered after the label; describes constraints and additional information. |

### `hint`
| | |
|-----------|------------|
| Type | `string \| node` |
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

### `autoComplete`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | Hint that indicates to browser how to autofill this input <https://developers.google.com/web/updates/2015/06/checkout-faster-with-autofill> |

### `readOnly`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Should the input have a [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly) attribute? |

### `name`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Provided as the input's [name](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attributes) attribute. |

### `id`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | String that will be set as the rendered `input` element's `id` attribute. Field components will automatically generate a unique id if prop is not provided. |

### `renderBeforeContent`
| | |
|-----------|------------|
| Type | `JSX.Element \| string` |
| Default | `null` |
| Description | Render function to allow rendering inside input, on the left. |

### `renderAfterContent`
| | |
|-----------|------------|
| Type | `JSX.Element \| string` |
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
| Type | `JSX.Element \| string` |
| Default | `null` |
| Description | Render function to allow rendering on the left outside of the input. |

### `renderConnectedAfter`
| | |
|-----------|------------|
| Type | `JSX.Element \| string` |
| Default | `null` |
| Description | Render function to allow rendering on the right outside of the input. |

### `hasConnectedContentAbove`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | If true, the field will render with zeroed out border radii on its top edge. |

### `hasConnectedContentBelow`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | If true, the field will render with zeroed out border radii on its bottom edge. |

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

### `size`
| | |
|-----------|------------|
| Type | `**PhoneFieldSize**` |
| Default | `PhoneFieldSize.Medium` |
| Description | Determines the size and font-size of the input. |

### `isInternationalEnabled`
| | |
|-----------|------------|
| Type | `bool` |
| Default | `false` |
| Description | Determines whether the field supports selecting a country and formatting for international numbers. |

### `autoDetectCountry`
| | |
|-----------|------------|
| Type | `bool` |
| Default | `false` |
| Description | Determines whether the field should auto-detect the country when a phone number with country code is pasted. This will only work when `isInternationalEnabled` is set to true. |

### `currentCountry`
| | |
|-----------|------------|
| Type | `Exclude<(typeof AllCountryCodes)[number], (typeof BlockedCountryCodes)[number]>` |
| Default | `undefined` |
| Description | Sets the current country. This should be treated as a controlled component. |

### `onCountryChange`
| | |
|-----------|------------|
| Type | `( country: PhoneFieldCountryCode, value: string, formattedValue: PhoneFieldFormattedValueType, event: ChangeEvent ) => void` |
| Default | `undefined` |
| Description | Called when country is changed, with country shortcode as first argument, and updated numbers after. |

### `availableCountries`
| | |
|-----------|------------|
| Type | `PhoneFieldCountryCode[]` |
| Default | `['US', 'CA', 'AU', 'JP', 'DE', 'NZ']` |
| Description | Determines which countries will show up in the selector when isInternationalEnabled is `true`. |

### `isCountryFullNameDisplayed`
| | |
|-----------|------------|
| Type | `bool` |
| Default | `false` |
| Description | Whether to display full names of countries in English beside the dial code. To localize, use `countryFullNameLabelOverrides`. |

### `countryFullNameLabelOverrides`
| | |
|-----------|------------|
| Type | `{[key in PhoneFieldCountryCode]?: string }` |
| Default | `undefined` |
| Description | Override labels with a mapping of CountryCode to translated name, especially for localization purposes. |

### `areCountriesLocaleSorted`
| | |
|-----------|------------|
| Type | `bool` |
| Default | `false` |
| Description | Whether country options are to be sorted by their localized values. Useful to sort country names after labels are overridden. |

### `preferredCountryCodes`
| | |
|-----------|------------|
| Type | `PhoneFieldCountryCode[]` |
| Default | `undefined` |
| Description | Determines which countries will show up at the top of the selector. Can only be used if `areCountriesLocaleSorted` is `true`. |

### `inputMode`
| | |
|-----------|------------|
| Type | `InputElementType['inputMode']` |
| Default | `undefined` |
| Description | Hints at the type of data that might be entered by the user while editing the element or its contents https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute |

### `interfaceRef`
| | |
|-----------|------------|
| Type | `React.RefObject` |
| Default | `null` |
| Description | Provides access to underlying `DOM` methods (i.e. `focus`) via `ref`. |

### `forceOnChange`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | In some rare situations, you may find that a browser's autofill feature changes a DOM input, but does not fire React's onChange. Use this prop to try to assist with this issue. |

### `isClearable`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Displays a "click to clear input" button in the input if input is present. |

### `onValueClear`
| | |
|-----------|------------|
| Type | `(event: MouseEvent) => void` |
| Default | `undefined` |
| Description | A callback function that is run when the clear input button is activated. |

### `clearButtonAccessibilityLabel`
| | |
|-----------|------------|
| Type | `string` |
| Default | `Clear input value` |
| Description | Accessible text label for the "click to clear" button. Utilized by assistive technologies. |

## Usage

### PhoneField - default use
```typescript
import { PhoneField } from '@doordash/prism-react'
…
<PhoneField
  value={this.state.phone}
  onChange={unformatted => this.setState({ phone: unformatted })}
  label="Phone Number"
/>
…
```
### PhoneField - international enabled use
```typescript
import { PhoneField } from '@doordash/prism-react'
…
<PhoneField
  isInternationalEnabled
  value={this.state.phone}
  currentCountry={this.state.country}
  onChange={(unformatted, formatted) => this.setState({ phone: unformatted })}
  onCountryChange={country => this.setState({ country: country })}
  label="Phone Number"
/>
…
```
## Usage tips

-   You can get the unformatted and formatted number as the first and second argument in `onChange`, and `event` as the third argument.
-   The value given to the field can be either formatted or unformatted.