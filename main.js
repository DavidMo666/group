"use strict";

const STORAGE_KEY = "financeTrackerData";
const THEME_KEY = "financeTrackerTheme";
const CONSENT_KEY = "financeTrackerConsent";
const CONSENT_VERSION = 1;
const CONSENT_MODES = {
  REJECTED: "rejected",
  ESSENTIAL: "essential-only",
  PREFERENCES: "essential-plus-preferences",
};

const state = {
  transactions: [],
  filters: {
    category: "all",
    type: "all",
    search: "",
  },
  editingId: null,
  pendingDeleteId: null,
  theme: "dark",
  consent: null,
};

const dom = {
  form: document.getElementById("transactionForm"),
  titleInput: document.getElementById("titleInput"),
  amountInput: document.getElementById("amountInput"),
  categoryInput: document.getElementById("categoryInput"),
  dateInput: document.getElementById("dateInput"),
  titleError: document.getElementById("titleError"),
  amountError: document.getElementById("amountError"),
  categoryError: document.getElementById("categoryError"),
  dateError: document.getElementById("dateError"),
  submitBtn: document.getElementById("submitBtn"),
  cancelEditBtn: document.getElementById("cancelEditBtn"),
  filterCategory: document.getElementById("filterCategory"),
  filterType: document.getElementById("filterType"),
  searchInput: document.getElementById("searchInput"),
  resetFiltersBtn: document.getElementById("resetFiltersBtn"),
  exportCsvBtn: document.getElementById("exportCsvBtn"),
  themeToggleBtn: document.getElementById("themeToggleBtn"),
  privacySettingsBtn: document.getElementById("privacySettingsBtn"),
  transactionsList: document.getElementById("transactionsList"),
  resultsCount: document.getElementById("resultsCount"),
  totalBalance: document.getElementById("totalBalance"),
  totalIncome: document.getElementById("totalIncome"),
  totalExpenses: document.getElementById("totalExpenses"),
  financeChart: document.getElementById("financeChart"),
  confirmModal: document.getElementById("confirmModal"),
  confirmDeleteBtn: document.getElementById("confirmDeleteBtn"),
  cancelDeleteBtn: document.getElementById("cancelDeleteBtn"),
  modalEditingWarning: document.getElementById("modalEditingWarning"),
  privacyBanner: document.getElementById("privacyBanner"),
  privacyRejectBtn: document.getElementById("privacyRejectBtn"),
  privacyEssentialBtn: document.getElementById("privacyEssentialBtn"),
  privacyPreferencesBtn: document.getElementById("privacyPreferencesBtn"),
  privacyChoiceStatus: document.getElementById("privacyChoiceStatus"),
  toastContainer: document.getElementById("toastContainer"),
  skeleton: document.getElementById("skeleton"),
};

