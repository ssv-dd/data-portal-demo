# `ErrorMessage`

Displays validation errors. Used by all Field classes, but can be used standalone for custom components.

## API

| Prop | PropType | Default | Notes |
| -------------------------- | ------------------------- | ----------------------- | ------------------------------------------------ |
| `message` | `string` | `null` | Required text to display as the message |
| `id` | `string` | `null` | DOM id for linking with `aria-describedby` |

## Usage

### ErrorMessage - default use
```typescript
import { ErrorMessage } from '@doordash/prism-react'

<ErrorMessage
  message="Credit card has expired."
/>
```
### ErrorMessage - linked field use

This is what's done on fields, to connect the a11y.
```typescript
import { ErrorMessage, TextField } from '@doordash/prism-react'

<TextField
  label="Name on card"
  accessibilityDescribedBy="name-field-error"
  value={this.state.value}
  onChange={value => this.setState({ value })}
  error="Please provide a name for the credit card."
/>
<ErrorMessage
  id="name-field-error"
  message="Please provide a name for the credit card."
/>
```