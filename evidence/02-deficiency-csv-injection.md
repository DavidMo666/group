# Deficiency: CSV Formula Injection in Exported Data

Owner: Member B
Branch: `cw1/defect-csv-injection`
PR:
Status: Candidate

Teacher categories: Validation; Security data export issue

## 1. Detection

Code location:

- `main.js`: `exportToCSV()` builds rows from transaction fields.
- `main.js`: CSV cells are quoted, but formula prefixes are not neutralized.

Tool/manual method:

- Manual browser reproduction.
- Exported CSV file inspection.
- Optional Excel or Google Sheets verification.

Environment:

- Browser:
- OS:
- Spreadsheet app:
- Commit SHA:
- Local or deployed URL:

Reproduction steps:

1. Open the app.
2. Add a transaction with this title: `=HYPERLINK("http://attacker.example","click")`.
3. Enter a valid amount, category, and date.
4. Click `Export CSV`.
5. Open the CSV in a spreadsheet app or inspect the raw file.
6. Confirm whether the exported cell still starts with `=`.

Before evidence:

- `evidence/assets/csv-injection/before-exported-csv.txt`
- `evidence/assets/csv-injection/before-spreadsheet-formula.png`

Quantified result:

- Dangerous formula-prefixed exported cells expected: `0`.
- Dangerous formula-prefixed exported cells before fix:

## 2. Literature

Primary source:

IEEE citation draft:

Key method from source:

Logic bridge to our fix:

## 3. Implementation

Before code snippet:

```js
row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",");
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

- `evidence/assets/csv-injection/after-exported-csv.txt`
- `evidence/assets/csv-injection/after-spreadsheet-safe-text.png`

Quantified before vs after:

Peer verifier:
