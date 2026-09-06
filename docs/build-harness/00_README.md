# TradeGuard Build Harness

This directory is the readiness source of truth for the Binance Agent OS Mini Hackathon build.

## Current Readiness

- Overall status: **PARTIAL**
- Conservative readiness score: **67/100**. This is an engineering-readiness estimate, not a win probability.
- P0 blockers: Agent OS snapshot provenance can be spoofed at the HTTP boundary; WebMCP tool execution has not been verified in a supported browser context; dependency audit reports eight high-severity advisories; the GitHub repository is private; demo, social post, survey and eligibility remain unverified.
- P1 issues: no automated API-route integration suite, no CI, duplicated Sites/Vercel adapters, no signed receipt format.
- Last verified: 2026-09-06
- Verified by: Codex using product commit `d424f65`, production HTTP checks and Binance MCP output.

## Evidence Principle

A claim is accepted only when implementation, a relevant invariant, a passing check, inspectable evidence and honest execution status agree.

## Documents

The numbered documents cover the problem, ecosystem gap, architecture, threats, invariants, sponsor integration, execution truth, tests, evidence, demo, reusable core and submission gate.
