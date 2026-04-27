import { IconColor, IconType, TextColor } from '@doordash/prism-react'
import type { IconColorValueType, IconTypeValueType, TextColorValueType } from '@doordash/prism-react'

import type { NotificationType } from './NotificationContext'

export const NOTIFICATION_STYLES: Record<
  NotificationType,
  {
    icon: IconTypeValueType
    iconColor: IconColorValueType
    textColor: TextColorValueType
  }
> = {
  success: {
    icon: IconType.CheckCircleLine,
    iconColor: IconColor.positive.default,
    textColor: TextColor.positive.default,
  },
  error: {
    icon: IconType.ErrorLine,
    iconColor: IconColor.negative.default,
    textColor: TextColor.negative.default,
  },
  loading: {
    icon: IconType.PlayFill,
    iconColor: IconColor.warning.default,
    textColor: TextColor.warning.default,
  },
  warning: {
    icon: IconType.WarningFill,
    iconColor: IconColor.warning.default,
    textColor: TextColor.warning.default,
  },
  info: {
    icon: IconType.InfoLine,
    iconColor: IconColor.highlight.default,
    textColor: TextColor.highlight.default,
  },
}
