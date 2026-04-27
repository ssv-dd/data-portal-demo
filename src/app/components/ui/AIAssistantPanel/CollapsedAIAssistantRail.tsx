import { PanelRightClose } from 'lucide-react'
import * as React from 'react'

import * as S from './CollapsedAIAssistantRail.styles'

const RAIL_ICON_SIZE = 18

export const CollapsedAIAssistantRail: React.FC<{ onExpand: () => void }> = ({ onExpand }) => {
  return (
    <S.Rail aria-label="Explorer (collapsed)">
      <S.ExpandButton type="button" onClick={onExpand} aria-label="Expand explorer">
        <PanelRightClose size={RAIL_ICON_SIZE} strokeWidth={2} aria-hidden />
      </S.ExpandButton>
    </S.Rail>
  )
}
