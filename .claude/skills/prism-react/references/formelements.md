# FormElements

Provides common form based components for use in wrapping custom forms and content in your projects.
## `Form`

Prism Web component for a `form` element. `form` represents a document section containing interactive controls for submitting information.

### API

`Form` will accept any valid attributes for an HTML `form` element and pass them through to the rendered element. You can reference [MDN's `form` element documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) for more information.

### Usage

#### Form - example with `Toggle`
```typescript
import { Fieldset, Form, Toggle } from '@doordash/prism-react'

...

const [milkType, setMilkType] = React.useState('dairy-milk')

return (
  <Form id="my-unique-form-id" method="post">
    <Fieldset title="Milk type selection">
      <StackChildren>
        <Toggle
          label="Dairy milk (default)"
          name="milk-type"
          type={ToggleType.radio}
          isSelected={milkType === 'dairy-milk'}
          onChange={() => setMilkType('dairy-milk')}
        />
        <Toggle
          label="Oat Milk"
          name="milk-type"
          type={ToggleType.radio}
          isSelected={milkType === 'oat-milk'}
          onChange={() => setMilkType('oat-milk')}
        />
        <Toggle
          label="Almond Milk"
          name="milk-type"
          type={ToggleType.radio}
          isSelected={milkType === 'almond-milk'}
          onChange={() => setMilkType('almond-milk')}
        />
        <Toggle
          label="Soy Milk"
          name="milk-type"
          type={ToggleType.radio}
          isSelected={milkType === 'soy-milk'}
          onChange={() => setMilkType('soy-milk')}
        />
      </StackChildren>
    </Fieldset>
  </Form>
)
```
#### Usage tips
* Use this as a top-level form wrapper

## `Fieldset`
Prism Web component for a `fieldset` element. `<Fieldset>` is used to group related form inputs within a form. Use this component to wrap around `<Form>` input groups.

### API
Prop | PropType | Default | Notes
---- | -------- | ------- | -----
`children` | `ReactNode.isRequired` | `undefined` | Content to render as children of the `fieldset`
`title` | `string.isRequired` | `` | This required  prop renders as the `legend` element (via this package's `Legend` component), which will be announced in screen readers
`disabled` | `boolean` | `false` | disables the inputs within the fieldset
`form` | `string` | `undefined` | the id of the parent form element's id
`name` | `string` | `undefined` | the name associated with this group

### Usage

#### Fieldset - Use `Form` and with `TextField` components
```typescript
import { Fieldset, Form, TextField, Toggle } from '@doordash/prism-react'

...

const [specialOffers, setSpecialOffers] = React.useState(true)
const [accountDetails, setAccountDetails] = React.useState(true)

...

<Form id="my-unique-form-id">
  <Fieldset title="Account Info" form="my-unique-form-id">
    <TextField label="First Name" name="firstName" value={currentValue} onChange={changeHandler} />
    <TextField label="Last Name" name="lastName" value={currentValue} onChange={changeHandler} />
  </Fieldset>
  <Fieldset title="Notification Preferences" form="my-unique-form-id">
    <Toggle
      label="I would like to receive special offer notifications"
      isSelected={specialOffers}
      onChange={() => setSpecialOffers(!specialOffers)}
    />
    <Toggle
      label="I would like to be notified about changes to my account details"
      isSelected={accountDetails}
      onChange={() => setAccountDetails(!accountDetails)}
    />
  </Fieldset>
</Form>
```
#### Usage tips
* Wrap this around form field groups
* If you are setting the `disabled` prop on `fieldset`, be sure to also pass that value through to Prism Web Field and Toggle components to ensure children are also have visual disabled styling applied.