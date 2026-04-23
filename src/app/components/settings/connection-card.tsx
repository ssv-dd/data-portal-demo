import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  Circle,
  CheckCircle2,
} from "lucide-react";
import { Theme } from "@doordash/prism-react";
import { glassPanel, radius } from "@/styles/theme";

const Card = styled(motion.div)`
  ${glassPanel}
  border-radius: ${radius["2xl"]};
  padding: ${Theme.usage.space.xLarge};
  border: 1px solid var(--app-border);
  background: rgb(var(--app-card-rgb) / 0.6);
  backdrop-filter: blur(12px);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.medium};
  margin-bottom: ${Theme.usage.space.large};
  padding-bottom: ${Theme.usage.space.large};
  border-bottom: 1px solid rgb(var(--app-overlay-rgb) / 0.06);
`;

const ProviderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: ${radius.md};
  background: white;
  border: 1px solid rgb(0 0 0 / 0.08);
  padding: 12px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ProviderInfo = styled.div`
  flex: 1;
`;

const ProviderName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--app-fg);
  margin: 0 0 6px 0;
  letter-spacing: -0.01em;
`;

const StatusContainer = styled.div<{
  $variant: "connected" | "disconnected";
}>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: ${radius.md};
  background: ${({ $variant }) =>
    $variant === "connected"
      ? "rgb(16 185 129 / 0.10)"
      : "rgb(0 0 0 / 0.03)"};
  border: 1px solid ${({ $variant }) =>
    $variant === "connected"
      ? "rgb(16 185 129 / 0.2)"
      : "rgb(0 0 0 / 0.06)"};
`;

const StatusIcon = styled.div<{
  $variant: "connected" | "disconnected";
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $variant }) =>
    $variant === "connected"
      ? "#10B981"
      : "var(--app-muted-fg)"};
`;

const StatusText = styled.span<{
  $variant: "connected" | "disconnected";
}>`
  font-size: 11px;
  font-weight: 500;
  color: ${({ $variant }) =>
    $variant === "connected"
      ? "#059669"
      : "var(--app-muted-fg)"};
`;

const Description = styled.p`
  font-size: 14px;
  color: var(--app-muted-fg);
  line-height: 1.6;
  margin: 0 0 ${Theme.usage.space.large} 0;
`;

const ActionButton = styled(motion.button)<{
  $variant?: "primary" | "destructive";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 48px;
  padding: 14px ${Theme.usage.space.large};
  font-size: 15px;
  font-weight: 600;
  border-radius: ${radius.xl};
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  background: ${({ $variant }) =>
    $variant === "destructive"
      ? "linear-gradient(135deg, rgb(239 68 68) 0%, rgb(220 38 38) 100%)"
      : "linear-gradient(135deg, var(--app-fg) 0%, rgb(var(--app-fg-rgb) / 0.9) 100%)"};
  color: ${({ $variant }) =>
    $variant === "destructive" ? "#ffffff" : "var(--app-bg)"};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

// Status icon component
const StatusIconComponent = ({ isConnected }: { isConnected: boolean }) => {
  return isConnected ? <CheckCircle2 size={12} /> : <Circle size={12} />;
};

export function ConnectionCard() {
  const [isConnected, setIsConnected] = useState(() => {
    // Load from localStorage on mount
    return localStorage.getItem('snowflake-connected') === 'true';
  });

  const handleToggle = () => {
    const newState = !isConnected;
    setIsConnected(newState);
    // Save to localStorage
    localStorage.setItem('snowflake-connected', String(newState));
  };

  const status = isConnected ? "connected" : "disconnected";
  const statusText = isConnected ? "Connected" : "Not Connected";
  const descriptionText = isConnected
    ? "Successfully authenticated with your Snowflake account. You can now query data in AI chat and SQL Studio."
    : "Connect to Snowflake to unlock AI-powered data analysis, SQL querying, and collaborative notebooks.";

  const buttonConfig = {
    text: isConnected ? "Disconnect" : "Connect to Snowflake",
    variant: isConnected ? ("destructive" as const) : ("primary" as const),
  };

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <CardHeader>
        <ProviderIcon>
          <img src={`${import.meta.env.BASE_URL}snowflake-icon.svg`} alt="Snowflake" />
        </ProviderIcon>
        <ProviderInfo>
          <ProviderName>Snowflake</ProviderName>
          <StatusContainer $variant={status}>
            <StatusIcon $variant={status}>
              <StatusIconComponent isConnected={isConnected} />
            </StatusIcon>
            <StatusText $variant={status}>{statusText}</StatusText>
          </StatusContainer>
        </ProviderInfo>
      </CardHeader>

      <Description>{descriptionText}</Description>

      <ActionButton
        $variant={buttonConfig.variant}
        onClick={handleToggle}
        aria-label={buttonConfig.text}
      >
        {buttonConfig.text}
      </ActionButton>
    </Card>
  );
}
