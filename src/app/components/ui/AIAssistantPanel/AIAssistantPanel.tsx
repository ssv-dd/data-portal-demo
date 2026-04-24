import { MessageSquare, PanelRightClose, Plus, Sparkles } from 'lucide-react'
import * as React from 'react'

import type { ChatMessage } from '../../../features/search/types/aiSearch'
import { useResizablePanel } from '../../../hooks/useResizablePanel'

import { AIAssistantContent } from './AIAssistantContent'
import * as S from './AIAssistantPanel.styles'
import { useAIAssistantTheme } from './AIAssistantThemeContext'
import { CollapsedAIAssistantRail } from './CollapsedAIAssistantRail'
import PastChatContent from './PastChatContent'
import type { AIAssistantRecommendation } from './aiAssistant.types'
import type { AssistantChatSkillOption } from './assistantChatSkill.types'

/** Width constraints for the resizable branch only (passed via `resizableProps`). */
export type AIAssistantResizableProps = {
  readonly minWidthPx?: number
  readonly maxWidthPx?: number
  readonly defaultWidthPx?: number
}

export interface AIAssistantPanelProps {
  readonly children?: React.ReactNode
  /**
   * When `true` (default), `resizableProps` controls drag bounds; when `false`, the panel uses `flex: 1`.
   */
  readonly isResizable?: boolean
  readonly resizableProps?: AIAssistantResizableProps
  readonly header?: React.ReactNode
  readonly resizePosition?: 'start' | 'end'
  readonly 'aria-label'?: string
  /** Shown below the welcome line as a vertical stack when using the default `AIAssistantContent`. */
  readonly recommendations?: readonly AIAssistantRecommendation[]
  readonly onRecommendationClick?: (id: string) => void
  readonly onChatSend?: (message: string, opts?: { readonly displayForUser?: string }) => void | Promise<void>
  readonly chatMessages?: readonly ChatMessage[]
  readonly chatLoading?: boolean
  /** Chat composer placeholder; e.g. `SQL_STUDIO_AI_ASSISTANT_CHAT_PLACEHOLDER` from SQL Studio. */
  readonly chatPlaceholder?: string
  /** Required when using built-in Ask Data AI flow (`onChatSend` omitted). Ignored when `onChatSend` is set. */
  readonly chatAgentId?: string
  /** Optional text prepended to each user message for the API (built-in and custom `onChatSend`). */
  readonly chatCustomPrompt?: string
  /** Optional RegExp to extract the user-written portion from the full outgoing payload (including `chatCustomPrompt`) for UI display; ignored if not provided. Should have a capturing group for the user portion. */
  readonly chatCustomPromptMatch?: RegExp
  /** Knowledge bases for the SQL-style composer (+ menu and pills). */
  readonly chatSkillOptions?: readonly AssistantChatSkillOption[]
  /** Pre-selected skill ids when using `chatSkillOptions` (uncontrolled). */
  readonly defaultChatSelectedSkillIds?: readonly string[]
  /** When set with `onAssistantActiveTabChange`, controls Chats vs Past Chats tab. */
  readonly assistantActiveTabId?: string
  readonly onAssistantActiveTabChange?: (tabId: string) => void
  /** Ask Data agent id for past-chats list (`filter_object.filter_value` with `agent_id`). */
  readonly pastChatsAgentId?: string
  /** When user picks a past chat: switch session (e.g. URL) and usually switch to Chats tab via controlled tab state. */
  readonly onPastChatSessionSelect?: (chatSessionId: string) => void
  readonly onAddNewChat?: () => void
  readonly assistantName: string
  readonly assistantDescription?: string
  /** When set, replaces the chat input with a disabled banner showing this message. */
  readonly chatDisabledReason?: string
  /** Controlled collapsed state. When provided, the panel becomes controlled and internal state is ignored. */
  readonly isCollapsed?: boolean
  readonly onIsCollapsedChange?: (collapsed: boolean) => void
  /** Called when user clicks "Replace Widget" on an AI-returned SQL message. */
  readonly onReplaceWidget?: (payload: import('./aiAssistant.types').WidgetActionPayload) => void
  /** Called when user clicks "Pin as New Widget" on an AI-returned SQL message. */
  readonly onPinAsNewWidget?: (payload: import('./aiAssistant.types').WidgetActionPayload) => void
}

export const AI_TABS = [
  { id: 'chats', label: 'Chats', Icon: Sparkles },
  { id: 'past_chats', label: 'Past Chats', Icon: MessageSquare },
]

const ICON_SIZE = 16

