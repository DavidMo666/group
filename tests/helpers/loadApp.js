const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "../..");

const resolveTranslationValue = (messages, key) => {
  return key.split(".").reduce((current, segment) => current?.[segment], messages);
};

const interpolate = (value, options = {}) => {
  return value.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, token) => {
    return options[token] == null ? "" : String(options[token]);
  });
};

const createI18nStub = (resources) => {
  const listeners = new Set();
  const api = {
    language: "en",
    init({ lng = "en", fallbackLng = "en" } = {}) {
      api.language = resources[lng] ? lng : fallbackLng;
    },
    on(eventName, handler) {
      if (eventName === "languageChanged") {
        listeners.add(handler);
      }
    },
    changeLanguage(lng) {
      api.language = resources[lng] ? lng : "en";
      listeners.forEach((handler) => handler(api.language));
      return Promise.resolve(api.language);
    },
    t(key, options = {}) {
      const active = resources[api.language]?.translation || {};
      const fallback = resources.en?.translation || {};
      const value =
        resolveTranslationValue(active, key) ??
        resolveTranslationValue(fallback, key) ??
        key;

      return typeof value === "string" ? interpolate(value, options) : key;
    },
  };

  return api;
};

const loadApp = () => {
  jest.resetModules();
  const html = fs.readFileSync(path.join(rootDir, "index.html"), "utf8");
  const { resources } = require(path.join(rootDir, "i18n-resources.js"));
  const i18next = createI18nStub(resources);

  document.open();
  document.write(html);
  document.close();

  global.i18next = i18next;
  global.financeTrackerResources = resources;
  window.i18next = i18next;
  window.financeTrackerResources = resources;

  return require(path.join(rootDir, "main.js"));
};

const byId = (id) => document.getElementById(id);

const click = (element) => {
  element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
};

const change = (element, value) => {
  element.value = value;
  element.dispatchEvent(new Event("change", { bubbles: true }));
};

const input = (element, value) => {
  element.value = value;
  element.dispatchEvent(new Event("input", { bubbles: true }));
};

const submit = (form) => {
  form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
};

const fillTransactionForm = ({ title, amount, category, date }) => {
  byId("titleInput").value = title;
  byId("amountInput").value = amount;
  byId("categoryInput").value = category;
  byId("dateInput").value = date;
};

const submitTransaction = (transaction) => {
  fillTransactionForm(transaction);
  submit(byId("transactionForm"));
};

const transactionTitles = () =>
  Array.from(document.querySelectorAll(".transaction__title")).map((element) =>
    element.textContent.trim(),
  );

module.exports = {
  byId,
  change,
  click,
  fillTransactionForm,
  input,
  loadApp,
  submit,
  submitTransaction,
  transactionTitles,
};