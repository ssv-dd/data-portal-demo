import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import * as S from './DataPortalNavBar.styles'

const NAVBAR_PORTAL_ID = 'shell-navbar-portal'

type Props = {
  persona?: string
  shellVersion?: number
}

export const DataPortalNavBar = ({ persona, shellVersion }: Props) => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setPortalContainer(document.getElementById(NAVBAR_PORTAL_ID))
  }, [shellVersion])

  if (!portalContainer) {
    return null
  }

  return createPortal(
    <S.NavContainer>
      {persona && (
        <S.PersonaContainer aria-label={`Your data persona is ${persona}`}>
          <S.PersonaLabel>Your Data Persona:</S.PersonaLabel>
          <S.PersonaTag>{persona}</S.PersonaTag>
        </S.PersonaContainer>
      )}
    </S.NavContainer>,
    portalContainer
  )
}
