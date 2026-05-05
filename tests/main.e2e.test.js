const {
  byId,
  change,
  click,
  input,
  loadApp,
  submitTransaction,
  transactionTitles,
} = require("./helpers/loadApp");

describe("finance tracker E2E-style user flows", () => {
  test("runs the main finance workflow from storage choice to CSV export", async () => {
    const app = loadApp();

    click(byId("privacyAllowBtn"));
    expect(byId("privacyBanner").hidden).toBe(true);
    expect(JSON.parse(localStorage.getItem(app.CONSENT_KEY)).mode).toBe(
      app.CONSENT_MODES.ALLOWED,
    );

    click(byId("themeToggleBtn"));
    expect(document.body.classList.contains("theme-light")).toBe(true);
    expect(localStorage.getItem(app.THEME_KEY)).toBe("light");

    submitTransaction({
      title: "Freelance Payment",
      amount: "1500",
      category: "Business",
      date: "2026-05-05",
    });
    submitTransaction({
      title: "Rent",
      amount: "-800",
      category: "Housing",
      date: "2026-05-06",
    });

    change(byId("filterType"), "expense");
    expect(transactionTitles()).toEqual(["Rent"]);

    input(byId("searchInput"), "freelance");
    expect(transactionTitles()).toEqual([]);

    click(byId("resetFiltersBtn"));
    const payment = app.state.transactions.find(
      (transaction) => transaction.title === "Freelance Payment",
    );
    click(document.querySelector(`.edit-btn[data-id="${payment.id}"]`));
    expect(app.state.editingId).toBe(payment.id);
    byId("titleInput").value = "Client Payment";
    byId("amountInput").value = "1750";
    byId("categoryInput").value = "Business";
    byId("dateInput").value = "2026-05-07";
    byId("transactionForm").dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
    expect(transactionTitles()).toEqual(["Client Payment", "Rent"]);

    app.exportToCSV();
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    const exportedBlob = URL.createObjectURL.mock.calls[0][0];
    await expect(exportedBlob.text()).resolves.toContain(
      '"Client Payment","1750","Business","2026-05-07"',
    );
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-transactions");

    click(document.querySelector('.delete-btn[data-id="' + app.state.transactions[0].id + '"]'));
    click(byId("confirmDeleteBtn"));
    expect(transactionTitles()).toEqual(["Client Payment"]);
    expect(byId("totalBalance").textContent).toBe("$1,750.00");
  });

  test("rejects persistent storage and keeps transactions session-only", () => {
    const app = loadApp();

    click(byId("privacyRejectBtn"));
    expect(JSON.parse(localStorage.getItem(app.CONSENT_KEY)).mode).toBe(
      app.CONSENT_MODES.REJECTED,
    );
    expect(byId("privacyBanner").hidden).toBe(true);

    submitTransaction({
      title: "Cash Gift",
      amount: "50",
      category: "Other",
      date: "2026-05-05",
    });
    expect(transactionTitles()).toEqual(["Cash Gift"]);
    expect(localStorage.getItem(app.STORAGE_KEY)).toBeNull();

    click(byId("themeToggleBtn"));
    expect(localStorage.getItem(app.THEME_KEY)).toBeNull();

    click(byId("privacySettingsBtn"));
    expect(byId("privacyChoiceStatus").textContent).toContain(
      "persistent storage rejected",
    );
  });
});