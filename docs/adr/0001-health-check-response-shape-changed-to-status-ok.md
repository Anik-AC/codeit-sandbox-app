# 0001. Health check response shape changed to {"status": "ok"}

- **Status:** Accepted
- **Date:** 2026-09-30
- **Source:** CODEIT-80, [PR #7](https://github.com/Anik-AC/codeit-sandbox-app/pull/7)

## Context

The ticket asked for GET /api/health to return 200 with {"status": "ok"}. Before this change, the endpoint returned {"ok": true}.

## Decision

The endpoint now returns {"status": "ok"}, and the unit test checks for an exact match on both the status code and the body. The old {"ok": true} shape is gone and there is no compatibility fallback.

## Consequences

This change is visible to anything outside the app. Any uptime probe, dashboard or smoke test that checks for the old body will break until it is updated. The reviewer asked for this to be called out in the release notes so the problem is not first discovered in production.

_Recorded by CodeIt's Docs agent from the pull request and its review._
