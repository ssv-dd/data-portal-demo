import { Modal, ModalSize } from '@doordash/prism-react'
import { SlidersHorizontal } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

import { FOOTER_ITEMS, NAV_ITEMS } from '../../../constants/navigation'
import {
  TrackingEventAppName,
  TrackingEventName,
  TrackingEventType,
  useTrackingContext,
} from '../../../contexts/TrackingProvider'

import * as S from './AppSidebar.styles'

type SidebarMode = 'icons-text' | 'icons-only'

type Props = {
  hidden?: boolean
}

export const AppSidebar = ({ hidden = false }: Props) => {
  const location = useLocation()
  const { trackEvent } = useTrackingContext()
  const [showCustomizeModal, setShowCustomizeModal] = useState(false)

  const [mode, setMode] = useState<SidebarMode>(() => {
    const stored = localStorage.getItem('data-portal-sidebar-mode')
    return (stored as SidebarMode) || 'icons-text'
  })

  useEffect(() => {
    localStorage.setItem('data-portal-sidebar-mode', mode)
  }, [mode])

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' || location.pathname === ''
    return location.pathname.startsWith(path)
  }

  const handleModeChange = (newMode: SidebarMode) => {
    void trackEvent({
      name: TrackingEventName.SIDEBAR_MODE_CHANGED,
      type: TrackingEventType.CLICK,
      appName: TrackingEventAppName.DATA_PORTAL,
      data: { from: mode, to: newMode },
    })
    setMode(newMode)
    setShowCustomizeModal(false)
  }

  const getWidth = () => {
    if (mode === 'icons-text') return 80
    return 56
  }

  const handleNavClick = (key: string, path: string) => {
    void trackEvent({
      name: TrackingEventName.SIDE_NAVIGATION_ITEM_CLICK,
      type: TrackingEventType.CLICK,
      appName: TrackingEventAppName.DATA_PORTAL,
      data: { itemKey: key, from: location.pathname, to: path, sidebarMode: mode },
    })
  }

  return (
    <>
      <S.SidebarContainer $width={hidden ? 0 : getWidth()} role="navigation" aria-label="Main navigation">
        <S.SidebarInner $hidden={hidden}>
          {mode === 'icons-text' ? (
            <>
              <S.NavSectionIconsText>
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.path)
                  return (
                    <S.NavItemLinkIconsText
                      key={item.key}
                      to={item.path}
                      $disabled={item.disabled}
                      aria-current={active ? 'page' : undefined}
                      aria-disabled={item.disabled}
                      onClick={
                        item.disabled
                          ? (e: React.MouseEvent) => e.preventDefault()
                          : () => handleNavClick(item.key, item.path)
                      }
                    >
                      <S.IconWrapperIconsText>
                        <item.icon />
                      </S.IconWrapperIconsText>
                      <S.LabelIconsText>{item.label}</S.LabelIconsText>
                    </S.NavItemLinkIconsText>
                  )
                })}
              </S.NavSectionIconsText>

              <S.FooterSectionIconsText>
                {FOOTER_ITEMS.map((item) => {
                  const active = isActive(item.path)
                  return (
                    <S.NavItemLinkIconsText
                      key={item.key}
                      to={item.path}
                      $disabled={item.disabled}
                      aria-current={active ? 'page' : undefined}
                      aria-disabled={item.disabled}
                      onClick={
                        item.disabled
                          ? (e: React.MouseEvent) => e.preventDefault()
                          : () => handleNavClick(item.key, item.path)
                      }
                    >
                      <S.IconWrapperIconsText>
                        <item.icon />
                      </S.IconWrapperIconsText>
                      <S.LabelIconsText>{item.label}</S.LabelIconsText>
                    </S.NavItemLinkIconsText>
                  )
                })}

                <S.CustomizeButton
                  onClick={() => {
                    void trackEvent({
                      name: TrackingEventName.SIDEBAR_CUSTOMIZE_MODAL_OPEN,
                      type: TrackingEventType.CLICK,
                      appName: TrackingEventAppName.DATA_PORTAL,
                      data: { sidebarMode: mode },
                    })
                    setShowCustomizeModal(true)
                  }}
                  aria-label="Customize sidebar"
                >
                  <S.IconWrapperIconsText as="span">
                    <SlidersHorizontal />
                  </S.IconWrapperIconsText>
                </S.CustomizeButton>
              </S.FooterSectionIconsText>
            </>
          ) : (
            <>
              <S.NavSectionIconsOnly>
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.path)
                  return (
                    <S.NavItemLinkIconsOnly
                      key={item.key}
                      to={item.path}
                      $disabled={item.disabled}
                      aria-current={active ? 'page' : undefined}
                      aria-label={item.label}
                      aria-disabled={item.disabled}
                      title={item.label}
                      onClick={
                        item.disabled
                          ? (e: React.MouseEvent) => e.preventDefault()
                          : () => handleNavClick(item.key, item.path)
                      }
                    >
                      <S.IconWrapperIconsOnly>
                        <item.icon />
                      </S.IconWrapperIconsOnly>
                    </S.NavItemLinkIconsOnly>
                  )
                })}
              </S.NavSectionIconsOnly>

              <S.FooterSectionIconsOnly>
                {FOOTER_ITEMS.map((item) => {
                  const active = isActive(item.path)
                  return (
                    <S.NavItemLinkIconsOnly
                      key={item.key}
                      to={item.path}
                      $disabled={item.disabled}
                      aria-current={active ? 'page' : undefined}
                      aria-label={item.label}
                      aria-disabled={item.disabled}
                      title={item.label}
                      onClick={
                        item.disabled
                          ? (e: React.MouseEvent) => e.preventDefault()
                          : () => handleNavClick(item.key, item.path)
                      }
                    >
                      <S.IconWrapperIconsOnly>
                        <item.icon />
                      </S.IconWrapperIconsOnly>
                    </S.NavItemLinkIconsOnly>
                  )
                })}

                <S.CustomizeButtonIconsOnly
                  aria-label="Customize sidebar"
                  title="Customize"
                  onClick={() => {
                    void trackEvent({
                      name: TrackingEventName.SIDEBAR_CUSTOMIZE_MODAL_OPEN,
                      type: TrackingEventType.CLICK,
                      appName: TrackingEventAppName.DATA_PORTAL,
                      data: { sidebarMode: mode },
                    })
                    setShowCustomizeModal(true)
                  }}
                >
                  <S.IconWrapperIconsOnly>
                    <SlidersHorizontal />
                  </S.IconWrapperIconsOnly>
                </S.CustomizeButtonIconsOnly>
              </S.FooterSectionIconsOnly>
            </>
          )}
        </S.SidebarInner>
      </S.SidebarContainer>

      <Modal
        isOpen={showCustomizeModal}
        title="Customize Sidebar"
        size={ModalSize.medium}
        onOpenChange={setShowCustomizeModal}
      >
        <S.ModalDescription>Choose your preferred sidebar layout.</S.ModalDescription>
        <S.RadioGroup>
          <S.RadioOption $selected={mode === 'icons-only'}>
            <S.RadioInput
              type="radio"
              name="sidebar-mode"
              value="icons-only"
              checked={mode === 'icons-only'}
              onChange={() => handleModeChange('icons-only')}
            />
            <S.RadioContent>
              <S.RadioLabel>Icons only</S.RadioLabel>
              <S.RadioDescription>Compact icon rail for maximum workspace.</S.RadioDescription>
            </S.RadioContent>
          </S.RadioOption>

          <S.RadioOption $selected={mode === 'icons-text'}>
            <S.RadioInput
              type="radio"
              name="sidebar-mode"
              value="icons-text"
              checked={mode === 'icons-text'}
              onChange={() => handleModeChange('icons-text')}
            />
            <S.RadioContent>
              <S.RadioLabel>Icons &amp; text</S.RadioLabel>
              <S.RadioDescription>Shows icons with labels for easier navigation.</S.RadioDescription>
            </S.RadioContent>
          </S.RadioOption>
        </S.RadioGroup>
      </Modal>
    </>
  )
}
