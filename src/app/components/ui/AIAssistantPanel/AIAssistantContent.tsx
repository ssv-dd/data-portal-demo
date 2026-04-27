import { useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import * as React from 'react'

import type { ChatMessage } from '../../../features/search/types/aiSearch'

import { AIAssistantChatInput } from './AIAssistantChatInput'
import { AIAssistantChatThread } from './AIAssistantChatThread'
import * as S from './AIAssistantContent.styles'
import { useAIAssistantTheme } from './AIAssistantThemeContext'
import type { AIAssistantRecommendation } from './aiAssistant.types'
import { applyCustomPromptToUserMessage } from './aiAssistantPrompt'
import type { AssistantChatSkillOption } from './assistantChatSkill.types'
import { useAIAssistantBuiltInChat } from './useAIAssistantBuiltInChat'

const pillListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.08,
    },
  },
} as const

const pillItemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 420, damping: 30 },
  },
} as const

const ICON_SIZE = 16

export interface AIAssistantContentProps {
  readonly recommendations?: readonly AIAssistantRecommendation[]
  readonly onRecommendationClick?: (id: string) => void
  /**
   * When omitted, messages are sent via Ask Data AI async conversation + polling (`agentId` required).
   * When provided, that handler receives the (optionally custom-prompt–wrapped) payload for the API.
   */
  readonly onChatSend?: (message: string, opts?: { readonly displayForUser?: string }) => void | Promise<void>
  /** Required with `onChatSend` when the host manages chat state (e.g. SQL Studio). */
  readonly chatMessages?: readonly ChatMessage[]
  readonly chatLoading?: boolean
  /** Shown in the chat composer; supply from the host (e.g. SQL Studio constants). */
  readonly chatPlaceholder?: string
  /** Required for built-in async mode when `onChatSend` is not provided. */
  readonly chatAgentId?: string
  /** Optional prefix merged into each outgoing user message (API payload); omitted sends text as-is. */
  readonly chatCustomPrompt?: string
  /** Optional RegExp to extract the user-written portion from the full outgoing payload (including `chatCustomPrompt`) for UI display; ignored if not provided. Should have a capturing group for the user portion. */
  readonly chatCustomPromptMatch?: RegExp
  /** Display name for the assistant, shown in the header and used as the default aria-label for the panel. */
  readonly assistantName: string
  /** Optional description of the assistant's capabilities, shown in the header. */
  readonly assistantDescription?: string
  /** Knowledge bases for the composer (+ menu and pills), e.g. SQL Studio. */
  readonly chatSkillOptions?: readonly AssistantChatSkillOption[]
  /** Default selected skill ids when `chatSkillOptions` is set (uncontrolled). */
  readonly defaultChatSelectedSkillIds?: readonly string[]
  /** Callback fired when welcome screen visibility changes; new chat should be disabled when showing. */
  readonly onWelcomeDisplayChange?: (isDisplaying: boolean) => void
  /** When set, replaces the chat input with a disabled banner showing this message. */
  readonly chatDisabledReason?: string
  /** Called when user clicks "Replace Widget" on an AI-returned SQL message. */
  readonly onReplaceWidget?: (payload: import('./aiAssistant.types').WidgetActionPayload) => void
  /** Called when user clicks "Pin as New Widget" on an AI-returned SQL message. */
  readonly onPinAsNewWidget?: (payload: import('./aiAssistant.types').WidgetActionPayload) => void
}

