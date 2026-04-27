import { Database } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import * as S from './NavSQLStudio.styles'

const NAVBAR_PORTAL_ID = 'shell-navbar-portal'
const DATABASE_ICON_COLOR = 'var(--app-blue-600)'

export const NavSQLStudio = () => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setPortalContainer(document.getElementById(NAVBAR_PORTAL_ID))
  }, [])

  if (!portalContainer) {
    return null
  }

  return createPortal(
    <S.Container aria-label="SQL Studio">
      <S.IconWrapper>
        <Database size={24} color={DATABASE_ICON_COLOR} />
      </S.IconWrapper>
      <S.TitleText>SQL Studio</S.TitleText>
    </S.Container>,
    portalContainer
  )
}
