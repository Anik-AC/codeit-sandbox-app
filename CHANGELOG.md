# Changelog

What changed for users, written by CodeIt's Docs agent from merged tickets.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## 2026-09-30

### Other changes

- **Added:** Shows how many tasks you have directly under the Tasks heading (for example "You have 3 tasks"), and hides the count when the list is empty. (CODEIT-72, #3)
- **Added:** Adds a version check at GET /api/version that reports which app version is deployed. (CODEIT-81, #9)
- **Added:** Adds a ping check at GET /api/ping that load balancers can call to confirm the API is alive. (CODEIT-84, #12)
- **Changed:** Changes the health check at GET /api/health to respond with {"status": "ok"} instead of {"ok": true}, so update any uptime probes or dashboards that check the old response. (CODEIT-80, #7)
