# SingleSelectGroup
These are all groups of selectable elements that are displayed in different ways—think toggle button groups, radio groups, circle toggle button groups, etc.

## `SingleSelectGroup`

Allows you to have selectable groups of options.

## Exported Constants

* `SingleSelectGroupSize`

## API

### `onChange` `required`
| | |
|-----------|------------|
| Type | `(index: number \| null) => void` |
| Default | `null` |
| Description | Function to call when the selected button in the set changes; the callback is given an `index`, which is an integer describing which child has been selected. |

### `selectedIndex`
| | |
|-----------|------------|
| Type | `number` |
| Default | `null` |
| Description | Value that determines what button should be selected in the group; use this when making this a controlled component. |

### `defaultSelectedIndex`
| | |
|-----------|------------|
| Type | `number` |
| Default | `null` |
| Description | Value that determines what button should be selected in the group when first mounted. Use this when you want to have this be an uncontrolled component. |

### `size`
| | |
|-----------|------------|
| Type | `**SingleSelectGroupSize**` |
| Default | `small` |
| Description | Size of the buttons in the group. Defaults to `Small`. |

### `isDisabled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Makes the buttons in the group disabled, preventing interaction. |

### `isInline`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Makes the button group fit the content of each of the buttons. To fill the space of the container it's contained in, make sure this is `false`. |

### `accessibilityLabel`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | Sets an `aria-label` on your button for screen reader accessibility; either this or `accessibilityLabeledBy` are _required_ to use this component. If neither are provided, the component will throw an error when rendering. |

### `accessibilityLabeledBy`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | Sets an `aria-labelledby` on your button for screen reader accessibility. This string must point to a visible label that has this ID that references it. Either this or `accessibilityLabel` are _required_ to use this component. If neither are provided, the component will throw an error when rendering. |

### `accessibilityDescribedBy`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | A DOM ID that references an element (like a tooltip) that describes this SingleSelectGroup. |

### `options`
| | |
|-----------|------------|
| Type | `string[]` |
| Default | `null` |
| Description | One of the ways of setting the elements that can be selected in the set. Each of the options here will be mapped to buttons in the group; alternatively, if your use is more complex (say you need to control the content of the `Button` options, or more closely manage interactions), we recommend using `children` instead of `options`. |

### `children`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `null` |
| Description | One of the ways of setting the elements that can be selected in the set. Each of the children contained here should either be a `Button` or use the props passed into it by `SingleSelectGroup`; alternatively, if your use is simpler, we recommend using `options` instead of `children`. |

### `shouldDeselectOnClick`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Determines if clicking onto an already selected options allows you to deselect it. Use this if you don't require this group to have an option selected. |

### SingleSelectGroup - default state with non-complex options
```typescript
import { SingleSelectGroup } from '@doordash/prism-react'
…
<SingleSelectGroup
  accessibilityLabel="Order Options"
  options={['Pickup', 'Delivery']}
/>
```
### SingleSelectGroup - different size
```typescript
import {
  SingleSelectGroup,
  SingleSelectGroupSize,
} from '@doordash/prism-react'
…
<SingleSelectGroup
  accessibilityLabel="Order Options"
  options={['Pickup', 'Delivery']}
  size={SingleSelectGroupSize.medium}
/>
```
### SingleSelectGroup - custom button behavior, menu dropdown on click
```typescript
class SelectWithMore extends React.Component {
  state = {
    dropdownOpen: false,
  }
  render() {
    return (
      <LayerManager>
        <SingleSelectGroup
          accessibilityLabel="Menus"
          onChange={index => this.setState({ dropdownOpen: index === 3 })}
          isInline={true}
        >
          <Button>Breakfast</Button>
          <Button>Lunch</Button>
          <Button>Dinner</Button>
          <Button>
            <AnchoredLayer
              content={
                this.state.dropdownOpen && (
                  <Tooltip>
                    Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit, sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip
                    ex ea commodo consequat.
                  </Tooltip>
                )
              }
              inner={this.state.inner}
              position={AnchoredLayerPosition.BottomCenter}
              shouldAutomaticallyFlip
            >
              <InlineChildren
                size={InlineChildrenSize.XxxSmall}
                justifyContent={InlineChildrenJustification.Center}
                alignItems={InlineChildrenAlignment.Center}
              >
                <span>More</span>
                <Icon
                  type={IconType.ChevronDown}
                  color={IconColor.CurrentColor}
                  size={IconSize.Small}
                />
              </InlineChildren>
            </AnchoredLayer>
          </Button>
        </SingleSelectGroup>
      </LayerManager>
    )
  }
}
return <ToggleWithMore />
```
### Usage tips

- If you need to make the group constrain to it's content, use `isInline`

## Accessibility

This button conforms to the accessibility API shown here:
<https://www.w3.org/TR/wai-aria-practices/#radiobutton>

And the examples show here:
<https://www.w3.org/TR/wai-aria-practices/examples/radio/radio-1/radio-1.html>