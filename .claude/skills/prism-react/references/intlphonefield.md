# `IntlPhoneField`

Accepts user input for all phone numbers in the world, and renders them.

If a form wishes to restrict certain phone numbers by country due to any
externally enforced limitations, we recommended enforcing that logic at the form level
when the user attempts to submit an unsupported country number.

[Countries that are blocked](https://github.com/doordash/tf_signal_sciences/blob/master/sites/production/sigsci_site_list.blocked_login_countries.tf) by app-sec team are ineligible for selection

**Note**: This component must be rendered as a child of `LayerManager` since the country helper component uses `Menu`

## API

### `IntlPhoneField` Props

### `value` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | The phone number to be populated. Can be an empty string if unknown. |

### `label` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | The name of the field; required for accessibility reasons. |

### `locale` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `en-US` |
| Description | Locale of the component. Used for localizing country names in CountryHelper. |

### `onChange`
| | |
|-----------|------------|
| Type | `(phoneNumberInfo: PhoneNumber, e?: ChangeEvent<HTMLInputElement>) => void` |
| Default | `null` |
| Description | Callback for when the component's value is changed. `PhoneNumber` object documented in the PhoneNumber Interface section below. |

### `initCurrentCountry`
| | |
|-----------|------------|
| Type | `CountryCode[]` |
| Default | `undefined` |
| Description | Country to be preselected for the dial code. Populate to the user region. |

### `errors`
| | |
|-----------|------------|
| Type | `IntlPhoneFieldError[]` |
| Default | `undefined` |
| Description | Optional. If populated, renders a red border around the field and/or country selector. |

### `isInitFocused`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Optional. Whether the input will be focused when first rendered. |

### `preferredCountryCodes`
| | |
|-----------|------------|
| Type | `CountryCode[]` |
| Default | `['US', 'CA', 'AU', 'JP', 'DE', 'NZ]` |
| Description | In the country select helper, countries that are shown at the top. |

### `maxCountriesDisplayed`
| | |
|-----------|------------|
| Type | `number` |
| Default | `5` |
| Description | Max number of countries shown in the country helper dropdown at any time. |

### `onCountryCodeHelperToggle`
| | |
|-----------|------------|
| Type | `(boolean) => void` |
| Default | `undefined` |
| Description | Optional. Invoked when the visibility of the country helper changes. |

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

### `onKeyUp`
| | |
|-----------|------------|
| Type | `function` |
| Default | `null` |
| Description | Callback for when the component keys up, even if a value has not changed. |

### `onKeyDown`
| | |
|-----------|------------|
| Type | `function` |
| Default | `null` |
| Description | Callback for when the component keys down, even if a value has not changed. |

### `onClick`
| | |
|-----------|------------|
| Type | `function` |
| Default | `null` |
| Description | Callback for when the component is clicked. |

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

### `isResizeable`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | By default true, but allows you to prevent resizing if set to false. |

### `isRounded`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | By default false, allows you to have a rounded field container. |

### `isMultiline`
| | |
|-----------|------------|
| Type | `boolean or integer` |
| Default | `false` |
| Description | If boolean, turns field into 2 line textarea; number specifies how many minimum lines. |

### `description`
| | |
|-----------|------------|
| Type | `string or node` |
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

### `autoComplete`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | Hint that indicates to browser how to autofill this input <https://developers.google.com/web/updates/2015/06/checkout-faster-with-autofill>. |

### `readOnly`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Should the input have a [readonly](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly) attribute? |

### `id`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | String that will be set as the rendered `input` element's `id` attribute. Field components will automatically generate a unique id if prop is not provided. |

### `renderBeforeContent`
| | |
|-----------|------------|
| Type | `func` |
| Default | `null` |
| Description | Render function to allow rendering inside input, on the left. |

### `renderAfterContent`
| | |
|-----------|------------|
| Type | `func` |
| Default | `null` |
| Description | Render function to allow rendering inside input, on the right. |

### `renderConnectedBefore`
| | |
|-----------|------------|
| Type | `func` |
| Default | `null` |
| Description | Render function to allow rendering on the left outside of the input. |

### `renderConnectedAfter`
| | |
|-----------|------------|
| Type | `func` |
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
| Type | `**IntlPhoneFieldSize**` |
| Default | `IntlPhoneFieldSize.medium` |
| Description | Determines the size and font-size of the input. |

### `inputMode`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Hints at the type of data that might be entered by the user while editing the element or its contents https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute. |

### `forceOnChange`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | In some rare situations, you may find that a browser's autofill feature changes a DOM input, but does not fire React's onChange. Use this prop to try to assist with this issue. |

### `constrainContentHeightToBoundary`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Will constrain the country code menu to the available remaining vertical height of the boundaryElement. |

### `countryCodeAccessibilityLabel`
| | |
|-----------|------------|
| Type | `string` |
| Default | `Country Code` |
| Description | Used as a label for the Country Code dropdown. |

### `countryCodeSearchFieldAccessibilityLabel`
| | |
|-----------|------------|
| Type | `string` |
| Default | `Search Country Codes` |
| Description | Used as a label for the Country Code dropdown search input. |

### `filterCountryCodes`
| | |
|-----------|------------|
| Type | `func` |
| Default | `null` |
| Description | Used to filter the supported Country Codes. |
```typescript
type IntlPhoneFieldError = {
  type: 'number' | 'countrySelector'
  message: string
  id?: string
}
```
### PhoneNumber Interface

The first argument of the `onChange` callback is a `PhoneNumber` object which
has the following properties:

#### `number`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | The E.164 standard formatted international phone number. |

#### `countryCode`
| | |
|-----------|------------|
| Type | `Exclude<(typeof AllCountryCodes)[number], (typeof BlockedCountryCodes)[number]>` |
| Default | `undefined` |
| Description | The country code of the country based on the international dial code. |

#### `isPossible`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Whether the number is of possible length for the given area. |

#### `isValid`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Whether the number is valid given regexes in `libphonenumber-js`. |

#### `invalidReason`
| | |
|-----------|------------|
| Type | `'INVALID_COUNTRY' \| 'NOT_A_NUMBER' \| 'TOO_SHORT' \| 'TOO_LONG' \| 'INVALID_LENGTH' \| 'UNSPECIFIED'` |
| Default | `undefined` |
| Description | Why the number is invalid. |

#### `type`
| | |
|-----------|------------|
| Type | `undefined \| 'PREMIUM_RATE' \| 'TOLL_FREE' \| 'SHARED_COST' \| 'VOIP' \| 'PERSONAL_NUMBER' \| 'PAGER' \| 'UAN' \| 'VOICEMAIL' \| 'FIXED_LINE_OR_MOBILE' \| 'FIXED_LINE' \| 'MOBILE'` |
| Default | `undefined` |
| Description | Type of number derived by regex, in `libphonenumber-js`. |

#### `countryCallingCode`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Just the international dialing code of a given phone number. |

#### `ext`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Extension of the given phone number, if any. |

#### `nationalNumber`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | The given phone number, formatted for the national region. In some markets, users may be more familiar with this format. |

#### `carrierCode`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | The code of the carrier for a phone number. |

## Usage

### Known User

To greatly enhance the UX, pass in the user's locale and country to the component.
Note that `initCurrentCountry` doesn't do anything if the country can be
derived on the passed in value.
```typescript
import { IntlPhoneField } from '@doordash/prism-react'

const MyComponent = (user: User) => {
  // Store the form state in state, or use other form libs
  const [number, setNumber] = useState<string>(user.phoneNumber)

  // Respond to updates from the input
  const handlePhoneFieldChange = useCallback((phoneNumInfo: PhoneNumber) => {
    setNumber(phoneNumInfo.number)
  }, [])

  return (
    <IntlPhoneField>
      value={number}
      onChange={handlePhoneFieldChange}
      initCurrentCountry={user.country}
      locale={user.locale}
    />
  )
}
```
### Unknown User

When the user info, including the phone number is unknown, render the field
with an empty string. Derive the country and locale in other ways. The **country**
is **especially important** as it may save them from needing to interact with
the country helper at all.
```typescript
import { IntlPhoneField } from '@doordash/prism-react'

const MyComponent = () => {
  const countryCode = useCountryCode()
  const locale = useLocale()

  // Store the form state in state, or use other form libs
  const [number, setNumber] = useState<string>('')

  // Respond to updates from the input
  const handlePhoneFieldChange = useCallback((phoneNumInfo: PhoneNumber) => {
    setNumber(phoneNumInfo.number)
  }, [])

  return (
    <IntlPhoneField>
      value={number}
      onChange={handlePhoneFieldChange}
      initCurrentCountry={countryCode}
      locale={locale}
    />
  )
}
```
### Handling errors

The `onChange` cb includes a `PhoneNumber` object as the first argument which
has properties `isPossible`, `isValid`, and `invalidReason`. Use a combination
of these to display a helpful message to the user, so they can fix their input.

You may add additional logic to your form, to only show these validation
errors when the form is submitted, or when the input has been touched.
```typescript
import { IntlPhoneField } from '@doordash/prism-react'

const invalidReasonToErrorMap = {
  'TOO_SHORT': i18n('The phone number provided is too short.'),
  'UNSPECIFIED': i18n("This number doesn't seem to be valid."),
  ...
}

const MyComponent = () => {
  // Store the form state in state, or use other form libs
  const [number, setNumber] = useState<string>('')
  const [error, setError] = useState<string>('')

  // Respond to updates from the input
  const handlePhoneFieldChange = useCallback((phoneNumInfo: PhoneNumber) => {
    setNumber(phoneNumInfo.number)

    if (!phoneNumInfo.isValid) {
      setError(invalidReasonToErrorMap[phoneNumInfo.invalidReason])
    } else {
      setError('')
    }
  }, [])

  return (
    <IntlPhoneField>
      value={number}
      onChange={handlePhoneFieldChange}
      initCurrentCountry={countryCode}
      locale={locale}
      error={error}
    />
  )
}
```