import * as React from 'react'

import { useGetChatSessionsByAgent } from '../../../hooks/useGetChatSessionsByAgent'

import * as S from './PastChatContent.styles'
import { extractUserWrittenPrompt } from './aiAssistantPrompt'

export interface PastChatContentProps {
  /** Ask Data AI agent id passed to `filter_object.filter_value` (with `filter_key=agent_id`). */
  readonly agentId: string
  readonly onSessionSelect: (chatSessionId: string) => void
  customPromptMatch?: RegExp
}

function parseSessionTimestamp(timestamp: unknown): Date | null {
  if (timestamp === null || timestamp === undefined) return null
  if (timestamp instanceof Date) {
    return Number.isNaN(timestamp.getTime()) ? null : timestamp
  }
  if (typeof timestamp === 'string' && timestamp.trim()) {
    const d = new Date(timestamp)
    return Number.isNaN(d.getTime()) ? null : d
  }
  if (typeof timestamp === 'object' && timestamp !== null && 'seconds' in timestamp) {
    const s = (timestamp as { seconds?: number }).seconds
    if (typeof s === 'number') {
      const d = new Date(s * 1000)
      return Number.isNaN(d.getTime()) ? null : d
    }
  }
  return null
}

function formatLastMessageLine(timestamp: unknown): string {
  const d = parseSessionTimestamp(timestamp)
  if (!d) {
    return 'Last message —'
  }
  const datePart = d.toLocaleDateString(undefined, {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  })
  return `Last message ${datePart}`
}

const PastChatContent: React.FC<PastChatContentProps> = ({ agentId, onSessionSelect, customPromptMatch }) => {
  const agentOk = !!agentId.trim()

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetChatSessionsByAgent('ai-assistant-past-chats', agentId, agentOk)

  const sessions = React.useMemo(() => data?.pages.flatMap((page) => page.chatSessions ?? []) ?? [], [data])

  const listRef = React.useRef<HTMLUListElement>(null)

  const onScroll = React.useCallback(() => {
    const el = listRef.current
    if (!el || !hasNextPage || isFetchingNextPage) return
    const { scrollTop, scrollHeight, clientHeight } = el
    if (scrollHeight - scrollTop - clientHeight < 80) {
      void fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (!agentOk) {
    return (
      <S.Root>
        <S.Heading>Your chats</S.Heading>
        <S.EmptyState>No agent is configured to load chat history.</S.EmptyState>
      </S.Root>
    )
  }

  return (
    <S.Root>
      <S.Heading>Your chats</S.Heading>
      {isError ? (
        <S.ErrorState>Could not load chat history. Try again later.</S.ErrorState>
      ) : isLoading && sessions.length === 0 ? (
        <S.EmptyState>Loading chats…</S.EmptyState>
      ) : sessions.length === 0 ? (
        <S.EmptyState>No past chats for this assistant yet.</S.EmptyState>
      ) : (
        <S.List ref={listRef} onScroll={onScroll} role="list">
          {sessions.map((session) => {
            const id = session.chatSessionId?.trim()
            if (!id) return null
            return (
              <S.Item key={id} role="none">
                <S.ItemButton
                  type="button"
                  onClick={() => onSessionSelect(id)}
                  aria-label={`Open chat: ${session.chatSessionSummary || id}`}
                >
                  <S.ItemTitle>
                    {extractUserWrittenPrompt(
                      session.chatSessionSummary || id || 'Untitled chat',
                      customPromptMatch
                    )}
                  </S.ItemTitle>
                  <S.ItemMeta>{formatLastMessageLine(session.timestamp)}</S.ItemMeta>
                </S.ItemButton>
              </S.Item>
            )
          })}
          {isFetchingNextPage ? (
            <S.Item role="none">
              <S.EmptyState style={{ margin: 0, padding: '12px 0' }}>Loading more…</S.EmptyState>
            </S.Item>
          ) : null}
        </S.List>
      )}
    </S.Root>
  )
}

export default PastChatContent
