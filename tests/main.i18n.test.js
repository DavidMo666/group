const { byId, click, loadApp } = require("./helpers/loadApp");

const t = (key, options) => global.i18next.t(key, options);

describe("finance tracker i18n behavior", () => {
  test("initializes from stored language and applies translated static UI", () => {
    localStorage.setItem("financeTrackerLang", "zh");

    loadApp();

    expect(global.i18next.language).toBe("zh");
    expect(document.documentElement.lang).toBe("zh-CN");
    expect(document.title).toBe(t("meta.title"));
    expect(byId("langSwitcher").getAttribute("aria-label")).toBe(
      t("lang.groupAria"),
    );
    expect(byId("langEnBtn").textContent).toBe(t("lang.en"));
    expect(byId("langZhBtn").textContent).toBe(t("lang.zh"));
    expect(byId("langEnBtn").getAttribute("aria-pressed")).toBe("false");
    expect(byId("langZhBtn").getAttribute("aria-pressed")).toBe("true");
    expect(byId("themeToggleBtn").textContent).toBe(t("theme.switchToLight"));
    expect(
      document.querySelector('[data-i18n="summary.totalBalance"]').textContent,
    ).toBe(t("summary.totalBalance"));
    expect(byId("searchInput").placeholder).toBe(t("filters.searchPh"));
    expect(byId("resultsCount").textContent).toBe(
      t("transactions.results", { count: 0 }),
    );
    expect(document.querySelector(".transactions__empty p").textContent).toBe(
      t("transactions.emptyText"),
    );
    expect(document.querySelector(".empty-add-btn").textContent).toBe(
      t("transactions.emptyCta"),
    );
    expect(byId("categoryInput").options[0].textContent).toBe(
      t("form.selectCategory"),
    );
    expect(
      Array.from(byId("filterCategory").options).map((option) => option.textContent),
    ).toContain(t("categories.Food"));
  });

  test("switching language updates pressed state, rendered copy, and locale formatting", () => {
    const app = loadApp();
    app.state.transactions = [
      {
        id: "tx_income",
        title: "Salary",
        amount: 2500,
        category: "Salary",
        date: "2026-05-02",
      },
      {
        id: "tx_expense",
        title: "Groceries",
        amount: -120.5,
        category: "Food",
        date: "2026-05-03",
      },
    ];
    app.renderApp();

    click(byId("langZhBtn"));

    const expectedIncome = new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "USD",
    }).format(2500);
    const expectedExpenses = new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "USD",
    }).format(120.5);
    const expectedDate = new Date("2026-05-03").toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const firstTransactionMeta = Array.from(
      document.querySelector(".transaction .transaction__meta").querySelectorAll("span"),
    ).map((element) => element.textContent.trim());

    expect(global.i18next.language).toBe("zh");
    expect(localStorage.getItem(app.LANG_KEY)).toBe("zh");
    expect(document.documentElement.lang).toBe("zh-CN");
    expect(byId("langEnBtn").getAttribute("aria-pressed")).toBe("false");
    expect(byId("langZhBtn").getAttribute("aria-pressed")).toBe("true");
    expect(byId("themeToggleBtn").textContent).toBe(t("theme.switchToLight"));
    expect(byId("searchInput").placeholder).toBe(t("filters.searchPh"));
    expect(byId("resultsCount").textContent).toBe(
      t("transactions.results", { count: 2 }),
    );
    expect(byId("totalIncome").textContent).toBe(expectedIncome);
    expect(byId("totalExpenses").textContent).toBe(expectedExpenses);
    expect(byId("financeChart").getAttribute("aria-label")).toBe(
      t("chart.aria", {
        income: expectedIncome,
        expenses: expectedExpenses,
      }),
    );
    expect(firstTransactionMeta[0]).toBe(t("categories.Food"));
    expect(firstTransactionMeta[1]).toBe(expectedDate);
    expect(document.querySelector(".edit-btn").getAttribute("aria-label")).toBe(
      t("transactions.editAria", { title: "Groceries" }),
    );
  });
});