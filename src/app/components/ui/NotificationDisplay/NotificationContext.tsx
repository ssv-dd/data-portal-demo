import * as React from 'react'

export type NotificationType = 'success' | 'error' | 'loading' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  duration?: number
  onRetry?: () => void
}

export interface NotificationContextValue {
  showNotification: (type: NotificationType, message: string, duration?: number, onRetry?: () => void) => void
  clearNotification: () => void
  currentNotification: Notification | null
}

export const NotificationContext = React.createContext<NotificationContextValue | undefined>(undefined)

interface NotificationProviderProps {
  children: React.ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [currentNotification, setCurrentNotification] = React.useState<Notification | null>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

  const clearNotification = React.useCallback(() => {
    setCurrentNotification(null)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
  }, [])

  const showNotification = React.useCallback(
    (type: NotificationType, message: string, duration: number = 3000, onRetry?: () => void) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      const notification: Notification = {
        id: Date.now().toString(),
        type,
        message,
        duration,
        onRetry,
      }

      setCurrentNotification(notification)

      // Auto-hide for success, warning, and info (but not loading or error which need manual dismissal)
      if (type === 'success' || type === 'info') {
        timeoutRef.current = setTimeout(() => {
          setCurrentNotification(null)
        }, duration)
      } else if (type === 'warning') {
        // Warnings stay for 5 seconds
        timeoutRef.current = setTimeout(() => {
          setCurrentNotification(null)
        }, 5000)
      } else if (type === 'loading') {
        // Loading notifications auto-hide after 5 seconds
        timeoutRef.current = setTimeout(() => {
          setCurrentNotification(null)
        }, 5000)
      } else if (type === 'error') {
        // Errors stay longer (10 seconds) or until dismissed/retried
        timeoutRef.current = setTimeout(() => {
          setCurrentNotification(null)
        }, 10000)
      }
    },
    []
  )

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const value = React.useMemo(
    () => ({
      showNotification,
      clearNotification,
      currentNotification,
    }),
    [showNotification, clearNotification, currentNotification]
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export const useNotifications = (): NotificationContextValue => {
  const context = React.useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}
