// Jest 测试设置文件
import '@testing-library/jest-dom';

// Mock electron API - 基础结构，具体实现在各个测试文件中覆盖
global.window = global.window || {};

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Mock CustomEvent
global.CustomEvent = class CustomEvent extends Event {
  constructor(eventName, eventInitDict) {
    super(eventName, eventInitDict);
    this.detail = eventInitDict?.detail;
  }
};

// Mock dispatchEvent
if (!global.dispatchEvent) {
  global.dispatchEvent = jest.fn();
}

// Mock addEventListener
if (!global.addEventListener) {
  global.addEventListener = jest.fn();
}
