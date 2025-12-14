# Redactyl

Redactyl is a security middleware designed to protect AI agents from unsafe web content by statically analyzing and sanitizing webpage HTML before it is consumed.

## Problem Statement
Modern AI agents and web crawlers often ingest raw HTML content directly from the web. Hidden or invisible DOM elements can be used to inject instructions or malicious payloads that are not visible to human users but can influence AI systems.

## Current Status
This repository contains an MVP under active development.

### Implemented
- Backend module to detect and remove hidden DOM elements from HTML
- Standalone test to validate redaction logic

### In Progress
- Detection of encoded / obfuscated payloads
- Risk scoring logic
- Backend API integration

### Planned
- Browser extension for real-time analysis
- End-to-end demo and evaluation benchmarks

## Tech Stack
- Python
- Flask (backend API)
- BeautifulSoup (HTML parsing)
- Chrome Extension (planned)

## Note
This is a hackathon MVP focused on correctness, explainability, and end-to-end demonstration rather than production deployment.