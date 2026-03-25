# `Breadcrumbs`

## Exported Constants
* `BreadcrumbSize`

## API
Prop | Type | Default | Notes
-------------------------------- | ------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------
`items` `required` | `Array<BreadcrumbItem>` | `null` | The breadcrumb items to render
`includesCurrentPage` | `boolean` | `false` | Renders the last item in the `items` array, as a muted, non-interactable element
`size` | `BreadcrumbsSize` | `BreadcrumbsSize.Medium` | The size of the breadcrumb component
`tag` | `BreadcrumbHTMLTag` | `a` if `href` present, `undefined` otherwise | The HTML tag used to generate the interactive elements
`showParentOnly` | `boolean` | `false` | Renders only the parent item, and a back button
`isCollapsed` | `boolean` | `false` | Renders only the first and last item, with an ellipsis button in the middle.
`expandButtonAccessibilityLabel` | `string` | `Expand all breadcrumb items` | The aria-label applied to the expand button used in the isCollapsed variant
`backButtonAccessibilityLabel` | `(itemTitle: string) => string` | `itemTitle => 'Go back to' + itemTitle` | A method that returns the aria-label to apply to the back button used in the showParentOnly variant
```typescript
type BreadcrumbItem = {
    title: string
    tag?: string | React.ReactNode
    href?: string
    onClick?: (item: BreadcrumbItem) => void
}
```
## Usage

### Breadcrumbs - default state
```tsx
import { Breadcrumbs } from '@doordash/prism-react'

const items = [
    {
        title: 'item 1',
        url: 'https://www.doordash.com'
    },
    {
        title: 'item 2',
        onClick: (item) => window.alert(item)
    }
]

<Breadcrumbs items={items} />
```
### Breadcrumbs - includesCurrentPage

Renders the last item in the array as in a muted style. Additionally the last item will not be interactable.
```tsx
import { Breadcrumbs } from '@doordash/prism-react'

const items = [
    {
        title: 'item 1',
        url: 'https://www.doordash.com'
    },
    {
        title: 'item 2',
        onClick: (item) => window.alert(item)
    },
    {
        title: 'current page'
    }
]

<Breadcrumbs items={items} includesCurrentPage />
```
### Breadcrumbs - size

You can change the size of the breadcrumbs, the options are Small, Medium, and Large
```tsx
import { Breadcrumbs, BreadcrumbsSize } from '@doordash/prism-react'

const items = [
    {
        title: 'item 1',
        url: 'https://www.doordash.com'
    },
    {
        title: 'item 2',
        onClick: (item) => window.alert(item)
    }
]

<Breadcrumbs items={items} size={BreadcrumbsSize.Large} />
```
### Breadcrumbs - showParentOnly

Renders only the parent item, and a back button.
```tsx
import { Breadcrumbs } from '@doordash/prism-react'

const items = [
    {
        title: 'item 1',
        url: 'https://www.doordash.com'
    },
    {
        title: 'item 2',
        onClick: (item) => window.alert(item)
    },
    {
        title: 'parent item'
    }
]

<Breadcrumbs items={items} showParentOnly />
```
### Breadcrumbs - isCollapsed

Renders only the first and last item, with an ellipsis button in the middle. When the ellipsis buton is clicked, all items become visible
```tsx
import { Breadcrumbs } from '@doordash/prism-react'

const items = [
    {
        title: 'item 1',
    },
    {
        title: 'item 2',
    },
    {
        title: 'item 3'
    }
]

<Breadcrumbs items={items} isCollapsed />
```