---
name: open-pr
description: Push the branch and open or update the pull request with the template, then print the final RESULT line.
---

# Open or update the pull request

1. Make sure lint, type check and unit tests pass, and your commits are on the ticket
   branch (`git branch --show-current`). Never commit to `main`.
2. Push: `git push -u origin HEAD`. On rework, the branch already has a PR: push to it.
   Never force-push unless you rebased; then use `--force-with-lease`.
3. Check for an existing PR: `gh pr view --json url,state 2>/dev/null`.
   - **None:** `gh pr create --base main --title "{KEY}: {ticket summary}" --body-file <file>`
   - **Open:** `gh pr edit --body-file <file>` so the description matches the code.
4. Write the body with this template, filling every section:

````markdown
## Summary

<!-- One or two sentences: what this PR does and why. Link the ticket: {KEY}. -->

## Acceptance criteria

<!-- Copy every criterion from the ticket. Tick it and name the test that proves it. -->
- [ ] Given ... When ... Then ... (test: `path/to/file.test.ts` > "name")

## Changes

<!-- The files or modules changed, one line each, in the order a reviewer should read them. -->

## Tests added

<!-- New or changed tests, and which criterion each one covers. -->

## Test results

<!-- Paste the summary lines of the lint, typecheck, unit and relevant e2e runs. -->

## Notes for reviewer

<!-- Anything surprising: trade-offs, follow-ups, things you could not do. "None" is fine. -->
````

5. Finish your work with exactly one final line, and nothing after it:

```
RESULT: {"status": "pr_opened", "pr_url": "https://github.com/...", "notes": "one sentence"}
```

`status` is one of:
- `pr_opened`: you created the PR.
- `pr_updated`: you pushed to an existing PR.
- `blocked`: you need a human decision. Say what, in `notes`, and in a Jira comment.
- `failed`: you tried and could not make it work. Say what failed, in `notes`.
