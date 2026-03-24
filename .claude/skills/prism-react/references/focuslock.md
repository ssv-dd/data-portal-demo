# `FocusLock`
a component that allows for locking focus to the children, and supports layering

## API
Prop | PropType | Default | Notes
---- | -------- | ------- | -----
`disableFocusLock` | `boolean` | `false` | A boolean that allows you to override the active state of the focus lock.
`getInitialFocusElement` | `FocusLockInitialFocusElementGetter` | `undefined` | A function that should return an `HTMLElement` that `FocusLock` will pass initial focus to when mounting. Use this function to return a `ref` pointing to a DOM element, or use the `container` element passed to the function to query the DOM for the element that should receive focus.

## Usage

In order to use the <FocusLock /> you must have only one child, and it must be able to accept an `innerRef`

### FocusLock - basic usage
```typescript
import { FocusLock } from '@doordash/prism-react'
import Wrapper from './styles'

<FocusLock>
    <Wrapper>
        <Button>Some Button</Button>
        <div tabIndex={0}>some focusable element</div>
    </Wrapper>
</FocusLock>
```
### FocusLock - togglable disabled state
```typescript
import { FocusLock } from '@doordash/prism-react'
import Wrapper from './styles'

const [disableFocusLock, setDisableFocusLock] = React.useState<boolean>(false)

<FocusLock disableFocusLock={disableFocusLock}>
    <Wrapper>
        <Button onClick={() => setDisableFocusLock(!disableFocusLock)}>Toggle Focus Lock</Button>
        <div tabIndex={0}>some focusable element</div>
    </Wrapper>
</FocusLock>
```