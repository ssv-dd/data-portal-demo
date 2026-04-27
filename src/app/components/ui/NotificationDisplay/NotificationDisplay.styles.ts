import { Theme } from '@doordash/prism-react'
import styled from 'styled-components'

import { shadows } from '../../../styles/dataPortalAppTheme'

export const NotificationContainer = styled.div`
  position: absolute;
  top: ${Theme.usage.space.medium};
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  background: ${Theme.usage.color.background.elevated.default};
  padding: ${Theme.usage.space.xxSmall};
  border-radius: ${Theme.usage.borderRadius.medium};
  box-shadow: ${shadows.popover};
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translate(-50%, -${Theme.usage.space.medium});
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
`