const escapeHTML = (str) => {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const isCSVFormulaRisk = (value) => {
  return /^[\t\r\n]|^\s*[=+\-@]/.test(value);
};

const toCSVTextFormula = (value) => {
  return `="${value.replaceAll('"', '""')}"`;
};

const escapeCSVCell = (cell, shouldPreventFormula = true) => {
  const value = String(cell ?? "");
  const safeValue =
    shouldPreventFormula && isCSVFormulaRisk(value)
      ? toCSVTextFormula(value)
      : value;

  return `"${safeValue.replaceAll('"', '""')}"`;
};

const generateID = () => {
  return `tx_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const saveToLocalStorage = () => {
  if (state.consent?.mode === CONSENT_MODES.REJECTED) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  if (!hasTransactionStorageConsent()) {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
};

const isPlainObject = (value) => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

const isValidTransaction = (transaction) => {
  if (!isPlainObject(transaction)) return false;

  const { id, title, amount, category, date } = transaction;

  return (
    typeof id === "string" &&
    id.trim().length > 0 &&
    typeof title === "string" &&
    title.trim().length > 0 &&
    typeof amount === "number" &&
    Number.isFinite(amount) &&
    typeof category === "string" &&
    category.trim().length > 0 &&
    typeof date === "string" &&
    date.trim().length > 0 &&
    !Number.isNaN(new Date(date).getTime())
  );
};

const resetStoredTransactions = () => {
  state.transactions = [];
  saveToLocalStorage();
};

const isValidConsent = (consent) => {
  return (
    isPlainObject(consent) &&
    consent.version === CONSENT_VERSION &&
    [
      CONSENT_MODES.REJECTED,
      CONSENT_MODES.ESSENTIAL,
      CONSENT_MODES.PREFERENCES,
    ].includes(
      consent.mode,
    ) &&
    typeof consent.recordedAt === "string" &&
    !Number.isNaN(new Date(consent.recordedAt).getTime())
  );
};

const loadConsent = () => {
  const stored = localStorage.getItem(CONSENT_KEY);

  if (!stored) {
    state.consent = null;
    return;
  }

  try {
    const parsed = JSON.parse(stored);
    state.consent = isValidConsent(parsed) ? parsed : null;
  } catch (error) {
    console.warn("Recovered from invalid financeTrackerConsent.", error);
    state.consent = null;
  }

  if (!state.consent) {
    localStorage.removeItem(CONSENT_KEY);
  }
};

const hasThemePreferenceConsent = () => {
  return state.consent?.mode === CONSENT_MODES.PREFERENCES;
};

const hasTransactionStorageConsent = () => {
  return (
    state.consent?.mode === CONSENT_MODES.ESSENTIAL ||
    state.consent?.mode === CONSENT_MODES.PREFERENCES
  );
};

const getConsentStatusText = () => {
  if (!state.consent) {
    return "No storage preference has been recorded yet.";
  }

  if (state.consent.mode === CONSENT_MODES.REJECTED) {
    return "Current choice: persistent storage rejected. New records disappear after refresh.";
  }

  if (hasThemePreferenceConsent()) {
    return "Current choice: finance records and theme preference are stored.";
  }

  return "Current choice: finance records are stored. Theme preference is not stored.";
};

const renderPrivacyChoiceStatus = () => {
  dom.privacyChoiceStatus.textContent = getConsentStatusText();
};

const openPrivacyBanner = () => {
  renderPrivacyChoiceStatus();
  dom.privacyBanner.hidden = false;
};

const closePrivacyBanner = () => {
  dom.privacyBanner.hidden = true;
};

const saveConsentChoice = (mode) => {
  state.consent = {
    version: CONSENT_VERSION,
    mode,
    recordedAt: new Date().toISOString(),
  };

  localStorage.setItem(CONSENT_KEY, JSON.stringify(state.consent));

  if (mode === CONSENT_MODES.REJECTED) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(THEME_KEY);
  } else if (!hasThemePreferenceConsent()) {
    if (state.transactions.length === 0 && localStorage.getItem(STORAGE_KEY)) {
      loadFromLocalStorage();
    }
    localStorage.removeItem(THEME_KEY);
    saveToLocalStorage();
  } else {
    if (state.transactions.length === 0 && localStorage.getItem(STORAGE_KEY)) {
      loadFromLocalStorage();
    }
    saveToLocalStorage();
    saveTheme();
  }

  renderPrivacyChoiceStatus();
  closePrivacyBanner();
  showToast("Privacy storage preference saved.");
};

const loadFromLocalStorage = () => {
  if (state.consent?.mode === CONSENT_MODES.REJECTED) {
    localStorage.removeItem(STORAGE_KEY);
    state.transactions = [];
    return;
  }

  if (!hasTransactionStorageConsent()) {
    state.transactions = [];
    return;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    state.transactions = [];
    return;
  }

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
};

const saveTheme = () => {
  if (hasThemePreferenceConsent()) {
    localStorage.setItem(THEME_KEY, state.theme);
    return;
  }

  localStorage.removeItem(THEME_KEY);
};

const setTheme = (theme) => {
  state.theme = theme;
  document.body.classList.toggle("theme-light", theme === "light");
  dom.themeToggleBtn.textContent =
    theme === "light" ? "Dark Mode" : "Light Mode";
  saveTheme();
};

const loadTheme = () => {
  const storedTheme = hasThemePreferenceConsent()
    ? localStorage.getItem(THEME_KEY)
    : null;
  setTheme(storedTheme === "light" ? "light" : "dark");
};

const showToast = (message, variant = "success") => {
  const toast = document.createElement("div");
  toast.className = `toast${variant === "error" ? " toast--error" : ""}`;
  toast.textContent = message;
  dom.toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 2400);
};

const clearErrors = () => {
  const fields = [
    { input: dom.titleInput, error: dom.titleError },
    { input: dom.amountInput, error: dom.amountError },
    { input: dom.categoryInput, error: dom.categoryError },
    { input: dom.dateInput, error: dom.dateError },
  ];

  fields.forEach(({ input, error }) => {
    input.classList.remove("is-invalid");
    error.textContent = "";
  });
};

const setError = (input, errorEl, message) => {
  input.classList.add("is-invalid");
  errorEl.textContent = message;
};

const validateForm = () => {
  clearErrors();

  const title = dom.titleInput.value.trim();
  const amountValue = dom.amountInput.value.trim();
  const amount = Number(amountValue);
  const category = dom.categoryInput.value;
  const date = dom.dateInput.value;

  let isValid = true;

  if (!title) {
    setError(dom.titleInput, dom.titleError, "Title is required.");
    isValid = false;
  }

  if (!amountValue || Number.isNaN(amount) || amount === 0) {
    setError(dom.amountInput, dom.amountError, "Enter a valid amount.");
    isValid = false;
  }

  if (!category) {
    setError(dom.categoryInput, dom.categoryError, "Select a category.");
    isValid = false;
  }

  if (!date) {
    setError(dom.dateInput, dom.dateError, "Pick a date.");
    isValid = false;
  }

  return isValid;
};

const resetFormState = () => {
  dom.form.reset();
  state.editingId = null;
  dom.submitBtn.textContent = "Add Transaction";
  dom.cancelEditBtn.hidden = true;
  clearErrors();
};

const addTransaction = () => {
  if (!validateForm()) {
    showToast("Please fix the highlighted fields.", "error");
    return;
  }

  const title = dom.titleInput.value.trim();
  const amount = Number(dom.amountInput.value);
  const category = dom.categoryInput.value;
  const date = dom.dateInput.value;

  if (state.editingId) {
    // Defensive guard: if the transaction no longer exists
    const stillExists = state.transactions.some(
      (tx) => tx.id === state.editingId,
    );
    if (!stillExists) {
      showToast("Transaction no longer exists.", "error");
      resetFormState();
      return;
    }
    state.transactions = state.transactions.map((tx) =>
      tx.id === state.editingId ? { ...tx, title, amount, category, date } : tx,
    );
    showToast("Transaction updated.");
  } else {
    const newTransaction = {
      id: generateID(),
      title,
      amount,
      category,
      date,
    };

    state.transactions = [newTransaction, ...state.transactions];
    showToast("Transaction added.");
  }

  resetFormState();
  saveToLocalStorage();
  renderApp();
};

const startEditing = (id) => {
  const transaction = state.transactions.find((tx) => tx.id === id);
  if (!transaction) return;

  // If another row is being edited, remember state before switching 
  const isSwitching = state.editingId !== null && state.editingId !== id;

  dom.titleInput.value = transaction.title;
  dom.amountInput.value = transaction.amount;
  dom.categoryInput.value = transaction.category;
  dom.dateInput.value = transaction.date;

  state.editingId = id;
  dom.submitBtn.textContent = "Save Changes";
  dom.cancelEditBtn.hidden = false;
  dom.titleInput.focus();

  // When switching edit target, tell user unsaved changes on the previous row were discarded
  showToast(
    isSwitching
      ? "Switched to a different transaction. Unsaved changes discarded."
      : "Editing mode enabled.",
    isSwitching ? "error" : "success",
  );

  
  renderTransactions();
};

const deleteTransaction = (id) => {
  
  if (state.editingId === id) {
    resetFormState();
  }
  state.transactions = state.transactions.filter((tx) => tx.id !== id);
  saveToLocalStorage();
  renderApp();
  showToast("Transaction deleted.");
};

const openConfirmModal = (id) => {
  state.pendingDeleteId = id;
  // If delete target is the row currently being edited, show an extra warning
  dom.modalEditingWarning.hidden = state.editingId !== id;
  dom.confirmModal.classList.add("is-open");
  dom.confirmModal.setAttribute("aria-hidden", "false");
};

const closeConfirmModal = () => {
  state.pendingDeleteId = null;
  dom.modalEditingWarning.hidden = true;
  dom.confirmModal.classList.remove("is-open");
  dom.confirmModal.setAttribute("aria-hidden", "true");
};

const renderSummary = () => {
  const amounts = state.transactions.map((tx) => tx.amount);

  const totalIncome = amounts
    .filter((amount) => amount > 0)
    .reduce((sum, amount) => sum + amount, 0);

  const totalExpenses = amounts
    .filter((amount) => amount < 0)
    .reduce((sum, amount) => sum + amount, 0);

  const totalBalance = totalIncome + totalExpenses;

  dom.totalIncome.textContent = formatCurrency(totalIncome);
  dom.totalExpenses.textContent = formatCurrency(Math.abs(totalExpenses));
  dom.totalBalance.textContent = formatCurrency(totalBalance);
};

const renderTransactions = () => {
  const filtered = filterTransactions();

  dom.resultsCount.textContent = `${filtered.length} results`;

  if (filtered.length === 0) {
    dom.transactionsList.innerHTML = `
      <div class="transactions__empty">
        <div class="empty__icon">+</div>
        <p>No transactions yet. Add your first one to get started.</p>
        <button class="btn btn--accent empty-add-btn" type="button">Add First Transaction</button>
      </div>
    `;
    return;
  }

  const groups = groupByMonth(filtered);

  dom.transactionsList.innerHTML = groups
    .map(
      (group) => `
        <div class="month-group">
          <p class="month-title">${escapeHTML(group.label)}</p>
          ${group.items.map(renderTransactionItem).join("")}
        </div>
      `,
    )
    .join("");
};

const renderTransactionItem = (tx) => {
  const typeClass = tx.amount >= 0 ? "amount--income" : "amount--expense";
  const formattedAmount = formatCurrency(tx.amount);
  const formattedDate = formatDate(tx.date);
  // Highlight the row being edited 
  const editingClass = state.editingId === tx.id ? " transaction--editing" : "";

  return `
    <div class="transaction${editingClass}">
      <div>
        <p class="transaction__title">${escapeHTML(tx.title)}</p>
        <div class="transaction__meta">
          <span class="badge">${escapeHTML(tx.category)}</span>
          <span>${escapeHTML(formattedDate)}</span>
        </div>
      </div>
      <div>
        <p class="amount ${typeClass}">${escapeHTML(formattedAmount)}</p>
        <button class="edit-btn" data-id="${escapeHTML(tx.id)}">Edit</button>
        <button class="delete-btn" data-id="${escapeHTML(tx.id)}">Delete</button>
      </div>
    </div>
  `;
};

const filterTransactions = () => {
  const { category, type, search } = state.filters;

  return state.transactions.filter((tx) => {
    const matchesCategory = category === "all" || tx.category === category;

    const matchesType =
      type === "all" ||
      (type === "income" && tx.amount > 0) ||
      (type === "expense" && tx.amount < 0);

    const matchesSearch = tx.title.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesType && matchesSearch;
  });
};

const groupByMonth = (transactions) => {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const groups = [];
  const lookup = new Map();

  sorted.forEach((tx) => {
    const label = new Date(tx.date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    if (!lookup.has(label)) {
      lookup.set(label, { label, items: [] });
      groups.push(lookup.get(label));
    }

    lookup.get(label).items.push(tx);
  });

  return groups;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const renderChart = () => {
  const canvas = dom.financeChart;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  const displayWidth = canvas.clientWidth;
  const displayHeight = 260;

  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const width = displayWidth;
  const height = displayHeight;

  ctx.clearRect(0, 0, width, height);

  const amounts = state.transactions.map((tx) => tx.amount);
  const income = amounts.filter((a) => a > 0).reduce((s, a) => s + a, 0);
  const expenses = Math.abs(
    amounts.filter((a) => a < 0).reduce((s, a) => s + a, 0),
  );

  const maxValue = Math.max(income, expenses, 1);
  const barWidth = 120;
  const gap = 80;
  const baseY = height - 40;

  const incomeHeight = (income / maxValue) * (height - 80);
  const expenseHeight = (expenses / maxValue) * (height - 80);

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.moveTo(40, baseY);
  ctx.lineTo(width - 40, baseY);
  ctx.stroke();

  ctx.fillStyle = "#22c55e";
  ctx.fillRect(160, baseY - incomeHeight, barWidth, incomeHeight);

  ctx.fillStyle = "#f97316";
  ctx.fillRect(
    160 + barWidth + gap,
    baseY - expenseHeight,
    barWidth,
    expenseHeight,
  );

  ctx.fillStyle = "#f8f4e9";
  ctx.font = "14px sans-serif";
  ctx.fillText("Income", 170, baseY + 20);
  ctx.fillText("Expense", 160 + barWidth + gap, baseY + 20);

  ctx.fillText(formatCurrency(income), 150, baseY - incomeHeight - 10);
  ctx.fillText(
    formatCurrency(expenses),
    150 + barWidth + gap,
    baseY - expenseHeight - 10,
  );
};

const renderApp = () => {
  renderSummary();
  renderTransactions();
  renderChart();
};

const exportToCSV = () => {
  if (state.transactions.length === 0) {
    showToast("No data to export.", "error");
    return;
  }

  const headers = ["Title", "Amount", "Category", "Date"];
  const rows = state.transactions.map((tx) => [
    tx.title,
    tx.amount,
    tx.category,
    tx.date,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => escapeCSVCell(cell, typeof cell !== "number")).join(","),
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "transactions.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  showToast("CSV exported.");
};

const initializeApp = () => {
  loadConsent();
  loadFromLocalStorage();
  loadTheme();
  renderApp();

  setTimeout(() => {
    dom.skeleton.classList.add("is-hidden");
  }, 300);

  dom.form.addEventListener("submit", (e) => {
    e.preventDefault();
    addTransaction();
  });

  dom.cancelEditBtn.addEventListener("click", () => {
    resetFormState();
    // Clear list highlight when leaving edit mode
    renderTransactions();
  });

  dom.transactionsList.addEventListener("click", (e) => {
    const deleteButton = e.target.closest(".delete-btn");
    const editButton = e.target.closest(".edit-btn");
    const emptyAdd = e.target.closest(".empty-add-btn");

    const deleteId = deleteButton?.dataset?.id;
    const editId = editButton?.dataset?.id;

    if (deleteId) {
      openConfirmModal(deleteId);
    }

    if (editId) {
      startEditing(editId);
    }

    if (emptyAdd) {
      dom.titleInput.focus();
    }
  });

  dom.filterCategory.addEventListener("change", (e) => {
    state.filters.category = e.target.value;
    renderTransactions();
  });

  dom.filterType.addEventListener("change", (e) => {
    state.filters.type = e.target.value;
    renderTransactions();
  });

  dom.searchInput.addEventListener("input", (e) => {
    state.filters.search = e.target.value;
    renderTransactions();
  });

  dom.resetFiltersBtn.addEventListener("click", () => {
    state.filters = { category: "all", type: "all", search: "" };
    dom.filterCategory.value = "all";
    dom.filterType.value = "all";
    dom.searchInput.value = "";
    renderTransactions();
  });

  dom.exportCsvBtn.addEventListener("click", exportToCSV);

  dom.themeToggleBtn.addEventListener("click", () => {
    setTheme(state.theme === "dark" ? "light" : "dark");
  });

  dom.privacySettingsBtn.addEventListener("click", openPrivacyBanner);

  dom.privacyRejectBtn.addEventListener("click", () => {
    saveConsentChoice(CONSENT_MODES.REJECTED);
  });

  dom.privacyEssentialBtn.addEventListener("click", () => {
    saveConsentChoice(CONSENT_MODES.ESSENTIAL);
  });

  dom.privacyPreferencesBtn.addEventListener("click", () => {
    saveConsentChoice(CONSENT_MODES.PREFERENCES);
  });

  dom.confirmDeleteBtn.addEventListener("click", () => {
    if (state.pendingDeleteId) {
      deleteTransaction(state.pendingDeleteId);
    }
    closeConfirmModal();
  });

  dom.cancelDeleteBtn.addEventListener("click", closeConfirmModal);

  dom.confirmModal.addEventListener("click", (e) => {
    if (e.target.dataset.close) {
      closeConfirmModal();
    }
  });

  if (!state.consent) {
    openPrivacyBanner();
  }
};

initializeApp();
