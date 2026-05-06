export const resources = {
  en: {
    translation: {
      meta: {
        title: "Advanced Personal Finance Tracker",
      },
      lang: {
        groupAria: "Language",
        en: "English",
        zh: "中文",
      },
      header: {
        eyebrow: "Personal Finance",
        title: "Advanced Finance Tracker",
        subtitle: "Track income, expenses, and your balance with clarity.",
      },
      actions: {
        exportCsv: "Export CSV",
        resetFilters: "Reset Filters",
        privacySettings: "Privacy Settings",
      },
      theme: {
        switchToLight: "Light Mode",
        switchToDark: "Dark Mode",
      },
      summary: {
        totalBalance: "Total Balance",
        totalIncome: "Total Income",
        totalExpenses: "Total Expenses",
      },
      chart: {
        sectionTitle: "Cash Flow Overview",
        meta: "Income vs Expense",
        incomeLabel: "Income",
        expenseLabel: "Expense",
        aria: "Cash flow bar chart showing total income {{income}} and total expenses {{expenses}}.",
      },
      form: {
        sectionTitle: "Add Transaction",
        title: "Title",
        amount: "Amount",
        category: "Category",
        date: "Date",
        titlePh: "e.g., Freelance Payment",
        amountPh: "e.g., 1200 or -45",
        selectCategory: "Select category",
        submitAdd: "Add Transaction",
        submitSave: "Save Changes",
        cancelEdit: "Cancel Edit",
      },
      filters: {
        sectionTitle: "Filters & Search",
        category: "Category",
        type: "Type",
        search: "Search by title",
        allCategories: "All categories",
        typeAll: "All",
        typeIncome: "Income",
        typeExpense: "Expense",
        searchPh: "Start typing...",
      },
      transactions: {
        sectionTitle: "Transactions",
        results: "{{count}} results",
        emptyText: "No transactions yet. Add your first one to get started.",
        emptyCta: "Add First Transaction",
        edit: "Edit",
        delete: "Delete",
        editAria: "Edit transaction {{title}}",
        deleteAria: "Delete transaction {{title}}",
      },
      categories: {
        Salary: "Salary",
        Business: "Business",
        Investments: "Investments",
        Housing: "Housing",
        Food: "Food",
        Transport: "Transport",
        Health: "Health",
        Entertainment: "Entertainment",
        Education: "Education",
        Other: "Other",
      },
      privacy: {
        bannerEyebrow: "Local storage notice",
        bannerTitle: "Privacy & Storage Preferences",
        bannerP1:
          "This app can use local storage to save your finance records and theme preference on this device.",
        bannerP2:
          "It does not use third-party advertising or analytics tracking.",
        reject: "Reject persistent storage",
        allow: "Allow persistent storage",
        readPolicy: "Read Privacy Policy",
      },
      modal: {
        deleteTitle: "Delete transaction?",
        deleteDescription: "This action cannot be undone.",
        editingWarning:
          "You are currently editing this transaction. Deleting it will discard your unsaved changes.",
        cancel: "Cancel",
        delete: "Delete",
      },
      toast: {
        privacySaved: "Privacy storage preference saved.",
        invalidRemoved: "Some saved transactions were invalid and were removed.",
        dataReset: "Saved data was corrupted and has been reset.",
        fixFields: "Please fix the highlighted fields.",
        txMissing: "Transaction no longer exists.",
        updated: "Transaction updated.",
        added: "Transaction added.",
        switchingEdit:
          "Switched to a different transaction. Unsaved changes discarded.",
        editingEnabled: "Editing mode enabled.",
        deleted: "Transaction deleted.",
        noExport: "No data to export.",
        exported: "CSV exported.",
      },
      errors: {
        titleRequired: "Title is required.",
        amountInvalid: "Enter a valid amount.",
        categoryRequired: "Select a category.",
        dateRequired: "Pick a date.",
      },
      consent: {
        statusNone: "No storage preference has been recorded yet.",
        statusRejected:
          "Current choice: persistent storage rejected. New records disappear after refresh.",
        statusAllowed:
          "Current choice: persistent storage allowed. Records and theme are saved.",
      },
      csv: {
        title: "Title",
        amount: "Amount",
        category: "Category",
        date: "Date",
      },
      privacyPage: {
        metaTitle: "Privacy Policy | Advanced Finance Tracker",
        eyebrow: "Privacy Policy",
        title: "Advanced Finance Tracker",
        subtitle:
          "This page explains what this app stores on your device, why it is stored, and how your storage choices work.",
        backToApp: "Back to app",
        s1h: "What this app stores on your device",
        s1p:
          "This app stores finance tracker data in your browser's local storage. The main stored records are financeTrackerData for your transactions, financeTrackerConsent for your storage choice, and financeTrackerTheme for your light or dark theme preference. These records are saved only when you allow persistent storage. If you reject persistent storage, new finance records are kept only for the current page session and disappear after refresh.",
        s2h: "Why the data is stored",
        s2p:
          "Transaction data and theme preference are stored only when you allow persistent storage, so the tracker can keep your records and theme available after a page refresh. The consent record is stored so the app remembers your storage choice.",
        s3h: "Which storage is optional",
        s3p:
          "financeTrackerConsent is used to remember your storage choice. financeTrackerData and financeTrackerTheme are optional persistent storage: without them, records and theme changes can still be used on the current page but disappear after refresh.",
        s4h: "How your choices work",
        s4p:
          "If you reject persistent storage, new finance records and theme changes are not saved to local storage and disappear after refresh. If you allow persistent storage, the app saves transaction data, your selected light or dark theme, and your storage choice. You can reopen Privacy Settings from the main app and change this choice at any time.",
        s5h: "How long data remains",
        s5p:
          "The stored data remains in your browser until you delete transactions, change your storage preference, clear browser storage, or remove the site data for this app. CSV files are only created when you choose to export them.",
        s6h: "Third parties",
        s6p:
          "This app does not use third-party advertising, analytics, social tracking, or remote data processing. Transaction data is processed in your browser and is not uploaded to a server by this app.",
        s7h: "Contact",
        s7pBefore:
          "For privacy questions or correction requests about this project, use the GitHub Issues page for the repository:",
      },
    },
  },
  zh: {
    translation: {
      meta: {
        title: "高级个人财务追踪器",
      },
      lang: {
        groupAria: "语言",
        en: "English",
        zh: "中文",
      },
      header: {
        eyebrow: "个人理财",
        title: "高级财务追踪器",
        subtitle: "清晰记录收入、支出与结余。",
      },
      actions: {
        exportCsv: "导出 CSV",
        resetFilters: "重置筛选",
        privacySettings: "隐私设置",
      },
      theme: {
        switchToLight: "浅色模式",
        switchToDark: "深色模式",
      },
      summary: {
        totalBalance: "总余额",
        totalIncome: "总收入",
        totalExpenses: "总支出",
      },
      chart: {
        sectionTitle: "现金流概览",
        meta: "收入对比支出",
        incomeLabel: "收入",
        expenseLabel: "支出",
        aria: "现金流柱状图：总收入 {{income}}，总支出 {{expenses}}。",
      },
      form: {
        sectionTitle: "添加交易",
        title: "标题",
        amount: "金额",
        category: "分类",
        date: "日期",
        titlePh: "例如：自由职业报酬",
        amountPh: "例如：1200 或 -45",
        selectCategory: "选择分类",
        submitAdd: "添加交易",
        submitSave: "保存更改",
        cancelEdit: "取消编辑",
      },
      filters: {
        sectionTitle: "筛选与搜索",
        category: "分类",
        type: "类型",
        search: "按标题搜索",
        allCategories: "全部分类",
        typeAll: "全部",
        typeIncome: "收入",
        typeExpense: "支出",
        searchPh: "开始输入…",
      },
      transactions: {
        sectionTitle: "交易记录",
        results: "{{count}} 条结果",
        emptyText: "尚无交易。添加第一条以开始使用。",
        emptyCta: "添加第一笔交易",
        edit: "编辑",
        delete: "删除",
        editAria: "编辑交易：{{title}}",
        deleteAria: "删除交易：{{title}}",
      },
      categories: {
        Salary: "薪资",
        Business: "商业",
        Investments: "投资",
        Housing: "住房",
        Food: "餐饮",
        Transport: "交通",
        Health: "健康",
        Entertainment: "娱乐",
        Education: "教育",
        Other: "其他",
      },
      privacy: {
        bannerEyebrow: "本地存储提示",
        bannerTitle: "隐私与存储偏好",
        bannerP1:
          "本应用可使用本地存储在此设备上保存您的财务记录与主题偏好。",
        bannerP2: "不使用第三方广告或分析追踪。",
        reject: "拒绝持久化存储",
        allow: "允许持久化存储",
        readPolicy: "阅读隐私政策",
      },
      modal: {
        deleteTitle: "删除该交易？",
        deleteDescription: "此操作无法撤销。",
        editingWarning:
          "您正在编辑该交易。删除将放弃尚未保存的更改。",
        cancel: "取消",
        delete: "删除",
      },
      toast: {
        privacySaved: "已保存隐私存储偏好。",
        invalidRemoved: "部分已保存的交易无效，已移除。",
        dataReset: "已保存数据损坏，已重置。",
        fixFields: "请修正标出的字段。",
        txMissing: "交易已不存在。",
        updated: "交易已更新。",
        added: "交易已添加。",
        switchingEdit: "已切换到另一笔交易，未保存的更改已丢弃。",
        editingEnabled: "已进入编辑模式。",
        deleted: "交易已删除。",
        noExport: "没有可导出的数据。",
        exported: "CSV 已导出。",
      },
      errors: {
        titleRequired: "请填写标题。",
        amountInvalid: "请输入有效金额。",
        categoryRequired: "请选择分类。",
        dateRequired: "请选择日期。",
      },
      consent: {
        statusNone: "尚未记录存储偏好。",
        statusRejected:
          "当前选择：已拒绝持久化存储。新记录在刷新后将消失。",
        statusAllowed:
          "当前选择：已允许持久化存储。记录与主题会被保存。",
      },
      csv: {
        title: "标题",
        amount: "金额",
        category: "分类",
        date: "日期",
      },
      privacyPage: {
        metaTitle: "隐私政策 | 高级财务追踪器",
        eyebrow: "隐私政策",
        title: "高级财务追踪器",
        subtitle:
          "本页说明本应用在您设备上存储的内容、原因以及您的选择如何生效。",
        backToApp: "返回应用",
        s1h: "本应用在您设备上存储什么",
        s1p:
          "本应用将财务追踪数据保存在浏览器本地存储中。主要记录包括：financeTrackerData（交易）、financeTrackerConsent（存储选择）与 financeTrackerTheme（浅色或深色主题）。仅在您允许持久化存储时才会写入。若拒绝持久化存储，新的财务记录仅在当前页面会话中保留，刷新后会消失。",
        s2h: "为何存储这些数据",
        s2p:
          "仅在允许持久化时保存交易与主题偏好，以便刷新后仍能使用。同意记录用于记住您的存储选择。",
        s3h: "哪些存储是可选的",
        s3p:
          "financeTrackerConsent 用于记住您的存储选择。financeTrackerData 与 financeTrackerTheme 为可选持久化：没有它们时，记录与主题仍可在当前页使用，但刷新后消失。",
        s4h: "您的选择如何生效",
        s4p:
          "若拒绝持久化存储，新记录与主题更改不会写入本地存储，刷新后消失。若允许，则会保存交易、主题与存储选择。您可随时在主应用重新打开「隐私设置」更改选择。",
        s5h: "数据保留多久",
        s5p:
          "数据将保留在浏览器中，直到您删除交易、更改偏好、清除站点数据或移除本应用站点数据。CSV 仅在您主动导出时生成。",
        s6h: "第三方",
        s6p:
          "本应用不使用第三方广告、分析、社交追踪或远程数据处理。交易数据仅在浏览器内处理，不会由此应用上传到服务器。",
        s7h: "联系",
        s7pBefore:
          "如有关于本项目的隐私问题或更正请求，请使用仓库的 GitHub Issues：",
      },
    },
  },
};
