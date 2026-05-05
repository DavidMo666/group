const { loadApp } = require("./helpers/loadApp");

describe("finance tracker utility logic", () => {
  test("escapes HTML and CSV cells safely", () => {
    const app = loadApp();

    expect(app.escapeHTML('<img src=x onerror="alert(1)">')).toBe(
      '&lt;img src=x onerror="alert(1)"&gt;',
    );
    expect(app.isCSVFormulaRisk("=SUM(A1:A2)")).toBe(true);
    expect(app.isCSVFormulaRisk("  -10")).toBe(true);
    expect(app.isCSVFormulaRisk("Groceries")).toBe(false);
    expect(app.toCSVTextFormula('=2+2 "quoted"')).toBe('="=2+2 ""quoted"""');
    expect(app.escapeCSVCell('=2+2 "quoted"')).toBe('"=""=2+2 """"quoted"""""""');
    expect(app.escapeCSVCell("plain", false)).toBe('"plain"');
    expect(app.escapeCSVCell(null)).toBe('""');
  });

  test("validates transactions and consent records", () => {
    const app = loadApp();
    const validTransaction = {
      id: "tx_1",
      title: "Salary",
      amount: 2500,
      category: "Salary",
      date: "2026-05-01",
    };
    const validConsent = {
      version: app.CONSENT_VERSION,
      mode: app.CONSENT_MODES.ALLOWED,
      recordedAt: "2026-05-05T10:00:00.000Z",
    };

    expect(app.isPlainObject(validTransaction)).toBe(true);
    expect(app.isPlainObject(null)).toBe(false);
    expect(app.isPlainObject([])).toBe(false);
    expect(app.isValidTransaction(validTransaction)).toBe(true);

    [
      null,
      { ...validTransaction, id: " " },
      { ...validTransaction, title: "" },
      { ...validTransaction, amount: Number.NaN },
      { ...validTransaction, amount: "2500" },
      { ...validTransaction, category: "" },
      { ...validTransaction, date: "not-a-date" },
    ].forEach((transaction) => {
      expect(app.isValidTransaction(transaction)).toBe(false);
    });

    expect(app.isValidConsent(validConsent)).toBe(true);
    expect(app.isValidConsent({ ...validConsent, version: 0 })).toBe(false);
    expect(app.isValidConsent({ ...validConsent, mode: "maybe" })).toBe(false);
    expect(app.isValidConsent({ ...validConsent, recordedAt: "soon" })).toBe(
      false,
    );
  });

  test("formats currency, dates, filters, groups, and transaction markup", () => {
    const app = loadApp();
    app.state.transactions = [
      {
        id: "tx_income",
        title: "May Salary",
        amount: 3200,
        category: "Salary",
        date: "2026-05-02",
      },
      {
        id: "tx_food",
        title: "Groceries <weekly>",
        amount: -80.5,
        category: "Food",
        date: "2026-05-03",
      },
      {
        id: "tx_april",
        title: "April Rent",
        amount: -900,
        category: "Housing",
        date: "2026-04-30",
      },
    ];

    expect(app.formatCurrency(-80.5)).toBe("-$80.50");
    expect(app.formatDate("2026-05-03")).toBe("May 3, 2026");

    app.state.filters = { category: "Food", type: "expense", search: "gro" };
    expect(app.filterTransactions()).toHaveLength(1);
    expect(app.filterTransactions()[0].id).toBe("tx_food");

    app.state.filters = { category: "all", type: "income", search: "" };
    expect(app.filterTransactions()).toHaveLength(1);

    const groups = app.groupByMonth(app.state.transactions);
    expect(groups.map((group) => group.label)).toEqual(["May 2026", "April 2026"]);
    expect(groups[0].items.map((transaction) => transaction.id)).toEqual([
      "tx_food",
      "tx_income",
    ]);

    app.state.editingId = "tx_food";
    const markup = app.renderTransactionItem(app.state.transactions[1]);
    expect(markup).toContain("transaction--editing");
    expect(markup).toContain("Groceries &lt;weekly&gt;");
    expect(markup).toContain("amount--expense");
  });

  test("reports consent status text for every state", () => {
    const app = loadApp();

    app.state.consent = null;
    expect(app.getConsentStatusText()).toContain("No storage preference");

    app.state.consent = {
      version: app.CONSENT_VERSION,
      mode: app.CONSENT_MODES.REJECTED,
      recordedAt: "2026-05-05T10:00:00.000Z",
    };
    expect(app.hasPersistentStorageConsent()).toBe(false);
    expect(app.getConsentStatusText()).toContain("persistent storage rejected");

    app.state.consent = {
      version: app.CONSENT_VERSION,
      mode: app.CONSENT_MODES.ALLOWED,
      recordedAt: "2026-05-05T10:00:00.000Z",
    };
    expect(app.hasPersistentStorageConsent()).toBe(true);
    expect(app.getConsentStatusText()).toContain("persistent storage allowed");

    app.state.consent = {
      version: app.CONSENT_VERSION,
      mode: "unknown",
      recordedAt: "2026-05-05T10:00:00.000Z",
    };
    expect(app.getConsentStatusText()).toContain("No storage preference");
  });
});