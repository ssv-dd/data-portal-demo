import { Copy, PinIcon, Replace } from 'lucide-react'
import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import {
  ChartArtifact,
  MessageFooter,
  MessageResponse,
  MetricCard,
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
  TableArtifact,
  ThinkingShimmer,
  ToolCallItem,
} from '../../../features/ai-chat'
import { FollowUpChips } from '../../../features/search/components/FollowUpChips'
import type { ChatMessage, ChartData } from '../../../features/search/types/aiSearch'
import { stripBackendContext } from '../../../features/search/utils/messageFormatters'
import { inferAxesFromSql, toPinnableChartType } from '../../../utils/sqlAxisInference'

import * as S from './AIAssistantChatThread.styles'
import type { WidgetActionPayload } from './aiAssistant.types'
import { extractUserWrittenPrompt } from './aiAssistantPrompt'

async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // ignore
  }
}

function buildWidgetActionPayload(message: ChatMessage, chart: ChartData): WidgetActionPayload | null {
  const sql = chart.sql ?? message.sql
  if (!sql) return null

  const chartType = toPinnableChartType(chart.type)
  if (!chartType) return null

  const backendXKey = chart.config?.xAxisKey
  const backendYKey = chart.config?.yAxisKey

  if (backendXKey && backendYKey) {
    return { sql, chartType, xKey: backendXKey, yKeys: [backendYKey] }
  }

  const inferred = inferAxesFromSql(sql)
  if (!inferred.xKey || inferred.yKeys.length === 0) return null

  return { sql, chartType, xKey: inferred.xKey, yKeys: inferred.yKeys }
}

export interface AIAssistantChatThreadProps {
  readonly messages: readonly ChatMessage[]
  readonly customPrompt?: string
  readonly customPromptMatch?: RegExp
  readonly onFollowUpClick?: (text: string) => void
  readonly onReplaceWidget?: (payload: WidgetActionPayload) => void
  readonly onPinAsNewWidget?: (payload: WidgetActionPayload) => void
}

