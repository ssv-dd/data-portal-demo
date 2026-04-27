import * as React from 'react'

interface NotificationErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface NotificationErrorBoundaryState {
  hasError: boolean
}

/**
 * Error boundary for the notification system.
 * Catches errors in the notification context and provides a fallback UI.
 *
 * This component ensures that if the notification system encounters an error,
 * the entire application doesn't crash. Instead, it gracefully degrades
 * and continues to render the children without notifications.
 *
 * @example
 * ```tsx
 * <NotificationErrorBoundary>
 *   <NotificationProvider>
 *     <App />
 *   </NotificationProvider>
 * </NotificationErrorBoundary>
 * ```
 */
export class NotificationErrorBoundary extends React.Component<
  NotificationErrorBoundaryProps,
  NotificationErrorBoundaryState
> {
  constructor(props: NotificationErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): NotificationErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Notification System Error:', error, errorInfo)
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // If custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback: silently render children without notification system
      // This ensures the app continues to work even if notifications fail
      return this.props.children
    }

    return this.props.children
  }
}
