"use strict";

(function initI18n() {
  const LANG_KEY = "financeTrackerLang";
  const SUPPORTED = /** @type {const} */ (["en", "zh"]);

  /** @type {Record<string, Record<string, string>>} */
  const MESSAGES = {
    en: {
      "app.documentTitle": "Advanced Personal Finance Tracker",
      "header.eyebrow": "Personal Finance",
      "header.title": "Advanced Finance Tracker",
      "header.subtitle":
        "Track income, expenses, and your balance with clarity.",
      "lang.switch": "Language",
      "lang.en": "English",
      "lang.zh": "中文",
      "actions.themeLight": "Light Mode",
      "actions.themeDark": "Dark Mode",
      "actions.exportCsv": "Export CSV",
      "actions.resetFilters": "Reset Filters",
      "actions.privacySettings": "Privacy Settings",
      "summary.totalBalance": "Total Balance",
      "summary.totalIncome": "Total Income",
      "summary.totalExpenses": "Total Expenses",
      "chart.title": "Cash Flow Overview",
      "chart.subtitle": "Income vs Expense",
      "chart.income": "Income",
      "chart.expense": "Expense",
      "chart.aria":
        "Cash flow bar chart showing total income {{income}} and total expenses {{expenses}}.",
      "form.title": "Add Transaction",
      "field.title": "Title",
      "field.title.placeholder": "e.g., Freelance Payment",
      "field.amount": "Amount",
      "field.amount.placeholder": "e.g., 1200 or -45",
      "field.category": "Category",
      "field.category.placeholder": "Select category",
      "field.date": "Date",
      "form.submit.add": "Add Transaction",
      "form.submit.save": "Save Changes",
      "form.cancelEdit": "Cancel Edit",
      "category.salary": "Salary",
      "category.business": "Business",
      "category.investments": "Investments",
      "category.housing": "Housing",
      "category.food": "Food",
      "category.transport": "Transport",
      "category.health": "Health",
      "category.entertainment": "Entertainment",
      "category.education": "Education",
      "category.other": "Other",
      "filters.title": "Filters & Search",
      "filters.category": "Category",
      "filters.type": "Type",
      "filters.search": "Search by title",
      "filters.search.placeholder": "Start typing...",
      "filters.allCategories": "All categories",
      "filters.allTypes": "All",
      "filters.income": "Income",
      "filters.expense": "Expense",
      "list.title": "Transactions",
      "list.results": "{{count}} results",
      "list.empty":
        "No transactions yet. Add your first one to get started.",
      "list.addFirst": "Add First Transaction",
      "tx.edit": "Edit",
      "tx.delete": "Delete",
      "tx.edit.aria": "Edit transaction {{title}}",
      "tx.delete.aria": "Delete transaction {{title}}",
      "modal.delete.title": "Delete transaction?",
      "modal.delete.body":
        "This action cannot be undone.",
      "modal.delete.editingWarning":
        "You are currently editing this transaction. Deleting it will discard your unsaved changes.",
      "modal.cancel": "Cancel",
      "modal.confirmDelete": "Delete",
      "banner.eyebrow": "Local storage notice",
      "banner.title": "Privacy & Storage Preferences",
      "banner.line1":
        "This app can use local storage to save your finance records and theme preference on this device.",
      "banner.line2":
        "It does not use third-party advertising or analytics tracking.",
      "banner.reject": "Reject persistent storage",
      "banner.allow": "Allow persistent storage",
      "banner.policy": "Read Privacy Policy",
      "validation.title": "Title is required.",
      "validation.amount": "Enter a valid amount.",
      "validation.category": "Select a category.",
      "validation.date": "Pick a date.",
      "toast.fixFields": "Please fix the highlighted fields.",
      "toast.txAdded": "Transaction added.",
      "toast.txUpdated": "Transaction updated.",
      "toast.txDeleted": "Transaction deleted.",
      "toast.txGone": "Transaction no longer exists.",
      "toast.noExport": "No data to export.",
      "toast.csvExported": "CSV exported.",
      "toast.privacySaved": "Privacy storage preference saved.",
      "toast.invalidRemoved":
        "Some saved transactions were invalid and were removed.",
      "toast.dataReset": "Saved data was corrupted and has been reset.",
      "toast.editSwitch": "Switched to a different transaction. Unsaved changes discarded.",
      "toast.editOn": "Editing mode enabled.",
      "consent.status.none": "No storage preference has been recorded yet.",
      "consent.status.rejected":
        "Current choice: persistent storage rejected. New records disappear after refresh.",
      "consent.status.allowed":
        "Current choice: persistent storage allowed. Records and theme are saved.",
      "csv.header.title": "Title",
      "csv.header.amount": "Amount",
      "csv.header.category": "Category",
      "csv.header.date": "Date",
      "privacy.documentTitle": "Privacy Policy | Advanced Finance Tracker",
      "privacy.back": "Back to app",
      "privacy.eyebrow": "Privacy Policy",
      "privacy.hero.title": "Advanced Finance Tracker",
      "privacy.hero.subtitle":
        "This page explains what this app stores on your device, why it is stored, and how your storage choices work.",
      "privacy.s1.h": "What this app stores on your device",
      "privacy.s1.p":
        "This app stores finance tracker data in your browser's local storage. The main stored records are financeTrackerData for your transactions, financeTrackerConsent for your storage choice, and financeTrackerTheme for your light or dark theme preference. These records are saved only when you allow persistent storage. If you reject persistent storage, new finance records are kept only for the current page session and disappear after refresh.",
      "privacy.s2.h": "Why the data is stored",
      "privacy.s2.p":
        "Transaction data and theme preference are stored only when you allow persistent storage, so the tracker can keep your records and theme available after a page refresh. The consent record is stored so the app remembers your storage choice.",
      "privacy.s3.h": "Which storage is optional",
      "privacy.s3.p":
        "financeTrackerConsent is used to remember your storage choice. financeTrackerData and financeTrackerTheme are optional persistent storage: without them, records and theme changes can still be used on the current page but disappear after refresh.",
      "privacy.s4.h": "How your choices work",
      "privacy.s4.p":
        "If you reject persistent storage, new finance records and theme changes are not saved to local storage and disappear after refresh. If you allow persistent storage, the app saves transaction data, your selected light or dark theme, and your storage choice. You can reopen Privacy Settings from the main app and change this choice at any time.",
      "privacy.s5.h": "How long data remains",
      "privacy.s5.p":
        "The stored data remains in your browser until you delete transactions, change your storage preference, clear browser storage, or remove the site data for this app. CSV files are only created when you choose to export them.",
      "privacy.s6.h": "Third parties",
      "privacy.s6.p":
        "This app does not use third-party advertising, analytics, social tracking, or remote data processing. Transaction data is processed in your browser and is not uploaded to a server by this app.",
      "privacy.s7.h": "Contact",
      "privacy.s7.p.before": "For privacy questions or correction requests about this project, use the GitHub Issues page for the repository:",
    },
    zh: {
      "app.documentTitle": "高级个人财务追踪器",
      "header.eyebrow": "个人理财",
      "header.title": "高级财务追踪器",
      "header.subtitle": "清晰记录收入、支出与结余。",
      "lang.switch": "语言",
      "lang.en": "English",
      "lang.zh": "中文",
      "actions.themeLight": "浅色模式",
      "actions.themeDark": "深色模式",
      "actions.exportCsv": "导出 CSV",
      "actions.resetFilters": "重置筛选",
      "actions.privacySettings": "隐私设置",
      "summary.totalBalance": "总余额",
      "summary.totalIncome": "总收入",
      "summary.totalExpenses": "总支出",
      "chart.title": "现金流概览",
      "chart.subtitle": "收入与支出",
      "chart.income": "收入",
      "chart.expense": "支出",
      "chart.aria":
        "现金流柱状图：总收入 {{income}}，总支出 {{expenses}}。",
      "form.title": "添加交易",
      "field.title": "标题",
      "field.title.placeholder": "例如：自由职业报酬",
      "field.amount": "金额",
      "field.amount.placeholder": "例如：1200 或 -45",
      "field.category": "分类",
      "field.category.placeholder": "选择分类",
      "field.date": "日期",
      "form.submit.add": "添加交易",
      "form.submit.save": "保存修改",
      "form.cancelEdit": "取消编辑",
      "category.salary": "工资",
      "category.business": "经营",
      "category.investments": "投资",
      "category.housing": "住房",
      "category.food": "餐饮",
      "category.transport": "交通",
      "category.health": "医疗",
      "category.entertainment": "娱乐",
      "category.education": "教育",
      "category.other": "其他",
      "filters.title": "筛选与搜索",
      "filters.category": "分类",
      "filters.type": "类型",
      "filters.search": "按标题搜索",
      "filters.search.placeholder": "输入关键词…",
      "filters.allCategories": "全部分类",
      "filters.allTypes": "全部",
      "filters.income": "收入",
      "filters.expense": "支出",
      "list.title": "交易记录",
      "list.results": "{{count}} 条结果",
      "list.empty": "暂无交易，先添加一笔开始使用。",
      "list.addFirst": "添加第一笔交易",
      "tx.edit": "编辑",
      "tx.delete": "删除",
      "tx.edit.aria": "编辑交易：{{title}}",
      "tx.delete.aria": "删除交易：{{title}}",
      "modal.delete.title": "删除此交易？",
      "modal.delete.body": "此操作无法撤销。",
      "modal.delete.editingWarning":
        "你正在编辑此交易，删除将放弃未保存的修改。",
      "modal.cancel": "取消",
      "modal.confirmDelete": "删除",
      "banner.eyebrow": "本地存储提示",
      "banner.title": "隐私与存储偏好",
      "banner.line1":
        "本应用可将你的账目与主题偏好保存在本机的本地存储中。",
      "banner.line2": "不使用第三方广告或分析追踪。",
      "banner.reject": "拒绝持久化存储",
      "banner.allow": "允许持久化存储",
      "banner.policy": "查看隐私政策",
      "validation.title": "请填写标题。",
      "validation.amount": "请输入有效金额。",
      "validation.category": "请选择分类。",
      "validation.date": "请选择日期。",
      "toast.fixFields": "请先修正标红字段。",
      "toast.txAdded": "已添加交易。",
      "toast.txUpdated": "已更新交易。",
      "toast.txDeleted": "已删除交易。",
      "toast.txGone": "交易已不存在。",
      "toast.noExport": "没有可导出的数据。",
      "toast.csvExported": "已导出 CSV。",
      "toast.privacySaved": "已保存隐私存储偏好。",
      "toast.invalidRemoved": "部分已保存交易无效，已移除。",
      "toast.dataReset": "本地数据损坏，已重置。",
      "toast.editSwitch": "已切换到其他交易，未保存的修改已丢弃。",
      "toast.editOn": "已进入编辑模式。",
      "consent.status.none": "尚未记录存储偏好。",
      "consent.status.rejected":
        "当前选择：拒绝持久化存储。刷新后新记录会消失。",
      "consent.status.allowed":
        "当前选择：允许持久化存储。账目与主题会被保存。",
      "csv.header.title": "标题",
      "csv.header.amount": "金额",
      "csv.header.category": "分类",
      "csv.header.date": "日期",
      "privacy.documentTitle": "隐私政策 | 高级财务追踪器",
      "privacy.back": "返回应用",
      "privacy.eyebrow": "隐私政策",
      "privacy.hero.title": "高级财务追踪器",
      "privacy.hero.subtitle":
        "本页说明本应用在你设备上存储什么、为何存储，以及你的选择如何生效。",
      "privacy.s1.h": "本应用在设备上存储什么",
      "privacy.s1.p":
        "本应用将财务数据保存在浏览器本地存储中，主要包括：financeTrackerData（交易）、financeTrackerConsent（存储选择）、financeTrackerTheme（浅色/深色主题）。仅在你允许持久化存储时写入。若拒绝持久化，新账目仅在当前页面会话有效，刷新后会消失。",
      "privacy.s2.h": "为何存储这些数据",
      "privacy.s2.p":
        "在你允许持久化存储时保存交易与主题，以便刷新后仍可使用；保存同意记录以便记住你的选择。",
      "privacy.s3.h": "哪些存储是可选的",
      "privacy.s3.p":
        "financeTrackerConsent 用于记住存储选择；financeTrackerData 与 financeTrackerTheme 为可选持久化：没有它们时仍可在本页使用，但刷新后会丢失。",
      "privacy.s4.h": "你的选择如何生效",
      "privacy.s4.p":
        "若拒绝持久化，新账目与主题变更不会写入本地存储，刷新后消失。若允许持久化，会保存交易数据、主题与存储选择。你可随时在主应用打开「隐私设置」更改选择。",
      "privacy.s5.h": "数据保留多久",
      "privacy.s5.p":
        "数据会一直留在浏览器中，直到你删除交易、更改存储偏好、清除站点数据或浏览器存储。CSV 仅在你导出时生成。",
      "privacy.s6.h": "第三方",
      "privacy.s6.p":
        "本应用不使用第三方广告、分析、社交追踪或远程数据处理；交易数据仅在浏览器内处理，不会由此应用上传到服务器。",
      "privacy.s7.h": "联系",
      "privacy.s7.p.before":
        "如有关于本项目的隐私问题或更正请求，请通过仓库 GitHub Issues：",
    },
  };

  /** @type {'en'|'zh'} */
  let currentLang = "en";

  function normalizeLang(value) {
    return SUPPORTED.includes(value) ? value : "en";
  }

  function readStoredLang() {
    try {
      return normalizeLang(localStorage.getItem(LANG_KEY) || "");
    } catch {
      return "en";
    }
  }

  function persistLang(lang) {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* ignore quota / private mode */
    }
  }

  /**
   * 简单插值：t('k', { a: '1' }) 替换 {{a}}
   * @param {string} key
   * @param {Record<string, string | number>=} vars
   */
  function t(key, vars) {
    const table = MESSAGES[currentLang] || MESSAGES.en;
    let text = table[key] ?? MESSAGES.en[key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replaceAll(`{{${k}}}`, String(v));
      });
    }
    return text;
  }

  function setHtmlLangAttr(lang) {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }

  function applyDocumentTitle() {
    const page =
      document.documentElement.getAttribute("data-page") || "app";
    document.title =
      page === "privacy"
        ? t("privacy.documentTitle")
        : t("app.documentTitle");
  }

  function applyDataI18nElements() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      el.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key || !("placeholder" in el)) return;
      el.placeholder = t(key);
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria-label");
      if (!key) return;
      el.setAttribute("aria-label", t(key));
    });

    document.querySelectorAll("option[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      el.textContent = t(key);
    });
  }

  function syncLangToggleUI() {
    document.querySelectorAll("[data-lang]").forEach((btn) => {
      const lang = btn.getAttribute("data-lang");
      const active = lang === currentLang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function applyToDocument() {
    setHtmlLangAttr(currentLang);
    applyDocumentTitle();
    applyDataI18nElements();
    syncLangToggleUI();
  }

  /**
   * @param {'en'|'zh'} lang
   */
  function setLang(lang) {
    const next = normalizeLang(lang);
    if (next === currentLang) {
      applyToDocument();
      window.dispatchEvent(
        new CustomEvent("app:languagechange", { detail: { lang: next } }),
      );
      return;
    }
    currentLang = next;
    persistLang(next);
    applyToDocument();
    window.dispatchEvent(
      new CustomEvent("app:languagechange", { detail: { lang: next } }),
    );
  }

  function getLang() {
    return currentLang;
  }

  function getLocaleTag() {
    return currentLang === "zh" ? "zh-CN" : "en-US";
  }

  function categoryLabel(value) {
    const map = {
      Salary: "category.salary",
      Business: "category.business",
      Investments: "category.investments",
      Housing: "category.housing",
      Food: "category.food",
      Transport: "category.transport",
      Health: "category.health",
      Entertainment: "category.entertainment",
      Education: "category.education",
      Other: "category.other",
    };
    const key = map[value];
    return key ? t(key) : value;
  }

  currentLang = readStoredLang();
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", applyToDocument);
    } else {
      applyToDocument();
    }
  }

  window.financeI18n = {
    t,
    setLang,
    getLang,
    getLocaleTag,
    applyToDocument,
    categoryLabel,
    MESSAGES,
  };
})();
