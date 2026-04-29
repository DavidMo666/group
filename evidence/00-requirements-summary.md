# CPT304 Coursework 1 Requirements Summary

## Core Requirement

The team must fork a tiny open-source project, audit the original code, identify four unique deficiencies, research fixes from external literature, implement the fixes, deploy the app, and submit a report with evidence.

The four deficiencies must be real weaknesses in the original project. They cannot be the same as the five baseline standards.

## Four Deficiencies

Each deficiency must use the Detection-Literature-Implementation structure:

1. Detection: show how the flaw was found and prove it exists.
2. Literature: cite a paper, official standard, or high-quality technical article that supports the fix.
3. Implementation: explain how the research directly guided the code change and show before-vs-after code snippets.

## Five Baseline Standards

The baseline standards are tracked separately:

1. Live uptime: site live on Vercel or Render for 7+ consecutive days.
2. Test coverage: 80%+ coverage with Codecov/Istanbul evidence.
3. Accessibility: Lighthouse Accessibility score 90+.
4. Internationalization: working toggle for at least two languages.
5. Legal compliance: functional cookie banner and dedicated privacy policy page.

## Evidence Rules

- Every screenshot must have a figure number and descriptive caption in the final report.
- Every deficiency must have reproducible steps and measurable before-vs-after evidence.
- Each team member must provide PR links and contribution evidence.
- AI output is only a helper. The final evidence must come from reproducible local or deployed behavior.
- A PR description should answer: what changed, why it changed, where the old-vs-new code is, and which screenshots or preview links prove it.
- Baseline standards must be written separately from the four deficiencies, even when one branch contributes to both.

## Teacher Direction Mapping

The selected deficiencies map to the teacher-provided categories:

| Deficiency | Teacher categories |
| --- | --- |
| Stored DOM XSS | Security - XSS Vulnerability; Risk for Cross-Site Scripting; Validation |
| CSV Formula Injection | Validation; Security data export issue |
| Corrupted localStorage crash | Persistence Layer; Error Handling; State Management |
| Multi-tab lost update | Concurrency Issues; State Management; Logic - Race Conditions |

## Storage Resilience Evidence Status

The first implemented deficiency is `Corrupted localStorage Crashes the App` on branch `cw1/defect-storage-resilience`.

Report-ready evidence is stored under `evidence/assets/storage-resilience/`:

- `03-before-normal-financeTrackerData-json.png`
- `04-before-inject-corrupted-localstorage-command.png`
- `05-before-console-syntaxerror-after-refresh.png`
- `06-before-page-stuck-after-crash.png`
- `07-after-corrupted-storage-recovered-page.png`
- `08-after-console-recovered-warning-no-pageerror.png`
- `09-after-localstorage-reset-to-empty-array.png`

The final report should use figure numbers and captions for these images. The raw working folder `复现问题截屏/` is intentionally ignored and should not be pushed.
