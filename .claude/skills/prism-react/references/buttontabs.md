## Import
```tsx
import {
  ButtonTabs,
  ButtonTab,
  ButtonTabPanelGroup,
  ButtonTabPanel,
  ButtonTabIconType,
  ButtonTabsDirection,
  ButtonTabsSize,
  ButtonTabsSelectEventInteraction
} from '@doordash/prism-react'
```
## Usage

`ButtonTabs` is a compound component that provides a set of tab item controls to toggle the visibility of associated tab panels.

### Components

- **ButtonTabs**: A group of tab item controls (ButtonTab) that toggles the visibility of an associated tab panel (ButtonTabPanel)
- **ButtonTab**: A tab item control that toggles a tab panel (ButtonTabPanel) into view
- **ButtonTabPanelGroup**: A group of tab panels (ButtonTabPanel) to display
- **ButtonTabPanel**: A section of content to be displayed when an associated tab item control is selected
- **ButtonTabIconType**: Type of icon to render before the ButtonTab label
- **ButtonTabsDirection**: ButtonTabs Direction constant for use with ButtonTabs component
- **ButtonTabsSize**: ButtonTabs Size constant for use with ButtonTabs component
- **ButtonTabsSelectEventInteraction**: ButtonTabs Select Event Interaction constant for use with ButtonTabs component. Used to denote what type of user interaction triggered a selection event

### Getting Started

> **Note:** The tab state is passed to both `ButtonTabs` and `ButtonTabPanelGroup`. Additionally, the `ButtonTab` `panelId` props must match a `ButtonTabPanel` `id` prop.
```tsx
import { ButtonTabs, ButtonTab, ButtonTabPanelGroup, ButtonTabPanel } from '@doordash/prism-react'

const [selectedTab, setSelectedTab] = React.useState<string | number>(0)

return (
  <>
    <ButtonTabs
      label={'Button Tabs'}
      selectedTab={selectedTab}
      onSelect={setSelectedTab}
    >
      <ButtonTab panelId={'panel-1'}>This is a tab</ButtonTab>
      <ButtonTab panelId={'panel-2'}>Medium Tab</ButtonTab>
      <ButtonTab panelId={'panel-3'}>A Third Tab</ButtonTab>
      <ButtonTab panelId={'panel-4'}>Another Tab</ButtonTab>
    </ButtonTabs>

    <ButtonTabPanelGroup selectedTab={selectedTab}>
      <ButtonTabPanel id="panel-1">
        {/* Tab panel content goes here */}
        <Text>This is the first panel</Text>
      </ButtonTabPanel>
      <ButtonTabPanel id="panel-2">
        {/* Tab panel content goes here */}
        <Button isInline>Get Started</Button>
        <Text>This is the second panel</Text>
      </ButtonTabPanel>
      <ButtonTabPanel id="panel-3">
        {/* Tab panel content goes here */}
        <Text>This is the third panel</Text>
      </ButtonTabPanel>
      <ButtonTabPanel id="panel-4">
        {/* Tab panel content goes here */}
        <Text>This is the fourth panel</Text>
      </ButtonTabPanel>
    </ButtonTabPanelGroup>
  </>
)
```
### Styled Tab Panels
```tsx
import styled from 'styled-components'

const StyledButtonTabPanel = styled(ButtonTabPanel)`
  padding: 100px;
  background: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.2);
`

<ButtonTabPanelGroup selectedTab={selectedTab}>
  <StyledButtonTabPanel id="panel-1">
    {/* Tab panel content goes here */}
    <Text>This is the first panel</Text>
  </StyledButtonTabPanel>
  <StyledButtonTabPanel id="panel-2">
    {/* Tab panel content goes here */}
    <Button isInline>Get Started</Button>
    <Text>This is the second panel</Text>
  </StyledButtonTabPanel>
  <StyledButtonTabPanel id="panel-3">
    {/* Tab panel content goes here */}
    <Text>This is the third panel</Text>
  </StyledButtonTabPanel>
</ButtonTabPanelGroup>
```
### With React Router

In this scenario, `ButtonTabPanelGroup` is not needed because the visibility is being controlled by React Router.
```tsx
import { ButtonTabs, ButtonTab, ButtonTabPanel, ButtonTabsSelectEventInteraction } from '@doordash/prism-react'

const location = useLocation()
const navigate = useNavigate()

const [selectedTab, setSelectedTab] = React.useState<string | number | null>(
  location.pathname.slice(1) || 0
)

return (
  <>
    <ButtonTabs
      label={'Button Tabs'}
      selectedTab={selectedTab}
      onSelect={(selected, event) => {
        // need to pass the panelId to use for route
        setSelectedTab(() => event.selectedTab)

        // when the tab changes using the arrow keys, the `Link` component
        // will not be triggered, so we need to call `navigate` when the tab is
        // changed with keyboard controls
        if (event.interaction === ButtonTabsSelectEventInteraction.Keyboard) {
          navigate(`${event.selectedTab}`)
        }
      }}
    >
      <ButtonTab as={Link} panelId={'panel-1'} to={'panel-1'}>
        Dashboard
      </ButtonTab>
      <ButtonTab as={Link} panelId={'panel-2'} to={'panel-2'}>
        Orders
      </ButtonTab>
      <ButtonTab as={Link} panelId={'panel-3'} to={'panel-3'}>
        Menu
      </ButtonTab>
    </ButtonTabs>

    <Routes>
      <Route
        path="panel-1"
        element={
          <ButtonTabPanel id="panel-1">
            <Text>Dashboard</Text>
          </ButtonTabPanel>
        }
      />
      <Route
        path="panel-2"
        element={
          <ButtonTabPanel id="panel-2">
            <Text>Orders</Text>
          </ButtonTabPanel>
        }
      />
      <Route
        path="panel-3"
        element={
          <ButtonTabPanel id="panel-3">
            <Text>Menu</Text>
          </ButtonTabPanel>
        }
      />
    </Routes>
  </>
)
```
## Button Tabs API

