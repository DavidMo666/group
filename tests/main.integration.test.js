const {
  byId,
  change,
  click,
  fillTransactionForm,
  input,
  loadApp,
  submit,
  submitTransaction,
  transactionTitles,
} = require("./helpers/loadApp");

describe("finance tracker integration behavior", () => {
  test("starts with privacy prompt, renders empty state, and hides skeleton", () => {
    const app = loadApp();

    expect(app.state.transactions).toEqual([]);
    expect(byId("privacyBanner").hidden).toBe(false);
    expect(byId("privacyChoiceStatus").textContent).toContain(
      "No storage preference",
    );
    expect(byId("resultsCount").textContent).toBe("0 results");
    expect(document.querySelector(".transactions__empty")).not.toBeNull();
    expect(document.body.classList.contains("theme-light")).toBe(false);

    jest.advanceTimersByTime(300);
    expect(byId("skeleton").classList.contains("is-hidden")).toBe(true);
  });

  test("validates form fields before adding transactions", () => {
    const app = loadApp();

    submit(byId("transactionForm"));

    expect(app.state.transactions).toHaveLength(0);
    expect(byId("titleError").textContent).toBe("Title is required.");
    expect(byId("amountError").textContent).toBe("Enter a valid amount.");
    expect(byId("categoryError").textContent).toBe("Select a category.");
    expect(byId("dateError").textContent).toBe("Pick a date.");
    expect(byId("titleInput").getAttribute("aria-invalid")).toBe("true");
    expect(document.querySelector(".toast--error").textContent).toBe(
      "Please fix the highlighted fields.",
    );

    fillTransactionForm({
      title: "Zero",
      amount: "0",
      category: "Other",
      date: "2026-05-05",
    });
    submit(byId("transactionForm"));
    expect(byId("amountError").textContent).toBe("Enter a valid amount.");
  });

  test("adds transactions, updates summary, chart label, and storage after consent", () => {
    const app = loadApp();

    click(byId("privacyAllowBtn"));
    submitTransaction({
      title: "Salary",
      amount: "2500",
      category: "Salary",
      date: "2026-05-01",
    });
    submitTransaction({
      title: "Groceries",
      amount: "-120.5",
      category: "Food",
      date: "2026-05-03",
    });

    expect(transactionTitles()).toEqual(["Groceries", "Salary"]);
    expect(byId("resultsCount").textContent).toBe("2 results");
    expect(byId("totalIncome").textContent).toBe("$2,500.00");
    expect(byId("totalExpenses").textContent).toBe("$120.50");
    expect(byId("totalBalance").textContent).toBe("$2,379.50");
    expect(byId("financeChart").getAttribute("aria-label")).toContain(
      "total income $2,500.00 and total expenses $120.50",
    );
    expect(global.__canvasContext.fillRect).toHaveBeenCalled();

    const stored = JSON.parse(localStorage.getItem(app.STORAGE_KEY));
    expect(stored).toHaveLength(2);
    expect(stored[0].title).toBe("Groceries");
  });

  test("filters by category, type, search, and resets filters", () => {
    loadApp();

    submitTransaction({
      title: "Salary",
      amount: "2500",
      category: "Salary",
      date: "2026-05-01",
    });
    submitTransaction({
      title: "Groceries",
      amount: "-120",
      category: "Food",
      date: "2026-05-02",
    });
    submitTransaction({
      title: "Bus Pass",
      amount: "-35",
      category: "Transport",
      date: "2026-05-03",
    });

    change(byId("filterType"), "expense");
    expect(transactionTitles()).toEqual(["Bus Pass", "Groceries"]);

    change(byId("filterCategory"), "Food");
    expect(transactionTitles()).toEqual(["Groceries"]);

    input(byId("searchInput"), "bus");
    expect(transactionTitles()).toEqual([]);
    expect(document.querySelector(".transactions__empty")).not.toBeNull();

    click(byId("resetFiltersBtn"));
    expect(byId("filterType").value).toBe("all");
    expect(byId("filterCategory").value).toBe("all");
    expect(byId("searchInput").value).toBe("");
    expect(transactionTitles()).toEqual(["Bus Pass", "Groceries", "Salary"]);
  });

  test("edits, switches edit targets, cancels editing, and guards stale edits", () => {
    const app = loadApp();

    submitTransaction({
      title: "Salary",
      amount: "2500",
      category: "Salary",
      date: "2026-05-01",
    });
    submitTransaction({
      title: "Groceries",
      amount: "-120",
      category: "Food",
      date: "2026-05-02",
    });

    click(document.querySelectorAll(".edit-btn")[0]);
    expect(byId("submitBtn").textContent).toBe("Save Changes");
    expect(byId("cancelEditBtn").hidden).toBe(false);
    expect(document.querySelector(".transaction--editing")).not.toBeNull();

    click(document.querySelectorAll(".edit-btn")[1]);
    expect(document.querySelector(".toast--error").textContent).toContain(
      "Switched to a different transaction",
    );

    byId("titleInput").value = "Salary Updated";
    byId("amountInput").value = "2700";
    byId("categoryInput").value = "Business";
    byId("dateInput").value = "2026-05-04";
    submit(byId("transactionForm"));
    expect(transactionTitles()).toContain("Salary Updated");
    expect(byId("submitBtn").textContent).toBe("Add Transaction");
    expect(byId("cancelEditBtn").hidden).toBe(true);

    const salary = app.state.transactions.find(
      (transaction) => transaction.title === "Salary Updated",
    );
    app.startEditing(salary.id);
    click(byId("cancelEditBtn"));
    expect(app.state.editingId).toBeNull();

    app.state.editingId = "missing_tx";
    fillTransactionForm({
      title: "Missing",
      amount: "10",
      category: "Other",
      date: "2026-05-05",
    });
    app.addTransaction();
    const errorToasts = document.querySelectorAll(".toast--error");
    expect(errorToasts[errorToasts.length - 1].textContent).toBe(
      "Transaction no longer exists.",
    );
    expect(app.state.editingId).toBeNull();
  });

  test("opens, closes, traps keys, and confirms delete modal", () => {
    const app = loadApp();

    submitTransaction({
      title: "Groceries",
      amount: "-120",
      category: "Food",
      date: "2026-05-02",
    });
    const transactionId = app.state.transactions[0].id;

    click(document.querySelector(".edit-btn"));
    click(document.querySelector(".delete-btn"));
    expect(byId("confirmModal").classList.contains("is-open")).toBe(true);
    expect(byId("confirmModal").getAttribute("aria-hidden")).toBe("false");
    expect(byId("modalEditingWarning").hidden).toBe(false);
    expect(app.state.pendingDeleteId).toBe(transactionId);

    const tabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(tabEvent);
    expect(tabEvent.defaultPrevented).toBe(true);

    const letterEvent = new KeyboardEvent("keydown", {
      key: "A",
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(letterEvent);
    expect(letterEvent.defaultPrevented).toBe(false);

    click(byId("cancelDeleteBtn"));
    expect(byId("confirmModal").classList.contains("is-open")).toBe(false);
    expect(app.state.pendingDeleteId).toBeNull();

    app.openConfirmModal(transactionId);
    const escapeEvent = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(escapeEvent);
    expect(escapeEvent.defaultPrevented).toBe(true);
    expect(app.state.pendingDeleteId).toBeNull();

    app.openConfirmModal(transactionId);
    click(byId("confirmDeleteBtn"));
    expect(app.state.transactions).toHaveLength(0);
    expect(byId("confirmModal").getAttribute("aria-hidden")).toBe("true");

    app.closeConfirmModal();
    app.startEditing("missing");
    expect(app.state.editingId).toBeNull();
  });

  test("uses modal focus boundaries when visible focusable controls exist", () => {
    const app = loadApp();

    submitTransaction({
      title: "Groceries",
      amount: "-120",
      category: "Food",
      date: "2026-05-02",
    });

    const offsetParentDescriptor = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "offsetParent",
    );
    Object.defineProperty(HTMLElement.prototype, "offsetParent", {
      configurable: true,
      get() {
        return this.hasAttribute("hidden") ? null : document.body;
      },
    });

    try {
      app.openConfirmModal(app.state.transactions[0].id);
      const [firstFocusableElement, lastFocusableElement] =
        app.getConfirmModalFocusableElements();

      expect(firstFocusableElement.id).toBe("cancelDeleteBtn");
      expect(lastFocusableElement.id).toBe("confirmDeleteBtn");

      byId("titleInput").focus();
      const outsideTab = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(outsideTab);
      expect(outsideTab.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(firstFocusableElement);

      const shiftTab = new KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(shiftTab);
      expect(shiftTab.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(lastFocusableElement);

      const tab = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(tab);
      expect(tab.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(firstFocusableElement);
    } finally {
      if (offsetParentDescriptor) {
        Object.defineProperty(
          HTMLElement.prototype,
          "offsetParent",
          offsetParentDescriptor,
        );
      } else {
        delete HTMLElement.prototype.offsetParent;
      }
    }
  });

  test("recovers from stored data problems and honors saved preferences", () => {
    const validConsent = {
      version: 1,
      mode: "allowed",
      recordedAt: "2026-05-05T10:00:00.000Z",
    };
    const validTransaction = {
      id: "tx_saved",
      title: "Saved Salary",
      amount: 1800,
      category: "Salary",
      date: "2026-05-01",
    };

    localStorage.setItem("financeTrackerConsent", JSON.stringify(validConsent));
    localStorage.setItem("financeTrackerTheme", "light");
    localStorage.setItem(
      "financeTrackerData",
      JSON.stringify([validTransaction, { id: "bad" }]),
    );

    let app = loadApp();
    expect(app.state.transactions).toEqual([validTransaction]);
    expect(document.body.classList.contains("theme-light")).toBe(true);
    expect(JSON.parse(localStorage.getItem(app.STORAGE_KEY))).toEqual([
      validTransaction,
    ]);
    expect(document.querySelector(".toast--error").textContent).toContain(
      "invalid",
    );

    localStorage.clear();
    localStorage.setItem("financeTrackerConsent", JSON.stringify(validConsent));
    localStorage.setItem("financeTrackerData", "not-json");
    app = loadApp();
    expect(app.state.transactions).toEqual([]);
    expect(localStorage.getItem(app.STORAGE_KEY)).toBe("[]");

    localStorage.clear();
    localStorage.setItem("financeTrackerConsent", "not-json");
    app = loadApp();
    expect(app.state.consent).toBeNull();
    expect(localStorage.getItem(app.CONSENT_KEY)).toBeNull();
    expect(byId("privacyBanner").hidden).toBe(false);

    localStorage.clear();
    localStorage.setItem(
      "financeTrackerConsent",
      JSON.stringify({ ...validConsent, mode: "rejected" }),
    );
    localStorage.setItem("financeTrackerData", JSON.stringify([validTransaction]));
    app = loadApp();
    expect(app.state.transactions).toEqual([]);
    expect(localStorage.getItem(app.STORAGE_KEY)).toBeNull();
  });

  test("loads saved data when consent is granted later", () => {
    loadApp();
    localStorage.setItem(
      "financeTrackerData",
      JSON.stringify([
        {
          id: "tx_waiting",
          title: "Waiting Income",
          amount: 700,
          category: "Business",
          date: "2026-05-05",
        },
      ]),
    );

    click(byId("privacyAllowBtn"));
    expect(transactionTitles()).toEqual(["Waiting Income"]);
    expect(byId("totalIncome").textContent).toBe("$700.00");
  });

  test("handles export, empty-state focus, backdrop close, resize, and init guard", async () => {
    const app = loadApp();

    app.initializeApp();
    click(byId("exportCsvBtn"));
    expect(URL.createObjectURL).not.toHaveBeenCalled();
    expect(document.querySelector(".toast--error").textContent).toBe(
      "No data to export.",
    );

    click(document.querySelector(".empty-add-btn"));
    expect(document.activeElement).toBe(byId("titleInput"));

    submitTransaction({
      title: "=Formula Risk",
      amount: "25",
      category: "Other",
      date: "2026-05-05",
    });
    click(byId("exportCsvBtn"));
    const exportedBlob = URL.createObjectURL.mock.calls[0][0];
    await expect(exportedBlob.text()).resolves.toContain(
      '"=""=Formula Risk""","25","Other","2026-05-05"',
    );

    app.openConfirmModal(app.state.transactions[0].id);
    click(document.querySelector(".modal__backdrop"));
    expect(byId("confirmModal").classList.contains("is-open")).toBe(false);

    const clearCalls = global.__canvasContext.clearRect.mock.calls.length;
    window.dispatchEvent(new Event("resize"));
    expect(global.__canvasContext.clearRect.mock.calls.length).toBeGreaterThan(
      clearCalls,
    );

    click(byId("confirmDeleteBtn"));
    expect(app.state.transactions).toHaveLength(1);
  });
});