# `Menu`

A layered component triggered by the press of a button or field that displays a list of selectable options

## Exported Constants

* `MenuSize`
* `MenuInteractionType`
* `MenuTitleAlignment`
* `MenuSelectType`
* `MenuSelectPosition`
* `MenuAlignment`
* `MenuBoundariesElement`

## API

### `content`
| | |
|-----------|------------|
| Type | `MenuItemProps[]` |
| Default | `undefined` |
| Description | Content that will be rendered in the Menu.<br/>By default each object will be rendered as a `ListCellLegacy` component, so any content you want present in that ListCellLegacy should be included as properties. The most common use cases for Menus have been provided through several optional top-level properties (`title`, `onClick`, `selectType`, etc.), and any additional customizations you would like to pass to the underlying `ListCellLegacy` can be included in the `listCellLegacyProps` property.<br/>Alternatively, if you would like to render a custom DOM node in the Menu (such as an "Apply" button, inline fields for rendering datepickers, etc.), you can pass in an object with a key of `customContent` and whose value is the DOM content.<br/>`hasSeparator` is available for deciding whether or not a visual separator is applied after the menu item - this property is available for both default content objects and objects with `customContent` defined. |

### `controlText`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Text that will be rendered in the MenuControl button. |

### `size`
| | |
|-----------|------------|
| Type | `**MenuSize**` |
| Default | `MenuSize.Medium` |
| Description | Size that will be applied to the default MenuControl button, as well as the controlText `Text` styles. |

### `renderMenuControl`
| | |
|-----------|------------|
| Type | `({accessibilityAttributes, describedBy}: {accessibilityAttributes: {aria-haspopup: boolean, aria-expanded: boolean}, describedBy: string}) => ReactNode` |
| Default | `undefined` |
| Description | If you would like an alternative control for the Menu (such as an `IconButton` or a `Primary` `Button`), you can set `renderMenuControl` which takes a function that returns a ReactNode. This control will be rendered in place of `MenuControl`. |

### `alignMenu`
| | |
|-----------|------------|
| Type | `**MenuAlignment**` |
| Default | `MenuAlignment.BottomRight` |
| Description | Used to determine where Menu will display in relation to the MenuControl. Passed through to the underlying `Popover` `position` prop. |

### `menuContainerStyles`
| | |
|-----------|------------|
| Type | `**CSSProperties**` |
| Default | `undefined` |
| Description | Any additional styles to apply to the element that wraps the Menu items in the `content` array. |

### `isInline`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Determines the `contentDisplayMode` prop value for the underlying `Popover` and the width styling for the control component. If false, the MenuControl will take up the width of its container. This API is useful if you want adjust the display in order to set custom styles on both the control and the `Menu` content (via the `menuContainerStyles` prop), such as a set width for your Menu & MenuControl. |

### `onControlClick`
| | |
|-----------|------------|
| Type | `MouseEventHandler<HTMLButtonElement>` |
| Default | `undefined` |
| Description | Optional callback function that will be called when `MenuControl` is clicked with event as first argument. |

### `interactionType`
| | |
|-----------|------------|
| Type | `**MenuInteractionType**` |
| Default | `MenuInteractionType.ToggleClick` |
| Description | One of: ToggleClick and Controlled. Determines how the `Menu` displays (passed through to the underlying `Popover`). If you want complete control over `Menu` visibility, used `MenuInteractionType.controlled`. |

### `boundariesElement`
| | |
|-----------|------------|
| Type | `MenuBoundariesElement \| HTMLElement \| null` |
| Default | `undefined` |
| Description | One of Viewport, ScrollParent, Window, or a given node. Passed through to the underlying `Popover` and used to determine how the Popover repositions itself to be visible. This is especially useful if you are rendering a `Menu` within a `Modal` and would like to allow the Menu content to expand outside of the Modal container. |

### `isVisible`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | **Use when `interactionType` is `MenuInteractionType.controlled`.** Boolean to determine the visibility state of the Menu (passed through to the underlying `Popover`). |

### `defaultIsVisible`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | **Use when `interactionType` is `MenuInteractionType.ToggleClick`.** Boolean to determine the initial visibility state of the Menu when not in Controlled mode (passed through to the underlying `Popover`). |

### `onVisibilityChange`
| | |
|-----------|------------|
| Type | `(isVisible: boolean) => void` |
| Default | `undefined` |
| Description | Called when the Menu has changed its visibility state, with first parameter being the new state. |

### `setContentWidthAsAnchorWidth`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | If set to true, the container for the `content` prop will be set as the same width as the control element. |

### `isPortaled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Whether or not to render the Menu dropdown in a portal or adjacent to the trigger. |

