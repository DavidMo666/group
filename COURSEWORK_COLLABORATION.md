# CPT304 Coursework 1 Collaboration Plan

## Goal

This repository uses a four-branch workflow for CPT304 Coursework 1. Each team member owns one deficiency branch and must provide reproducible evidence, literature support, implementation notes, verification results, and PR links.

The five baseline standards are tracked separately from the four deficiencies. A baseline item can be implemented in the same branch as a deficiency, but it must not be presented as one of the four deficiencies in the report.

## Branch Ownership

| Owner | Branch | Deficiency | Teacher category | Baseline support |
| --- | --- | --- | --- | --- |
| Member A | `cw1/defect-dom-xss` | Stored DOM XSS in transaction rendering | Security - XSS Vulnerability; Risk for Cross-Site Scripting; Validation | Accessibility |
| Member B | `cw1/defect-csv-injection` | CSV Formula Injection in exported data | Validation; Security data export issue | Test coverage |
| Member C | `cw1/defect-storage-resilience` | Corrupted `localStorage` crashes the app | Persistence Layer; Error Handling; State Management | Cookie banner and Privacy Policy |
| Member D | `cw1/defect-concurrency-loss` | Multi-tab lost update race condition | Concurrency Issues; State Management; Logic - Race Conditions | i18n and deployment tracking |

## Daily Workflow

1. Start from the latest stable `main`.

   ```bash
   git checkout main
   git pull origin main
   ```

2. Create or update your branch.

   ```bash
   git checkout -b cw1/defect-dom-xss
   ```

   If your branch already exists:

   ```bash
   git checkout cw1/defect-dom-xss
   git merge main
   ```

3. Work only on your assigned deficiency and assigned baseline item.
4. Record evidence in the matching `evidence/*.md` file and place screenshots/log exports under the matching `evidence/assets/<deficiency>/` folder.
5. Open a Draft PR early. Keep the PR draft open while collecting evidence and implementation notes.
6. Request one code reviewer and one evidence verifier before merging.

## Merge Order

Recommended merge order:

1. `cw1/defect-dom-xss`
2. `cw1/defect-csv-injection`
3. `cw1/defect-storage-resilience`
4. `cw1/defect-concurrency-loss`

The concurrency branch should merge last because it may depend on a more robust storage layer.

## Review Matrix

| PR | Code reviewer | Evidence verifier |
| --- | --- | --- |
| DOM XSS | Member B | Member C |
| CSV Injection | Member C | Member D |
| Storage Resilience | Member D | Member A |
| Concurrency Loss | Member A | Member B |

## Evidence Standard

Every deficiency must include:

- Code location.
- Reproduction steps that another teammate can repeat.
- Before evidence: screenshot, console log, exported file, or browser recording.
- Quantified result, such as script executed once, one of two records lost, or app fails to initialize.
- Literature source and IEEE citation draft.
- Before and after code snippets.
- Verification after the fix using the same reproduction steps.
- PR link and peer verifier name.

AI tool output is not evidence by itself. A team member must reproduce the issue locally and record the result.

## Repository Hygiene

Do not push local course handouts, temporary screenshots, `.DS_Store`, or raw browser-capture working folders. Use the curated project structure instead:

- Deficiency notes: `evidence/0X-deficiency-<topic>.md`
- Report-ready screenshots: `evidence/assets/<topic>/`
- PR rules: `.github/pull_request_template.md`
- Team workflow: `COURSEWORK_COLLABORATION.md`

For storage resilience, the raw working screenshots are kept locally under `复现问题截屏/`, while the report-ready copies are stored under `evidence/assets/storage-resilience/`.

Before opening a PR, run:

```bash
git status --short
git diff --check
```

The PR should include only the implementation files, the matching evidence markdown file, report-ready screenshots, and workflow files needed by the team.

## Baseline Evidence

Track the five baseline standards in `evidence/05-baseline-standards.md`:

- Live uptime: production URL and 7-day deployment log.
- Test coverage: 80%+ badge/report.
- Accessibility: Lighthouse Accessibility 90+ screenshot.
- i18n: screenshots showing at least two languages.
- Legal compliance: cookie banner and dedicated privacy policy page screenshots.

## Schedule

| Date | Target |
| --- | --- |
| 2026-04-28 | Lock four deficiencies, create branches and evidence files |
| 2026-04-29 | Finish before evidence and literature source for each deficiency |
| 2026-04-30 to 2026-05-02 | Implement fixes, tests, and PR review |
| 2026-05-03 | Merge deployable version to `main` and start collecting 7-day uptime |
| 2026-05-04 to 2026-05-08 | Finish coverage, Lighthouse, i18n, legal evidence |
| 2026-05-09 to 2026-05-10 | Write report, number screenshots, finalize IEEE references |
| 2026-05-11 | Package final ZIP and submit |
