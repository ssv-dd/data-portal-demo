---
name: harness-run
description: "Orchestrator for the 3-agent harness (Planner → Generator → Evaluator). Runs the full loop or resumes from where you left off. Invoke with /harness-run."
---

# Harness Orchestrator

Runs the full Planner → Generator → Evaluator loop using subagents for context isolation.

## How It Works

This orchestrator dispatches each agent as a **separate subagent** so each gets a fresh context window. Agents communicate through files in `harness/`, not through shared context.

```
User Prompt
    │
    ▼
┌──────────┐  writes   ┌─────────────────────────┐
│ PLANNER  │ ────────→ │ harness/specs/           │
└──────────┘           │   product-spec.md        │
                       └────────────┬─────────────┘
                                    │ reads
                                    ▼
                       ┌──────────────┐  writes   ┌─────────────────────────┐
                       │  GENERATOR   │ ────────→ │ harness/contracts/      │
                       └──────────────┘           │   sprint-N.md           │
                                                  │ harness/handoffs/       │
                                                  │   generator-status.md   │
                                                  └────────────┬────────────┘
                                                               │ reads
                                                               ▼
                                                  ┌──────────────┐  writes
                                                  │  EVALUATOR   │ ────────→
                                                  └──────────────┘
                                                  ┌─────────────────────────┐
                                                  │ harness/evaluations/    │
                                                  │   sprint-N-eval.md      │
                                                  └─────────────────────────┘
                                                               │
                                              ┌────────────────┴────────────┐
                                              │                             │
                                          ALL PASS                    HAS FAILURES
                                              │                             │
                                         Next sprint               Generator fixes
                                         or DONE                   then re-evaluate
```

## Usage

### Starting Fresh

When the user provides a prompt for a new build:

1. **Dispatch Planner subagent:**
   ```
   Agent tool → subagent_type: "general-purpose"
   Prompt: "You are the Harness Planner agent. Read the skill at .claude/skills/harness-planner/SKILL.md and follow it exactly. The user's request is: [USER PROMPT]. Write the product spec to harness/specs/product-spec.md"
   ```

2. **Dispatch Generator subagent:**
   ```
   Agent tool → subagent_type: "general-purpose"
   Prompt: "You are the Harness Generator agent. Read the skill at .claude/skills/harness-generator/SKILL.md and follow it exactly. Read the product spec from harness/specs/product-spec.md and implement Sprint 1."
   ```

3. **Dispatch Evaluator subagent:**
   ```
   Agent tool → subagent_type: "general-purpose"
   Prompt: "You are the Harness Evaluator agent. Read the skill at .claude/skills/harness-evaluator/SKILL.md and follow it exactly. Evaluate the latest sprint by reading the contract in harness/contracts/ and testing the running app at http://localhost:5180"
   ```

4. **Check evaluation result:**
   - Read `harness/evaluations/sprint-N-eval.md`
   - If ALL PASS → dispatch Generator for next sprint
   - If FAILURES → dispatch Generator to fix, then re-evaluate

### Resuming

Check the current state by reading:
- `harness/handoffs/generator-status.md` — where the Generator left off
- `harness/evaluations/` — latest evaluation results
- `harness/contracts/` — which sprints have been contracted

Then dispatch the appropriate agent to continue.

## Key Principle: Context Resets

Each agent runs as a **fresh subagent** with no shared context. This is intentional:

> "Context resets (clearing the context window entirely) rather than compaction"

The file-based handoff system (`harness/`) is how agents maintain continuity across context boundaries. Each agent reads what it needs from files, does its work, and writes results back to files.

## When to Use Each Agent Directly

You don't always need the full loop:

| Command | When to use |
|---------|-------------|
| `/harness-planner` | Writing a spec for a new feature/app |
| `/harness-generator` | Implementing a sprint (spec already exists) |
| `/harness-evaluator` | Testing a sprint (code already written) |
| `/harness-run` | Running the full loop end-to-end |

## File Structure

```
harness/
├── specs/
│   └── product-spec.md          # Planner output — the source of truth
├── contracts/
│   ├── sprint-1.md              # Generator ↔ Evaluator agreement
│   ├── sprint-2.md
│   └── ...
├── evaluations/
│   ├── sprint-1-eval.md         # Evaluator results
│   ├── sprint-2-eval.md
│   └── ...
└── handoffs/
    └── generator-status.md      # Generator progress for context resets
```

## Cost Awareness

Per the Anthropic article, the full harness is ~20x more expensive than a solo run. Use it for:
- Complex multi-feature builds
- Features requiring high quality/polish
- Work where bugs are costly

Skip it for:
- Simple bug fixes
- Single-file changes
- Quick prototypes
