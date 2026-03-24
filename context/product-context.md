# Data Portal — Product Context

**Last updated:** March 20, 2026  
**Owner:** Sai (PM)

---

## Target Users

Data Portal serves **all data users** across DoorDash, spanning two broad segments:

### Data Consumers
- **Executives** — track top-line metrics, need morning-brief-style summaries
- **Strategy & Operations (S&O)** — heavy dashboard users, some are decently technical and write SQL
- **Product Managers** — track product area metrics, monitor experiments
- **Finance** — revenue, margins, forecasting
- **Marketing** — campaign performance, customer segmentation

### Data Builders
- **Data Scientists (DS)** — notebooks, SQL, ML models, deep analysis
- **Data Engineers (DE)** — pipelines, table health, data quality
- **Machine Learning Engineers (MLEs)** — model monitoring, feature stores

### Implication
The home page and overall experience must support **personalization** across these roles. A one-size-fits-all layout won't work — execs need scorecards, builders need SQL/notebooks, S&O needs a blend.

---

## Team Structure & Product Areas

Teams operate in **XFN pods** consisting of:
- PM + S&O + Data Scientist + Designer

Each pod works within a **product area** (e.g., Consumer, Merchant, Dasher, Logistics, Ads & Promos).

### Product Areas (Metric Packs)
Metrics are organized by product area. Each area has its own set of tracked metrics:

- US Marketplace / Rx
- US New Verticals
- Ads & Promos
- DoorDash Commerce
- In Store
- DDfB (DoorDash for Business)
- CANZ (Canada, Australia, New Zealand)
- Dasher Dx / Logistics Lx
- Merchant
- CXI (Customer Experience & Integrity)
- Money

### Implication for Watchlist
The Watchlist (formerly "Executive Scorecard") is **not role-gated** — it's **personalized for every user** based on their role and the product area/domain they support:
- **Executives:** High-level metrics across multiple product areas (summary view)
- **XFN pods:** Deeper metrics within their specific product area

The idea is to proactively surface metrics relevant to the user's scope so teams can track performance and make decisions together.

---

## BI Tool Strategy

### Current State
- **Sigma Computing** — primary BI tool, Sigma dashboard URLs exist in `app.config.ts`
- **Looker** and **Mode** — on the chopping block, planned for deprecation later in 2026
- Multiple BI tool contracts create cost and fragmentation

### Direction
- DoorDash wants to **build in-house solutions** to replace external BI tools
- **Data Portal is an attempt toward that vision** — a unified, AI-native data experience
- **ThoughtSpot** is being onboarded as the **AI-Native BI Tool** for 2026 to plug the gap during transition
- ThoughtSpot will be embedded via **iframe** per recent PM-Eng discussions

### Open Questions (to resolve with Eng leads)
- Exact ThoughtSpot embedding approach (iframe vs. SDK vs. API)
- Timeline for Looker/Mode deprecation
- Which Sigma dashboards migrate first vs. get rebuilt natively in Data Portal
- Data layer architecture — does Data Portal query Snowflake directly or go through an API layer?

---

## Key Product Principles

1. **AI-native, not AI-adjacent.** AI is the primary interaction model, not a feature bolted onto a traditional portal.
2. **Personalized by default.** The experience adapts to role, domain, and usage patterns.
3. **Replace, not add.** Data Portal should reduce the number of tools people use, not become another one.
4. **Proactive, not reactive.** Surface what matters before the user asks — metric changes, team activity, relevant analyses.

---

## WBR Agent / CEO Agent

Sourced from Granola meeting notes (Feb–Mar 2026).

### Vision