function PanelChrome({
  header,
  children,
  rootProps,
  activeTab,
  onActiveTabChange,
  isResizeable,
  setIsCollapsed,
  onAddNewChat,
  isNewChatDisabled = false,
}: {
  readonly header?: React.ReactNode
  readonly children: React.ReactNode
  readonly rootProps: Omit<React.ComponentProps<typeof S.Root>, 'children'>
  readonly activeTab: string
  readonly onActiveTabChange: (id: string) => void
  readonly isResizeable: boolean
  readonly setIsCollapsed?: (collapsed: boolean) => void
  readonly onAddNewChat?: () => void
  readonly isNewChatDisabled?: boolean
}) {
  const theme = useAIAssistantTheme()

  return (
    <S.Root
      {...rootProps}
      style={{
        color: theme.usage.color.text.default,
        backgroundColor: 'transparent',
      }}
    >
      {header ? (
        header
      ) : (
        <S.Header>
          <S.AIAssistantTabsContainer role="tablist" aria-label="Explorer sections">
            {AI_TABS.map(({ id, label, Icon }) => (
              <S.AIAssistantTabButton
                key={id}
                type="button"
                role="tab"
                aria-selected={activeTab === id}
                $isActive={activeTab === id}
                onClick={() => onActiveTabChange(id)}
              >
                <Icon size={ICON_SIZE} aria-hidden />
                <S.AIAssistantTabLabel>{label}</S.AIAssistantTabLabel>
              </S.AIAssistantTabButton>
            ))}
          </S.AIAssistantTabsContainer>
          <S.HeaderIcon>
            <S.ActionButton
              $disabled={isNewChatDisabled}
              type="button"
              onClick={isNewChatDisabled ? undefined : onAddNewChat}
              aria-label="Start new chat"
            >
              <Plus size={18} strokeWidth={2} aria-hidden />
            </S.ActionButton>

            {isResizeable && (
              <S.ActionButton
                onClick={() => setIsCollapsed?.(true)}
                aria-label="Collapse panel"
                $disabled={false}
              >
                <PanelRightClose size={18} strokeWidth={2} aria-hidden />
              </S.ActionButton>
            )}
          </S.HeaderIcon>
        </S.Header>
      )}
      <S.Body style={{ padding: theme.usage.space.medium }}>{children}</S.Body>
    </S.Root>
  )
}

type ResizableAIAssistantPanelProps = {
  readonly resizableProps?: AIAssistantResizableProps
  readonly resizePosition?: 'start' | 'end'
  readonly activeTab: string
  readonly onActiveTabChange: (id: string) => void
  readonly setIsCollapsed: (collapsed: boolean) => void
  readonly assistantName: string
  readonly assistantDescription?: string
  readonly onAddNewChat?: () => void
  readonly onWelcomeDisplayChange?: (isDisplaying: boolean) => void
} & Pick<
  AIAssistantPanelProps,
  | 'header'
  | 'children'
  | 'aria-label'
  | 'recommendations'
  | 'onRecommendationClick'
  | 'onChatSend'
  | 'chatMessages'
  | 'chatLoading'
  | 'chatPlaceholder'
  | 'chatAgentId'
  | 'chatCustomPrompt'
  | 'chatCustomPromptMatch'
  | 'chatSkillOptions'
  | 'defaultChatSelectedSkillIds'
  | 'assistantActiveTabId'
  | 'onAssistantActiveTabChange'
  | 'pastChatsAgentId'
  | 'onPastChatSessionSelect'
  | 'chatDisabledReason'
  | 'onReplaceWidget'
  | 'onPinAsNewWidget'
>

