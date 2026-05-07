const {
  byId,
  click,
  loadApp,
  submitTransaction,
  transactionTitles,
} = require("./helpers/loadApp");
const { makeConsent, makeTransaction } = require("./helpers/fixtures");

const latestToastText = () => {
  const toasts = document.querySelectorAll(".toast");
  return toasts[toasts.length - 1]?.textContent || "";
};

describe("finance tracker resilience and edge cases", () => {
  test("handles allowed consent with no stored transactions without showing the privacy prompt", () => {
    localStorage.setItem("financeTrackerConsent", JSON.stringify(makeConsent()));

    const app = loadApp();

    expect(app.state.transactions).toEqual([]);
    expect(localStorage.getItem(app.STORAGE_KEY)).toBeNull();
    expect(byId("privacyBanner").hidden).toBe(true);
    expect(byId("resultsCount").textContent).toBe("0 results");
    expect(byId("financeChart").getAttribute("aria-label")).toContain(
      "total income $0.00 and total expenses $0.00",
    );
    expect(document.querySelector(".toast--error")).toBeNull();
  });

  test("resets stored transactions when persisted data is not an array", () => {
    localStorage.setItem("financeTrackerConsent", JSON.stringify(makeConsent()));
    localStorage.setItem(
      "financeTrackerData",
      JSON.stringify({ id: "tx_not_array" }),
    );

    const app = loadApp();

    expect(app.state.transactions).toEqual([]);
    expect(localStorage.getItem(app.STORAGE_KEY)).toBe("[]");
    expect(console.warn).toHaveBeenCalledWith(
      "Recovered from invalid financeTrackerData.",
      expect.any(TypeError),
    );
    expect(latestToastText()).toBe("Saved data was corrupted and has been reset.");
  });

  test("invalid consent records are discarded without loading stale data or theme", () => {
    const savedTransaction = makeTransaction({ title: "Hidden Until Consent" });

    localStorage.setItem(
      "financeTrackerConsent",
      JSON.stringify({ version: 1, mode: "allowed" }),
    );
    localStorage.setItem("financeTrackerTheme", "light");
    localStorage.setItem(
      "financeTrackerData",
      JSON.stringify([savedTransaction]),
    );

    const app = loadApp();

    expect(app.state.consent).toBeNull();
    expect(localStorage.getItem(app.CONSENT_KEY)).toBeNull();
    expect(app.state.transactions).toEqual([]);
    expect(transactionTitles()).toEqual([]);
    expect(document.body.classList.contains("theme-light")).toBe(false);
    expect(byId("privacyBanner").hidden).toBe(false);
  });

  test("rejecting persistence after saving data purges stored records and future writes", () => {
    const app = loadApp();

    click(byId("privacyAllowBtn"));
    submitTransaction({
      title: "Consulting",
      amount: "900",
      category: "Business",
      date: "2026-05-04",
    });
    click(byId("themeToggleBtn"));

    expect(localStorage.getItem(app.STORAGE_KEY)).not.toBeNull();
    expect(localStorage.getItem(app.THEME_KEY)).toBe("light");

    click(byId("privacySettingsBtn"));
    click(byId("privacyRejectBtn"));

    expect(JSON.parse(localStorage.getItem(app.CONSENT_KEY)).mode).toBe(
      app.CONSENT_MODES.REJECTED,
    );
    expect(localStorage.getItem(app.STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(app.THEME_KEY)).toBeNull();
    expect(transactionTitles()).toEqual(["Consulting"]);

    submitTransaction({
      title: "Cash",
      amount: "25",
      category: "Other",
      date: "2026-05-05",
    });
    click(byId("themeToggleBtn"));

    expect(transactionTitles()).toEqual(["Cash", "Consulting"]);
    expect(localStorage.getItem(app.STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(app.THEME_KEY)).toBeNull();
  });

  test("CSV export protects spreadsheet formulas while preserving commas, quotes, and numeric signs", async () => {
    const app = loadApp();
    app.state.transactions = [
      makeTransaction({
        id: "tx_plus",
        title: "+Bonus",
        amount: 12.5,
        category: "Food, Drinks",
        date: "2026-05-05",
      }),
      makeTransaction({
        id: "tx_tab",
        title: "\tTabbed",
        amount: -4,
        category: 'He said "Hi"',
        date: "2026-05-06",
      }),
      makeTransaction({
        id: "tx_at",
        title: "-Start",
        amount: -9,
        category: "@Category",
        date: "2026-05-07",
      }),
    ];

    app.exportToCSV();
    const exportedBlob = URL.createObjectURL.mock.calls[0][0];
    const csv = await exportedBlob.text();

    expect(csv.split("\n")[0]).toBe('"Title","Amount","Category","Date"');
    expect(csv).toContain('"=""+Bonus"""');
    expect(csv).toContain('"Food, Drinks"');
    expect(csv).toContain('"=""\tTabbed"""');
    expect(csv).toContain('"He said ""Hi"""');
    expect(csv).toContain('"=""-Start"""');
    expect(csv).toContain('"=""@Category"""');
    expect(csv).toContain('"-9"');
  });

  test("delete modal restores focus to the trigger or a safe fallback", () => {
    const app = loadApp();

    submitTransaction({
      title: "Salary",
      amount: "1500",
      category: "Salary",
      date: "2026-05-01",
    });
    submitTransaction({
      title: "Rent",
      amount: "-700",
      category: "Housing",
      date: "2026-05-02",
    });

    const rentDeleteButton = document.querySelector(
      `.delete-btn[data-id="${app.state.transactions[0].id}"]`,
    );
    rentDeleteButton.focus();
    click(rentDeleteButton);
    click(byId("cancelDeleteBtn"));
    expect(document.activeElement).toBe(rentDeleteButton);

    rentDeleteButton.focus();
    click(rentDeleteButton);
    click(byId("confirmDeleteBtn"));

    expect(transactionTitles()).toEqual(["Salary"]);
    expect(document.activeElement.classList.contains("delete-btn")).toBe(true);
    expect(document.activeElement.dataset.id).toBe(app.state.transactions[0].id);
  });

  test("theme toggles persist both light and dark choices when storage is allowed", () => {
    const app = loadApp();

    click(byId("privacyAllowBtn"));
    click(byId("themeToggleBtn"));
    expect(document.body.classList.contains("theme-light")).toBe(true);
    expect(localStorage.getItem(app.THEME_KEY)).toBe("light");

    click(byId("themeToggleBtn"));
    expect(document.body.classList.contains("theme-light")).toBe(false);
    expect(localStorage.getItem(app.THEME_KEY)).toBe("dark");
  });

  test("chart rendering tolerates missing canvas and browser sizing fallbacks", () => {
    const app = loadApp();
    const originalCanvas = app.dom.financeChart;
    const devicePixelRatioDescriptor = Object.getOwnPropertyDescriptor(
      window,
      "devicePixelRatio",
    );

    expect(() => {
      app.dom.financeChart = null;
      app.renderChart();
    }).not.toThrow();

    app.dom.financeChart = originalCanvas;
    app.state.transactions = [
      makeTransaction({ id: "tx_income", amount: 1000 }),
      makeTransaction({ id: "tx_expense", amount: -250 }),
    ];

    Object.defineProperty(window, "devicePixelRatio", {
      configurable: true,
      value: 0,
    });
    Object.defineProperty(originalCanvas, "clientHeight", {
      configurable: true,
      get() {
        return 0;
      },
    });

    try {
      app.renderChart();
      expect(originalCanvas.width).toBe(800);
      expect(originalCanvas.height).toBe(260);
      expect(originalCanvas.getAttribute("aria-label")).toContain(
        "total income $1,000.00 and total expenses $250.00",
      );
    } finally {
      if (devicePixelRatioDescriptor) {
        Object.defineProperty(
          window,
          "devicePixelRatio",
          devicePixelRatioDescriptor,
        );
      } else {
        delete window.devicePixelRatio;
      }
    }
  });
});