# `DatePicker`
A controlled calendar-like component for displaying and implementing date selection.

## Exported Constants
* `DatePickerMonthDisplay`
* `DatePickerSize`

## API

### `selectedDays`
| | |
|-----------|------------|
| Type | `Date \| Date[]` |
| Default | `undefined` |
| Description | Date(s) that will be rendered as selected in the DatePicker month grid. Will accept either a single date or multiple, individual dates. Use `selectedRange` if you would like to set a **range** of dates. If both `selectedDays` and `selectedRange` are defined, `DatePicker` will use the value of `selectedRange`. |

### `selectedRange`
| | |
|-----------|------------|
| Type | `{ from?: Date; to?: Date }` |
| Default | `undefined` |
| Description | Two dates that will be set as the start and end dates of a selected range. Use `selectedDays` if you would like the user to select **individual** days. If both `selectedDays` and `selectedRange` are defined, `DatePicker` will use the value of `selectedRange`. |

### `type`
| | |
|-----------|------------|
| Type | `**DatePickerType**` |
| Default | `DatePickerType.month` |
| Description | Determines if the DatePicker displays one month or one week at a time. `monthsDisplay` and `numMonths` only work in month view. |

### `onDayClick`
| | |
|-----------|------------|
| Type | `({ date: Date, isDisabled: boolean, isSelected: boolean, isToday: boolean }) => void` |
| Default | `undefined` |
| Description | Callback when user clicks on a day in the DatePicker month grid. Will receive an object as a param with the clicked date `date`, as well as any modifiers that have been applied to the day (whether is currently selected, is disabled, or is today's date). You can use these additional properties to determine what to do when the Day is clicked. |

### `onMonthPreviousClick`
| | |
|-----------|------------|
| Type | `(data?: DatePickerMonthDataProps) => void` |
| Default | `() => {}` |
| Description | Callback when user clicks on the Previous Month button. Will receive an object as a param that includes the updated current, previous, and next months. |

### `onMonthNextClick`
| | |
|-----------|------------|
| Type | `(data?: DatePickerMonthDataProps) => void` |
| Default | `() => {}` |
| Description | Callback when user clicks on the Next Month button. Will receive an object as a param that includes the updated current, previous, and next months. |

### `size`
| | |
|-----------|------------|
| Type | `**DatePickerSize**` |
| Default | `DatePickerSize.medium` |
| Description | Sets the size of the clickable days in the DatePicker month grid - adjusts the height and width of each day. |

### `monthsDisplay`
| | |
|-----------|------------|
| Type | `**DatePickerMonthDisplay**` |
| Default | `undefined` |
| Description | One of "Inline" or "Stacked". Determines if multiple months display in a row (inline) or in a column (stacked). Only used when `type` is set to `DatePickerType.month` |

### `firstDayOfWeek`
| | |
|-----------|------------|
| Type | `number` |
| Default | `undefined` |
| Description | Set to determine which day of the week will be the first in the `DatePicker` month grid. Defaults to `0` (or Sunday). |

### `locale`
| | |
|-----------|------------|
| Type | `string` |
| Default | `'en'` |
| Description | Optional string that sets the `lang` prop in the `DatePicker` component (e.g. `en`, `es`, `fr`, etc.), as well as internationalizes the displayed month and weekday strings along with the aria labels for individual date cells. Use if you are internationalizing your `DatePicker` instance. |

### `disabledDays`
| | |
|-----------|------------|
| Type | `DatePickerDisabledDaysAliasType \| DatePickerDisabledDaysAliasType[]` |
| Default | `undefined` |
| Description | Property to set if you would like to render certain days as disabled in `DatePicker`. See [`react-day-picker` docs](https://react-day-picker.js.org/api/DayPicker#disabledDays) for accepted value types. |

### `accessibilityLabelNextMonth`
| | |
|-----------|------------|
| Type | `string` |
| Default | `"Next month"` |
| Description | String that will be set as the aria-label for the next month navigation button |

### `accessibilityLabelPreviousMonth`
| | |
|-----------|------------|
| Type | `string` |
| Default | `"Previous month"` |
| Description | String that will be set as the aria-label for the previous month navigation button |

### `initialDate`
| | |
|-----------|------------|
| Type | `Date` |
| Default | `undefined` |
| Description | Set if you would like the `DatePicker` to render at a month other than today's calendar date on initial load. |

### `numMonths`
| | |
|-----------|------------|
| Type | `number` |
| Default | `1` |
| Description | Number of months you would like to display at a time in the DatePicker. Only used when `type` is set to `DatePickerType.month` |

### `shouldRenderNavigationButtons`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `true` |
| Description | Determines whether the `DatePicker` should render with buttons to control navigating between months. Set to `false` if you don't want these controls present. |

### `indicators`
| | |
|-----------|------------|
| Type | `{ active?: Modifier \| Modifier[] passive?: Modifier \| Modifier[] }` |
| Default | `undefined` |
| Description | Will add active and/or passive "indicator" dots to the `Date` object provided |

### `accessibilityActiveIndicatorLabel`
| | |
|-----------|------------|
| Type | `string \| ((props: Pick<DatePickerDayCellProps, 'day' \| 'month' \| 'modifiers'>) => string)` |
| Default | `undefined` |
| Description | The text that a screen reader will read aloud when a user focuses on a date with an "active" indicator. Accepts a string or a function for when the description is dynamic based on the date. |

### `accessibilityPassiveIndicatorLabel`
| | |
|-----------|------------|
| Type | `string \| ((props: Pick<DatePickerDayCellProps, 'day' \| 'month' \| 'modifiers'>) => string)` |
| Default | `undefined` |
| Description | The text that a screen reader will read aloud when a user focuses on a date with a "passive" indicator. Accepts a string or a function for when the description is dynamic based on the date information. |

### `captionLayout`
| | |
|-----------|------------|
| Type | `'label' \| 'dropdown' \| 'dropdown-months' \| 'dropdown-years'` |
| Default | `'label'` |
| Description | Controls the caption display style. `'label'` shows month/year as text. `'dropdown'` shows both month and year as dropdowns. `'dropdown-months'` shows month dropdown with year label. `'dropdown-years'` shows year dropdown with month label. |

### `reverseYears`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | When `true`, years in dropdown are displayed in descending order (most recent first). Only applies when `captionLayout` includes year dropdown. |

### `fromMonth`
| | |
|-----------|------------|
| Type | `Date` |
| Default | `undefined` |
| Description | Constrains the earliest selectable month. Defaults to 100 years before current year when using dropdowns. |

### `toMonth`
| | |
|-----------|------------|
| Type | `Date` |
| Default | `undefined` |
| Description | Constrains the latest selectable month. Defaults to 100 years after current year when using dropdowns. |

## Usage

### DatePicker - selecting an individual date
```typescript
import { DatePicker } from '@doordash/prism-react'

const CustomComponent = () => {
  const [selectedDate, setSelectedDate] = React.useState()

  return (
    <DatePicker
      selectedDays={selectedDate}
      onDayClick={({ date }) => setSelectedDate(date)}
    />
  )
}
```
### DatePicker - selecting a date range
```typescript
import { DatePicker } from '@doordash/prism-react'

const CustomComponent = () => {
  const [fromDate, setFromDate] = React.useState()
  const [toDate, setToDate] = React.useState()

  const handleDayClick = ({date, isSelected, isDisabled, isToday}) => {
    ...
  }

  return (
    <DatePicker
      selectedRange={{ from: fromDate, to: toDate }}
      onDayClick={handleDayClick}
    />
  )
}
```
### DatePicker - deselecting the selected date on subsequent click
```typescript
import { DatePicker } from '@doordash/prism-react'

const CustomComponent = () => {
  const [selectedDate, setSelectedDate] = React.useState()

  const handleDayClick = ({ date, isSelected }) => {
    setSelectedDate(isSelected ? undefined : date)
  }

  return (
    <DatePicker selectedDays={selectedDate} onDayClick={handleDayClick} />
  )
}
```
### DatePicker - multiple stacked months with navigation buttons hidden
```typescript
import { DatePicker, DatePickerMonthDisplay } from '@doordash/prism-react'
const CustomComponent = () => (
  <DatePicker
    monthsDisplay={DatePickerMonthDisplay.Stacked}
    numMonths={6}
    shouldRenderNavigationButtons={false}
  />
)
```
### DatePicker - with month and year dropdowns
```typescript
import { DatePicker } from '@doordash/prism-react'

const CustomComponent = () => {
  const [selectedDate, setSelectedDate] = React.useState()

  return (
    <DatePicker
      selectedDays={selectedDate}
      onDayClick={({ date, isSelected }) => setSelectedDate(isSelected ? undefined : date)}
      captionLayout="dropdown"
    />
  )
}
```
### DatePicker - with constrained date range (e.g., DOB entry for 18+)
```typescript
import { DatePicker } from '@doordash/prism-react'

const CustomComponent = () => {
  const [selectedDate, setSelectedDate] = React.useState()
  const today = new Date()
  const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  const hundredYearsAgo = new Date(today.getFullYear() - 100, 0, 1)

  return (
    <DatePicker
      selectedDays={selectedDate}
      onDayClick={({ date, isSelected, isDisabled }) => {
        if (!isDisabled) {
          setSelectedDate(isSelected ? undefined : date)
        }
      }}
      initialDate={eighteenYearsAgo}
      captionLayout="dropdown"
      fromMonth={hundredYearsAgo}
      toMonth={eighteenYearsAgo}
      disabledDays={{ after: eighteenYearsAgo }}
      reverseYears={true}
    />
  )
}
```
### DatePicker - with month dropdown only
```typescript
import { DatePicker } from '@doordash/prism-react'

const CustomComponent = () => {
  const [selectedDate, setSelectedDate] = React.useState()

  return (
    <DatePicker
      selectedDays={selectedDate}
      onDayClick={({ date }) => setSelectedDate(date)}
      captionLayout="dropdown-months"
    />
  )
}
```
### DatePicker - with year dropdown only
```typescript
import { DatePicker } from '@doordash/prism-react'

const CustomComponent = () => {
  const [selectedDate, setSelectedDate] = React.useState()

  return (
    <DatePicker
      selectedDays={selectedDate}
      onDayClick={({ date }) => setSelectedDate(date)}
      captionLayout="dropdown-years"
    />
  )
}
```
### Usage tips
* Prism Web's `DatePicker` uses the library [`react-day-picker`](https://react-day-picker.js.org/) - check out their docs for more information on how `DateUtils` and how the `DayPicker` library behaves under the hood.
* If you define both `selectedDays` and `selectedRange` in your `DatePicker`, the component will use the value of `selectedRange`. Only use one or the other: `selectedDays` for individual or multiple individual date selections, and `selectedRange` for a date range selection.

## `DateUtils`

In addition to the `DatePicker` component itself, we have also provided the `DateUtils` object from `react-day-picker`. There are several helpful utility functions provided in this object which can help you make comparisons between dates and assist in your `onDayClick` callback functions. `DatePicker` makes use of these functions under the hood as well. Check out the [docs from `react-day-picker`](https://react-day-picker.js.org/api/DateUtils) for more information!

### Example: using `DateUtils.isDayBefore` in `onDayClick` handler
```typescript
import { DatePicker, DateUtils } from '@doordash/prism-react'

const CustomComponent: React.FunctionComponent<CustomComponentProps> = () => {
  const [dateRange, updateDateRange] = React.useState({
    from: undefined, to: undefined
  })
  const handleDateClick = (date: Date) => {
    if (DateUtils.isDayBefore(date, dateRange.from)) {
      updateDateRange({ from: date, to: dateRange.from })
    } else if (DateUtils.isDayAfter(date, dateRange.from)) {
      updateDateRange({ from: dateRange.from, to: date })
    }
  }

  return (
    <DatePicker
      onDayClick={handleDateClick}
      selectedDays={dateRange}
    />
  )
}
```