export const AIAssistantContent: React.FC<AIAssistantContentProps> = ({
  recommendations = [],
  onRecommendationClick,
  onChatSend,
  chatMessages = [],
  chatLoading = false,
  chatPlaceholder = '',
  chatAgentId,
  chatCustomPrompt,
  chatCustomPromptMatch,
  assistantName,
  assistantDescription,
  chatSkillOptions,
  onWelcomeDisplayChange,
  defaultChatSelectedSkillIds,
  chatDisabledReason,
  onReplaceWidget,
  onPinAsNewWidget,
}) => {
  const theme = useAIAssistantTheme()
  const reducedMotion = useReducedMotion()
  const composerInputRef = React.useRef<HTMLTextAreaElement>(null)
  const [composerValue, setComposerValue] = React.useState('')

  const builtInAsync = onChatSend === undefined || onChatSend === null
  const {
    messages: builtInMessages,
    isLoading: builtInLoading,
    send: sendBuiltIn,
  } = useAIAssistantBuiltInChat({
    enabled: builtInAsync,
    agentId: chatAgentId,
    customPrompt: chatCustomPrompt,
  })

  const effectiveMessages: readonly ChatMessage[] = builtInAsync ? builtInMessages : chatMessages
  const hasUserMessage = effectiveMessages.some((m) => m.role === 'user')
  const showWelcomeAndPills = !hasUserMessage

  // Notify parent when welcome display state changes
  React.useEffect(() => {
    onWelcomeDisplayChange?.(showWelcomeAndPills)
  }, [showWelcomeAndPills, onWelcomeDisplayChange])

  const handleComposerSend = React.useCallback(
    async (raw: string) => {
      if (onChatSend) {
        const outgoing = applyCustomPromptToUserMessage(raw, chatCustomPrompt)
        await onChatSend(outgoing, { displayForUser: raw.trim() })
        return
      }
      await sendBuiltIn(raw)
    },
    [onChatSend, chatCustomPrompt, sendBuiltIn]
  )

  const chatBusy = (builtInAsync && builtInLoading) || (!!onChatSend && chatLoading)

  const handlePillClick = React.useCallback(
    (item: AIAssistantRecommendation) => {
      if (chatBusy) {
        return
      }
      const raw = (item.message?.trim() || item.label).trim()
      if (!raw) {
        return
      }
      onRecommendationClick?.(item.id)
      setComposerValue(raw)
      composerInputRef.current?.focus()
    },
    [chatBusy, onRecommendationClick]
  )

  const pillHoverMotion = React.useMemo(() => {
    if (reducedMotion) {
      return undefined
    }
    return {
      y: [0, -8, -2, -5],
      transition: {
        duration: 0.5,
        times: [0, 0.35, 0.65, 1],
        ease: [0.34, 1.26, 0.64, 1] as [number, number, number, number],
      },
    }
  }, [reducedMotion])

  return (
    <S.ContentColumn>
      {showWelcomeAndPills ? (
        <S.WelcomeWrapper>
          <S.WelcomeIconWrap>
            <Sparkles size={24} color="rgb(99, 82, 175)" aria-hidden />
          </S.WelcomeIconWrap>
          <S.WelcomeAssistantName>{assistantName}</S.WelcomeAssistantName>
          {assistantDescription ? (
            <S.WelcomeAssistantDescription>{assistantDescription}</S.WelcomeAssistantDescription>
          ) : null}
          {recommendations.length > 0 ? (
            <S.RecommendationsStack
              key={recommendations.map((r) => r.id).join(',')}
              initial="hidden"
              animate="visible"
              variants={pillListVariants}
              aria-label="Suggested prompts"
            >
              {recommendations.map((item) => {
                const Icon = item.icon
                const label = item.label.trim()
                return (
                  <S.RecommendationPill
                    key={item.id}
                    type="button"
                    variants={pillItemVariants}
                    whileHover={pillHoverMotion}
                    disabled={chatBusy}
                    aria-label={`Use suggestion: ${label}`}
                    onClick={() => handlePillClick(item)}
                  >
                    {Icon ? (
                      <S.PillIconWrap $iconColor={theme.usage.color.icon.default}>
                        <Icon size={ICON_SIZE} strokeWidth={2} aria-hidden />
                      </S.PillIconWrap>
                    ) : null}
                    <S.PillLabel>{label}</S.PillLabel>
                  </S.RecommendationPill>
                )
              })}
            </S.RecommendationsStack>
          ) : null}
        </S.WelcomeWrapper>
      ) : null}

      {builtInAsync || effectiveMessages.length > 0 ? (
        <AIAssistantChatThread
          messages={effectiveMessages}
          customPrompt={chatCustomPrompt}
          customPromptMatch={chatCustomPromptMatch}
          onFollowUpClick={(text) => void handleComposerSend(text)}
          onReplaceWidget={onReplaceWidget}
          onPinAsNewWidget={onPinAsNewWidget}
        />
      ) : null}
      <AIAssistantChatInput
        ref={composerInputRef}
        value={composerValue}
        onChange={setComposerValue}
        onSend={handleComposerSend}
        placeholder={chatPlaceholder}
        disabled={chatBusy}
        skillOptions={chatSkillOptions}
        defaultSelectedSkillIds={defaultChatSelectedSkillIds}
        chatDisabledReason={chatDisabledReason}
      />
    </S.ContentColumn>
  )
}
