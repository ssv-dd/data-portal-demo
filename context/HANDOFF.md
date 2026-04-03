# Data Portal — Session Handoff

**Date:** March 31, 2026  
**Context window:** Exhausted after extensive session. Use this file to resume in a new chat.

---

## Project Overview

- **Repo:** https://github.com/doordash/Data-Portal-AI-Native
- **Local path:** `/Users/saisudhir.vinjamuri/Documents/learn-claude/projects/data-portal`
- **Stack:** React 19 + TypeScript + Vite 7 + styled-components (DoorDash Prism design system) + Recharts
- **Current branch:** `main` (with 1 uncommitted commit for Notebooks — not yet pushed)
- **PM exploration branch:** `pm/chat-history` (preserved at `/tmp/data-portal-pm` worktree, port 5181)

## Team

- **Sai Sudhir Vinjamuri** — PM (you)
- **Harsha Reddy** — Eng lead (hvar24 on GitHub, harsha.reddy@doordash.com)
- **Rohit Menon** — Eng lead India (rohitmenondd on GitHub, r.menon@doordash.com)
- **Slack group DM:** Channel ID `C0AM1TZRV5K` (Sai + Harsha + Rohit)

## Key Context Files (read these first)

| File | What it contains |
|------|-----------------|
| `context/product-context.md` | User segments, XFN pods, BI strategy, product principles, WBR agent vision |
| `context/Company wide WBR Metrics - Sheet1.csv` | 123 WBR metrics across 13 product areas |
| `context/Data & Business Intelligence - Key Customer Matrix - Personas.csv` | 30+ user research interviews across 7 personas |
| `context/Canvas PRD - Gun Johnson.md` | Gun's Canvas requirements — gap analysis done against current build |
| `context/Meetings/Notes - Finalize Layout_Plans for April 6th rollout.md` | April 6 alignment decisions |
| `feedback/april-6-rollout-decisions.md` | Full decisions doc with action items |
| `.pm-notes/product-review-brief-03-31.md` | Detailed product brief (pre-read) |
| `.pm-notes/product-review-exec-summary.md` | Executive summary version (Pavel's recommended format) |
| `.pm-notes/demo-walkthrough-7min-combined.md` | Demo script with user research |
| `.pm-notes/demo-framework.md` | Reusable first-principles demo framework |
| `.pm-notes/gif-recording-guide.md` | Step-by-step GIF recording scripts |
| `.pm-notes/` | Gitignored — private PM docs |

## Product Review (April 7, 8:30 AM PST)

- **Moved from March 31 to April 7** to show productionized features
- **Exec summary:** `.pm-notes/product-review-exec-summary.md` + `.html` version
- **Detailed brief:** `.pm-notes/product-review-brief-03-31.md` + `.html`
- **Pavel's guidance (from Granola):** Focus on WHO + HOW, not tech. Start with ecosystem consolidation visual (60 sec). Milestone table with people + success criteria. Quality > speed.
- **Ecosystem visual:** Multiple versions generated in `.pm-notes/ecosystem-consolidation-visual-v*.png` and `.svg`
- **Customer calls planned this week:** Avi Scher (Sales Analytics), Gun Johnson (VP Analytics), Mahira Arif (S&O), Alyssa Wisdom (Ax), Christine (Sr Director S&O)

## What's Been Built (on main)

### Home Page
- AI-native hero with pre-filled prompt, ambient glow, Chat/Hybrid mode toggles
- Your Watchlist — tabular layout with real WBR metrics, customizable via side panel organized by product area
- Jump back in with tabs (Your projects / Recently visited)
- Discover with shoveler tabs (Your team / Trending / Recently published) + Compass icon
- Chat history — collapsible left sidebar (ChatGPT/Glean pattern)
- ETL Studio greyed-out tab in top nav

### Dashboards
- Chart builder with derived fields, formula bar, source browser
- Canvas grid with drag-drop, resize
- AI widget sidebar for natural-language chart creation
- Golden Dashboards filter on Dashboards page
- Canvas creation + publish + share flows

### SQL Studio
- Monaco editor, multi-tab, engine selection
- Data catalog, query library
- SQL Assistant with knowledge bases

### Notebooks (latest — committed, not pushed)
- Creation modal: Name → Server Type (CPU Small/Medium/Large, GPU T4/A10G/A100/H100/H200) → Pre-installed libraries (Standard/ML/Custom) → conditional Docker URL
- Template dropdown removed (handled by landing page)
- Owner field removed (auto-assigned)
- Notebook editor page created (`notebook-editor-page.tsx`) but reverted — needs rebuild
- Route `/notebook/:id` was added then reverted — needs re-adding

### AI Workflows
- Automation hub with stats + templates (existing, UI facelift)

## Open PRs
- **PR #9, #10** — Closed (superseded, merged by eng)
- **PR #14** — Merged (UI polish: Compass, Golden Dashboards, ETL Studio, Trend T28D)
- **Notebooks PR** — Not yet created (committed locally, needs push + PR)

## What Needs to Happen Next

### Immediate (this week)
1. **Push Notebooks commit** and create PR
2. **Rebuild notebook editor page** — JupyterHub iframe embed with loading state, kernel status, fallback link, Notebook Assistant sidebar
3. **Customer preview calls** — Avi, Gun, Mahira, Alyssa, Christine
4. **Finalize product brief** — update dates to April 7, add customer quotes after calls
5. **Record GIFs** for brief (see `.pm-notes/gif-recording-guide.md`)
6. **Regenerate HTML** of exec summary after final edits

### For April 7 review
- Ecosystem consolidation visual (finalize in Figma/Slides)
- Demo script rehearsal
- Impact numbers validated with Harsha
- Rollout plan milestone table with specific names + success criteria

### Deferred
- vs Plan column (needs data pipeline)
- AI Insight column in Watchlist
- In-app feedback mechanism (NPS/CSAT — PRD started but not built)
- Real-time collaboration on canvases
- Waterfall charts (Gun's P0 request)
- Google Docs copy/link integration (Gun's P0 request)

## MCP Tools Available

| Tool | What it does |
|------|-------------|
| **Granola** | Meeting notes — `query_granola_meetings`, `list_meetings`, `get_meeting_transcript` |
| **Slack** | Read channels/DMs, search messages/users — key channel `C0AM1TZRV5K` |
| **Glean** | Search docs, read documents, chat for analysis |
| **GitHub** | Via `gh` CLI — PRs, issues, repo management |

## Git Config

- **User:** Sai Sudhir Vinjamuri (saisudhir.vinjamuri@doordash.com)
- **Remotes:** origin = `doordash/Data-Portal-AI-Native`, target = `doordash/data-portal-2.0-ai-native-prod-eng-collab`
- **Commit convention:** Include `Co-authored-by: cursor[bot] <noreply@cursor.com>` trailer
- **Branch strategy:** `main` = stable, `pm/*` = PM exploration branches

## Key Design Decisions Made

1. AI prompt is the hero on home page (not a sidebar feature)
2. Watchlist uses WBR metric structure organized by product area
3. Chat history follows ChatGPT/Glean collapsible sidebar pattern
4. "Discover" naming (not "Trending in your org")
5. Golden Dashboards as external Sigma links for V0
6. vs Plan column shows `--` placeholder (data pipeline not ready)
7. ETL Studio greyed out as "coming soon"
8. Quality > speed for AI responses (Pavel's direction)
9. Phased rollout: Dogfood → LiPr → Expanded → GA
10. Mode $2M/year contract is a key cost lever
