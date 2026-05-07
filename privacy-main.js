const i18next = globalThis.i18next;
const resources =
  globalThis.financeTrackerResources ||
  (typeof module !== "undefined" && module.exports
    ? require("./i18n-resources.js").resources
    : undefined);

const LANG_KEY = "financeTrackerLang";

const applyPrivacyPage = () => {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key) el.textContent = i18next.t(key);
  });
  document.title = i18next.t("privacyPage.metaTitle");
  document.documentElement.lang = i18next.language === "zh" ? "zh-CN" : "en";

  const switcher = document.getElementById("langSwitcher");
  if (switcher) {
    switcher.setAttribute("aria-label", i18next.t("lang.groupAria"));
  }

  const lng = i18next.language;
  const enBtn = document.getElementById("langEnBtn");
  const zhBtn = document.getElementById("langZhBtn");
  if (enBtn && zhBtn) {
    enBtn.textContent = i18next.t("lang.en");
    zhBtn.textContent = i18next.t("lang.zh");
    enBtn.setAttribute("aria-pressed", lng === "en" ? "true" : "false");
    zhBtn.setAttribute("aria-pressed", lng === "zh" ? "true" : "false");
  }
};

const syncDocumentLanguage = () => {
  document.documentElement.lang = i18next.language === "zh" ? "zh-CN" : "en";
};

const init = () => {
  if (!i18next || !resources) {
    throw new Error("i18n dependencies were not loaded before privacy-main.js.");
  }

  const stored = localStorage.getItem(LANG_KEY);
  const lng = stored === "zh" ? "zh" : "en";

  const finishInitialization = () => {
    syncDocumentLanguage();

    i18next.on("languageChanged", () => {
      localStorage.setItem(LANG_KEY, i18next.language);
      syncDocumentLanguage();
      applyPrivacyPage();
    });

    document.getElementById("langEnBtn")?.addEventListener("click", () => {
      i18next.changeLanguage("en");
    });
    document.getElementById("langZhBtn")?.addEventListener("click", () => {
      i18next.changeLanguage("zh");
    });

    applyPrivacyPage();
  };

  const initResult = i18next.init({
    lng,
    fallbackLng: "en",
    resources,
    interpolation: { escapeValue: true },
  });

  if (initResult && typeof initResult.then === "function") {
    return initResult.then(finishInitialization);
  }

  finishInitialization();
  return Promise.resolve();
};

init().catch((err) => {
  console.error(err);
});
