# Home Page Feedback & Feature Ideas — v1

**Date:** March 20, 2026  
**Author:** Sai (PM)  
**Reviewed against:** Eng refactor (PRs #1–#4) vs. PM Vision V1 prototype  
**Status:** Draft for alignment with Harsha

---

## TL;DR

The eng refactor nailed architecture (componentization, theme system, data separation). But the product soul — the AI-native identity — got softened. The home page now feels like a traditional portal with AI bolted on, rather than an AI-first data experience. Below are 6 feedback areas with concrete feature proposals to bring back the boldness.

---

## 1. AI Is a Feature, Not the Identity

**What happened:** The AI chat prompt was demoted from a front-and-center experience to a search bar inside `HeroPanel`. Mode toggles (chat/hybrid/notebook) and purpose selectors (analysis/exploration/reporting) only appear after clicking into centered mode.

**Why it matters:** The whole thesis of this portal is "AI-native." If a user lands on the home page and sees a standard portal layout with a search bar, we've lost the differentiator in the first 3 seconds.

**Feature ideas:**
- **F1a: Restore AI prompt as the visual hero.** The prompt box with mode toggles should be the dominant element on the page — larger, center-stage, not inside a card. Reference: Vision V1's `chatBox` component with inline mode/purpose selectors.
- **F1b: Pre-filled prompt as a teaching moment.** Bring back `"I want to run a deep-dive analysis on Dashpass growth for the past 60 days."` as a pre-filled example. This shows users what's possible without requiring documentation. Rotate examples daily or per-role.
- **F1c: "AI is thinking" ambient indicator.** Add a subtle pulsing glow or animation to the prompt area that signals the AI is alive and ready — not a static search box.

**Prior component to reference:** Vision V1 `home-page.tsx` lines 76–156 — the `chatBox` const with mode/purpose selectors rendered inline.

---

## 2. Recommendation Context Is Weakened

**What happened:** V1 had rich, contextual "reason" strings explaining *why* something was recommended ("Referenced in 3 recent Slack threads by your direct reports"). The current `DiscoveryCard` buries these in one of three tabs, reducing their prominence.

**Why it matters:** Context-aware recommendations are what make this portal smart. "Company Dashboard" as a text link is forgettable. "Company Dashboard — 23 views by your team this week" is a reason to click.

**Feature ideas:**
- **F2a: "For You" should be the default and dominant section.** Don't make it compete equally with Favorites and Recent. It should take 2x the space, with Favorites/Recent as secondary.
- **F2b: Add social proof badges.** Show "🔥 Trending," "👀 23 views this week," or "💬 Mentioned in 3 Slack threads" as badges on recommendation cards.
- **F2c: Clickable context links.** The reason text itself should be interactive — "Referenced in 3 Slack threads" could deep-link to those threads.

**Prior component to reference:** Vision V1 `home-page.tsx` `recommendations` array with `reason` field, and the hover-state carousel rendering.

---

## 3. Visual Previews Are Gone

**What happened:** V1 showed actual dashboard thumbnail images (Company Dashboard, Progress vs Plan) in recommendation cards. The current version is text-only list items.

**Why it matters:** A thumbnail showing a chart trending up communicates more in 0.5 seconds than any text description. Visual previews dramatically increase click-through.

**Feature ideas:**
- **F3a: Restore thumbnail previews for dashboards.** Use the existing `company-dashboard-preview.png` and `progress-vs-plan-preview.png` assets (still in `/src/assets/`).
- **F3b: Add live sparklines to recommendation cards.** For metric-related recommendations, show a tiny inline sparkline of the key metric's recent trend. This is what makes a data portal feel alive.
- **F3c: Preview on hover.** Show a larger preview card on hover, similar to how Slack shows link previews.

**Prior component to reference:** Vision V1 `home-page.tsx` — the recommendation hover state that showed preview images.

---

## 4. Executive Scorecard Is Below the Fold

**What happened:** The scorecard — arguably the most powerful feature (AI summaries, metric drill-down, customizable areas) — sits below the Hero Panel, Recent Work, and Discovery sections. An exec has to scroll to find it.

**Why it matters:** For the target persona (business executive like Tony), the scorecard IS the reason to open this portal every morning. Burying it says "this portal is about browsing," not "this portal gives you answers."

**Feature ideas:**
- **F4a: Role-based layout.** For `business-executive` users, flip the hierarchy: Scorecard at top, AI chat as an overlay/sidebar, discovery below. For `data-scientist` users, keep the current layout with AI chat prominent.
- **F4b: "Morning brief" scorecard summary.** Show a 1-line AI summary above the fold: "3 metrics moved significantly overnight — GOV up 2.1%, HQDR down 0.3%." Clicking it expands or scrolls to the full scorecard.
- **F4c: Scorecard as a pinned widget.** Let users pin the scorecard to always show at the top of their home page, regardless of role.

**Prior component to reference:** `ExecutiveScorecard.tsx` — already exists and is feature-rich. The issue is placement, not implementation.

---

## 5. Quick Create Card Doesn't Match the Exec Persona

**What happened:** The "Quick Create" card takes prime real estate (0.6fr of Row 1) offering "Dashboard, SQL Query, Notebook, AI Workflow." These are builder actions — relevant for analysts, not execs.

**Why it matters:** An exec isn't going to create a SQL query. Showing them builder tools signals "this portal isn't for you," which is the opposite of what we want.

**Feature ideas:**
- **F5a: Role-adaptive Quick Actions.** For execs, replace "Quick Create" with "Quick Actions":
  - "View this week's scorecard"
  - "Ask AI about metric changes"
  - "Share a dashboard with your team"
  - "Schedule a recurring summary"
- **F5b: "What changed" card.** Replace Quick Create (for execs) with a "Since you were last here" card showing: new dashboards shared with you, metrics that moved significantly, team activity.
- **F5c: Keep Quick Create for analysts/builders.** Don't remove it — just conditionally render it based on `appConfig.user.role`.

**Prior component to reference:** `appConfig.user.role` in `config/app.config.ts` already supports role-based logic. `CreateCard` just needs a role-aware variant.

---

## 6. No Sense of "What Happened Since I Was Last Here"

**What happened:** The home page is static — it shows the same layout whether you last visited 5 minutes ago or 5 days ago. There's no temporal awareness.

**Why it matters:** The #1 reason an exec opens a data portal is "did anything change that I need to know about?" If the page can't answer that in 3 seconds, they'll go back to Slack and email.

**Feature ideas:**
- **F6a: "Overnight changes" notification bar.** A banner at the top: "Since yesterday: GOV up 2.1%, 2 new analyses shared with you, 1 metric alert triggered." Dismissible.
- **F6b: Activity timeline in Discovery.** Add a "What's new" tab to the Discovery card showing a chronological feed: "Harsha published Q1 Ops Dashboard (2h ago)," "Revenue metric updated (6h ago)."
- **F6c: Smart greeting with context.** Instead of just "Good morning, Tony" — "Good morning, Tony. 3 things need your attention today." The greeting becomes a brief.

**Prior component to reference:** No prior implementation. New feature — but could build on `discoveryFeed.recent` data structure in `home-data.ts`.

---

## Priority Recommendation for Harsha Discussion

| Priority | Feedback | Feature | Effort | Impact |
|----------|----------|---------|--------|--------|
| **P0** | #1 AI Identity | F1a: Restore AI prompt as hero | Medium | High |
| **P0** | #4 Scorecard placement | F4a: Role-based layout | Medium | High |
| **P1** | #6 Temporal awareness | F6a: Overnight changes bar | Low | High |
| **P1** | #2 Recommendation context | F2b: Social proof badges | Low | Medium |
| **P1** | #5 Persona mismatch | F5a: Role-adaptive actions | Medium | Medium |
| **P2** | #3 Visual previews | F3a: Restore thumbnails | Low | Medium |
| **P2** | #1 Teaching moment | F1b: Pre-filled prompt | Low | Medium |
| **P2** | #6 Smart greeting | F6c: Context-aware greeting | Low | Medium |
| **P3** | #3 Live sparklines | F3b: Inline sparklines | High | High |
| **P3** | #2 Clickable context | F2c: Deep-link reasons | High | Medium |

---

## Talking Points for Harsha Sync

1. "The refactor is excellent — component architecture, theme system, data separation are all production-grade. Great work."
2. "The product concern is that we've moved from AI-native to AI-adjacent. The prompt needs to be the hero, not a search bar."
3. "For execs, the scorecard should be above the fold. Can we do role-based layout without major rework?"
4. "Quick win: bring back the pre-filled prompt and social proof badges on recommendations. Low effort, high signal."
5. "Bigger bet: 'What changed since yesterday' — this is what makes execs open the portal daily instead of weekly."

---

*Next version: v2 after Harsha alignment*