### `constrainContentHeightToBoundary`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Will constrain the menu dropdown to the available remaining vertical height of the boundaryElement. |

### `contentAccessibilityRole`
| | |
|-----------|------------|
| Type | `string` |
| Default | `menu` |
| Description | Role to be used for the content wrapper. |

### `anchoredLayerProps`
| | |
|-----------|------------|
| Type | `Omit<AnchoredLayerProps, 'children' \| 'content'>` |
| Default | `{}` |
| Description | Allows you to pass any override settings to the AnchoredLayer contained in Menu. |

## Usage

### Standard usage
```typescript
import { Menu } from '@doordash/prism-react'

<Menu
  controlText="Start a new promo"
  content={[
    {
      title: 'Create a DoorDash Promo',
      onClick: () => console.log('Creating a DD promo!'),
    },
    {
      title: 'Create a Storefront Promo',
      onClick: () => console.log('Creating a Storefront promo!'),
    },
  ]}
/>
```
### Menu with checkbox options
```typescript
import { Menu, MenuSelectType } from '@doordash/prism-react'

<Menu
  controlText="Start a new promo"
  content={[
    {
      title: 'Select all',
      selectType: MenuSelectType.checkbox,
      onClick: () => this.setState({ allSelected: !this.state.allSelected })
    },
    {
      title: 'Resolved',
      selectType: MenuSelectType.checkbox,
      onClick: () => this.setState({ showResolved: !this.state.showResolved })
    },
    {
      title: 'Unresolved',
      selectType: MenuSelectType.checkbox,
      onClick: () => this.setState({ showUnresolved: !this.state.showUnresolved })
    },
  ]}
/>
```
### Displaying visual separators between Menu items
```typescript
import { Menu } from '@doordash/prism-react'

<Menu
  controlText="Select an amount"
  content={[
    {
      title: '$25',
      onClick: () => updateGCValue(25),
    },
    {
      title: '$30',
      onClick: () => updateGCValue(30),
    },
    {
      title: '$50',
      onClick: () => updateGCValue(50),
      hasSeparator: true,
    },
    {
      title: 'Amount will be applied to the digital gift card'
    },
  ]}
/>
```
### Controlled interaction - closing Menu on item selection
```typescript
import { Menu, MenuInteractionType } from '@doordash/prism-react'

...

const [isMenuOpen, setIsMenuOpen] = React.useState(false)

...

<Menu
  controlText="Time frame"
  content={[
    {
      title: 'Last 7 days',
      onClick: () => {
        updateTimeFrame(7)
        setIsMenuOpen(false)
      }
    },
    {
      title: 'Last 30 days',
      onClick: () => {
        updateTimeFrame(30)
        setIsMenuOpen(false)
      }
    },
    {
      title: 'Custom range',
      onClick: openCustomRangeFlow,
    }
  ]}
  interactionType={MenuInteractionType.controlled}
  isVisible={isMenuOpen}
  onVisibilityChange={isVisible => setIsMenuOpen(isVisible)}
/>
```
### Setting a custom control element
```typescript
import { Menu, Button } from '@doordash/prism-react'

<Menu
  content={[
    {
      title: 'Create a DoorDash Promo',
      onClick: () => console.log('Creating a DD promo!'),
    },
    {
      title: 'Create a Storefront Promo',
      onClick: () => console.log('Creating a Storefront promo!'),
    },
  ]}
  renderMenuControl={({ describedBy, accessibilityAttributes}) => (
    <Button
      aria-describedby={describedBy}
      isDepressed={accessibilityAttributes['aria-expanded']}
      {...accessibilityAttributes}
    >
      Promotion Options
    </Button>
  )}
/>
```
### Rendering custom content in the Menu
```typescript
import { Menu, InlineChildren, Inset, Button, TextField } from '@doordash/prism-react'

<Menu
  alignMenu={MenuAlignment.bottomLeft}
  controlText="Store Information"
  content={[
    {
      customContent: (
        <Inset>
          <InlineChildren>
            <TextField
              label="Name"
              onChange={value => console.log(value)}
            />
            <TextField
              label="Location"
              onChange={value => console.log(value)}
            />
          </InlineChildren>
        </Inset>
      ),
    },
    {
      title: 'See a list of all stores matching the above criteria',
    },
    {
      customContent: (
        <Inset>
          <Button onClick={() => console.log('Clicked!')}>Submit</Button>
        </Inset>
      ),
    },
  ]}
/>
```
### Using Menu inside html form
```typescript
import { Menu } from '@doordash/prism-react'

<form>
  <Menu
    onControlClick={(event)=> event.preventDefault()}
    controlText="Start a new promo"
    content={[
      {
        title: 'Create a DoorDash Promo',
        onClick: () => console.log('Creating a DD promo!'),
      },
      {
        title: 'Create a Storefront Promo',
        onClick: () => console.log('Creating a Storefront promo!'),
      },
    ]}
  />
</form>
```
# `MenuControl`

