# `NavBar`
A component for managing navigation and page level context/actions—can be used for full-pages, modals, popovers, etc.

## Exported Constants

* `NavBarNavigationAlignment`
* `NavBarNavigationType`
* `NavBarTextAlignment`
* `NavBarTitleSize`

## API

### `navigationType`
| | |
|-----------|------------|
| Type | `**NavBarNavigationType**` |
| Default | `NavBarNavigationType.back` |
| Description | One of `Back`, `Close`, `Menu`, `None`. Determines what happens when you tap the navigation action on the left. |

### `navigationAlignment`
| | |
|-----------|------------|
| Type | `**NavBarNavigationAlignment**` |
| Default | `NavBarNavigationAlignment.leading` |
| Description | One of `Leading`, `Trailing`. Determines where the navigation element is rendered. |

### `onNavigationClick`
| | |
|-----------|------------|
| Type | `function (no parameters)` |
| Default | `undefined` |
| Description | Required when the navigationType is not `None`. Called when navigation action is clicked. |

### `hasBackButton`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Renders a back button on the Leading edge of the NavBar. NOTE: if you are using `navigationAlignment` in tandem with this, the nav item will always be rendered on the trailing edge, and the back button on the leading. |

### `onBackButtonClick`
| | |
|-----------|------------|
| Type | `function (no parameters)` |
| Default | `undefined` |
| Description | Called when the back button is clicked. |

### `onOverflowClick`
| | |
|-----------|------------|
| Type | `(actions: NavBarActionProps[], event: MouseEvent) => void` |
| Default | `undefined` |
| Description | Required when actions are truncated based on number or size. You should display additional actions in either a Popover or a BottomSheet. |

### `textAlign`
| | |
|-----------|------------|
| Type | `**NavBarTextAlignment**` |
| Default | `left` |
| Description | One of `left` or `center`. Aligns the `title`, `subtext`, and `parentTitle` accordingly. |

### `title`
| | |
|-----------|------------|
| Type | `string \| React.ReactElement` |
| Default | `undefined` |
| Description | Either a string (preferred) or a Node. If you pass a node, you can have custom content in the title slot. |

### `subtext`
| | |
|-----------|------------|
| Type | `string \| React.ReactElement` |
| Default | `undefined` |
| Description | Either a string (preferred) or a Node. If you pass a node, you can have custom content in the subtext slot. |

### `parentTitle`
| | |
|-----------|------------|
| Type | `string \| React.ReactElement` |
| Default | `undefined` |
| Description | Either a string (preferred) or a Node. If you pass a node, you can have custom content in the parentTitle slot. |

### `media`
| | |
|-----------|------------|
| Type | `{ src: string, alt: string } \| React.ReactElement` |
| Default | `undefined` |
| Description | Media that can be rendered above the title, with action buttons on top of it. |

### `titleSize`
| | |
|-----------|------------|
| Type | `**NavBarTitleSize**` |
| Default | `NavBarTitleSize.small` |
| Description | One of `Small`, `Medium`, `Large`. The size and style of the `title`, `subtext` and `parentTitle` that is provided. `Medium` and `Large` are displayed below the action bar, `Small` is displayed within. |

### `shouldRenderTitleOnNewLine`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Renders the title element on a new line, while still respecting `titleSize`. |

### `strings`
| | |
|-----------|------------|
| Type | `{ navigationButtonLabel?: string, backButtonLabel?: string }` |
| Default | `undefined` |
| Description | Object of provided strings so that the NavBar can have customized accessibilityLabels. |

### `actions`
| | |
|-----------|------------|
| Type | `NavBarActionProps[]` |
| Default | `undefined` |
| Description | Array of objects that should be treated as props to create `IconButton` instances. Can be truncated based on `maxNumberOfVisibleActions` or screen size. |

### `maxNumberOfVisibleActions`
| | |
|-----------|------------|
| Type | `number` |
| Default | `2` |
| Description | Determines the maximum number of visible actions to show before triggering an overflow menu. |

### `isSeparatorVisible`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | An override that forces whether the separator is visible or not. Only relevant when `titleSize` is `Small`. |

### `isRaised`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | If used as an elevated surface, `isRaised` provides a box-shadow. |

### `allowTitleWrapping`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | If true, title can wrap to multile lines when content is larger than container. |

### `allowSubtextWrapping`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | If true, subtext can wrap to multile lines when content is larger than container. |

## Usage

### NavBar - default state
```typescript
import { NavBar, NavBarNavigationType, NavBarTitleSize, IconButtonIconType } from '@doordash/prism-react'

<NavBar
  title="Orders"
  navigationType={NavBarNavigationType.back}
  titleSize={NavBarTitleSize.medium}
  subtext="Your previous orders"
  actions={[{ iconType: IconButtonIconType.Search, onClick: () => DoSearch() }]}
  onOverflowClick={overflowActions =>
    alert(JSON.stringify(overflowActions))
  }
/>
```
### Usage tips
* For custom, highly visible navigation bars, you might need to create your own custom version.