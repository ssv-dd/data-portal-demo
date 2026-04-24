import styled from 'styled-components'

export const LightGradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top left, rgb(var(--app-fuchsia-rgb) / 0.08), transparent 35%),
    radial-gradient(circle at bottom right, rgb(var(--app-blue-rgb) / 0.08), transparent 35%);
`

export const DarkGradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top left, rgb(var(--app-violet-rgb) / 0.15), transparent 40%),
    radial-gradient(circle at bottom right, rgb(var(--app-cyan-rgb) / 0.12), transparent 40%);
`

export const AmbientRoot = styled.div`
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`
