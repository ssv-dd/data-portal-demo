import styled from 'styled-components';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';
import { colors, radius, Theme } from '@/styles/theme';
import type { ProductArea } from '@/types';

interface ScorecardContextBarProps {
  areas: ProductArea[];
  selectedAreas: string[];
  onToggleArea: (areaId: string) => void;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

const StyledCard = styled(Card)`
  padding: ${Theme.usage.space.medium};
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 64px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.medium};
`;

const ProductAreasSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const Label = styled.span`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
`;

const ScrollContainer = styled.div`
  position: relative;
`;

const ButtonList = styled.div`
  display: flex;
  gap: ${Theme.usage.space.xSmall};
  overflow-x: auto;
  max-width: 750px;
  padding-bottom: ${Theme.usage.space.xxSmall};
  scrollbar-width: thin;
`;

const AreaButton = styled(Button)`
  font-size: ${Theme.usage.fontSize.xxSmall};
  white-space: nowrap;
  flex-shrink: 0;
`;

const FadeIndicator = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: ${Theme.usage.space.xxSmall};
  width: 64px;
  background: linear-gradient(to left, ${colors.white}, rgb(var(--app-surface-rgb) / 0.8), transparent);
  pointer-events: none;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.medium};
  flex-shrink: 0;
`;

const ComparisonSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const ComparisonLabel = styled.span`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
`;

const StyledSelect = styled.select`
  font-size: ${Theme.usage.fontSize.xSmall};
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.xSmall};
  border-radius: ${radius.md};
  border: 1px solid ${colors.border};
  background-color: ${colors.background};
  color: ${colors.foreground};
`;

const UpdatedInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const SubsidiaryCallout = styled.div`
  margin-top: ${Theme.usage.space.small};
  padding-top: ${Theme.usage.space.small};
  border-top: 1px solid ${colors.border};
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const ScopeLabel = styled.span`
  font-weight: 500;
`;

const Separator = styled.span`
  margin: 0 ${Theme.usage.space.xSmall};
`;

const WarningText = styled.span`
  color: ${colors.yellow600};
`;

export function ScorecardContextBar({
  areas,
  selectedAreas,
  onToggleArea,
  timeRange,
  onTimeRangeChange,
}: ScorecardContextBarProps) {
  return (
    <StyledCard>
      <TopRow>
        <LeftSection>
          <ProductAreasSection>
            <Label>Product Areas:</Label>
            <ScrollContainer>
              <ButtonList>
                {areas.map(area => (
                  <AreaButton
                    key={area.id}
                    variant={selectedAreas.includes(area.id) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onToggleArea(area.id)}
                  >
                    {area.name}
                  </AreaButton>
                ))}
              </ButtonList>
              <FadeIndicator />
            </ScrollContainer>
          </ProductAreasSection>
        </LeftSection>
        <RightSection>
          <ComparisonSection>
            <ComparisonLabel>Comparison:</ComparisonLabel>
            <StyledSelect
              value={timeRange}
              onChange={(e) => onTimeRangeChange(e.target.value)}
            >
              <option value="dod">DoD</option>
              <option value="wow">WoW</option>
              <option value="mom">MoM</option>
              <option value="yoy">YoY</option>
            </StyledSelect>
          </ComparisonSection>
          <UpdatedInfo>
            <RefreshCw style={{ height: '12px', width: '12px' }} />
            Updated 5 mins ago
          </UpdatedInfo>
        </RightSection>
      </TopRow>

      <SubsidiaryCallout>
        <ScopeLabel>Scope:</ScopeLabel> DoorDash US, DoorDash Canada, SevenRooms
        <Separator>|</Separator>
        <WarningText>⚠️ Excludes: Wolt, Deliveroo (pending integration)</WarningText>
      </SubsidiaryCallout>
    </StyledCard>
  );
}
