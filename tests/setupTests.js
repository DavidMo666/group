const makeCanvasContext = () => ({
  setTransform: jest.fn(),
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  fillRect: jest.fn(),
  fillText: jest.fn(),
});

const NativeBlob = global.Blob;

class TestBlob {
  constructor(parts = [], options = {}) {
    this.parts = parts;
    this.type = options.type || "";
  }

  text() {
    return Promise.resolve(this.parts.join(""));
  }
}

Object.defineProperty(HTMLCanvasElement.prototype, "clientWidth", {
  configurable: true,
  get() {
    return 800;
  },
});

Object.defineProperty(HTMLCanvasElement.prototype, "clientHeight", {
  configurable: true,
  get() {
    return 260;
  },
});

beforeEach(() => {
  jest.useFakeTimers();
  localStorage.clear();

  global.__canvasContext = makeCanvasContext();
  HTMLCanvasElement.prototype.getContext = jest.fn(() => global.__canvasContext);

  URL.createObjectURL = jest.fn(() => "blob:mock-transactions");
  URL.revokeObjectURL = jest.fn();
  global.Blob = TestBlob;
  HTMLAnchorElement.prototype.click = jest.fn();

  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.restoreAllMocks();
  jest.resetModules();
  global.Blob = NativeBlob;
  delete global.i18next;
  delete global.financeTrackerResources;
  delete global.financeTrackerApp;
  delete window.i18next;
  delete window.financeTrackerResources;
  delete window.financeTrackerApp;

  document.open();
  document.write("<!doctype html><html><head></head><body></body></html>");
  document.close();
});