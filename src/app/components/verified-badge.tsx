import { CheckCircle, Circle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import styled from "styled-components";
import { Theme } from "@doordash/prism-react";
import { colors, radius } from "@/styles/theme";

const BadgeWrapper = styled.div<{ $verified: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.xSmall};
  border-radius: ${radius.md};
  font-size: ${Theme.usage.fontSize.xxSmall};
  background: ${({ $verified }) =>
    $verified ? "#f0fdf4" : "rgba(236, 236, 240, 0.5)"};
  color: ${({ $verified }) => ($verified ? "#15803d" : colors.mutedForeground)};
  border: 1px solid
    ${({ $verified }) => ($verified ? "#bbf7d0" : colors.border)};
`;

interface VerifiedBadgeProps {
  verified: boolean;
  verifiedBy?: string;
  verifiedDate?: string;
}

export function VerifiedBadge({
  verified,
  verifiedBy,
  verifiedDate,
}: VerifiedBadgeProps) {
  const tooltipContent = verified
    ? `Verified: Approved for organizational AI insights by ${verifiedBy || "Unknown"} on ${verifiedDate || "Unknown date"}`
    : "Unverified: Not eligible for org AI summaries";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <BadgeWrapper $verified={verified}>
            {verified ? (
              <CheckCircle style={{ width: 12, height: 12 }} />
            ) : (
              <Circle style={{ width: 12, height: 12 }} />
            )}
            <span>{verified ? "Verified" : "Unverified"}</span>
          </BadgeWrapper>
        </TooltipTrigger>
        <TooltipContent>
          <p style={{ fontSize: "12px" }}>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
