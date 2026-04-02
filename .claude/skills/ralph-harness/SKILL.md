---
name: ralph-harness
description: Process companion for agentic coding. Orchestrates the RALPH loop (Review, Align, Interview, Limit, Produce, Handoff) with human gates, evidence requirements, and convention grounding. Use at the start of any non-trivial implementation task. Trigger phrases include "start task", "new feature", "implement", "ralph", "harness", "start the loop".
alwaysApply: false
globs:
---

# RALPH Harness

A process companion that enforces the RALPH loop for non-trivial tasks. It does not re-define the loop — the loop is defined in `docs/ralph-harness/agent-playbook.md`. This skill adds enforcement: human gates, sub-skill invocation, evidence requirements, and guidance on when to use or skip the loop.

## When to Use

- Starting any non-trivial implementation task
- When you want structured, auditable agent-assisted work
- When working with subagents or delegating slices

Do NOT use for trivial tasks (typo fixes, single-line changes, doc formatting). If the task has no risk of breaking anything, skip the harness.

## How to Run

1. **Read `docs/ralph-harness/agent-playbook.md`** — this is the single source of truth for the RALPH loop (R-A-I-L-P-H), including each step's details, research depth calibration, interview checklist, and handoff template.
2. Follow the loop step by step. This skill adds the enforcement layer on top:

## Enforcement Layer

What this skill adds beyond the playbook doc:

### Gates (must pause for human)

| Step | Gate | What to do |
|------|------|-----------|
| **A — Align** | Hard gate | Show task brief to human. Do NOT proceed until human explicitly acknowledges. |
| **H — Handoff** | Hard gate | Present handoff summary with real verification output. Human accepts, modifies, or rejects. |

No other steps require a hard pause, but the human may intervene at any step.

### Sub-Skill Invocation

| Step | Invoke | What it does |
|------|--------|-------------|
| **R** | `convention-check` skill | Find similar implementations, extract actual patterns from git/code/Glean, flag drift between code and docs. Present findings before planning. |
| **A** | Risk classification from `docs/ralph-harness/agentic-governance-guidelines.md` | Classify the change as G0-G3. Higher risk = stricter controls. |
| **I** | Convention drift questions | If `convention-check` found drift, surface it here: "Code does X, docs say Y — which should I follow?" |
| **P** | Testing guidelines from `docs/ralph-harness/testing-guidelines.md` | Validate test quality against the 7 AI-generated test failure modes. |

### Evidence Requirements

| Step | Requirement |
|------|------------|
| **R** | Produce a written research summary before proceeding. Even one paragraph. |
| **A** | Task brief must include risk class (G0-G3). |
| **P** | Real test output required. You may NOT write "tests passed" without actual terminal output from this session. |
| **H** | Handoff summary must include verification output. A handoff without evidence is a draft, not a handoff. |

### Trust Signals (recorded at H)

After the human acts on the handoff:

| Human action | Signal |
|-------------|--------|
| Accepted without modification | Strong positive — trust increases |
| Accepted with minor edits | Weak positive — small trust increase |
| Accepted with significant rewrites | Neutral — no change |
| Rejected or reverted | Negative — trust decreases (weighted 2x) |

Trust is **per-domain**, not global. See `docs/ralph-harness/agentic-governance-guidelines.md` for the full trust model.

## Skill Architecture

The harness is the orchestrator layer in a layered architecture:

| Layer | Role | Examples | Durable? |
|-------|------|----------|----------|
| **Orchestrator** | Walks through RALPH, manages gates, composes skills below | `ralph-harness` (this skill) | Yes — process is ours |
| **Domain Skills** | Chain tools with domain knowledge and reasoning | `convention-check`, future: `risk-classify`, `evidence-gather`, `pii-review` | Yes — domain knowledge is ours |
| **MCP Tools** | Atomic functions — each does one thing | git log, codebase search, Glean search, Jira, GitHub, Chronosphere | Partially — tools standardize via MCP |
| **Backend Services** | Systems the tools connect to | Git, Glean, Jira, GitHub, Chronosphere, Grafana, Taulu | No — provided by vendors |

**How to extend:** New domain skills plug in at the Domain Skills layer and get invoked by the harness at the appropriate RALPH step.

## When to Break the Loop

| Situation | What to do |
|-----------|-----------|
| Trivial change (typo, formatting) | Skip the harness entirely |
| Well-understood task, familiar area | Abbreviated R (skim), skip I, lightweight H |
| High-risk or cross-cutting change | Full loop, no shortcuts |
| Multi-day task | Full loop per slice, relay handoff between sessions |
| Emergency fix | Abbreviated loop, but H is never skipped |

The one step that is **never optional**: H (Handoff). Every piece of work must have a verified handoff, regardless of task size.
