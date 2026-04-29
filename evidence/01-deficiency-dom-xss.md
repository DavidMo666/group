# Deficiency: Stored DOM XSS in Transaction Rendering

Owner: Member A
Branch: `cw1/defect-dom-xss`
PR:
Status: Candidate

Teacher categories: Security - XSS Vulnerability; Risk for Cross-Site Scripting; Validation

## 1. Detection

Code location:

- `main.js`: transaction title is read from `titleInput`.
- `main.js`: `renderTransactions()` writes generated transaction markup with `innerHTML`.
- `main.js`: `renderTransactionItem()` inserts `tx.title` into an HTML template.

Tool/manual method:

- Manual browser reproduction.
- Browser DevTools Elements panel.

Environment:

- Browser:
- OS:
- Commit SHA:
- Local or deployed URL:

Reproduction steps:

1. Open the app.
2. Enter this title: `<img src=x onerror=alert("xss")>`.
3. Enter a valid amount, category, and date.
4. Submit the transaction.
5. Observe whether a browser alert appears.
6. Refresh the page and observe whether the payload persists through `localStorage`.

Before evidence:

- `evidence/assets/dom-xss/before-alert.png`
- `evidence/assets/dom-xss/before-dom-node.png`
- `evidence/assets/dom-xss/before-refresh-persistence.png`

Quantified result:

- Expected script executions: `0`.
- Actual script executions before fix:
- User-controlled fields inserted into HTML without escaping:

## 2. Literature

Primary source:

IEEE citation draft:

Key method from source:

Logic bridge to our fix:

## 3. Implementation

Before code snippet:

```js
return `
  <p class="transaction__title">${tx.title}</p>
`;
```

After code snippet:

```js
// Fill this after implementation.
```

Files changed:

Why this fix matches the literature:

## 4. Verification

Same reproduction steps after fix:

After evidence:

- `evidence/assets/dom-xss/after-no-script-execution.png`
- `evidence/assets/dom-xss/after-text-rendered-safely.png`

Quantified before vs after:

Peer verifier:
