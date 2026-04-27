import {
  IconSize,
  IconType,
  InlineChildrenAlignment,
  InlineChildrenSize,
  Theme,
  TextColor,
  TextWeight,
  Tooltip,
  TooltipContentWrapperDisplayMode,
  TooltipPosition,
  TooltipSize,
} from '@doordash/prism-react'
import { Icon, InlineChildren, Text } from '@doordash/prism-react'
import * as React from 'react'

import { TooltipContent } from '../../../features/Workflows/components/WorkflowBuilder/components/nodes/NodeStyles'

import { IconWrapper } from './LabelWithTooltip.styles'

export type LabelWithTooltipProps = {
  label: string
  tooltip: React.ReactNode | string
}

export const LabelWithTooltip: React.FC<LabelWithTooltipProps> = ({ label, tooltip }) => (
  <InlineChildren alignItems={InlineChildrenAlignment.center} size={InlineChildrenSize.xSmall}>
    <Text size={Theme.usage.fontSize.medium} weight={TextWeight.semibold} color={TextColor.text.default}>
      {label}
    </Text>
    <Tooltip
      content={<TooltipContent>{tooltip}</TooltipContent>}
      size={TooltipSize.small}
      position={TooltipPosition.topCenter}
      contentDisplayMode={TooltipContentWrapperDisplayMode.block}
    >
      {() => (
        <IconWrapper>
          <Icon size={IconSize.small} type={IconType.InfoCircleFill} />
        </IconWrapper>
      )}
    </Tooltip>
  </InlineChildren>
)