### `selectedTab` `required`
| | |
|-----------|------------|
| Type | `string \| number \| null` |
| Default | `0` |
| Description | Either the index or the unique id of the currently selected tab. This value must also be passed to the associated ButtonTabPanelGroup `selectedTab` prop. |

### `onSelect` `required`
| | |
|-----------|------------|
| Type | `(selectedTab: number, event: ButtonTabsSelectEvent) => void` |
| Default | `undefined` |
| Description | A callback that will be invoked when a new tab is selected |

### `label`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | A descriptive title for the ButtonTabs used by assistive technologies. `required` if no `aria-labelledby` prop is present. |

### `aria-labelledby`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | If a visible title for the ButtonTabs exists, provide that title element's id. `required` if no `label` prop is present. |

### `children` `required`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | Tab to render in container. Must be a set of ButtonTab components |

### `selectOnFocus`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | When true, a tab's associated tab panel will be revealed when the tab is focused. When false, the visible tab panel will only change on a selection event (i.e. click or enter on a tab) |

### `direction`
| | |
|-----------|------------|
| Type | `**ButtonTabsDirection**` |
| Default | `ButtonTabsDirection.ltr` |
| Description | Determines whether the tabs will be displayed from left to right or right to left |

### `passInitialFocusOnMount`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Moves initial focus to the initially selected tab |

### `disabled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Disables ButtonTabs and all child ButtonTab components when true |

### `hasSeparator`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Renders a bottom border/separator along the bottom of the Button Tabs |

### `inset`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Enables a theme defined padding along the left and right side of the Button Tabs |

### `fixedWidthTabs`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | When true, the tabs will fill the space of their container and will all be the same width. Long tab labels will overflow onto a second line |

### `size`
| | |
|-----------|------------|
| Type | `**ButtonTabsSize**` |
| Default | `ButtonTabsSize.medium` |
| Description | Determines the size of the ButtonTabs |

## ButtonTab API

### `children` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `Label is required` |
| Description | The content to render within a Tab |

### `panelId` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | The Tab Panel that should be revealed when this tab is selected |

### `onClick`
| | |
|-----------|------------|
| Type | `(event: ButtonTabClickEvent) => void` |
| Default | `undefined` |
| Description | Callback to invoke when ButtonTab is clicked |

### `id`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | Tab element id attribute used to link a tab with a tab panel. Will be autogenerated if not provided. |

### `onFocus`
| | |
|-----------|------------|
| Type | `(event: ButtonTabFocusEvent) => void` |
| Default | `undefined` |
| Description | Callback to invoke when ButtonTab is focused |

### `onBlur`
| | |
|-----------|------------|
| Type | `(event: ButtonTabFocusEvent) => void` |
| Default | `undefined` |
| Description | Callback to invoke when ButtonTab loses focus |

### `disabled`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Disables the Button Tab |

### `leadingIcon`
| | |
|-----------|------------|
| Type | `**ButtonTabIconType**` |
| Default | `undefined` |
| Description | Renders a given Prism icon in the Button Tab |

### `as`
| | |
|-----------|------------|
| Type | `ElementType` |
| Default | `button` |
| Description | Swap out the root component implementation with either a different HTML tag (e.g. `a`) or a React component. |

## ButtonTabPanelGroup API

### `children` `required`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | The Button Tab Panels to render |

### `selectedTab` `required`
| | |
|-----------|------------|
| Type | `string \| number` |
| Default | `0` |
| Description | Either the index or the unique id of the currently selected tab. This value must also be passed to the associated ButtonTabs `selectedTab` prop. |

### `forceTabPanelRender`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | When false, only one tab panel will exist in the DOM at a time. When true, all tab panels will be rendered and exist in the DOM, and be visually hidden when not selected. |

## ButtonTabPanel API

### `id` `required`
| | |
|-----------|------------|
| Type | `string` |
| Default | `undefined` |
| Description | The unique id for the tab panel to associate a tab panel with a tab |

### `children` `required`
| | |
|-----------|------------|
| Type | `ReactNode` |
| Default | `undefined` |
| Description | Content to render in Tab Panel |

### `as`
| | |
|-----------|------------|
| Type | `ElementType` |
| Default | `div` |
| Description | Swap out the root component implementation with either a different HTML tag (e.g. `a`) or a React component. |