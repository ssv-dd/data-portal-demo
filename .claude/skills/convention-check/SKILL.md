---
name: convention-check
description: Ground your plan in codebase reality before writing code. Derives actual conventions from git history, existing code patterns, and organizational docs (Glean) — not just AGENTS.md. Use when planning a non-trivial task, working in an unfamiliar area, or when AGENTS.md guidance seems incomplete or stale. Trigger phrases include "check conventions", "what's the pattern here", "how is this done in the codebase", "convention check", "align with existing code".
alwaysApply: false
globs:
---

# Convention Check

Before writing a plan or code for a non-trivial task, ground yourself in how the codebase actually works today. Documentation drifts. Different people implement the same pattern differently. This skill pulls conventions from reality — git, code, organizational docs — so your plan matches the codebase, not stale docs.

## When to Use

- Before writing an implementation plan for any non-trivial task
- When working in an unfamiliar area of the codebase
- When AGENTS.md guidance seems incomplete, potentially stale, or absent
- When multiple valid approaches exist and you need to pick the one that matches existing code

## Workflow

### Step 1: Identify the Affected Area

Determine the paths, packages, and domains your task touches.

```
What directory/package am I modifying?
What type of artifact am I creating? (component, page, hook, utility, test, etc.)
```

### Step 2: Find Similar Implementations

Search for 3-5 recent examples of the same type of work in the affected path. Use multiple sources:

**Git history (most recent = most authoritative):**
- `git log --oneline -20 -- <path>` to see recent changes
- `git log --oneline --all --diff-filter=A -- <path>` to find when similar files were added
- Look at the most recent 2-3 PRs that touched this area

**Codebase search:**
- Use Grep/Glob/SemanticSearch to find structurally similar files
- For React: find files with the same component patterns, hook patterns
- For TypeScript: find files with the same type patterns, import conventions
- For styled-components: find files with the same styling patterns

**Key question:** "What are the 3 most recent files that look like what I'm about to create?"

### Step 3: Extract Actual Patterns

From the examples found in Step 2, extract:

| Aspect | What to look for |
|--------|-----------------|
| **File organization** | Directory structure, file naming, package layout |
| **Naming** | Function/variable/type naming conventions, prefixes, suffixes |
| **Imports** | Import grouping, internal vs external, alias patterns |
| **Structure** | Component layout, hook patterns, prop patterns |
| **Testing** | Test file placement, test naming, fixture patterns |
| **Error handling** | Error wrapping, logging patterns, return conventions |
| **Dependencies** | How similar code integrates with frameworks, libraries, external services |

Record the patterns as concrete observations, not generalizations:
- Good: "All 4 recent files in this path use styled-components with `colors` and `radius` from `@/styles/theme`"
- Bad: "Follow naming conventions"

### Step 4: Read Documented Conventions

Read the relevant instruction files and any applicable skills or guidelines:

- `CLAUDE.md` (repo-wide conventions)
- Skills that match your task type (`card-styling`, `prism-react`, etc.)
- `docs/ralph-harness/` directory for design guidelines, testing guidelines, governance guidelines

### Step 5: Search Organizational Knowledge

If available, search organizational knowledge sources for design docs, RFCs, and team decisions:

- Glean, Confluence, or similar: search for the feature/area name + "design doc" or "RFC"
- PR reviews on similar changes: what did reviewers flag? What patterns did they request?

### Step 6: Flag Drift

Compare what you found in Steps 2-3 (actual patterns) against Steps 4-5 (documented conventions). Report:

| Finding | Codebase reality | Documentation says | Drift? |
|---------|-----------------|-------------------|--------|
| (pattern aspect) | (what the code actually does) | (what docs say) | Yes/No |

Common drift patterns:
- Docs say X but recent code does Y (docs stale)
- Different files in the same path do it differently (no settled convention)
- Docs are silent on this aspect (convention exists only in code)
- Docs exist but nobody follows them (convention is aspirational)

### Step 7: Present Findings and Ask

Present your findings to the human before planning. Format:

```
## Convention Check: <task description>

### Affected area
<paths, packages, domains>

### Similar implementations found
1. <file path> (added <date>) — <brief description of pattern>
2. <file path> (added <date>) — <brief description of pattern>
3. <file path> (added <date>) — <brief description of pattern>

### Actual patterns observed
- File naming: <what the code does>
- Structure: <what the code does>
- Testing: <what the code does>
- (other relevant aspects)

### Documented conventions
- CLAUDE.md says: <summary>
- <guideline name> says: <summary>

### Drift detected
- <aspect>: Code does X, docs say Y
- <aspect>: No documentation, but code consistently does Z

### Recommendation
Based on the most recent implementations, I recommend following <pattern>.
<specific question if conventions conflict>
```

Wait for the human to confirm which conventions to follow before proceeding to plan or implement.

## Principles

- **Recency wins**: When code and docs conflict, the most recent merged code is usually more authoritative than potentially stale docs.
- **Consistency wins**: When multiple approaches exist, prefer the one used by the majority of recent files in the same path.
- **Ask, don't assume**: When drift is detected, always present the conflict and ask. Don't silently pick one.
- **Update docs when possible**: If you discover significant drift, suggest a docs update as a follow-up task (don't block on it).

## Integration with RALPH Loop

This skill is invoked during the **R (Review)** step and feeds into the **I (Interview)** step:

- **R**: Convention check produces grounded evidence of how the codebase works
- **I**: Drift findings become clarifying questions for the human ("Code does X, docs say Y — which should I follow?")
- **L/P**: Plan and implementation are grounded in confirmed conventions
