## API
Prop | PropType | Default | Notes
---- | -------- | ------- | -----
`accessibilityLabel` | `string` | `undefined` | High-level label for the timeline. Use something descriptive like "Order Status Tracker" or "Delivery Timeline". Note: this is only visible for screen readers.
`steps` | `Array<TimelineStep>` | `undefined` | An array of steps to display in the timeline. Each step should have a `accessibilityLabel` and `iconType` property. The `accessibilityLabel` should be descriptive like "The merchant is preparing your order." or "Order sent to merchant for confirmation.". The `iconType` property uses the `TimelineIconType` enum. Note: there is a minimum of 2 steps required to render the timeline.
`currentStep` | `number` | `0` | The index of the current step in the timeline. This will be used to highlight the current step in the timeline.

## Usage

### Timeline - default state
```typescript
import {
  Timeline,
  TimelineStep,
  TimelineIconType,
} from '@doordash/prism-react'

const steps: TimelineStep[] = [
  {
    accessibilityLabel: 'Order sent to merchant for confirmation.',
    iconType: TimelineIconType.LogoDoordash,
  },
  {
    accessibilityLabel: 'The merchant is preparing your order.',
    iconType: TimelineIconType.MerchantFill,
  },
  {
    accessibilityLabel: 'The order is headed to you.',
    iconType: TimelineIconType.VehicleCarFill,
  },
  {
    accessibilityLabel: 'The order has been delivered.',
    iconType: TimelineIconType.HomeFill,
  },
]

<Timeline accessibilityLabel="Order Status Tracker" steps={steps} currentStep={currentStepFromBE} />
```