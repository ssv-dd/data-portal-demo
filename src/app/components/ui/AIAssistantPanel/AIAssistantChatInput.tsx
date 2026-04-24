import { BookOpen, Lock, Plus, Send, X } from 'lucide-react'
import * as React from 'react'

import * as S from './AIAssistantChatInput.styles'
import type { AssistantChatSkillOption } from './assistantChatSkill.types'

const SEND_ICON_SIZE = 18
const ADD_ICON_SIZE = 18
const PILL_ICON_SIZE = 14

export interface AIAssistantChatInputProps {
  readonly onSend?: (message: string) => void | Promise<void>
  readonly placeholder: string
  readonly disabled?: boolean
  readonly value?: string
  readonly onChange?: (value: string) => void
  readonly defaultValue?: string
  readonly 'aria-label'?: string
  /** When non-empty, shows + control, skill popover, and pills (SQL Assistant layout). */
  readonly skillOptions?: readonly AssistantChatSkillOption[]
  /** Controlled selection (skill ids). Omit for uncontrolled mode. */
  readonly selectedSkillIds?: readonly string[]
  /** Initial selection when uncontrolled. */
  readonly defaultSelectedSkillIds?: readonly string[]
  readonly onSelectedSkillIdsChange?: (ids: readonly string[]) => void
  /** Fired when user picks an option with `tone: 'emphasis'` (e.g. add custom). */
  readonly onCustomSkillClick?: () => void
  /** When set, replaces the entire input with a disabled banner showing this message (e.g. "Coming soon"). */
  readonly chatDisabledReason?: string
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref && 'current' in ref) {
        ;(ref as React.MutableRefObject<T | null>).current = node
      }
    }
  }
}

function optionIcon(option: AssistantChatSkillOption) {
  const kind = option.icon ?? (option.tone === 'emphasis' ? 'plus' : 'book')
  return kind === 'plus' ? Plus : BookOpen
}

