# `Sidesheet`
Content to be displayed modally from the side.

## Exported Constants

* `SidesheetFooterLayout`
* `SidesheetNavBarNavigationAlignment`
* `SidesheetOverlayType`
* `SidesheetSide`
* `SidesheetSize`
* `SidesheetWidth`

## API
Prop | PropType | Default | Notes
---------------------------- | ------------------------------------ | ------------------------------------ | -----
`buttonGroupProps` | `SidesheetButtonGroupProps` | | props to be passed to component-button-group in the footer of the Sidesheet.
`hasContentPadding` | `boolean` | `true` | allows for the padding on the x-axis to be disabled within the body section of the sidesheet
`footerLayout` | `SidesheetFooterLayout` | | footer ButtonGroup layout
`insetSize` | `SidesheetInsetSizeType` | `SidesheetSize.small` | a manual overwrite of the x/y padding of the sidesheet
`isOpen` | `boolean` | `false` | whether or not to render the sidesheet
`itemGap` | `SidesheetItemGapType` | `SidesheetItemGapSize.small` | a manual overwrite of the spacing between elements within the sidesheet (header, body, footer)
`navbarProps` | `SidebarNavBarProps` | | props to be passed to the component-navbar in the header of the Sidesheet
`onClose` | `() => void` | | method called on the close of the sidesheet
`interceptCloseWith` | `() => void` | | method that can be used to handle the internal close events of the Sidesheet
`onOpen` | `() => void` | | method called on the open of the sidesheet
`overlayType` | `SidesheetOverlayType` | `SidesheetOverlayType.transparent` | the type of overlay used above the main content of the page
`parentTitle` | `string` | | parent title displayed in the component-navbar
`primaryAction` | `SidesheetSlotInputType` | | primary action rendered in the component-button-group
`renderFooter` | `() => React.ReactElement` | | node to be rendered in the footer of the sidesheet inplace of the ButtonGroup
`renderHeader` | `() => React.ReactElement` | | node to be rendered in the header of the sidesheet inplace of the NavBar
`renderFixedHeader` | `() => React.ReactElement` | | node to be rendered in the fixed header of the sidesheet inplace of the NavBar
`secondaryAction` | `SidesheetSlotInputType` | | secondary action rendered in the component-button-group
`shouldCloseOnEsc` | `boolean` | `true` | allows the user to close the sidesheet by pressing the esc key on the keyboard
`shouldCloseOnOverlayClick` | `boolean` | `true` | allows the user to close the sidesheet by clicking the overlay
`side` | `SidesheetSide` | `SidesheetSide.trailing` | side that the Sidesheet is attached to
`width` | `SidesheetWidth` | `SidesheetWidth.wide` | the width of the Sidesheet, either narrow or wide
`subtext` | `string` | | subtext displayed in the component-navbar
`tertiaryAction` | `SidesheetSlotInputType` | | tertiary action rendered in the component-button-group
`title` | `string` | | title displayed in the component-navbar
`headerMedia` | `{src: string, alt: string} OR React.ReactNode` | | Media displayed in the sidesheet header

### Action type

Attribute | Type | Required | Notes
--------- | ---- | -------- | -----
`content` | `string OR React.ReactNode` | Yes | The content rendered within the `<Button />`
`onClick` | `() => void` | No | The method attached to the `onClick` of the `<Button />`
`buttonProps` | `ButtonGoupButtonProps` | No | Props passed to the `<Button />`. This allows for overwritting the default props of the Action.

## Usage

### Sidesheet - basic
```typescript
import { Sidesheet } from '@doordash/prism-react'

const [showSidesheet, setShowSidesheet] = React.useState(false)

<Button onClick={() => setShowSidesheet(true)}>Open the Sheet!</Button>
<Sidesheet
    isOpen={showSidesheet}
    onClose={() => setShowSidesheet(false)}
    title="I'm a Sidesheet"
    primaryAction={{
        content: 'Done',
        onClick: () => setShowSidesheet(false)
    }}
>
    this is the body of the sidesheet
</Sidesheet>
```
### Sidesheet - Multi-Stepped Flow
```typescript
    import { Sidesheet } from '@doordash/prism-react'

    const [showSidesheet, setShowSidesheet] = React.useState(false)
    const [currentStep, setCurrentStep] = React.useState<number>(0)

    const getStepTitle = step => {
        if (step === 0) {
            return 'Step 1'
        }
        return 'Step 2'
    }

    const primaryActionClick = () => {
        if (currentStep === 0) {
            setCurrentStep(1)
        } else {
            setShowSidesheet(false)
        }
    }

    const onClose = () => {
        setShowSidesheet(false)
        setCurrentStep(0)
    }

    const getNavBarProps = currentStep => {
        if (currentStep === 0) {
            return undefined
        } else {
            return {
                hasBackButton: true,
                onBackButtonClick: () => setCurrentStep(0),
            }
        }
    }

    return (
        <>
            <Button onClick={() => setShowSidesheet(true)}>Open Sidesheet</Button>
            <Sidesheet
                isOpen={showSidesheet}
                title={getStepTitle(currentStep)}
                onClose={onClose}
                primaryAction={{
                    content: currentStep === 0 ? 'Next Step' : 'Done',
                    onClick: primaryActionClick,
                }}
                navbarProps={getNavBarProps(currentStep)}
            >
                {currentStep === 0 && <StepOneContent />}
                {currentStep === 1 && <StepTwoContent />}
            </Sidesheet>
        </>
    )
```
## Migrating from existing, project-custom Sidesheet components

Overall the hope is that this component feels familiar, either from using the exisitng Sidesheet or Prism API consistency. Bellow you will see some of the biggest callouts:

- With the old Sidesheet component, you would have to conditionally render the sidesheet to open/close it. This is different with the Prism Sidesheet. Rendering and animation is controlled via a prop: `isOpen`
- With the older Sidesheet, and the usage of [ `focus-trap-react`](https://www.npmjs.com/package/focus-trap-react), you had to add a nested [`LayerManager`](https://github.com/doordash/design-language-system/tree/master/packages/component-layer-manager) within the sidesheet if you wanted to have a Prism Modal stacked on top of the sheet. This is no longer the case: you can trigger a Modal from within the Sidesheet or from elsewhere and focus will automatically be managed.
- The Prism Sidesheet was built using existing Prism components (Inset, NavBar, and ButtonGroup), which should make using this component easier and more familiar.

If you have any additional questions/feedback/comments about the official Prism Sidesheet component, please reach out via Slack: [#ask-design-infrastructure](https://doordash.slack.com/archives/C8GKGT1GX)