The default control component used by `Menu`, consistent control for displaying select/dropdown-like elements in your project.

## API

### `text` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Text that will be rendered in the MenuControl. |

### `size`
| | |
|-----------|------------|
| Type | `**MenuSize**` |
| Default | `MenuSize.Medium` |
| Description | Size that will be set for the MenuControl as well as the `Text` node that wraps the `text` prop. |

### `describedBy`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Used for accessibility attributes that will be spread into the MenuControl. |

### `isExpanded`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Boolean for setting accessibility attributes in the MenuControl and for applying expanded vs collapses styles. |

### `isInline`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | If false, `MenuControl` will take up the entire width of its container. If true, `MenuControl` will only be as wide as its content. |

### `onClick`
| | |
|-----------|------------|
| Type | `MouseEventHandler<HTMLButtonElement>` |
| Default | `undefined` |
| Description | Optional callback function that will be called when `MenuControl` is clicked with event as first argument. |

## Usage

### Standard usage
```typescript
import { MenuControl } from '@doordash/prism-react'

<MenuControl text="Select Options" />
```
### Applying expanded styles
```typescript
import { MenuControl } from '@doordash/prism-react'

<MenuControl text="Select Options" isExpanded={this.state.isExpanded} />
```
# `MenuItem`

The default items rendered for each object in `Menu`'s `content` array. Useful if you would like to leverage preset item configurations like checkbox or radio list items when using the `customContent` option for `content` objects. If using `customContent` please remember that you may need to pass in appropriate accessibility roles

## API

### `size`
| | |
|-----------|------------|
| Type | `**MenuSize**` |
| Default | `MenuSize.Medium` |
| Description | Required. Set to the same value as `Menu`'s `size` to ensure proper visual balance between custom and preset items in your `Menu`. |

### `title`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Title of `MenuItem`. |

### `titleAlign`
| | |
|-----------|------------|
| Type | `**MenuTitleAlignment**` |
| Default | `undefined` |
| Description | Text alignment for title. |

### `selectType`
| | |
|-----------|------------|
| Type | `**MenuSelectType**` |
| Default | `undefined` |
| Description | Set for selectable items (Checkbox or Radio). |

### `isSelected`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | Use in tandem with `selectType` to set selected item(s). |

### `onClick`
| | |
|-----------|------------|
| Type | `function (no parameters)` |
| Default | `undefined` |
| Description | Callback when item is clicked. |

### `onMouseEnter`
| | |
|-----------|------------|
| Type | `function (no parameters)` |
| Default | `undefined` |
| Description | An action to take when the list cell is hovered over. |

### `onMouseLeave`
| | |
|-----------|------------|
| Type | `function (no parameters)` |
| Default | `undefined` |
| Description | An action to take when the list cell when hover state is removed. |

### `selectPosition`
| | |
|-----------|------------|
| Type | `**MenuSelectPosition**` |
| Default | `undefined` |
| Description | Determines whether to render the select icon at the leading or trailing edge of the item. |

### `listCellProps`
| | |
|-----------|------------|
| Type | `ListCellProps & {
  [key: `data-${string}`]: any
  [key: `aria-${string}`]: any
}` |
| Default | `undefined` |
| Description | Any additional props to pass through to the underlying `ListCellLegacy`. |

### `leadingIcon`
| | |
|-----------|------------|
| Type | `**MenuItemIconType**` |
| Default | `undefined` |
| Description | Set to render an Icon at the leading edge of the MenuItem. |

### `accessibilityRole`
| | |
|-----------|------------|
| Type | `string` |
| Default | `menuitem` |
| Description | Role to be used for the MenuItem. |

## Usage

### Using within `customContent` in `content` prop
```typescript
import { Menu, MenuItem, MenuSelectType } from '@doordash/prism-react'

<Menu
  content={[
    {
      title: 'Select all',
      selectType: MenuSelectType.checkbox,
      onClick: () => this.setState({ allSelected: !this.state.allSelected })
    },
    {
      title: 'Resolved',
      selectType: MenuSelectType.checkbox,
      onClick: () => this.setState({ showResolved: !this.state.showResolved })
    },
    {
      customContent: (
        <MyCustomWrapper>
          {myLongItemsArray.map(itemTitle => (
            <MenuItem
              title={itemTitle}
              selectType={MenuSelectType.checkbox}
              isSelected={currentMenuSelections.includes(itemTitle)}
              onClick={() => addItemToSelections(itemTitle)}
            />
          ))}
        </MyCustomWrapper>
      )
    },
  ]}
/>
```