export const AIAssistantChatInput = React.forwardRef<HTMLTextAreaElement, AIAssistantChatInputProps>(
  function AIAssistantChatInput(
    {
      onSend,
      placeholder,
      disabled = false,
      value: controlledValue,
      onChange,
      defaultValue = '',
      'aria-label': ariaLabel = 'AI assistant message',
      skillOptions = [],
      selectedSkillIds: controlledSkillIds,
      defaultSelectedSkillIds = [],
      onSelectedSkillIdsChange,
      onCustomSkillClick,
      chatDisabledReason,
    },
    forwardedRef
  ) {
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
    const isControlled = controlledValue !== undefined
    const text = isControlled ? controlledValue : uncontrolled

    const [internalSkillIds, setInternalSkillIds] = React.useState<readonly string[]>(defaultSelectedSkillIds)
    const isSkillSelectionControlled = controlledSkillIds !== undefined
    const selectedSkillIds = React.useMemo(
      () => (isSkillSelectionControlled ? (controlledSkillIds ?? []) : internalSkillIds),
      [isSkillSelectionControlled, controlledSkillIds, internalSkillIds]
    )

    const setSelectedSkillIds = React.useCallback(
      (next: readonly string[]) => {
        if (!isSkillSelectionControlled) {
          setInternalSkillIds(next)
        }
        onSelectedSkillIdsChange?.(next)
      },
      [isSkillSelectionControlled, onSelectedSkillIdsChange]
    )

    const setText = React.useCallback(
      (next: string) => {
        if (!isControlled) {
          setUncontrolled(next)
        }
        onChange?.(next)
      },
      [isControlled, onChange]
    )

    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const setTextareaRef = mergeRefs(textareaRef, forwardedRef)
    const addWrapRef = React.useRef<HTMLDivElement>(null)
    const popoverRef = React.useRef<HTMLDivElement>(null)
    const [popoverOpen, setPopoverOpen] = React.useState(false)

    const skillOptionById = React.useMemo(() => {
      const m = new Map<string, AssistantChatSkillOption>()
      for (const o of skillOptions) {
        m.set(o.id, o)
      }
      return m
    }, [skillOptions])

    const togglePopover = React.useCallback(() => {
      setPopoverOpen((o) => !o)
    }, [])

    React.useEffect(() => {
      if (!popoverOpen) {
        return
      }
      const onPointerDown = (e: PointerEvent) => {
        const t = e.target as Node
        if (addWrapRef.current?.contains(t) || popoverRef.current?.contains(t)) {
          return
        }
        setPopoverOpen(false)
      }
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setPopoverOpen(false)
        }
      }
      document.addEventListener('pointerdown', onPointerDown, true)
      document.addEventListener('keydown', onKeyDown)
      return () => {
        document.removeEventListener('pointerdown', onPointerDown, true)
        document.removeEventListener('keydown', onKeyDown)
      }
    }, [popoverOpen])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value)
    }

    const submitMessage = React.useCallback(async () => {
      const trimmed = text.trim()
      if (!trimmed || disabled) {
        return
      }
      if (!isControlled) {
        setUncontrolled('')
      } else {
        onChange?.('')
      }
      textareaRef.current?.focus()
      await onSend?.(trimmed)
    }, [text, disabled, onSend, isControlled, onChange])

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      void submitMessage()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        void submitMessage()
      }
    }

    const canSend = !disabled && text.trim().length > 0

    const addSkill = React.useCallback(
      (option: AssistantChatSkillOption) => {
        if (option.tone === 'emphasis') {
          onCustomSkillClick?.()
          setPopoverOpen(false)
          textareaRef.current?.focus()
          return
        }
        if (selectedSkillIds.includes(option.id)) {
          setPopoverOpen(false)
          return
        }
        setSelectedSkillIds([...selectedSkillIds, option.id])
        setPopoverOpen(false)
        textareaRef.current?.focus()
      },
      [selectedSkillIds, setSelectedSkillIds, onCustomSkillClick]
    )

    const removeSkill = React.useCallback(
      (id: string) => {
        setSelectedSkillIds(selectedSkillIds.filter((x) => x !== id))
      },
      [selectedSkillIds, setSelectedSkillIds]
    )

    const availablePopoverOptions = React.useMemo(
      () => skillOptions.filter((o) => o.tone === 'emphasis' || !selectedSkillIds.includes(o.id)),
      [skillOptions, selectedSkillIds]
    )

    // const showSkillsUi = skillOptions.length > 0
    const showSkillsUi = false // Always hide skills UI (empty state handles no options)

    if (chatDisabledReason) {
      return (
        <S.DisabledOverlay aria-label={chatDisabledReason}>
          <Lock size={14} strokeWidth={2} aria-hidden />
          {chatDisabledReason}
        </S.DisabledOverlay>
      )
    }

    if (!showSkillsUi) {
      return (
        <S.Form onSubmit={handleSubmit} aria-label={ariaLabel}>
          <S.Row>
            <S.TextArea
              ref={setTextareaRef}
              aria-label="Chat message"
              placeholder={placeholder}
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              rows={1}
            />
            <S.SendButton type="submit" disabled={!canSend} aria-label="Send message" $isActive={canSend}>
              <Send size={SEND_ICON_SIZE} strokeWidth={2} aria-hidden />
            </S.SendButton>
          </S.Row>
        </S.Form>
      )
    }

    return (
      <S.Form onSubmit={handleSubmit} aria-label={ariaLabel}>
        <S.Shell>
          <S.TextArea
            ref={setTextareaRef}
            aria-label="Chat message"
            placeholder={placeholder}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={2}
          />
          <S.Toolbar>
            <S.AddButtonWrap ref={addWrapRef}>
              <S.AddButton
                type="button"
                disabled={disabled}
                aria-expanded={popoverOpen}
                aria-haspopup="listbox"
                aria-controls={popoverOpen ? 'ai-assistant-skill-popover' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  if (!disabled) {
                    togglePopover()
                  }
                }}
              >
                <Plus size={ADD_ICON_SIZE} strokeWidth={2} aria-hidden />
              </S.AddButton>
              {popoverOpen ? (
                <S.Popover
                  ref={popoverRef}
                  id="ai-assistant-skill-popover"
                  role="listbox"
                  aria-label="Knowledge bases"
                >
                  <S.PopoverHeader>Knowledge bases</S.PopoverHeader>
                  <S.PopoverList>
                    {availablePopoverOptions.length === 0 ? (
                      <S.PopoverEmpty>All skills are already added.</S.PopoverEmpty>
                    ) : (
                      availablePopoverOptions.map((option) => {
                        const Icon = optionIcon(option)
                        return (
                          <S.PopoverOption
                            key={option.id}
                            type="button"
                            role="option"
                            onClick={() => addSkill(option)}
                          >
                            <S.PopoverOptionIcon>
                              <Icon size={PILL_ICON_SIZE} strokeWidth={2} aria-hidden />
                            </S.PopoverOptionIcon>
                            <S.PopoverOptionText>
                              <S.PopoverOptionTitle>{option.title}</S.PopoverOptionTitle>
                              <S.PopoverOptionDesc>{option.description}</S.PopoverOptionDesc>
                            </S.PopoverOptionText>
                          </S.PopoverOption>
                        )
                      })
                    )}
                  </S.PopoverList>
                </S.Popover>
              ) : null}
            </S.AddButtonWrap>
            <S.PillsRow>
              {selectedSkillIds.map((id) => {
                const opt = skillOptionById.get(id)
                if (!opt) {
                  return null
                }
                const PillIcon = optionIcon(opt)
                return (
                  <S.SkillPill key={id}>
                    <S.SkillPillIcon>
                      <PillIcon size={PILL_ICON_SIZE} strokeWidth={2} aria-hidden />
                    </S.SkillPillIcon>
                    <S.SkillPillLabel>{opt.title}</S.SkillPillLabel>
                    <S.SkillPillRemove
                      type="button"
                      aria-label={`Remove ${opt.title}`}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        removeSkill(id)
                      }}
                    >
                      <X size={12} strokeWidth={2} aria-hidden />
                    </S.SkillPillRemove>
                  </S.SkillPill>
                )
              })}
            </S.PillsRow>
            <S.SendButton type="submit" disabled={!canSend} aria-label="Send message" $isActive={canSend}>
              <Send size={SEND_ICON_SIZE} strokeWidth={2} aria-hidden />
            </S.SendButton>
          </S.Toolbar>
        </S.Shell>
      </S.Form>
    )
  }
)