A **"Chief of Staff agent"** that proactively delivers executive summaries — less about showing metrics, more about "here's where you should focus attention." [[source]](https://notes.granola.ai/d/b72d6158-ecfc-4000-bc2c-cb873b6ea1fb)

Targets the **Monday morning use case**: a contextual landing experience that doesn't require search queries. [[source]](https://notes.granola.ai/d/9b370470-8f08-42c7-9b2e-526e2b827ccf)

### Prototype (built on OpenAI Codex)

- Pulls sample data from Snowflake via Data Portal events table [[source]](https://notes.granola.ai/d/e6a66911-5eb0-4012-a1e5-51bf27282a66)
- Generates executive summaries covering historical trends, quarterly performance, recent activity [[source]](https://notes.granola.ai/d/e6a66911-5eb0-4012-a1e5-51bf27282a66)
- User behavior insight: usage peaks early morning/late evening (people in meetings all day) [[source]](https://notes.granola.ai/d/003543b9-14d4-468c-b9a4-0c34d91fb28e)
- Currently runs on sample data — needs production integration [[source]](https://notes.granola.ai/d/e6a66911-5eb0-4012-a1e5-51bf27282a66)

### Q1 Performance Framework (Prabhdir/Scott use case)

The agent should answer five questions [[source]](https://notes.granola.ai/d/b72d6158-ecfc-4000-bc2c-cb873b6ea1fb):
1. How did we start this quarter?
2. What happened quarter-to-date?
3. What happened last week?
4. Where does that leave us on a QTD basis today?
5. Is there anything you should dig into based on the above?

Historical context: monthly summaries (Jan: 2–3 big things, Feb: 2–3 big things) plus an overall quarter narrative. Gets harder to remember as the year progresses.

### AI Overview Features (Executive Scorecard)

- Top 3 weekly highlights [[source]](https://notes.granola.ai/d/b8463d80-eeee-4e1a-b3a2-6ee640ad6d27)
- Areas requiring attention
- Emerging patterns / opportunities / anomalies
- Level 2 insights with source attribution
- Business unit categorization (US Marketplace, Verticals, Ads, etc.)
- User-configurable monitoring metrics ("Add" functionality)
- Future: follow-up questions and team tagging

### Slack Delivery Mechanism

- Slack integration via webhook or Slack app [[source]](https://notes.granola.ai/d/e6a66911-5eb0-4012-a1e5-51bf27282a66)
- Automate weekly Monday morning reports to a Slack channel
- Implementation: create Slack app → get token → get channel ID → use Slack SDK `chat.postMessage` API
- Need Paul's help for Slack webhook permissions [[source]](https://notes.granola.ai/d/7c09d827-54aa-402d-a679-6671cc5e1df4)

### Production Architecture

Workflow: **ETL Express → PR merge → Active DAG → Data fetch → Agent processing** [[source]](https://notes.granola.ai/d/e6a66911-5eb0-4012-a1e5-51bf27282a66)
- ETL Express (Airflow wrapper) for data orchestration
- Scheduled cron jobs pull fresh data into a dedicated table
- Snowflake connection in code using credentials
- Codex platform has poor MCP support; Claude Code may offer better integration

### Pain Points Validating This

- Product Analytics teams spend ~40% of time on WBR and exec reporting [[source]](https://notes.granola.ai/d/ab2a92e1-5e7c-4212-aa22-f7e370a8dca6)
- Christine's team already using Cursor for automated biz ops reports (4-page weekly summaries) [[source]](https://notes.granola.ai/d/f06777f6-e828-4ba8-8d33-59bc4ee5d306)

### Next Steps & Open Items

- **WBR POC with Prabhdir** for exec use case [[source]](https://notes.granola.ai/d/7c09d827-54aa-402d-a679-6671cc5e1df4)
- **Showcase CEO Agent to Andy** (Pavel's ask) [[source]](https://notes.granola.ai/d/7c09d827-54aa-402d-a679-6671cc5e1df4)
- Sudhir: create test Slack channel + app setup
- Sudhir: build ETL Express workflow with existing SQL queries
- Sahil: share Slack API docs and setup guide

### Data Builder / Skills Vision (Feb 23 DM with Jacopo)

Framed as a **"Data AI Studio"** (like [n8n](https://n8n.io/workflows/)) where data builders can discover, compose, edit, and deploy data agents and skills with governance. Skills are abstracted from agents and reusable:
- **Data Engineer agent** — pipeline monitoring + autofix
- **CEO/Executive agent** — reuse executive-grade reasoning skills for other agents
- **Data Scientist/PM agent** — turn a metric into a structured, testable causal statement

---

*This is a living document. Add context as discussions with Eng and stakeholders evolve.*