export const AIAssistantChatThread: React.FC<AIAssistantChatThreadProps> = ({
  messages,
  customPrompt,
  customPromptMatch,
  onFollowUpClick,
  onReplaceWidget,
  onPinAsNewWidget,
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages])

  const filteredMessages = React.useMemo(() => {
    if (!customPromptMatch) {
      return messages
    }
    return messages.map((m) => {
      if (m.role === 'user' && m.displayContent) {
        return {
          ...m,
          displayContent: extractUserWrittenPrompt(m.displayContent, customPromptMatch),
        }
      }
      return m
    })
  }, [messages, customPromptMatch])

  if (messages.length === 0) {
    return null
  }

  return (
    <S.ThreadRoot>
      <S.ScrollArea ref={scrollRef}>
        <S.ThreadList>
          {filteredMessages.map((message) => (
            <S.MessageBlock key={message.id} $isUser={message.role === 'user'}>
              {message.role === 'user' ? (
                <S.UserBubble>
                  {extractUserWrittenPrompt(message.displayContent ?? message.content, customPromptMatch)}
                </S.UserBubble>
              ) : (
                <>
                  {message.status === 'pending' &&
                    (!message.toolCalls || message.toolCalls.length === 0) &&
                    !message.content && <ThinkingShimmer />}

                  {message.toolCalls && message.toolCalls.length > 0 && (
                    <Reasoning
                      isStreaming={message.status !== 'completed'}
                      toolCount={message.toolCalls.length}
                    >
                      <ReasoningTrigger />
                      <ReasoningContent>
                        {message.toolCalls.map((call, idx) => (
                          <ToolCallItem key={`${call.name}-${idx}`} {...call} />
                        ))}
                      </ReasoningContent>
                    </Reasoning>
                  )}

                  {message.content ? (
                    <S.AssistantBubble>
                      <S.MarkdownBody>
                        <MessageResponse>
                          {stripBackendContext(message.displayContent ?? message.content)}
                        </MessageResponse>
                      </S.MarkdownBody>

                      <MessageFooter message={message} />

                      {onFollowUpClick &&
                        message.suggestedFollowUps &&
                        message.suggestedFollowUps.length > 0 && (
                          <FollowUpChips
                            suggestions={message.suggestedFollowUps}
                            onFollowUpClick={onFollowUpClick}
                          />
                        )}
                    </S.AssistantBubble>
                  ) : null}

                  {message.metrics && message.metrics.length > 0 ? (
                    <S.MetricsGrid>
                      {message.metrics.map((metric, idx) => (
                        <MetricCard key={`metric-${idx}`} {...metric} />
                      ))}
                    </S.MetricsGrid>
                  ) : null}

                  {message.charts && message.charts.length > 0 ? (
                    <S.ChartsSection>
                      {message.charts.map((chart, idx) => {
                        if (chart.type === 'table') {
                          return (
                            <TableArtifact
                              key={`chart-${idx}`}
                              title={chart.title}
                              description={chart.description}
                              data={chart.tableData || []}
                            />
                          )
                        }

                        const chartSql = chart.sql ?? message.sql
                        const hasData = chart.series.some((s) => s.dataPoints.length > 0)
                        const showActions =
                          Boolean(chartSql) &&
                          hasData &&
                          message.status === 'completed' &&
                          (onReplaceWidget || onPinAsNewWidget)

                        const chartElement = (
                          <ChartArtifact
                            type={chart.type as 'line' | 'bar' | 'area' | 'pie'}
                            title={chart.title}
                            description={chart.description}
                            series={chart.series}
                            config={chart.config}
                            height={chart.height ?? 220}
                          />
                        )

                        if (!showActions)
                          return <React.Fragment key={`chart-${idx}`}>{chartElement}</React.Fragment>

                        return (
                          <S.ChartWithActions key={`chart-${idx}`}>
                            {chartElement}
                            <S.ChartActionFooter>
                              {onPinAsNewWidget && (
                                <S.ChartActionPrimary
                                  type="button"
                                  onClick={() => {
                                    const payload = buildWidgetActionPayload(message, chart)
                                    if (payload) onPinAsNewWidget(payload)
                                  }}
                                >
                                  <PinIcon size={13} />
                                  Pin to Canvas
                                </S.ChartActionPrimary>
                              )}
                              {onReplaceWidget && (
                                <S.ChartActionSecondary
                                  type="button"
                                  onClick={() => {
                                    const payload = buildWidgetActionPayload(message, chart)
                                    if (payload) onReplaceWidget(payload)
                                  }}
                                >
                                  <Replace size={13} />
                                  Replace Widget
                                </S.ChartActionSecondary>
                              )}
                            </S.ChartActionFooter>
                          </S.ChartWithActions>
                        )
                      })}
                    </S.ChartsSection>
                  ) : null}

                  {message.recommendations && message.recommendations.length > 0 ? (
                    <S.RecommendationsCard>
                      <S.RecommendationsTitle>Recommendations</S.RecommendationsTitle>
                      <S.RecommendationsList>
                        {message.recommendations.map((rec, idx) => (
                          <S.RecommendationItem key={`rec-${idx}`}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{rec}</ReactMarkdown>
                          </S.RecommendationItem>
                        ))}
                      </S.RecommendationsList>
                    </S.RecommendationsCard>
                  ) : null}

                  {message.content ? (
                    <S.AssistantActions>
                      <S.IconButton
                        type="button"
                        aria-label="Copy message"
                        onClick={() => void copyText(stripBackendContext(message.content))}
                      >
                        <Copy size={16} strokeWidth={2} />
                      </S.IconButton>
                    </S.AssistantActions>
                  ) : null}
                </>
              )}
            </S.MessageBlock>
          ))}
        </S.ThreadList>
      </S.ScrollArea>
    </S.ThreadRoot>
  )
}
