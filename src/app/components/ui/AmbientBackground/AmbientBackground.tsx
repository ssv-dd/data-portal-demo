import { GradientOrb } from '../GradientOrb'

import * as S from './AmbientBackground.styles'

type AmbientBackgroundProps = {
  readonly isDark?: boolean
}

/** Decorative gradient mesh + orbs for both light and dark themes. */
export function AmbientBackground({ isDark = false }: AmbientBackgroundProps) {
  return (
    <S.AmbientRoot aria-hidden>
      {isDark ? <S.DarkGradientOverlay /> : <S.LightGradientOverlay />}
      <GradientOrb variant="primary" style={{ left: '-120px', top: '-20px' }} />
      <GradientOrb variant="secondary" style={{ right: '-80px', top: '120px' }} />
      <GradientOrb variant="primary" style={{ left: '60%', top: '600px' }} />
    </S.AmbientRoot>
  )
}
