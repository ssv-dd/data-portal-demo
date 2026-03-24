import { useState } from 'react';
import styled from 'styled-components';
import { Button } from './ui/button';
import {
  Settings,
  X,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Theme } from '@doordash/prism-react';
import { colors, radius, shadows } from '@/styles/theme';
import { toast } from '@/app/lib/toast';

export interface AIOverviewSettings {
  autoSync: boolean;
  detailLevel: 'summary' | 'balanced' | 'detailed';
  focusAreas: {
    goalProgress: boolean;
    anomalies: boolean;
    weekOverWeek: boolean;
    monthOverMonth: boolean;
    recommendations: boolean;
    crossMetricCorrelations: boolean;
  };
}

interface AIOverviewSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: AIOverviewSettings;
  onSave: (settings: AIOverviewSettings) => void;
}

export const defaultAIOverviewSettings: AIOverviewSettings = {
  autoSync: true,
  detailLevel: 'balanced',
  focusAreas: {
    goalProgress: true,
    anomalies: true,
    weekOverWeek: true,
    monthOverMonth: false,
    recommendations: true,
    crossMetricCorrelations: false,
  },
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${Theme.usage.space.medium};
`;

const Backdrop = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgb(var(--app-overlay-rgb) / 0.3);
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 448px;
  background: ${colors.white};
  border-radius: ${radius.xl};
  box-shadow: ${shadows['2xl']};
  overflow: hidden;
`;

const Header = styled.div`
  padding: ${Theme.usage.space.medium} ${Theme.usage.space.large};
  border-bottom: 1px solid ${colors.border};
  background: linear-gradient(to right, ${colors.purple50}, var(--app-status-info-bg));
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const TitleText = styled.h2`
  font-size: ${Theme.usage.fontSize.medium};
  font-weight: 600;
`;

const Content = styled.div`
  padding: ${Theme.usage.space.medium} ${Theme.usage.space.large};
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.medium};
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
`;

const ToggleButton = styled.button`
  flex-shrink: 0;
  margin-top: ${Theme.usage.space.xxxSmall};
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const ToggleContent = styled.div`
  flex: 1;
`;

const ToggleLabel = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
`;

const ToggleDesc = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  margin-top: ${Theme.usage.space.xxSmall};
`;

const RecommendBox = styled.div`
  margin-left: ${Theme.usage.space.xLarge};
  margin-top: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${radius.md};
  background-color: var(--app-status-success-bg-light);
  border: 1px solid #bbf7d0;
`;

const RecommendText = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: #14532d;
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.xSmall};
`;

const AdvancedToggle = styled.button`
  width: 100%;
  text-align: left;
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.xl};
  border: 1px solid ${colors.border};
  background: transparent;
  cursor: pointer;
  transition: background-color 150ms;

  &:hover {
    background-color: rgb(var(--app-accent-rgb) / 0.4);
  }
`;

const AdvancedLabel = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const AdvancedContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.medium};
  overflow: hidden;
`;

const SectionLabel = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
`;

const DetailOption = styled.button<{ $selected: boolean }>`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
  padding: ${Theme.usage.space.small};
  border-radius: ${radius.xl};
  border: 1px solid ${({ $selected }) => $selected ? colors.purple500 : colors.border};
  background-color: ${({ $selected }) => $selected ? colors.purple50 : 'transparent'};
  cursor: pointer;
  transition: all 200ms;
  text-align: left;

  &:hover {
    background-color: ${({ $selected }) => $selected ? colors.purple50 : 'rgb(var(--app-accent-rgb) / 0.4)'};
  }
`;

const UnselectedCircle = styled.div<{ $size?: string }>`
  height: ${({ $size }) => $size || '20px'};
  width: ${({ $size }) => $size || '20px'};
  border-radius: ${Theme.usage.borderRadius.full};
  border: 2px solid ${colors.border};
`;

const UnselectedSquare = styled.div`
  height: 16px;
  width: 16px;
  border-radius: ${Theme.usage.borderRadius.small};
  border: 2px solid ${colors.border};
`;

const OptionText = styled.div`
  flex: 1;
  text-align: left;
`;

const OptionLabel = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
`;

const OptionDesc = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const FocusOption = styled.button`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: ${Theme.usage.space.small};
  padding: ${Theme.usage.space.xSmall};
  border-radius: ${radius.md};
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background-color 150ms;
  text-align: left;

  &:hover {
    background-color: rgb(var(--app-accent-rgb) / 0.4);
  }
`;

const Footer = styled.div`
  padding: ${Theme.usage.space.medium} ${Theme.usage.space.large};
  border-top: 1px solid ${colors.border};
  background-color: rgb(var(--app-muted-rgb) / 0.5);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${Theme.usage.space.xSmall};
`;

