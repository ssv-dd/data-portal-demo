import styled from 'styled-components'

import { glassPanel, radius, shadows, Theme } from '../../styles/dataPortalAppTheme'

export const Page = styled.div`
  padding: ${Theme.usage.space.xLarge};
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xLarge};
`

export const Header = styled.header`
  margin-bottom: ${Theme.usage.space.medium};
`

export const Title = styled.h1`
  margin: 0;
  font-size: ${Theme.usage.fontSize.xLarge};
  font-weight: 700;
  color: ${Theme.usage.color.text.default};
`

export const Subtitle = styled.p`
  margin: ${Theme.usage.space.xSmall} 0 0;
  font-size: ${Theme.usage.fontSize.medium};
  color: ${Theme.usage.color.text.subdued.default};
  max-width: 78ch;
  line-height: 1.5;
`

/** Short “how to use this page” note for design / eng reviewers. */
export const ReviewerNote = styled.p`
  margin: ${Theme.usage.space.medium} 0 0;
  padding: ${Theme.usage.space.small} ${Theme.usage.space.medium};
  border-radius: ${radius.lg};
  border-left: 3px solid ${Theme.usage.color.border.strong.default};
  background: ${Theme.usage.color.background.subdued.default};
  font-size: ${Theme.usage.fontSize.small};
  line-height: 1.5;
  color: ${Theme.usage.color.text.subdued.default};
  max-width: 78ch;
`

/** Top-level page section (e.g. charts vs UI vs tables). */
export const MajorSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.large};
  padding-top: ${Theme.usage.space.xLarge};
  border-top: 1px solid ${Theme.usage.color.border.default};
`

export const MajorSectionTitle = styled.h2`
  margin: 0;
  font-size: ${Theme.usage.fontSize.large};
  font-weight: 600;
  color: ${Theme.usage.color.text.default};
`

export const MajorSectionLead = styled.p`
  margin: 0;
  max-width: 78ch;
  font-size: ${Theme.usage.fontSize.small};
  line-height: 1.5;
  color: ${Theme.usage.color.text.subdued.default};
`

/** Group of related charts inside the chart library section. */
export const SubSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.medium};
`

export const SubSectionTitle = styled.h3`
  margin: 0;
  font-size: ${Theme.usage.fontSize.medium};
  font-weight: 600;
  color: ${Theme.usage.color.text.default};
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(560px, 1fr));
  gap: ${Theme.usage.space.large};
`

/**
 * Full-width row inside {@link Grid}: two equal columns (stacks on narrow viewports).
 * Use for pie + donut, area + line, or KPI pairings.
 */
export const TwoUpRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${Theme.usage.space.large};
  grid-column: 1 / -1;
  align-items: stretch;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`

export const Card = styled.section`
  ${glassPanel}
  border-radius: ${radius['2xl']};
  border: 1px solid ${Theme.usage.color.border.default};
  box-shadow: ${shadows.card};
  padding: ${Theme.usage.space.large};
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
  transition: box-shadow 200ms;
  overflow: hidden;

  &:hover {
    box-shadow: ${shadows.cardHover};
  }
`

export const CardFullWidth = styled(Card)`
  grid-column: 1 / -1;
`

export const CardTitle = styled.h2`
  margin: 0;
  font-size: ${Theme.usage.fontSize.medium};
  font-weight: 600;
  color: ${Theme.usage.color.text.default};
`

export const CardDescription = styled.p`
  margin: 0;
  font-size: ${Theme.usage.fontSize.small};
  color: ${Theme.usage.color.text.subdued.default};
`

/** Title + control on one row (e.g. chart variant picker). */
export const CardTitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${Theme.usage.space.small};
  min-width: 0;
`

/** Stable vertical space when swapping donut examples with different intrinsic heights. */
export const DonutVariantPanel = styled.div`
  flex: 1;
  min-height: 460px;
  min-width: 0;
`

export const StatesRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${Theme.usage.space.medium};
`

/** Full-width block above the chart grid (not a grid child). */
export const DemoSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.medium};
`

export const DemoCardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${Theme.usage.space.medium};
  align-items: stretch;
`

export const DemoCardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.xSmall};
  flex: 1;
  min-height: 0;
`

export const DemoClickHint = styled.p`
  margin: 0;
  font-size: ${Theme.usage.fontSize.small};
  color: ${Theme.usage.color.text.subdued.default};
`

export const DemoDropdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: ${Theme.usage.space.large};
  align-items: start;
`

export const DemoDropdownCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.small};
  min-width: 0;
`

export const DemoDropdownHint = styled.p`
  margin: 0;
  font-size: ${Theme.usage.fontSize.small};
  color: ${Theme.usage.color.text.subdued.default};
`

export const DemoBadge = styled.span`
  display: inline-block;
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.xSmall};
  border-radius: ${Theme.usage.borderRadius.small};
  background: ${Theme.usage.color.background.subdued.default};
  font-size: ${Theme.usage.fontSize.small};
  font-weight: 500;
  color: ${Theme.usage.color.text.subdued.default};
`
