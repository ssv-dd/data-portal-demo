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

### Implication for Scorecard
The Executive Scorecard is **not role-gated** — it's **personalized for every user** based on their role and the product area/domain they support. The idea is to proactively surface metrics relevant to the pod's product area so teams can track performance and make decisions together.

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

*This is a living document. Add context as discussions with Eng and stakeholders evolve.*
