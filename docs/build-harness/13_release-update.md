# September 8 release update

This update supersedes the earlier dependency and market-integrity findings.

- Patched dependencies: installation audit reports zero vulnerabilities.
- Risk calculations now use a fresh server-fetched Binance book for agent requests.
- Submitted top-of-book prices are compared within 0.5%; malformed IDs and divergent prices are rejected.
- Submitted update IDs remain separate from the authoritative calculation book.
- Agent identity is not authenticated; no cryptographic provenance claim is made.
- Risk checks, type checking and production build passed locally.
- GitHub Actions verification workflow added.
- Browser WebMCP demonstration, video recording and personal submission steps remain to be completed.

The older evidence files describe historical runs, not this release.
