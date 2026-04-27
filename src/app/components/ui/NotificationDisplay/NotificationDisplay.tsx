import {
  Button,
  ButtonType,
  Icon,
  IconSize,
  InlineChildren,
  InlineChildrenAlignment,
  InlineChildrenSize,
  Text,
} from '@doordash/prism-react'
import * as React from 'react'

import { NotificationContext } from './NotificationContext'
import { NOTIFICATION_STYLES } from './NotificationDisplay.constants'
import { NotificationContainer } from './NotificationDisplay.styles'

export const NotificationDisplay: React.FC = () => {
  const context = React.useContext(NotificationContext)
  if (!context) {
    throw new Error('NotificationDisplay must be used within NotificationProvider')
  }

  const { currentNotification, clearNotification } = context

  if (!currentNotification) {
    return null
  }

  const { icon, iconColor, textColor } = NOTIFICATION_STYLES[currentNotification.type]

  const handleRetry = () => {
    if (currentNotification.onRetry) {
      currentNotification.onRetry()
      clearNotification()
    }
  }

  return (
    <NotificationContainer>
      <InlineChildren size={InlineChildrenSize.xxSmall} alignItems={InlineChildrenAlignment.center}>
        <Icon type={icon} color={iconColor} size={IconSize.medium} />
        <Text color={textColor}>{currentNotification.message}</Text>
        {currentNotification.type === 'error' && currentNotification.onRetry && (
          <Button type={ButtonType.link} isInline onClick={handleRetry}>
            Retry
          </Button>
        )}
      </InlineChildren>
    </NotificationContainer>
  )
}
