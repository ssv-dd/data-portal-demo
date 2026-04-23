import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Theme } from '@doordash/prism-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import { ConnectionCard } from '@/app/components/settings/connection-card';

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--app-bg);
  position: relative;
  overflow: hidden;
`;

const GradientBackground = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 10%, rgb(var(--app-violet-rgb) / 0.06), transparent 40%),
              radial-gradient(circle at 80% 90%, rgb(var(--app-blue-rgb) / 0.06), transparent 40%);
  pointer-events: none;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  padding: ${Theme.usage.space.xxLarge} ${Theme.usage.space.large};
`;

const MaxWidthContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: ${Theme.usage.space.xxLarge};
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: var(--app-fg);
  margin: 0 0 ${Theme.usage.space.small} 0;
  letter-spacing: -0.02em;
`;

const PageSubtitle = styled.p`
  font-size: 15px;
  color: var(--app-muted-fg);
  margin: 0;
`;

const StyledTabsList = styled(TabsList)`
  background: rgb(var(--app-overlay-rgb) / 0.05);
  border: 1px solid var(--app-border);
  padding: 4px;
  border-radius: ${Theme.usage.borderRadius.large};
  display: inline-flex;
  margin-bottom: ${Theme.usage.space.xLarge};
`;

const TabContent = styled(motion.div)`
  min-height: 500px;
`;

const SectionHeader = styled.div`
  margin-bottom: ${Theme.usage.space.large};
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: var(--app-fg);
  margin: 0 0 ${Theme.usage.space.xSmall} 0;
`;

const SectionDescription = styled.p`
  font-size: 14px;
  color: var(--app-muted-fg);
  margin: 0;
  line-height: 1.6;
`;

const ProviderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: ${Theme.usage.space.large};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PlaceholderContent = styled.div`
  padding: ${Theme.usage.space.xxLarge} ${Theme.usage.space.large};
  text-align: center;
  background: rgb(var(--app-surface-rgb) / 0.3);
  border: 1px dashed var(--app-border);
  border-radius: ${Theme.usage.borderRadius.xLarge};
`;

const PlaceholderIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${Theme.usage.space.medium};
  opacity: 0.3;
`;

const PlaceholderTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--app-fg);
  margin: 0 0 ${Theme.usage.space.small} 0;
`;

const PlaceholderText = styled.p`
  font-size: 14px;
  color: var(--app-muted-fg);
  margin: 0;
`;

type TabValue = 'general' | 'connections' | 'preferences';

const VALID_TABS: TabValue[] = ['general', 'connections', 'preferences'];

export function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as TabValue | null;

  // Default to 'connections' tab as specified in the plan
  const initialTab: TabValue = VALID_TABS.includes(tabParam as TabValue) ? (tabParam as TabValue) : 'connections';
  const [activeTab, setActiveTab] = useState<TabValue>(initialTab);

  // Only sync activeTab when URL changes (browser back/forward or external navigation)
  // Don't sync URL to activeTab to avoid infinite loop
  useEffect(() => {
    const currentTabParam = searchParams.get('tab') as TabValue | null;
    const validTab = currentTabParam && VALID_TABS.includes(currentTabParam) ? currentTabParam : 'connections';

    if (validTab !== activeTab) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab(validTab);
    }
  }, [searchParams, activeTab]);

  const handleTabChange = (value: string) => {
    const newTab = value as TabValue;
    // Update both state and URL when user clicks a tab
    setActiveTab(newTab);
    setSearchParams({ tab: newTab }, { replace: true });
  };

  return (
    <PageContainer>
      <GradientBackground />
      <ContentWrapper>
        <MaxWidthContainer>
          <PageHeader>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <PageTitle>Settings</PageTitle>
              <PageSubtitle>Manage your Data Portal preferences and connections</PageSubtitle>
            </motion.div>
          </PageHeader>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
          >
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <StyledTabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="connections">Connections</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </StyledTabsList>

              <TabContent>
                <TabsContent value="general">
                  <GeneralTabContent />
                </TabsContent>

                <TabsContent value="connections">
                  <ConnectionsTabContent />
                </TabsContent>

                <TabsContent value="preferences">
                  <PreferencesTabContent />
                </TabsContent>
              </TabContent>
            </Tabs>
          </motion.div>
        </MaxWidthContainer>
      </ContentWrapper>
    </PageContainer>
  );
}

function GeneralTabContent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PlaceholderContent>
        <PlaceholderIcon>⚙️</PlaceholderIcon>
        <PlaceholderTitle>General Settings</PlaceholderTitle>
        <PlaceholderText>
          General settings and configurations will be available here soon.
        </PlaceholderText>
      </PlaceholderContent>
    </motion.div>
  );
}

function ConnectionsTabContent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SectionHeader>
        <SectionTitle>Data Warehouse Connections</SectionTitle>
        <SectionDescription>
          Connect to your data warehouses to query data in AI chat and SQL Studio. Your credentials are securely stored and encrypted.
        </SectionDescription>
      </SectionHeader>

      <ProviderGrid>
        <ConnectionCard />
      </ProviderGrid>
    </motion.div>
  );
}

function PreferencesTabContent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PlaceholderContent>
        <PlaceholderIcon>🎨</PlaceholderIcon>
        <PlaceholderTitle>Preferences</PlaceholderTitle>
        <PlaceholderText>
          Customize your Data Portal experience with personalized preferences.
        </PlaceholderText>
      </PlaceholderContent>
    </motion.div>
  );
}
