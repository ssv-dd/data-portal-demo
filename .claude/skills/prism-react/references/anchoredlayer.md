# AnchoredLayer

## `AnchoredLayer` API
AnchoredLayer is a primitive for building layered components that position a floating element (content) relative to an anchor (children). AnchoredLayer's internals will always look for the best LayerManager layer to attach the floating element.

### `content`
| | |
|--|--|
| Type | `React.ReactNode or (props: { closeContent: () => void }) => React.ReactNode` |
| Default | `undefined` |
| Description | The content to be displayed within the anchored layer. If the component is uncontrolled, you can use a render prop pattern to access the closeContent function. |

### `children`
| | |
|--|--|
| Type | `React.ReactNode` |
| Default | `undefined` |
| Description | The child element that triggers the display of the anchored layer. |

### `position`
| | |
|--|--|
| Type | `AnchoredLayerPositionValuesType` |
| Default | `AnchoredLayerPosition.BottomCenter` |
| Description | The position of the anchored layer relative to its anchor. |

### `shouldEscapeWithAnchor`
| | |
|--|--|
| Type | `boolean` |
| Default | `true` |
| Description | Determines if the anchored layer should hide when the anchor element leaves the `boundariesElement`. |

### `isOpen`
| | |
|--|--|
| Type | `boolean` |
| Default | `undefined` |
| Description | Determines if the anchored layer is open. `Required` is using AnchoredLayer in a controlled manner. |

### `offset`
| | |
|--|--|
| Type | `AnchoredLayerOffsetType` |
| Default | `undefined` |
| Description | The offset of the anchored layer from its anchor. |

### `showArrow`
| | |
|--|--|
| Type | `boolean` |
| Default | `false` |
| Description | Determines if the arrow indicator should be shown. |

### `arrowOptions`
| | |
|--|--|
| Type | `AnchoredLayerArrowOverrideOptionsType` |
| Default | `null` |
| Description | Options to override the styles of the arrow indicator. |

### `positionStrategy`
| | |
|--|--|
| Type | `AnchoredLayerPositionStrategyValuesType` |
| Default | `null` |
| Description | The strategy to position the anchored layer. |

### `isPortaled`
| | |
|--|--|
| Type | `boolean` |
| Default | `true` |
| Description | Determines if the anchored layer should be rendered as a portal. |

### `anchorContainerDisplayMode`
| | |
|--|--|
| Type | `React.CSSProperties['display']` |
| Default | `inline-flex` |
| Description | The CSS display mode for the anchor container element. |

### `contentContainerDisplayMode`
| | |
|--|--|
| Type | `React.CSSProperties['display']` |
| Default | `block` |
| Description | The CSS display mode for the content container element. |

### `anchorContainerProps`
| | |
|--|--|
| Type | `AnchoredLayerAnchorContainerProps` |
| Default | `undefined` |
| Description | Additional props to be passed to the anchor container element. |

### `contentContainerProps`
| | |
|--|--|
| Type | `AnchoredLayerContentContainerProps` |
| Default | `undefined` |
| Description | Additional props to be passed to the content container element. |

### `anchorAsChild`
| | |
|--|--|
| Type | `boolean` |
| Default | `false` |
| Description | Determines if the anchor is rendered as a child of the anchored layer without an anchor container. |

### `onOpen`
| | |
|--|--|
| Type | `() => void` |
| Default | `() => {}` |
| Description | Callback function called when the anchored layer is opened. |

### `onClose`
| | |
|--|--|
| Type | `() => void` |
| Default | `() => {}` |
| Description | Callback function called when the anchored layer is closed. |

### `setContentWidthAsAnchorWidth`
| | |
|--|--|
| Type | `boolean` |
| Default | `false` |
| Description | Determines if the width of the content should match the width of the anchor. |

### `boundariesElement`
| | |
|--|--|
| Type | `AnchoredLayerBoundariesElementType` |
| Default | `AnchoredLayerBoundariesElement.ScrollParent` |
| Description | The element or selector to use as the boundaries for the anchored layer. |

### `boundariesPadding`
| | |
|--|--|
| Type | `AnchoredLayerBoundariesPaddingType` |
| Default | `undefined` |
| Description | The padding applied to the boundaries of the anchored layer. |

### `detectOverflowOptions`
| | |
|--|--|
| Type | `AnchoredLayerBoundariesOverrideSettings` |
| Default | `undefined` |
| Description | Advanced settings to override the default boundary behavior of the anchored layer. |

