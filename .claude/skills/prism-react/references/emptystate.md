## Import
```typescript
import {
 EmptyState,
EmptyStateMediaSize
} from "@doordash/prism-react"
```
## API
### `title`

| | |
| --- | --- |
| Type | `string` |
| Default | `undefined` |
| Description | The title text displayed in the empty state. If not provided, the title element will be omitted. |

---

### `titleAs`

| | |
| --- | --- |
| Type | `ElementType` |
| Default | `'p'` |
| Description | The HTML element or React component used to render the title. Useful for customizing semantic heading levels (e.g., `'h1'`, `'h2'`, etc.). |

---

### `description`

| | |
| --- | --- |
| Type | `string` |
| Default | `undefined` |
| Description | The description text displayed below the title. This is a required field. |

---

### `descriptionAs`

| | |
| --- | --- |
| Type | `ElementType` |
| Default | `'p'` |
| Description | The HTML element or React component used to render the description. Useful for customizing semantic structure (e.g., `'p'`, `'span'`, etc.). |

---

### `primaryActionText`

| | |
| --- | --- |
| Type | `string` |
| Default | `undefined` |
| Description | The text to display on the primary action button. If not provided, the button will not be rendered. |

---

### `primaryActionProps`

| | |
| --- | --- |
| Type | `object (omits certain properties)` |
| Default | `undefined` |
| Description | Props to pass to the primary action button, excluding the `children` prop. Useful for customizing button behavior (e.g., `onClick`, `disabled`, etc.). |

---

### `media`

| | |
| --- | --- |
| Type | `**EmptyStateMedia**` |
| Default | `undefined` |
| Description | Media element (e.g., image, icon, illustration) to display in the empty state. You can pass a URL string or a React Element. |

---

### `mediaSize`

| | |
| --- | --- |
| Type | `**EmptyStateMediaSize**` |
| Default | `EmptyStateMediaSize.medium` |
| Description | Size of the media element. Determines the visual scale of the media. |

---

### `customMediaMarginBottom`

| | |
| --- | --- |
| Type | `number` |
| Default | `undefined` |
| Description | Custom bottom margin for the media element, in pixels. Allows precise control over spacing between media and content. |

---

## Usage

### EmptyState - default state
```typescript
import { EmptyState } from '@doordash/prism-react'

<EmptyState description="Nothing to See Here!" />
```
### EmptyState - with title and action
```typescript
import { EmptyState } from '@doordash/prism-react'

<EmptyState
  title="No Items Found"
  description="We couldn't find any items matching your search criteria."
  primaryActionText="Clear Search"
  primaryActionProps={{
    onClick: () => console.log('Clear search')
  }}
/>
```