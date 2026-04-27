import { ChevronDown } from 'lucide-react'
import * as React from 'react'

import { useOnClickOutside } from '../../../hooks/useOnClickOutside'

import * as S from './CustomDropdown.styles'

export type CustomDropdownOption = {
  value: string
  label: string
  /** Optional icon shown before the label in the list */
  icon?: React.ReactNode
  /** Optional pill/badge rendered after the icon and before the label text (trigger + list). */
  labelBadge?: React.ReactNode
  disabled?: boolean
}

type CustomDropdownProps = {
  /** Current selected value (must match one of options[].value) */
  value: string
  /** List of options */
  options: CustomDropdownOption[]
  /** Called when user selects an option */
  onChange: (value: string) => void
  /** Optional icon shown before the label on the trigger button */
  icon?: React.ReactNode
  /** Optional placeholder when value is not in options */
  placeholder?: string
  /** Optional: 'light' | 'dark' for focus ring; if omitted, uses Theme (theme-aware) */
  themeMode?: 'light' | 'dark'
  /** Optional aria-label for the trigger */
  'aria-label'?: string
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  options,
  onChange,
  icon,
  placeholder = 'Select…',
  themeMode: _themeMode,
  'aria-label': ariaLabel,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  useOnClickOutside(containerRef, () => setIsOpen(false), { enabled: isOpen })

  const current = options.find((o) => o.value === value)
  const displayLabel = current?.label ?? placeholder

  return (
    <S.DropdownWrap ref={containerRef}>
      <S.DropdownTrigger
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        $isOpen={isOpen}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel ?? displayLabel}
      >
        {icon ? <span className="dropdown-trigger-icon">{icon}</span> : null}
        <span className="dropdown-trigger-main">
          <span className="dropdown-trigger-label">{displayLabel}</span>
          {current?.labelBadge ? <span className="dropdown-trigger-badge">{current.labelBadge}</span> : null}
        </span>
        <ChevronDown size={16} className="dropdown-chevron" aria-hidden />
      </S.DropdownTrigger>
      <S.DropdownList $isOpen={isOpen} role="listbox" aria-hidden={!isOpen}>
        {options.map((opt) => (
          <S.DropdownOption
            key={opt.value}
            type="button"
            role="option"
            $isActive={value === opt.value}
            $disabled={opt?.disabled ?? false}
            disabled={opt?.disabled ?? false}
            aria-selected={value === opt.value}
            onClick={() => {
              onChange(opt.value)
              setIsOpen(false)
            }}
          >
            {opt.icon !== undefined && opt.icon !== null ? <span>{opt.icon}</span> : null}
            <span className="dropdown-option-main">
              <span>{opt.label}</span>
              {opt.labelBadge ? <span className="dropdown-option-badge">{opt.labelBadge}</span> : null}
            </span>
          </S.DropdownOption>
        ))}
      </S.DropdownList>
    </S.DropdownWrap>
  )
}
