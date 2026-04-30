import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { Bell, ChevronDown, Moon, Sun, SwatchBook, User, Check } from "lucide-react";
import { Badge } from "../ui/badge";
import { Theme } from "@doordash/prism-react";
import { useTheme } from "@/app/context/theme-context";
import styled from "styled-components";
import { colors, radius } from "@/styles/theme";

const Nav = styled.nav`
  height: 56px;
  border-bottom: 1px solid ${colors.slate200};
  background: var(--app-nav-bg);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  padding: 0 ${Theme.usage.space.large};
  gap: ${Theme.usage.space.large};
  position: sticky;
  top: 0;
  z-index: 40;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LogoIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  object-fit: cover;
`;

const LogoText = styled.span`
  font-size: ${Theme.usage.fontSize.medium};
  font-weight: 700;
  color: ${colors.slate950};
  letter-spacing: 0.5px;
`;

const LogoSeparator = styled.span`
  color: ${colors.slate300};
  font-weight: 300;
  font-size: 20px;
`;

const LogoSubtext = styled.span`
  font-size: ${Theme.usage.fontSize.medium};
  font-weight: 500;
  color: ${colors.slate600};
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const Spacer = styled.div`
  flex: 1;
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const IconButton = styled.button`
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${radius.lg};
  transition: all 200ms;
  position: relative;
  color: ${colors.slate600};

  &:hover {
    background-color: ${colors.slate100};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ThemeAppearanceTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${radius.lg};
  transition: all 200ms;
  color: ${colors.slate600};
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${colors.slate100};
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  .chevron {
    width: 16px;
    height: 16px;
    opacity: 0.75;
  }
`;

const NotificationBadge = styled(Badge)`
  position: absolute;
  top: ${Theme.usage.space.xxSmall};
  right: ${Theme.usage.space.xxSmall};
  width: 16px;
  height: 16px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${Theme.usage.fontSize.xxSmall};
`;

const AvatarButton = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${radius.xl};
  background-color: ${colors.slate200};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: ${colors.slate300};
  }

  svg {
    width: 16px;
    height: 16px;
    color: ${colors.slate600};
  }
`;

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

const PopoverWrap = styled.div`
  position: relative;
  display: inline-flex;
`;

const PopoverPanel = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 9990;
  min-width: 220px;
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  padding: 4px;
`;

const PopoverItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  font-size: 13px;
  font-family: inherit;
  color: ${colors.foreground};
  background: ${({ $active }) => $active ? 'rgb(var(--app-muted-rgb) / 0.4)' : 'transparent'};
  border: none;
  border-radius: ${radius.md};
  cursor: pointer;
  text-align: left;
  transition: background 100ms;

  &:hover { background: rgb(var(--app-muted-rgb) / 0.5); }
`;

export function TopNav() {
  const { theme, toggleTheme, useStockPrismDark, setTheme, setUseStockPrismDark } =
    useTheme();

  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);
  const notifsRef = useRef<HTMLDivElement>(null);

  useClickOutside(themeRef, useCallback(() => setThemeMenuOpen(false), []));
  useClickOutside(notifsRef, useCallback(() => setNotifsOpen(false), []));

  const appearanceOptions = useMemo(
    () => [
      { label: "Light", selected: theme === "light", action: () => setTheme("light") },
      { label: "Dark · custom app", selected: theme === "dark" && !useStockPrismDark, action: () => { setTheme("dark"); setUseStockPrismDark(false); } },
      { label: "Dark · Prism neutral", selected: theme === "dark" && useStockPrismDark, action: () => { setTheme("dark"); setUseStockPrismDark(true); } },
    ],
    [theme, useStockPrismDark, setTheme, setUseStockPrismDark],
  );

  return (
    <Nav>
      <LogoContainer>
        <LogoIcon src={`${import.meta.env.BASE_URL}dd-logo.png`} alt="DoorDash" />
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <LogoText>OPS</LogoText>
          <LogoSeparator>/</LogoSeparator>
          <LogoSubtext>
            Data Portal
            <ChevronDown style={{ width: 14, height: 14, opacity: 0.5 }} />
          </LogoSubtext>
        </div>
      </LogoContainer>

      <Spacer />

      <ActionsContainer>
        <IconButton onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? <Moon /> : <Sun />}
        </IconButton>

        <PopoverWrap ref={themeRef}>
          <ThemeAppearanceTrigger type="button" onClick={() => setThemeMenuOpen(!themeMenuOpen)}>
            <SwatchBook />
            <ChevronDown className="chevron" aria-hidden />
          </ThemeAppearanceTrigger>
          {themeMenuOpen && (
            <PopoverPanel>
              {appearanceOptions.map((opt) => (
                <PopoverItem key={opt.label} $active={opt.selected} onClick={() => { opt.action(); setThemeMenuOpen(false); }}>
                  {opt.selected && <Check style={{ width: 14, height: 14 }} />}
                  {opt.label}
                </PopoverItem>
              ))}
            </PopoverPanel>
          )}
        </PopoverWrap>

        <PopoverWrap ref={notifsRef}>
          <IconButton onClick={() => setNotifsOpen(!notifsOpen)}>
            <Bell />
            <NotificationBadge variant="destructive">2</NotificationBadge>
          </IconButton>
          {notifsOpen && (
            <PopoverPanel>
              <PopoverItem onClick={() => setNotifsOpen(false)}>Asset pending verification</PopoverItem>
              <PopoverItem onClick={() => setNotifsOpen(false)}>Dashboard shared with you</PopoverItem>
            </PopoverPanel>
          )}
        </PopoverWrap>

        <AvatarButton>
          <User />
        </AvatarButton>
      </ActionsContainer>
    </Nav>
  );
}
