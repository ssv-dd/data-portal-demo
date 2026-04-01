# Canvas PRD

**Author:** Gun Johnson  
**Date:** 3-4-2026  
**Source:** [Google Doc](https://docs.google.com/document/d/1xIiEh2MPMsDFQm69rsBgzoX3gplrQ76clwZmuDmjfwo/edit?tab=t.0)

## 1. Introduction and Overview

This document outlines the requirements for a new Data Visualization and Reporting Platform, comprised of two core components: Widgets and Canvas. The goal is to provide DoorDash (DD) users with a powerful, flexible, and governed system for data analysis, reporting, and sharing.

## 2. Goals and Objectives

- Enable users to create, view, and share dynamic data visualizations (Widgets).
- Provide a collaborative environment (Canvas) for combining multiple visualizations and deriving insights.
- Establish clear guardrails to manage platform cost, performance, and resource utilization.
- Facilitate easy integration and sharing of data insights within and outside of the platform (e.g., G-Docs).

## 3. Features & Requirements

### 3.1. Widget Requirements

Widgets are the foundational visualization units of the platform.

| Requirement Area | Detailed Requirements | Priority |
|---|---|---|
| Data & Updates | Must define a configurable Update Frequency for the underlying data. | P0 |
| Data & Updates | Must allow for Data Linkage, enabling a single source of data to be shared with other Widgets. | P1 |
| Visualization | Must support different object types: Chart/Graph and Table. | P0 |
| Visualization | Must explicitly support Waterfall Charts. | P0 |
| Visualization | Must provide a mechanism for viewing data Lineage. | P1 |
| Sharing & Export | Must support Sharing with other DD users within the platform. | P0 |
| Sharing & Export | Must support a Copy function to copy and link the Widget into external documents, specifically Google Docs. | P0 |
| Maintenance | A process for ongoing Maintenance must be defined. | P1 |

### 3.2. Canvas Requirements

Canvas is the dashboarding environment where Widgets are composed and managed.

| Requirement Area | Detailed Requirements | Priority |
|---|---|---|
| Composition & Layout | Must support the Combination of Multiple Widgets into a single view. | P0 |
| Composition & Layout | Must provide the Ability to Order & Re-size Widgets within the Canvas. | P0 |
| Data & Updates | Must support a configurable Update Frequency, with the potential for Auto-Update based on the selected frequency. | — |
| Insights | Must include the Ability to Generate AI Summaries from the combined data of the Canvas. | P0 |
| Sharing & Collaboration | Must support Sharing with other users within the Canvas environment. | P0 |
| Sharing & Collaboration | Must support a Copy function to copy and link the Canvas into external documents, specifically Google Docs. | P0 |
| Sharing & Collaboration | Must enable Collaboration, allowing multiple DD users to work together on a single Canvas. | P1 |
| Standardization | Must support a Promote function to share standardized Canvases across the organization. | P1 |
| Maintenance | A process for ongoing Maintenance must be defined. | P1 |

### 3.3. Guardrail Requirements

Guardrails ensure the platform operates efficiently and cost-effectively.

| Requirement Area | Detailed Requirements | Priority |
|---|---|---|
| Cost & Runtime | Must implement tracking and controls for Overall Cost & Runtime associated with the platform's operation (e.g., data queries, updates). | P0 |
| Usage Management | Must establish rules for Use to manage resource consumption. | P1 |
| Usage Management | Example Use Rule: Implement a process to automatically deprecate a Widget or Canvas's update frequency (e.g., from daily to weekly updates) if non-use is detected over a defined period. | P1 |

## 4. Success Metrics

- Adoption Rate: Number of active DD users creating/viewing Widgets and Canvases per month.
- Performance: Average load time for Widgets and Canvases.
- Cost Efficiency: Reduction in overall query/platform cost due to Guardrails implementation.
- Collaboration: Number of Canvases shared and collaborated on.

## Appendix

**Widget:**
- Update frequency
- Share: share with other DD users
- Copy: Copy & link into G-Docs in particular
- Data Linkage: Source data to be shared with other widgets in particular
- Object: Chart / Graph vs. table, must have Waterfall charts
- Lineage?
- Maintain

**Canvas:**
- Update frequency: could this be auto-updated for the particular update frequency
- Combination of multiple widgets
- Ability to order & re-size widgets
- Ability to generate AI summaries from
- Share: share with other users within Canvas
- Copy: Copy & link into G-Docs in particular
- Collaborate: work with other DD users on
- Promote: Share standardized
- Maintain

**Guardrails:**
- Overall Cost & Runtime
- Use: e.g. deprecate from daily -> weekly updates if non-use
