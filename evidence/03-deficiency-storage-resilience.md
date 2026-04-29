# Deficiency: Corrupted localStorage Crashes the App

Owner: Member C
Branch: `cw1/defect-storage-resilience`
PR:
Status: Fixed

Teacher categories: Persistence Layer - Local vs. Server storage; Error Handling; State Management

## 1. Detection

Code location:

- `main.js`: `loadFromLocalStorage()` previously parsed `financeTrackerData` directly with `JSON.parse`.
- `main.js`: `initializeApp()` calls storage loading during startup, so an exception blocks the whole page initialization.

Tool/manual method:

- Browser DevTools Console.
- Browser DevTools Application > Local Storage.
- Manual page refresh reproduction.
- Playwright smoke check for page errors and skeleton state.

Environment:

- Browser: Google Chrome.
- OS: macOS.
- Baseline commit SHA before this branch: `d9d475f`.
- Local URL: `http://localhost:8080`.

Reproduction steps:

1. Open the app.
2. Open DevTools Console.
3. Run: `localStorage.setItem("financeTrackerData", "{")`.
4. Refresh the page.
5. Observe the console error and whether the app initializes.

Before evidence:

- `evidence/assets/storage-resilience/03-before-normal-financeTrackerData-json.png`
- `evidence/assets/storage-resilience/04-before-inject-corrupted-localstorage-command.png`
- `evidence/assets/storage-resilience/05-before-console-syntaxerror-after-refresh.png`
- `evidence/assets/storage-resilience/06-before-page-stuck-after-crash.png`

Quantified result:

- Expected recovery from corrupted local data: app loads with safe fallback.
- Actual behavior before fix: one uncaught `SyntaxError` is thrown from `JSON.parse`.
- Startup-blocking errors before fix: `initializeApp()` is interrupted before the skeleton is hidden, leaving the app visually stuck.
- Playwright before-fix check: `errors.length = 1`, `skeleton = "skeleton"`.

## 2. Literature

Primary sources:

- MDN Web Docs, `JSON.parse() - JavaScript`.
- OWASP Web Security Testing Guide, `Testing Browser Storage`.
- OWASP Cheat Sheet Series, `Input Validation Cheat Sheet`.

IEEE citation draft:

```text
[1] MDN Web Docs, "JSON.parse() - JavaScript," Mozilla Developer Network. [Online]. Available: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse

[2] OWASP Foundation, "Testing Browser Storage," OWASP Web Security Testing Guide. [Online]. Available: https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/11-Client-side_Testing/12-Testing_Browser_Storage

[3] OWASP Foundation, "Input Validation Cheat Sheet," OWASP Cheat Sheet Series. [Online]. Available: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
```

Key method from source:

- MDN states that `JSON.parse()` throws a `SyntaxError` when the input is not valid JSON.
- OWASP treats browser storage as client-side data that can be inspected and modified through developer tools.
- OWASP recommends validating untrusted input at syntactic and semantic levels before the application processes it.

Logic bridge to our fix:

The stored `financeTrackerData` value cannot be trusted just because the app wrote it previously. It can be corrupted by manual DevTools changes, stale data from an older app version, browser extensions, or malformed persisted state. Therefore, the app should catch parse failures, validate that the parsed value has the expected transaction-array schema, recover to a safe empty state, and notify the user instead of letting startup fail.

## 3. Implementation

Before code snippet:

```js
const stored = localStorage.getItem(STORAGE_KEY);
state.transactions = stored ? JSON.parse(stored) : [];
```

After code snippet:

```js
try {
  const parsed = JSON.parse(stored);

  if (!Array.isArray(parsed)) {
    throw new TypeError("Stored transactions must be an array.");
  }

  const validTransactions = parsed.filter(isValidTransaction);
  state.transactions = validTransactions;

  if (validTransactions.length !== parsed.length) {
    saveToLocalStorage();
    showToast("Some saved transactions were invalid and were removed.", "error");
  }
} catch (error) {
  console.warn("Recovered from invalid financeTrackerData.", error);
  resetStoredTransactions();
  showToast("Saved data was corrupted and has been reset.", "error");
}
```

Files changed:

- `main.js`

Why this fix matches the literature:

- `try/catch` addresses MDN's documented `JSON.parse()` failure mode for invalid JSON.
- `Array.isArray(parsed)` checks the top-level syntax expected by the app: a list of transactions.
- `isValidTransaction()` checks semantic correctness for each transaction: string ID, non-empty title/category/date, finite numeric amount, and parseable date.
- `resetStoredTransactions()` provides fail-safe recovery by writing `[]`, allowing `initializeApp()` to complete and the UI to remain usable.

## 4. Verification

Same reproduction steps after fix:

1. Open the app with the fixed branch.
2. Run `localStorage.setItem("financeTrackerData", "{")` in DevTools Console.
3. Refresh the page.
4. Confirm the app loads instead of staying on the skeleton screen.
5. Confirm `financeTrackerData` is reset to `[]` in DevTools Application > Local Storage.
6. Confirm the console shows a handled recovery warning, not an uncaught startup exception.

After evidence:

- `evidence/assets/storage-resilience/07-after-corrupted-storage-recovered-page.png`
- `evidence/assets/storage-resilience/08-after-console-recovered-warning-no-pageerror.png`
- `evidence/assets/storage-resilience/09-after-localstorage-reset-to-empty-array.png`

Quantified before vs after:

- Before: `pageerror = 1`, console shows `Uncaught SyntaxError`, skeleton remains visible, and app startup is blocked.
- After: `pageerror = 0`, skeleton becomes `skeleton is-hidden`, `financeTrackerData` is rewritten as `[]`, and the app remains usable.

Peer verifier:

- Pending: Member A should repeat the same reproduction steps on their machine before merge.