export function AIOverviewSettingsModal({ 
  isOpen, 
  onClose, 
  currentSettings,
  onSave 
}: AIOverviewSettingsModalProps) {
  const [settings, setSettings] = useState<AIOverviewSettings>(currentSettings);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSave = () => {
    onSave(settings);
    toast.success('AI Overview settings saved');
    onClose();
  };

  const handleToggleFocusArea = (area: keyof typeof settings.focusAreas) => {
    setSettings(prev => ({
      ...prev,
      focusAreas: {
        ...prev.focusAreas,
        [area]: !prev.focusAreas[area]
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <Overlay>
        <Backdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <ModalContainer
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <Header>
            <HeaderRow>
              <HeaderTitle>
                <Settings style={{ height: '20px', width: '20px', color: colors.purple600 }} />
                <TitleText>AI Overview Settings</TitleText>
              </HeaderTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                style={{ flexShrink: 0 }}
              >
                <X style={{ height: '20px', width: '20px' }} />
              </Button>
            </HeaderRow>
          </Header>

          <Content>
            <div>
              <ToggleRow>
                <ToggleButton
                  onClick={() => setSettings(prev => ({ ...prev, autoSync: !prev.autoSync }))}
                >
                  {settings.autoSync ? (
                    <CheckCircle2 style={{ height: '20px', width: '20px', color: colors.purple600 }} />
                  ) : (
                    <UnselectedCircle />
                  )}
                </ToggleButton>
                <ToggleContent>
                  <ToggleLabel>Auto-sync with my scorecard</ToggleLabel>
                  <ToggleDesc>Show insights for selected metrics only</ToggleDesc>
                </ToggleContent>
              </ToggleRow>

              {settings.autoSync && (
                <RecommendBox>
                  <RecommendText>
                    <CheckCircle2 style={{ height: '12px', width: '12px', flexShrink: 0, marginTop: '2px' }} />
                    <span>Recommended for most users. AI will automatically focus on your selected metrics.</span>
                  </RecommendText>
                </RecommendBox>
              )}
            </div>

            <AdvancedToggle onClick={() => setShowAdvanced(!showAdvanced)}>
              <AdvancedLabel>
                Advanced {showAdvanced ? '▼' : '▶'}
              </AdvancedLabel>
            </AdvancedToggle>

            <AnimatePresence>
              {showAdvanced && (
                <AdvancedContent
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div>
                    <SectionLabel>Detail Level:</SectionLabel>
                    <OptionsList>
                      {[
                        { value: 'summary', label: 'Executive Summary', desc: '3-4 bullet points' },
                        { value: 'balanced', label: 'Balanced', desc: 'Current default view' },
                        { value: 'detailed', label: 'Detailed Analysis', desc: 'Expanded explanations' },
                      ].map((option) => (
                        <DetailOption
                          key={option.value}
                          $selected={settings.detailLevel === option.value}
                          onClick={() => setSettings(prev => ({ ...prev, detailLevel: option.value as any }))}
                        >
                          <div style={{ flexShrink: 0, marginTop: '2px' }}>
                            {settings.detailLevel === option.value ? (
                              <CheckCircle2 style={{ height: '20px', width: '20px', color: colors.purple600 }} />
                            ) : (
                              <UnselectedCircle />
                            )}
                          </div>
                          <OptionText>
                            <OptionLabel>{option.label}</OptionLabel>
                            <OptionDesc>{option.desc}</OptionDesc>
                          </OptionText>
                        </DetailOption>
                      ))}
                    </OptionsList>
                  </div>

                  <div>
                    <SectionLabel>Focus on:</SectionLabel>
                    <OptionsList>
                      {[
                        { key: 'goalProgress', label: 'Goal progress', desc: 'Track vs targets' },
                        { key: 'anomalies', label: 'Anomalies', desc: 'Unusual patterns' },
                        { key: 'weekOverWeek', label: 'Week-over-week changes', desc: 'WoW trends' },
                        { key: 'monthOverMonth', label: 'Month-over-month changes', desc: 'MoM trends' },
                        { key: 'recommendations', label: 'AI recommendations', desc: 'Next actions' },
                        { key: 'crossMetricCorrelations', label: 'Cross-metric correlations', desc: 'Related patterns' },
                      ].map((option) => (
                        <FocusOption
                          key={option.key}
                          onClick={() => handleToggleFocusArea(option.key as any)}
                        >
                          <div style={{ flexShrink: 0, marginTop: '2px' }}>
                            {settings.focusAreas[option.key as keyof typeof settings.focusAreas] ? (
                              <CheckCircle2 style={{ height: '16px', width: '16px', color: colors.purple600 }} />
                            ) : (
                              <UnselectedSquare />
                            )}
                          </div>
                          <OptionText>
                            <OptionLabel>{option.label}</OptionLabel>
                            <OptionDesc>{option.desc}</OptionDesc>
                          </OptionText>
                        </FocusOption>
                      ))}
                    </OptionsList>
                  </div>
                </AdvancedContent>
              )}
            </AnimatePresence>
          </Content>

          <Footer>
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              style={{
                background: 'linear-gradient(to right, #a855f7, #3b82f6)',
                color: colors.white,
              }}
            >
              Apply
            </Button>
          </Footer>
        </ModalContainer>
      </Overlay>
    </AnimatePresence>
  );
}
