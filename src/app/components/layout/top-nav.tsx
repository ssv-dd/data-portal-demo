import { useMemo } from "react";
import { Bell, ChevronDown, Moon, Sun, SwatchBook, User } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Menu,
  MenuAlignment,
  MenuSelectType,
  Theme,
} from "@doordash/prism-react";
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

export function TopNav() {
  const { theme, toggleTheme, useStockPrismDark, setTheme, setUseStockPrismDark } =
    useTheme();

  const appearanceMenuContent = useMemo(
    () => [
      {
        title: "Light",
        selectType: MenuSelectType.radio,
        isSelected: theme === "light",
        onClick: () => setTheme("light"),
      },
      {
        title: "Dark · custom app",
        selectType: MenuSelectType.radio,
        isSelected: theme === "dark" && !useStockPrismDark,
        onClick: () => {
          setTheme("dark");
          setUseStockPrismDark(false);
        },
      },
      {
        title: "Dark · Prism neutral",
        selectType: MenuSelectType.radio,
        isSelected: theme === "dark" && useStockPrismDark,
        onClick: () => {
          setTheme("dark");
          setUseStockPrismDark(true);
        },
      },
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
        <Menu
          alignMenu={MenuAlignment.bottomRight}
          menuContainerStyles={{ minWidth: 232 }}
          content={appearanceMenuContent}
          renderMenuControl={({ describedBy, accessibilityAttributes }) => (
            <ThemeAppearanceTrigger
              type="button"
              aria-describedby={describedBy}
              aria-label="Theme: light, custom dark, or Prism neutral dark"
              title="Choose light mode, custom app dark, or Prism default neutral dark"
              {...accessibilityAttributes}
            >
              <SwatchBook />
              <ChevronDown className="chevron" aria-hidden />
            </ThemeAppearanceTrigger>
          )}
        />
        <Menu
          renderMenuControl={({ describedBy, accessibilityAttributes }) => (
            <IconButton
              aria-describedby={describedBy}
              {...accessibilityAttributes}
            >
              <Bell />
              <NotificationBadge variant="destructive">2</NotificationBadge>
            </IconButton>
          )}
          content={[
            { title: "Asset pending verification" },
            { title: "Dashboard shared with you" },
          ]}
        />
        <AvatarButton>
          <User />
        </AvatarButton>
      </ActionsContainer>
    </Nav>
  );
}
