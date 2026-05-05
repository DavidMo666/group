const makeConsent = (overrides = {}) => ({
  version: 1,
  mode: "allowed",
  recordedAt: "2026-05-05T10:00:00.000Z",
  ...overrides,
});

const makeTransaction = (overrides = {}) => ({
  id: "tx_saved",
  title: "Saved Salary",
  amount: 1800,
  category: "Salary",
  date: "2026-05-01",
  ...overrides,
});

module.exports = {
  makeConsent,
  makeTransaction,
};