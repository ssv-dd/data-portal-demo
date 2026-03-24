import { Link, useLocation } from "react-router";
import { Bell, User, Moon, Sun } from "lucide-react";
import { Badge } from "../ui/badge";
import { Menu, Theme } from "@doordash/prism-react";
import { useTheme } from "@/app/context/theme-context";
import styled from "styled-components";
import { colors, radius, shadows } from "@/styles/theme";

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
  gap: ${Theme.usage.space.small};
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${radius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${colors.violet500}, ${colors.cyan400});
  box-shadow: ${shadows.lg};
`;

const LogoText = styled.span`
  font-size: ${Theme.usage.fontSize.medium};
  font-weight: 600;
  color: ${colors.slate950};
`;

const LogoSeparator = styled.span`
  color: ${colors.slate400};
`;

const LogoSubtext = styled.span`
  font-size: ${Theme.usage.fontSize.medium};
  color: ${colors.slate600};
`;

const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  flex: 1;
`;

const TabLink = styled(Link)<{ $active: boolean }>`
  padding: ${Theme.usage.space.xSmall} 14px;
  border-radius: ${radius.lg};
  transition: all 200ms;
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  text-decoration: none;

  ${({ $active }) =>
    $active
      ? `
    background-color: ${colors.slate900};
    color: ${colors.white};
    box-shadow: ${shadows.sm};
  `
      : `
    color: ${colors.slate600};
    &:hover {
      color: ${colors.slate900};
      background-color: ${colors.slate100};
    }
  `}
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

const tabs = [
  { name: "Home", path: "/" },
  { name: "Dashboards", path: "/dashboards" },
  { name: "SQL Studio", path: "/sql-studio" },
  { name: "Notebooks", path: "/notebooks" },
  { name: "AI Workflows", path: "/ai-workflows" },
];

export function TopNav() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Nav>
      <LogoContainer>
        <LogoIcon>
          <span
            style={{ color: colors.white, fontWeight: 700, fontSize: "18px" }}
          >
            D
          </span>
        </LogoIcon>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <LogoText>DoorDash</LogoText>
          <LogoSeparator>|</LogoSeparator>
          <LogoSubtext>Data Portal</LogoSubtext>
        </div>
      </LogoContainer>

      <TabsContainer>
        {tabs.map((tab) => (
          <TabLink key={tab.path} to={tab.path} $active={isActive(tab.path)}>
            {tab.name}
          </TabLink>
        ))}
      </TabsContainer>

      <ActionsContainer>
        <IconButton onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? <Moon /> : <Sun />}
        </IconButton>
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
