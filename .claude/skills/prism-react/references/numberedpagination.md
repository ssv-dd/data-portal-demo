# `NumberedPagination`

A component for controlling the display of multiple pages, showing page numbers

## API

### `numPages`
| | |
|-----------|------------|
| Type | `number` |
| Default | `undefined` |
| Description | The maximum number of pages for this control. |

### `currentPage`
| | |
|-----------|------------|
| Type | `number` |
| Default | `undefined` |
| Description | The current page number, in the range [1, numPages]. |

### `pagesAroundCurrent`
| | |
|-----------|------------|
| Type | `number` |
| Default | `3` |
| Description | The number of pages to show around current page. |

### `pagesBeforeTruncate`
| | |
|-----------|------------|
| Type | `number` |
| Default | `10` |
| Description | The maximum number of pages to show before truncating using ellipsis. |

### `changePage`
| | |
|-----------|------------|
| Type | `(page: number) => void` |
| Default | `undefined` |
| Description | A callback that will be called to update the current page number. Receives a number that the page will change to, in the range [1, numPages]. |

### `accessibilityLabel`
| | |
|-----------|------------|
| Type | `string` |
| Default | `pagination` |
| Description | Set an `aria-label` on your NumberedPagination control for screen reader accessibility. |

### `contentAccessibilityLabels`
| | |
|-----------|------------|
| Type | `NumberedPaginationContentAccessibilityLabelProps` |
| Default | `shape({next: 'go to next page', previous: 'go to previous page', currentPage: (pageNum: number) => 'you are currently on page ${pageNum}', goToPage: (pageNum: number) => go to page ${pageNum}})` |
| Description | Set relevant `aria-label`s on the actionable components of your NumberedPagination control for screen reader accessibility.<br/>`next`: aria-label that will be applied to the "next" button<br/>`previous`: aria-label that will be applied to the "previous" button<br/>`currentPage`: function that returns the aria-label that will be applied to the current page button<br/>`goToPage`: function that returns the aria-label that will be applied to a non-current page button |

### `pageProps`
| | |
|-----------|------------|
| Type | `Array<{ tag?: string or Element; tagProps?: Object }>` |
| Default | `undefined` |
| Description | An array of objects that can be used to customize the tag and tagProps of each page button. The index in the array will be applied to each page in order. |

## Usage

### NumberedPagination - basic usage
```typescript
import { NumberedPagination } from '@doordash/prism-react'

<NumberedPagination
  numPages={numPages}
  currentPage={currentPage}
  changePage={onChangePage}
  pagesAroundCurrent={pagesAroundCurrent}
  pagesBeforeTruncate={pagesBeforeTruncate}
/>
```