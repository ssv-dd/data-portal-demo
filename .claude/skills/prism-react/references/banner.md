# `Banner`

A Banner temporarily displays pertinent information to a user that they can take action on.

[View NavigationBanner documentation](#navigationbanner)

## Exported Constants

- `BannerType`
- `BannerStyle`
- `BannerActionPosition`
- `BannerIconType`

## API

### `ariaLiveRole`
| | |
|-----------|------------|
| Type | `string` |
| Default | `status` |
| Description | Indicates the degree for which screen readers will conveyed changes to the banner: alert, log, marquee, status, timer |

### `label`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Label for the Banner. |

### `body`
| | |
|-----------|------------|
| Type | `string \| React.ReactElement` |
| Default | `undefined` |
| Description | Body description for the Banner. |

### `bannerType`
| | |
|-----------|------------|
| Type | `**BannerType**` |
| Default | `BannerType.Informational` |
| Description | Message type of the Banner. |

### `bannerStyle`
| | |
|-----------|------------|
| Type | `**BannerStyle**` |
| Default | `BannerStyle.Default` |
| Description | Specifies emphasis level of the Banner: Default, Emphasis, Subdued. |

### `iconType`
| | |
|-----------|------------|
| Type | `**BannerIconType**` |
| Default | `undefined` |
| Description | Icon Override. |

### `useDefaultIconColors`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | If `iconType` is specified, set to `true` to use the default icon colors (useful for logos). |

### `onClose`
| | |
|-----------|------------|
| Type | `function (no parameters)` |
| Default | `undefined` |
| Description | Renders close button and calls this function on click. |

### `primaryAction`
| | |
|-----------|------------|
| Type | `BannerActionProps` |
| Default | `undefined` |
| Description | Renders primary button and calls this function on click. |

### `secondaryAction`
| | |
|-----------|------------|
| Type | `BannerActionProps` |
| Default | `undefined` |
| Description | Renders secondary button and calls this function on click. |

### `isGlobal`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Set to `true` when Banner is being displayed at top page level |

### `closeButtonAccessibilityLabel`
| | |
|-----------|------------|
| Type | `string` |
| Default | `Close` |
| Description | Accessibility label for the close icon button |

### `iconAccessibilityLabel`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Override for the accessibility label for the icon |

### `actionPosition`
| | |
|-----------|------------|
| Type | `**BannerActionPosition**` |
| Default | `BannerActionPosition.Trailing` |
| Description | Placement of `primaryAction` and `secondaryAction` buttons in relation to the text content of the Banner. By default, actions will render on the trailing edge for > `Breakpoints.mobile` size screens and below the text content for <= `Breakpoints.mobile` size screens. Set to `BannerActionPosition.Bottom` to always render the CTAs below the text content of the `Banner`, regardless of screen size. **Note:** Actions will always render below the text content on <= `Breakpoints.mobile` size screens, regardless of this prop value, to optimize space for `Banner`s rendered on small screens. |

## Usage

### Banner - default state
```typescript
import { Banner } from '@doordash/prism-react'

<Banner label="Hello" />
```
### Banner - Positive Feedback
```typescript
import { Banner, BannerType } from '@doordash/prism-react'
;<Banner label="Thanks for submitting!" bannerType={BannerType.Positive} />
```
### Banner - Global notification
```typescript
import { Banner } from '@doordash/prism-react'
;<Banner label="Due for COVID-19 at-office deliveries are unavailable" isGlobal />
```
### Banner - Warning Info
```typescript
import { Banner, BannerType } from '@doordash/prism-react'
;<Banner label="Please select an option before proceeding." bannerType={BannerType.Warning} />
```
### Usage tips

- `secondaryAction` is only an available prop when also using `primaryAction`
- You cannot use `iconType` with `Negative` or `Warning` variants.
- You must use either a `label` or `body` prop
- You can use `BannerIconType.None` to hide the icon (although it should only be used in rare cases as the icon provides additional visual context outside of colors for accessibility concerns)

### Accessibility - Aria Live Roles

The following roles are [live regions](https://w3c.github.io/aria/#live_region_roles) and may be modified by [live region attributes](https://w3c.github.io/aria/#attrs_liveregions). Elements with the following `role` attribute act as live regions by default. The values of this attribute are expressed in degrees of importance and function.

| Role | Description | Usage | W3C Info |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| status | The role `status` has an implicit `aria-live` value of `polite`, and an implicit `aria-atomic` value of `true`, which allows the entire changed region as a whole to be presented. | Use when content is advisory information for the user but is not important enough to justify an alert. _**Note**: If another part of the page controls what appears in the status, authors SHOULD make the relationship explicit with the `aria-controls` attribute._ | [status](https://www.w3.org/TR/wai-aria-1.1/#status) |
| alert | The role `alert` has an implicit `aria-live` value of `assertive`, and an implicit `aria-atomic` value of `true`. | Use when messages are time-senesitive or important enough to require the user's immediate attention. A change to an assertive live region will interrupt any announcement a screen reader is currently making, therefore should be used sparingly. | [alert](https://www.w3.org/TR/wai-aria-1.1/#status) |
| log | The role `log` has an implicit `aria-live` value of `polite`. | Use when new information is added in a meaningful order and old information may disappear. Examples include chat logs, messaging history, or an error log. | [log](https://www.w3.org/TR/wai-aria-1.1/#log) |
| marquee | The role `marquee` has an implicit `aria-live` value of `off`. | Used where non-essential information changes frequently. Commonly used for stock tickers and ad banners. The primary difference between a `marquee` and a `log` is that logs usually have a meaningful order or sequence of important content changes. | [marquee](https://www.w3.org/TR/wai-aria-1.1/#marquee) |
| timer | The role `timer` has an implicit `aria-live` value of `off`. | A type of live region containing a numerical counter which indicates an amount of elapsed time from a start point, or the time remaining until an end point. A good use case for `timer` would be to convey the "time left to buy" some item on sale. | [timer](https://www.w3.org/TR/wai-aria-1.1/#timer) |

# `NavigationBanner`

A NavigationBanner is a clickable banner that provides navigation functionality, typically used to direct users to another page or section.

## API

### `label`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Label for the NavigationBanner. Required if no `body` prop is present. |

### `body`
| | |
|-----------|------------|
| Type | `string \| React.ReactElement` |
| Default | `undefined` |
| Description | Body description for the NavigationBanner. Required if no `label` prop is present. |

### `bannerType`
| | |
|-----------|------------|
| Type | `**BannerType**` |
| Default | `BannerType.Informational` |
| Description | Message type of the NavigationBanner. |

### `iconType`
| | |
|-----------|------------|
| Type | `**BannerIconType**` |
| Default | `undefined` |
| Description | Icon Override. |

### `useDefaultIconColors`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | If `iconType` is specified, set to `true` to use the default icon colors (useful for logos). |

### `iconAccessibilityLabel`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Override for the accessibility label for the icon. |

### `disabled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Functionally and visually disables the banner. |

### `as`
| | |
|-----------|------------|
| Type | `ElementType` |
| Default | `button` |
| Description | The HTML element or React component to render the NavigationBanner as. |

NavigationBanner is a polymorphic component that can be rendered as different HTML elements or React components using the `as` prop. By default, it renders as a `button` element and inherits all standard button props. Any additional props passed to the component will be spread onto the underlying element. For example, when using `as="a"`, you can pass `href` and other anchor tag props directly to the component.

## Usage

### NavigationBanner - default state
```typescript
import { NavigationBanner } from '@doordash/prism-react'
...
<NavigationBanner label="Click here to learn more" />
```
### NavigationBanner - with body
```typescript
import { NavigationBanner } from '@doordash/prism-react'
...
<NavigationBanner label="Special Offer" body="Click here to get 10% off your next order" />
```
### NavigationBanner - with custom icon
```typescript
import { NavigationBanner, BannerIconType } from '@doordash/prism-react'
...
<NavigationBanner label="View Menu" iconType={BannerIconType.Store} />
```
### NavigationBanner - as anchor tag
```typescript
import { NavigationBanner } from '@doordash/prism-react'
...
<NavigationBanner as="a" href="/menu" label="View Menu" target="_blank" />
```
### Usage tips

- The component always includes a chevron icon on the right side to indicate it's clickable
- You must use either a `label` or `body` prop
- The component inherits all standard button props when rendered as a button element