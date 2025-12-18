
---
# Redactyl Architecture

## Overview

Redactyl is designed as a **preprocessing safety layer for AI agents** that
consume web content. Instead of allowing AI agents to directly ingest raw web
pages, Redactyl intercepts the page content, removes potential AI-risk DOM
patterns, and outputs sanitized HTML suitable for downstream AI processing.

Redactyl does not aim to classify websites as malicious. Its primary objective
is to reduce the risk of prompt injection, hidden manipulation, and encoded
instructions embedded within web pages.

---

## System Components

Redactyl consists of three main components:

1. **Chrome Extension (Frontend Interface)**
2. **Flask Backend (Redaction Engine)**
3. **Downstream AI Agent (Consumer, conceptual)**

---

## Architecture Flow

The high-level flow of Redactyl is as follows:


## Component Breakdown

### 1. Chrome Extension

The Chrome extension acts as the entry point of the system. Its responsibilities
include:

- Capturing the complete DOM of the active web page
- Sending raw HTML content to the backend for analysis
- Displaying analysis results such as:
  - Number of hidden elements removed
  - Encoded payloads detected
  - Risk indicators and explanations
- Allowing users to view or copy the redacted HTML output

The extension does not perform any detection logic itself. All analysis and
redaction decisions are delegated to the backend to ensure consistency and
centralized control.

---

### 2. Flask Backend (Redaction Engine)

The backend is implemented as a Flask-based API and serves as the core
processing unit of Redactyl.

Key responsibilities include:

- Parsing incoming HTML using a DOM parser
- Identifying AI-risk patterns such as:
  - Hidden DOM elements (`display:none`, `hidden` attributes, etc.)
  - Encoded payloads (e.g., Base64-encoded strings)
- Removing hidden elements from the DOM
- Detecting and reporting encoded payloads without altering visible content
- Generating a sanitized HTML output for safe downstream consumption
- Providing contextual risk explanations to aid interpretability

The backend operates deterministically using rule-based logic. This design
choice prioritizes transparency, explainability, and reproducibility over
opaque model-based inference.

---

### 3. Downstream AI Agent (Conceptual Integration)

Redactyl is designed to sit **between web content and AI agents**.

Instead of AI agents ingesting raw web pages directly, they consume the
sanitized HTML output produced by Redactyl. This prevents hidden or encoded
instructions from influencing AI behavior while preserving legitimate visible
content.

In the current implementation, the downstream AI agent is demonstrated
conceptually. The redacted HTML output is made available via the API and
extension interface, enabling easy integration with summarization agents,
scrapers, or other web-based AI systems.

---

## Design Rationale

### Why Rule-Based Redaction?

- Hidden and encoded DOM patterns are structurally identifiable
- Rule-based logic provides predictable and explainable behavior
- Avoids false confidence associated with probabilistic classification
- Suitable for security-oriented preprocessing tasks

### Why Preprocessing Instead of Classification?

Web pages frequently contain hidden or encoded elements for benign reasons
(e.g., UI state management, analytics). Treating these patterns as absolute
indicators of maliciousness would be inaccurate.

Redactyl instead treats them as **AI-risk factors**, focusing on removal and
sanitization rather than labeling sites as unsafe.

---

## Security and Scope Considerations

- Redactyl does not execute page JavaScript
- No modification is made to visible content structure
- The system is designed to be non-intrusive and reversible
- Scope is intentionally limited to DOM-based AI risks

---

## Summary

Redactyl introduces a modular, transparent, and extensible architecture for
protecting AI agents from DOM-based prompt injection and hidden manipulation.
By operating as a preprocessing layer rather than a classifier, Redactyl
provides a practical and explainable approach to AI safety in web-based
environments.