### `onFlippedChange`
| | |
|--|--|
| Type | `OnFlippedChangeType` |
| Default | `undefined` |
| Description | Callback function called when the flipped state of the anchored layer changes. |

### `shouldAutomaticallyShift`
| | |
|--|--|
| Type | `boolean` |
| Default | `true` |
| Description | Determines if the anchored layer should automatically shift its position on the x-axis to fit within the boundaries. |

### `shouldAutomaticallyFlip`
| | |
|--|--|
| Type | `boolean` |
| Default | `true` |
| Description | Determines if the anchored layer should automatically flip to the opposite side when it overflows its boundaries. Cannot be used with `shouldUseAutoPlacement`. |

### `shouldUseAutoPlacement`
| | |
|--|--|
| Type | `boolean` |
| Default | `false` |
| Description | Determines if the anchored layer should use auto placement when positioning. Cannot be used with `shouldUseAutomaticallyFlip`. |

### `shouldUseAutoPlacement`
| | |
|--|--|
| Type | `boolean` |
| Default | `false` |
| Description | Determines if the anchored layer should use auto placement when positioning. Cannot be used with `shouldUseAutomaticallyFlip`. |

### `animation`
| | |
|--|--|
| Type | `AnchoredLayerAnimationTypes` |
| Default | `AnchoredLayerAnimationTypes.SlideFade` |
| Description | Style of animation to use when showing and hiding floating content. |

### `animationOptions`
| | |
|--|--|
| Type | `TransitionOptionsType` |
| Default | `null` |
| Description | Style of animation to use when showing and hiding floating content. |

### `useClick`
| | |
|--|--|
| Type | `boolean` |
| Default | `false` |
| Description | Opens or closes the floating element when clicking the reference element. Disabled if using AnchoredLayer in a controlled manner with `isOpen.` |

### `useClickProps`
| | |
|--|--|
| Type | `UseClickProps` |
| Default | `undefined` |
| Description | Props for the useClick interaction. https://floating-ui.com/docs/useClick

### `useHover`
| | |
|--|--|
| Type | `boolean` |
| Default | `false` |
| Description | Opens the floating element while hovering over the reference element, like CSS :hover. Disabled if using AnchoredLayer in a controlled manner with `isOpen.` |

### `useHoverProps`
| | |
|--|--|
| Type | `UseHoverProps` |
| Default | `undefined` |
| Description | Props for the useHover interaction. https://floating-ui.com/docs/useHover

### `useFocus`
| | |
|--|--|
| Type | `boolean` |
| Default | `false` |
| Description | Opens the floating element while the reference element has focus, like CSS :focus. Disabled if using AnchoredLayer in a controlled manner with `isOpen.` |

### `useFocusProps`
| | |
|--|--|
| Type | `UseFocusProps` |
| Default | `undefined` |
| Description | Props for the useFocus interaction. https://floating-ui.com/docs/useFocus

### `useDismiss`
| | |
|--|--|
| Type | `boolean` |
| Default | `false` |
| Description | Closes the floating element when a dismissal is requested — by default, when the user presses the escape key or outside of the floating element with their pointer. Disabled if using AnchoredLayer in a controlled manner with `isOpen.` |

### `useDismissProps`
| | |
|--|--|
| Type | `UseDismissProps` |
| Default | `undefined` |
| Description | Props for the useDismiss interaction. https://floating-ui.com/docs/useDismiss |

### `disableInteractiveHover`
| | |
|--|--|
| Type | `boolean` |
| Default | `false` |
| Description | Tooltips are interactive by default (to pass WCAG 2.1 success criterion 1.4.13). It won't close when the user hovers over the tooltip before the leaveDelay is expired. You can disable this behavior (thus failing the success criterion which is required to reach level AA) by passing disableInteractiveHover. |

### `useFocusManager`
| | |
|--|--|
| Type | `boolean` |
| Default | `false` |
| Description | Whether or not to use FocusManagement. https://floating-ui.com/docs/FloatingFocusManager |

### `focusManagerProps`
| | |
|--|--|
| Type | `FloatingFocusManagerProps` |
| Default | `undefined` |
| Description | Prop overrides for the FloatingFocusManager component from FloatingUI. https://floating-ui.com/docs/FloatingFocusManager |

### `isContentFullWidth`
| | |
|--|--|
| Type | `boolean` |
| Default | `false` |
| Description | Set the content container the same width as the boundary element, regardless of container content. |

### `constrainContentHeightToBoundary`
| | |
|--|--|
| Type | `boolean` |
| Default | `false` |
| Description | Will constrain the floating element to the available remaining vertical height of the boundaryElement. |