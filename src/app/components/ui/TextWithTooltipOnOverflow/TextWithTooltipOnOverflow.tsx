import {
  Text,
  TextColor,
  TextOverflow,
  TextProps,
  TextSizeValueType,
  TextStyle,
  TextWeightValueType,
  TooltipInteractionType,
  TooltipSize,
} from '@doordash/prism-react'
import {
  Tooltip,
  TooltipContentWrapperDisplayMode,
  TooltipPosition,
  TooltipPositionType,
} from '@doordash/prism-react'
import * as React from 'react'

type Props = {
  position?: TooltipPositionType
  children?: React.ReactNode
  size?: TextSizeValueType
  weight?: TextWeightValueType
  overflow?: TextOverflow
  styles?: typeof TextStyle
  tooltipWidth?: number
  tooltipTextProps?: Partial<Omit<TextProps, 'Styles'>>
  highlight?: string
} & Partial<Omit<TextProps, 'Styles'>>

export const TextWithTooltipOnOverflow: React.FC<Props> = ({
  position = TooltipPosition.topCenter,
  tooltipWidth = 300,
  tooltipTextProps,
  children,
  highlight = '',
  ...props
}) => {
  const [showTooltip, setShowTooltip] = React.useState(false)

  const parts = (children as string).split(new RegExp(`(${highlight})`, 'gi'))

  return (
    <Tooltip
      position={position}
      size={TooltipSize.small}
      interactionType={showTooltip ? TooltipInteractionType.toggleHover : TooltipInteractionType.controlled}
      content={
        <div style={{ maxWidth: tooltipWidth }}>
          <Text color={TextColor.text.inverse.default} {...tooltipTextProps}>
            {children}
          </Text>
        </div>
      }
      contentDisplayMode={TooltipContentWrapperDisplayMode.block}
    >
      {() => (
        <div
          ref={(r) => {
            let span: HTMLCollectionOf<HTMLSpanElement> | undefined | HTMLSpanElement =
              r?.getElementsByTagName('span')
            span = span && span?.length > 0 ? span[0] : undefined
            if (
              span &&
              (span?.scrollWidth > span?.offsetWidth ||
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                (props.maxLines > 1 && span?.scrollHeight > span?.offsetHeight))
            ) {
              setShowTooltip(true)
            } else {
              setShowTooltip(false)
            }
          }}
        >
          <Text {...props}>
            <span>
              {highlight.length > 0
                ? parts.map((part) =>
                    part.toLowerCase() === highlight.toLowerCase() ? <mark key={part}>{part}</mark> : part
                  )
                : children}
            </span>
          </Text>
        </div>
      )}
    </Tooltip>
  )
}
