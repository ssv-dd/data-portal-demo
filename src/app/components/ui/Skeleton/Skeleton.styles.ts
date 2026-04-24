import { Theme } from '@doordash/prism-react'
import styled, { keyframes } from 'styled-components'

const shimmerAnimation = keyframes`
  0% {
    background-position: 100% center;
  }
  100% {
    background-position: -100% center;
  }
`

export const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    ${Theme.usage.color.background.subdued.default} 0%,
    ${Theme.usage.color.background.subdued.default} 40%,
    color-mix(
        in srgb,
        ${Theme.usage.color.highlight.strong.default} 15%,
        ${Theme.usage.color.background.subdued.default}
      )
      50%,
    ${Theme.usage.color.background.subdued.default} 60%,
    ${Theme.usage.color.background.subdued.default} 100%
  );
  background-size: 200% 100%;
  animation: ${shimmerAnimation} 1.5s ease-in-out infinite;
  border-radius: ${Theme.usage.borderRadius.small};
`