function ResizableAIAssistantPanel({
  resizableProps,
  header,
  children,
  recommendations,
  onRecommendationClick,
  onChatSend,
  chatMessages,
  chatLoading,
  chatPlaceholder,
  chatAgentId,
  chatCustomPrompt,
  'aria-label': ariaLabel,
  resizePosition = 'start',
  chatCustomPromptMatch,
  chatSkillOptions,
  defaultChatSelectedSkillIds,
  assistantActiveTabId,
  onAssistantActiveTabChange,
  pastChatsAgentId,
  onPastChatSessionSelect,
  activeTab,
  onActiveTabChange,
  setIsCollapsed,
  assistantName,
  assistantDescription,
  onAddNewChat,
  onWelcomeDisplayChange,
  chatDisabledReason,
  onReplaceWidget,
  onPinAsNewWidget,
}: ResizableAIAssistantPanelProps) {
  const theme = useAIAssistantTheme()
  const { minWidthPx, maxWidthPx, defaultWidthPx } = resizableProps ?? {}
  const [showingWelcome, setShowingWelcome] = React.useState(false)

  // Disable new chat when welcome is showing in the Chats tab
  const isNewChatDisabled = activeTab === AI_TABS[0].id && showingWelcome

  const { size, separatorProps, isDragging } = useResizablePanel({
    axis: 'horizontal',
    edge: resizePosition,
    min: minWidthPx ?? 260,
    max: maxWidthPx ?? 520,
    defaultSize: defaultWidthPx ?? 300,
  })

  return (
    <S.LayoutRow>
      {resizePosition === 'start' && (
        <S.Separator
          {...separatorProps}
          style={{
            ...separatorProps.style,
            opacity: 1,
          }}
        />
      )}
      <PanelChrome
        header={header}
        rootProps={{ 'aria-label': ariaLabel, $resizable: true, $widthPx: size }}
        activeTab={activeTab}
        onActiveTabChange={onActiveTabChange}
        isResizeable={true}
        setIsCollapsed={setIsCollapsed}
        onAddNewChat={onAddNewChat}
        isNewChatDisabled={isNewChatDisabled}
      >
        {children ??
          (activeTab === AI_TABS[0].id ? (
            <AIAssistantContent
              recommendations={recommendations}
              onRecommendationClick={onRecommendationClick}
              onChatSend={onChatSend}
              chatMessages={chatMessages}
              chatLoading={chatLoading}
              chatPlaceholder={chatPlaceholder}
              chatAgentId={chatAgentId}
              chatCustomPrompt={chatCustomPrompt}
              chatCustomPromptMatch={chatCustomPromptMatch}
              chatSkillOptions={chatSkillOptions}
              defaultChatSelectedSkillIds={defaultChatSelectedSkillIds}
              assistantName={assistantName}
              assistantDescription={assistantDescription}
              onWelcomeDisplayChange={setShowingWelcome}
              chatDisabledReason={chatDisabledReason}
              onReplaceWidget={onReplaceWidget}
              onPinAsNewWidget={onPinAsNewWidget}
            />
          ) : (
            <PastChatContent
              agentId={pastChatsAgentId ?? ''}
              onSessionSelect={onPastChatSessionSelect ?? (() => undefined)}
              customPromptMatch={chatCustomPromptMatch}
            />
          ))}
      </PanelChrome>
      {resizePosition === 'end' && (
        <S.Separator
          {...separatorProps}
          style={{
            ...separatorProps.style,
            backgroundColor: isDragging ? theme.usage.color.border.pressed : theme.usage.color.border.default,
            opacity: 1,
          }}
        />
      )}
    </S.LayoutRow>
  )
}

function NonResizableAIAssistantPanel({
  header,
  children,
  recommendations,
  onRecommendationClick,
  onChatSend,
  chatMessages,
  chatLoading,
  chatPlaceholder,
  chatAgentId,
  chatCustomPrompt,
  chatCustomPromptMatch,
  chatSkillOptions,
  defaultChatSelectedSkillIds,
  pastChatsAgentId,
  onPastChatSessionSelect,
  resizableProps,
  'aria-label': ariaLabel,
  activeTab,
  onActiveTabChange,
  assistantName,
  assistantDescription,
  chatDisabledReason,
}: {
  activeTab: string
  onActiveTabChange: (id: string) => void
  assistantName: string
  assistantDescription?: string
} & Pick<
  AIAssistantPanelProps,
  | 'header'
  | 'children'
  | 'aria-label'
  | 'recommendations'
  | 'onRecommendationClick'
  | 'onChatSend'
  | 'chatMessages'
  | 'chatLoading'
  | 'chatPlaceholder'
  | 'chatAgentId'
  | 'chatCustomPrompt'
  | 'chatCustomPromptMatch'
  | 'chatSkillOptions'
  | 'defaultChatSelectedSkillIds'
  | 'pastChatsAgentId'
  | 'onPastChatSessionSelect'
  | 'resizableProps'
  | 'chatDisabledReason'
>) {
  const defaultWidthPx = resizableProps?.defaultWidthPx

  return (
    <PanelChrome
      header={header}
      rootProps={{
        'aria-label': ariaLabel,
        $resizable: false,
        ...(defaultWidthPx !== undefined ? { $widthPx: defaultWidthPx } : {}),
      }}
      activeTab={activeTab}
      onActiveTabChange={onActiveTabChange}
      isResizeable={false}
    >
      {children ??
        (activeTab === AI_TABS[0].id ? (
          <AIAssistantContent
            recommendations={recommendations}
            onRecommendationClick={onRecommendationClick}
            onChatSend={onChatSend}
            chatMessages={chatMessages}
            chatLoading={chatLoading}
            chatPlaceholder={chatPlaceholder}
            chatAgentId={chatAgentId}
            chatCustomPrompt={chatCustomPrompt}
            chatCustomPromptMatch={chatCustomPromptMatch}
            chatSkillOptions={chatSkillOptions}
            defaultChatSelectedSkillIds={defaultChatSelectedSkillIds}
            assistantName={assistantName}
            assistantDescription={assistantDescription}
            chatDisabledReason={chatDisabledReason}
          />
        ) : (
          <PastChatContent
            agentId={pastChatsAgentId ?? ''}
            onSessionSelect={onPastChatSessionSelect ?? (() => undefined)}
          />
        ))}
    </PanelChrome>
  )
}

