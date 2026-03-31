# Harness: 3-Agent Build System

GAN-inspired architecture for long-running app development, based on
[Anthropic's harness design patterns](https://www.anthropic.com/engineering/harness-design-long-running-apps).

## Agents

| Agent | Command | Role |
|-------|---------|------|
| **Planner** | `/harness-planner` | Expands a brief prompt into a product spec |
| **Generator** | `/harness-generator` | Implements features against the spec, writes sprint contracts |
| **Evaluator** | `/harness-evaluator` | Tests running app via Playwright, scores against contracts |
| **Orchestrator** | `/harness-run` | Runs the full loop with subagents |

## Quick Start

```
/harness-planner       # Give it a 1-4 sentence description
/harness-generator     # Implements sprint 1
/harness-evaluator     # Tests sprint 1
/harness-generator     # Fixes failures or starts sprint 2
```

## File Structure

```
harness/
├── specs/product-spec.md        # Planner output
├── contracts/sprint-N.md        # Generator ↔ Evaluator agreements
├── evaluations/sprint-N-eval.md # Evaluator results
└── handoffs/generator-status.md # Progress across context resets
```

## Key Principles

1. **File-based handoffs** — agents communicate through files, not shared context
2. **Context resets** — each agent gets a fresh context window
3. **Sprint contracts** — testable criteria agreed before coding
4. **Skeptical evaluator** — external critic catches what generators miss
