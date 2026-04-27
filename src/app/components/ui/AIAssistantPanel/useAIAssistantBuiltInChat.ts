import * as React from 'react'

import { useAIChat } from '../../../features/search/hooks/useAIChat'
import type { ChatMessage } from '../../../features/search/types/aiSearch'

import { applyCustomPromptToUserMessage } from './aiAssistantPrompt'

export interface UseAIAssistantBuiltInChatParams {
  readonly enabled: boolean
  readonly agentId: string | undefined
  readonly customPrompt?: string
}

export function useAIAssistantBuiltInChat({
  enabled,
  agentId,
  customPrompt,
}: UseAIAssistantBuiltInChatParams): {
  readonly messages: ChatMessage[]
  readonly isLoading: boolean
  readonly send: (rawUserText: string) => Promise<void>
} {
  const chatMutation = useAIChat()
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const chatSessionIdRef = React.useRef(
    typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `session-${Date.now()}`
  )

  const send = React.useCallback(
    async (rawUserText: string) => {
      if (!enabled) {
        return
      }
      const trimmed = rawUserText.trim()
      if (!trimmed) {
        return
      }
      const id = agentId?.trim()
      if (!id) {
        return
      }

      const outgoing = applyCustomPromptToUserMessage(trimmed, customPrompt)
      const userMessage: ChatMessage = {
        id: `${Date.now()}-user`,
        role: 'user',
        content: outgoing,
        displayContent: customPrompt?.trim() ? trimmed : undefined,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      const placeholderId = `polling-${Date.now()}`
      const placeholderAIMessage: ChatMessage = {
        id: placeholderId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        status: 'pending',
      }
      setMessages((prev) => [...prev, placeholderAIMessage])

      const completedStepIndices = new Set<number>()
      let previousStepCount = 0

      try {
        const aiResponse = await chatMutation.mutateAsync({
          message: outgoing,
          history: [...messages, userMessage],
          chatSessionId: chatSessionIdRef.current,
          agentId: id,
          onPollingUpdate: (update) => {
            const currentStepCount = update.intermediateSteps?.length || 0

            setMessages((prev) => {
              const newMessages = [...prev]
              const lastMessage = newMessages[newMessages.length - 1]

              if (lastMessage.id === placeholderId) {
                const toolCalls = update.intermediateSteps?.map((step, index) => {
                  let status: 'pending' | 'in_progress' | 'completed' | 'error'

                  if (update.status === 'completed') {
                    status = 'completed'
                  } else if (update.status === 'pending') {
                    status = 'pending'
                  } else {
                    const isLastStep = index === currentStepCount - 1

                    if (isLastStep) {
                      status = 'in_progress'
                    } else if (completedStepIndices.has(index)) {
                      status = 'completed'
                    } else {
                      completedStepIndices.add(index)
                      status = 'completed'
                    }
                  }

                  return {
                    name: step.name,
                    status,
                    icon: undefined,
                  }
                })

                if (currentStepCount > previousStepCount && previousStepCount > 0) {
                  completedStepIndices.add(previousStepCount - 1)
                }
                previousStepCount = currentStepCount

                return [
                  ...newMessages.slice(0, -1),
                  {
                    ...lastMessage,
                    content: update.responseText || '',
                    status:
                      update.status === 'pending'
                        ? 'pending'
                        : update.status === 'completed'
                          ? 'completed'
                          : 'pending',
                    toolCalls,
                    metrics: update.metrics,
                    charts: update.charts,
                    recommendations: update.recommendations,
                    referencedAssets: update.referencedAssets,
                    suggestedFollowUps: update.suggestedFollowUps,
                  },
                ]
              }

              return newMessages
            })
          },
        })

        setMessages((prev) => {
          const newMessages = [...prev]
          const placeholderIndex = newMessages.findIndex((msg) => msg.id === placeholderId)
          if (placeholderIndex !== -1) {
            newMessages[placeholderIndex] = {
              ...aiResponse,
              id: placeholderId,
            }
          }
          return newMessages
        })
      } catch {
        setMessages((prev) => {
          const newMessages = prev.filter((msg) => msg.id !== placeholderId)
          const errorMessage: ChatMessage = {
            id: `${Date.now()}-error`,
            role: 'assistant',
            content: 'Sorry, I encountered an error processing your message. Please try again.',
            timestamp: new Date(),
            status: 'error',
          }
          return [...newMessages, errorMessage]
        })
      } finally {
        setIsLoading(false)
      }
    },
    [enabled, agentId, customPrompt, chatMutation, messages]
  )

  return {
    messages: enabled ? messages : [],
    isLoading: enabled && isLoading,
    send,
  }
}
