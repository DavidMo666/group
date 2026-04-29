# Deficiency: Multi-tab Lost Update Race Condition

Owner: Member D
Branch: `cw1/defect-concurrency-loss`
PR:
Status: Candidate

Teacher categories: Concurrency Issues; State Management; Logic - Race Conditions; Persistence Layer

## 1. Detection

Code location:

- `main.js`: app reads `localStorage` only during initialization.
- `main.js`: each save writes the full `state.transactions` array back to storage.
- `main.js`: no `storage` event listener or merge strategy exists.

Tool/manual method:

- Two browser tabs.
- Browser DevTools Application panel.
- Optional Playwright script for repeatable proof.

Environment:

- Browser:
- OS:
- Commit SHA:
- Local or deployed URL:

Reproduction steps:

1. Open the app in Tab A.
2. Open the same app in Tab B.
3. In Tab A, add a transaction titled `A tab transaction`.
4. Without refreshing Tab B, add a transaction titled `B tab transaction`.
5. Refresh Tab A.
6. Inspect the transaction list or `localStorage`.

Before evidence:

- `evidence/assets/concurrency-loss/before-tab-a-add.png`
- `evidence/assets/concurrency-loss/before-tab-b-add.png`
- `evidence/assets/concurrency-loss/before-lost-update.png`

Quantified result:

- Expected records after two tab writes: `2`.
- Actual records before fix:
- Lost update rate in this scenario:

## 2. Literature

Primary source:

IEEE citation draft:

Key method from source:

Logic bridge to our fix:

## 3. Implementation

Before code snippet:

```js
state.transactions = [newTransaction, ...state.transactions];
saveToLocalStorage();
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

- `evidence/assets/concurrency-loss/after-two-records-preserved.png`
- `evidence/assets/concurrency-loss/after-storage-event-sync.png`

Quantified before vs after:

Peer verifier:
