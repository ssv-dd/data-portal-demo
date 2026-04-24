import { ChevronDown } from 'lucide-react'
import { type ReactNode, useCallback, useRef, useState } from 'react'

import { useOnClickOutside } from '../../../hooks/useOnClickOutside'

import * as S from './MenuDropdown.styles'

export interface MenuDropdownItem {
  readonly key: string
  readonly label: string
  readonly icon?: ReactNode
  readonly disabled?: boolean
  readonly onClick?: () => void
}

interface MenuDropdownProps {
  readonly label: ReactNode
  readonly icon?: ReactNode
  readonly items: readonly MenuDropdownItem[]
}

export const MenuDropdown = ({ label, icon, items }: MenuDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(wrapperRef, () => setIsOpen(false), { enabled: isOpen })

  const handleItemClick = useCallback((item: MenuDropdownItem) => {
    if (item.disabled) return
    setIsOpen(false)
    item.onClick?.()
  }, [])

  return (
    <S.Wrapper ref={wrapperRef}>
      <S.Trigger onClick={() => setIsOpen((prev) => !prev)}>
        {icon}
        {label}
        <ChevronDown size={14} />
      </S.Trigger>
      {isOpen && (
        <S.Menu>
          {items.map((item) => (
            <S.MenuItem key={item.key} $disabled={item.disabled} onClick={() => handleItemClick(item)}>
              {item.icon}
              {item.label}
            </S.MenuItem>
          ))}
        </S.Menu>
      )}
    </S.Wrapper>
  )
}
