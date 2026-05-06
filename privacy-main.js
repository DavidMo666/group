import i18next from "https://cdn.jsdelivr.net/npm/i18next@23.15.2/+esm";
import { resources } from "./i18n-resources.js";

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

const init = async () => {
  const stored = localStorage.getItem(LANG_KEY);
  const lng = stored === "zh" ? "zh" : "en";

  await i18next.init({
    lng,
    fallbackLng: "en",
    resources,
    interpolation: { escapeValue: true },
  });

  document.documentElement.lang = i18next.language === "zh" ? "zh-CN" : "en";

  i18next.on("languageChanged", () => {
    localStorage.setItem(LANG_KEY, i18next.language);
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

init().catch((err) => {
  console.error(err);
});