/**
 * Right-side assistant column. Requires `AIAssistantThemeProvider` with Prism **`Theme`** (`ThemeType`).
 */
export function AIAssistantPanel({
  isResizable = true,
  resizePosition = 'start',
  resizableProps,
  header,
  children,
  recommendations,
  onRecommendationClick,
  onChatSend,
  chatMessages,
  chatLoading,
  chatPlaceholder,
  chatAgentId,
  chatCustomPrompt,
  chatCustomPromptMatch,
  chatSkillOptions,
  defaultChatSelectedSkillIds,
  assistantActiveTabId,
  onAssistantActiveTabChange,
  pastChatsAgentId,
  onPastChatSessionSelect,
  'aria-label': ariaLabel = 'AI Assistant',
  assistantName,
  assistantDescription,
  onAddNewChat,
  chatDisabledReason,
  isCollapsed: controlledIsCollapsed,
  onIsCollapsedChange,
  onReplaceWidget,
  onPinAsNewWidget,
}: AIAssistantPanelProps) {
  const [internalActiveTab, setInternalActiveTab] = React.useState(AI_TABS[0].id)
  const [internalIsCollapsed, setInternalIsCollapsed] = React.useState(false)
  const isControlled = controlledIsCollapsed !== undefined
  const isCollapsed = isControlled ? controlledIsCollapsed : internalIsCollapsed

  const setIsCollapsed = React.useCallback(
    (value: boolean) => {
      if (!isControlled) setInternalIsCollapsed(value)
      onIsCollapsedChange?.(value)
    },
    [isControlled, onIsCollapsedChange]
  )

  const activeTab = assistantActiveTabId ?? internalActiveTab

  const onActiveTabChange = React.useCallback(
    (id: string) => {
      onAssistantActiveTabChange?.(id)
      if (assistantActiveTabId === undefined) {
        setInternalActiveTab(id)
      }
    },
    [assistantActiveTabId, onAssistantActiveTabChange]
  )

  if (!isResizable) {
    return (
      <NonResizableAIAssistantPanel
        header={header}
        aria-label={ariaLabel}
        recommendations={recommendations}
        onRecommendationClick={onRecommendationClick}
        onChatSend={onChatSend}
        chatMessages={chatMessages}
        chatLoading={chatLoading}
        chatPlaceholder={chatPlaceholder}
        chatAgentId={chatAgentId}
        chatCustomPrompt={chatCustomPrompt}
        chatCustomPromptMatch={chatCustomPromptMatch}
        chatSkillOptions={chatSkillOptions}
        defaultChatSelectedSkillIds={defaultChatSelectedSkillIds}
        pastChatsAgentId={pastChatsAgentId}
        onPastChatSessionSelect={onPastChatSessionSelect}
        resizableProps={resizableProps}
        activeTab={activeTab}
        onActiveTabChange={onActiveTabChange}
        assistantName={assistantName}
        assistantDescription={assistantDescription}
        chatDisabledReason={chatDisabledReason}
      >
        {children}
      </NonResizableAIAssistantPanel>
    )
  }

  return (
    <>
      {isCollapsed ? (
        <CollapsedAIAssistantRail onExpand={() => setIsCollapsed(false)} />
      ) : (
        <ResizableAIAssistantPanel
          resizableProps={resizableProps}
          header={header}
          aria-label={ariaLabel}
          resizePosition={resizePosition}
          recommendations={recommendations}
          onRecommendationClick={onRecommendationClick}
          onChatSend={onChatSend}
          chatMessages={chatMessages}
          chatLoading={chatLoading}
          chatPlaceholder={chatPlaceholder}
          chatAgentId={chatAgentId}
          chatCustomPrompt={chatCustomPrompt}
          chatCustomPromptMatch={chatCustomPromptMatch}
          chatSkillOptions={chatSkillOptions}
          defaultChatSelectedSkillIds={defaultChatSelectedSkillIds}
          pastChatsAgentId={pastChatsAgentId}
          onPastChatSessionSelect={onPastChatSessionSelect}
          activeTab={activeTab}
          onActiveTabChange={onActiveTabChange}
          setIsCollapsed={setIsCollapsed}
          assistantName={assistantName}
          assistantDescription={assistantDescription}
          onAddNewChat={onAddNewChat}
          chatDisabledReason={chatDisabledReason}
          onReplaceWidget={onReplaceWidget}
          onPinAsNewWidget={onPinAsNewWidget}
        >
          {children}
        </ResizableAIAssistantPanel>
      )}
    </>
  )
}
