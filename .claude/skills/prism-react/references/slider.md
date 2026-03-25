# `Slider`

Sliders allow users to select from a visual range of values for mobile platforms.

**Exported Constants**

-   `Slider`
-   `SliderIconType`
-   `SliderType`

## `<Slider />` API

## Slider API

### `ariaLabelledBy`
| | |
|--|--|
| Type | `string` |
| Default | `undefined` |
| Description | Used for `aria-label` if no visible label is used. |

### `className`
| | |
|--|--|
| Type | `string` |
| Default | `undefined` |
| Description | `className` passed down to Slider wrapper, for usage with Styled Components' advanced wrapping techniques. |

### `defaultValue`
| | |
|--|--|
| Type | `number` |
| Default | `undefined` |
| Description | The initial value of the slider in uncontrolled mode. Undefined if `value` prop is present. |

### `id`
| | |
|--|--|
| Type | `string` |
| Default | `undefined` |
| Description | The base id to use for the slider and its sub-components. |

### `isDisabled`
| | |
|--|--|
| Type | `boolean` |
| Default | `false` |
| Description | Whether or not the slider is in a disabled state. |

### `isRequired`
| | |
|--|--|
| Type | `boolean` |
| Default | `false` |
| Description | If `true` and in a form, the Slider value is required. |

### `autoFocus`
| | |
|--|--|
| Type | `boolean` |
| Default | `false` |
| Description | If `true`, Slider will attempt to capture focus on load. |

### `leadingIcon`
| | |
|--|--|
| Type | `**SliderIconType**` |
| Default | `undefined` |
| Description | Icon to be used on the leading side of the slider. |

### `max`
| | |
|--|--|
| Type | `number` |
| Default | `100` |
| Description | Max value of the slider. Must be larger than the min. |

### `min`
| | |
|--|--|
| Type | `number` |
| Default | `0` |
| Description | Min value of the slider. Must be smaller than the max. |

### `segments`
| | |
|--|--|
| Type | `{ value: number; label?: string }[]` |
| Default | `undefined` |
| Description | Used to create custom labels for the tick marks. Useful for human-readable scales. |

### `name`
| | |
|--|--|
| Type | `string` |
| Default | `undefined` |
| Description | The `name` attribute of the input field. Useful in forms. |

### `onChange`
| | |
|--|--|
| Type | `(value: number, event: ChangeEvent<HTMLInputElement>) => void` |
| Default | `undefined` |
| Description | Function called whenever the slider value changes (by dragging, clicking, or keyboard usage). |

### `onChangeEnd`
| | |
|--|--|
| Type | `(value: number, event: React.MouseEvent<HTMLInputElement> \| React.TouchEvent<HTMLInputElement>) => void` |
| Default | `undefined` |
| Description | Function called when the user stops selecting a new value (by dragging, clicking, or keyboard usage). |

### `onChangeStart`
| | |
|--|--|
| Type | `(value: number, event: React.MouseEvent<HTMLInputElement> \| React.TouchEvent<HTMLInputElement>) => void` |
| Default | `undefined` |
| Description | Function called when the user starts selecting a new value (by dragging, clicking, or keyboard usage). |

### `onBlur`
| | |
|--|--|
| Type | `FocusEventHandler<HTMLInputElement>` |
| Default | `undefined` |
| Description | Function called on input `onBlur`. |

### `onFocus`
| | |
|--|--|
| Type | `FocusEventHandler<HTMLInputElement>` |
| Default | `undefined` |
| Description | Function called on input `onFocus`. |

### `step`
| | |
|--|--|
| Type | `number` |
| Default | `10` |
| Description | The step in which increments/decrements have to be made. |

### `trailingIcon`
| | |
|--|--|
| Type | `**SliderIconType**` |
| Default | `undefined` |
| Description | Icon to be used on the trailing side of the slider. |

### `type`
| | |
|--|--|
| Type | `**SliderType**` |
| Default | `"standard"` |
| Description | Slider track type, whether standard or with tick marks. |

### `value`
| | |
|--|--|
| Type | `number` |
| Default | `undefined` |
| Description | The value of the slider in controlled mode. |

### `size`
| | |
|--|--|
| Type | `**FieldSize**` |
| Default | `undefined` |
| Description | Determines the size and font-size of the input. |