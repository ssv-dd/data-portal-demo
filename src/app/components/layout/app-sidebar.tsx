import { Modal, ModalSize } from '@doordash/prism-react';
import { SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import * as S from './app-sidebar.styles';
import { FOOTER_ITEMS, NAV_ITEMS } from '@/app/constants/navigation';

type SidebarMode = 'icons-text' | 'icons-only';

type Props = {
  hidden?: boolean;
};

export const AppSidebar = ({ hidden = false }: Props) => {
  const location = useLocation();
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  const [mode, setMode] = useState<SidebarMode>(() => {
    const stored = localStorage.getItem('data-portal-sidebar-mode');
    return (stored as SidebarMode) || 'icons-text';
  });

  useEffect(() => {
    localStorage.setItem('data-portal-sidebar-mode', mode);
  }, [mode]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '';
    return location.pathname.startsWith(path);
  };

  const handleModeChange = (newMode: SidebarMode) => {
    setMode(newMode);
    setShowCustomizeModal(false);
  };

  const getWidth = () => {
    if (mode === 'icons-text') return 80;
    return 56;
  };

  return (
    <>
      <S.SidebarContainer $width={hidden ? 0 : getWidth()} role="navigation" aria-label="Main navigation">
        <S.SidebarInner $hidden={hidden}>
          {mode === 'icons-text' ? (
            <>
              <S.NavSectionIconsText>
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <S.NavItemLinkIconsText
                      key={item.key}
                      to={item.path}
                      $disabled={item.disabled}
                      aria-current={active ? 'page' : undefined}
                      aria-disabled={item.disabled}
                      onClick={item.disabled ? (e: React.MouseEvent) => e.preventDefault() : undefined}
                    >
                      <S.IconWrapperIconsText>
                        <item.icon />
                      </S.IconWrapperIconsText>
                      <S.LabelIconsText>{item.label}</S.LabelIconsText>
                    </S.NavItemLinkIconsText>
                  );
                })}
              </S.NavSectionIconsText>

              <S.FooterSectionIconsText>
                {FOOTER_ITEMS.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <S.NavItemLinkIconsText
                      key={item.key}
                      to={item.path}
                      $disabled={item.disabled}
                      aria-current={active ? 'page' : undefined}
                      aria-disabled={item.disabled}
                      onClick={item.disabled ? (e: React.MouseEvent) => e.preventDefault() : undefined}
                    >
                      <S.IconWrapperIconsText>
                        <item.icon />
                      </S.IconWrapperIconsText>
                      <S.LabelIconsText>{item.label}</S.LabelIconsText>
                    </S.NavItemLinkIconsText>
                  );
                })}

                <S.CustomizeButton onClick={() => setShowCustomizeModal(true)} aria-label="Customize sidebar">
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
                  const active = isActive(item.path);
                  return (
                    <S.NavItemLinkIconsOnly
                      key={item.key}
                      to={item.path}
                      $disabled={item.disabled}
                      aria-current={active ? 'page' : undefined}
                      aria-label={item.label}
                      aria-disabled={item.disabled}
                      title={item.label}
                      onClick={item.disabled ? (e: React.MouseEvent) => e.preventDefault() : undefined}
                    >
                      <S.IconWrapperIconsOnly>
                        <item.icon />
                      </S.IconWrapperIconsOnly>
                    </S.NavItemLinkIconsOnly>
                  );
                })}
              </S.NavSectionIconsOnly>

              <S.FooterSectionIconsOnly>
                {FOOTER_ITEMS.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <S.NavItemLinkIconsOnly
                      key={item.key}
                      to={item.path}
                      $disabled={item.disabled}
                      aria-current={active ? 'page' : undefined}
                      aria-label={item.label}
                      aria-disabled={item.disabled}
                      title={item.label}
                      onClick={item.disabled ? (e: React.MouseEvent) => e.preventDefault() : undefined}
                    >
                      <S.IconWrapperIconsOnly>
                        <item.icon />
                      </S.IconWrapperIconsOnly>
                    </S.NavItemLinkIconsOnly>
                  );
                })}

                <S.CustomizeButtonIconsOnly
                  aria-label="Customize sidebar"
                  title="Customize"
                  onClick={() => setShowCustomizeModal(true)}
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
  );
};
