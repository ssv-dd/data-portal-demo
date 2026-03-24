## API

### `size`

| | |
| --- | --- |
| Type | `**ProgressBarSize**` |
| Default | `"large"` |
| Description | Determines the height of the progress bar. |

### `type`

| | |
| --- | --- |
| Type | `**ProgressBarType**` |
| Default | `"informational"` |
| Description | Defines the visual style of the progress bar, which may affect colors and theming. |

### `progress`

| | |
| --- | --- |
| Type | `number` |
| Default | `undefined` |
| Description | The current progress percentage. Should be a value between `0` and `100`. |

### `ariaLabel`

| | |
| --- | --- |
| Type | `string` |
| Default | `undefined` |
| Description | Accessible label for screen readers. Describes the purpose and current progress status of the progress bar. |

### `isRounded`

| | |
| --- | --- |
| Type | `boolean` |
| Default | `true` |
| Description | If `true`, makes the track of the progress bar rounded. The progress indicator remains rounded unless it reaches `100%` with `isRounded` set to `false`. |

### `activeIndicatorColor`

| | |
| --- | --- |
| Type | `string` |
| Default | `undefined` |
| Description | Custom color override for the active progress indicator. If not provided, a default color based on `type` is used. |

### `trackColor`

| | |
| --- | --- |
| Type | `string` |
| Default | `undefined` |
| Description | Custom color override for the progress bar track (background). If not provided, a default track color is used. |

### `animationDebug`

| | |
| --- | --- |
| Type | `boolean` |
| Default | `false` |
| Description | Enables debug mode for animations. If `true`, logs animation duration calculations to the console. |

## Usage

### ProgressBar - default state
```typescript
import { ProgressBar, ProgressBarType, ProgressBarSize } from '@doordash/prism-react'

<ProgressBar ariaLabel="ProgressBar at 50%" progress={50} type={ProgressBarType.informational} size={ProgressBarSize.large} />
```