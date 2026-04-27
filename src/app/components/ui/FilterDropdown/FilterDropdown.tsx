import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, type LucideIcon } from 'lucide-react'
import * as React from 'react'

import { useOnClickOutside } from '../../../hooks/useOnClickOutside'

import * as S from './FilterDropdown.styles'

export interface FilterDropdownOption {
  readonly id: string
  readonly label: string
  readonly icon?: LucideIcon
}

interface FilterDropdownProps {
  readonly options: readonly FilterDropdownOption[]
  readonly value: string
  readonly onChange: (value: string) => void
  readonly icon?: LucideIcon
  readonly minWidth?: string
  readonly maxHeight?: string
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  options,
  value,
  onChange,
  icon: TriggerIcon,
  minWidth,
  maxHeight,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  useOnClickOutside(containerRef, () => setIsOpen(false), { enabled: isOpen })

  const handleSelect = React.useCallback(
    (id: string) => {
      onChange(id)
      setIsOpen(false)
    },
    [onChange]
  )

  const activeOption = options.find((o) => o.id === value)

  return (
    <S.Container ref={containerRef}>
      <S.TriggerButton onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        {TriggerIcon && <TriggerIcon size={14} />}
        <span>{activeOption?.label ?? value}</span>
        <S.ChevronIcon $isOpen={isOpen}>
          <ChevronDown size={14} />
        </S.ChevronIcon>
      </S.TriggerButton>

      <AnimatePresence>
        {isOpen && (
          <S.Dropdown
            as={motion.div}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
            $minWidth={minWidth}
            $maxHeight={maxHeight}
          >
            {options.map((option) => {
              const OptionIcon = option.icon
              return (
                <S.DropdownOption
                  key={option.id}
                  $isActive={value === option.id}
                  onClick={() => handleSelect(option.id)}
                >
                  {OptionIcon && <OptionIcon size={16} />}
                  <span>{option.label}</span>
                </S.DropdownOption>
              )
            })}
          </S.Dropdown>
        )}
      </AnimatePresence>
    </S.Container>
  )
}
