/**
 * GlobalSearch 组件测试
 * 测试全局搜索组件的功能，包括快捷键、搜索历史等
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { GlobalSearch } from 'src/renderer/components/GlobalSearch';

// Mock electron API
const mockElectronAPI = {
  db: {
    getContacts: jest.fn(),
    getCompanies: jest.fn(),
    getDeals: jest.fn(),
  },
};

beforeEach(() => {
  // 重置 mock
  jest.clearAllMocks();
  localStorage.clear();

  // 设置 global window.electronAPI
  global.window.electronAPI = mockElectronAPI;
});

afterEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

describe('GlobalSearch', () => {
  const mockContacts = [
    { id: 1, name: '张三', email: 'zhangsan@example.com', phone: '13800138000' },
    { id: 2, name: '李四', email: 'lisi@example.com', phone: '13900139000' },
    { id: 3, name: '王五', email: 'wangwu@example.com', phone: '13700137000' },
  ];

  const mockCompanies = [
    { id: 1, name: '科技公司', website: 'tech.example.com', industry: '科技' },
    { id: 2, name: '贸易公司', website: 'trade.example.com', industry: '贸易' },
  ];

  const mockDeals = [
    { id: 1, title: '大项目', value: 100000, stage: '谈判中' },
    { id: 2, title: '小订单', value: 10000, stage: '已完成' },
  ];

  describe('快捷键打开搜索框', () => {
    test('Cmd+K 应该打开搜索框', () => {
      render(<GlobalSearch />);

      // 模拟 Cmd+K 快捷键
      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      // 搜索框应该显示
      expect(screen.getByPlaceholderText('搜索联系人、公司、商谈...')).toBeInTheDocument();
    });

    test('Ctrl+K 应该打开搜索框', () => {
      render(<GlobalSearch />);

      // 模拟 Ctrl+K 快捷键
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

      // 搜索框应该显示
      expect(screen.getByPlaceholderText('搜索联系人、公司、商谈...')).toBeInTheDocument();
    });

    test('Cmd/Ctrl+K 应该关闭已打开的搜索框', () => {
      render(<GlobalSearch />);

      // 打开搜索框
      fireEvent.keyDown(document, { key: 'k', metaKey: true });
      expect(screen.getByPlaceholderText('搜索联系人、公司、商谈...')).toBeInTheDocument();

      // 再次按下快捷键应该关闭
      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      // 搜索框应该消失
      expect(screen.queryByPlaceholderText('搜索联系人、公司、商谈...')).not.toBeInTheDocument();
    });

    test('点击搜索按钮应该打开搜索框', () => {
      render(<GlobalSearch />);

      // 点击搜索按钮
      const searchButton = screen.getByText('搜索');
      fireEvent.click(searchButton);

      // 搜索框应该显示
      expect(screen.getByPlaceholderText('搜索联系人、公司、商谈...')).toBeInTheDocument();
    });

    test('点击遮罩层应该关闭搜索框', () => {
      render(<GlobalSearch />);

      // 打开搜索框
      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      // 点击遮罩层
      const overlay = document.querySelector('.modal-overlay');
      fireEvent.click(overlay);

      // 搜索框应该关闭
      expect(screen.queryByPlaceholderText('搜索联系人、公司、商谈...')).not.toBeInTheDocument();
    });
  });

  describe('输入查询触发搜索', () => {
    beforeEach(() => {
      mockElectronAPI.db.getContacts.mockResolvedValue(mockContacts);
      mockElectronAPI.db.getCompanies.mockResolvedValue(mockCompanies);
      mockElectronAPI.db.getDeals.mockResolvedValue(mockDeals);
    });

    test('输入查询应该触发搜索', async () => {
      render(<GlobalSearch />);

      // 打开搜索框
      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      // 输入查询
      const input = screen.getByPlaceholderText('搜索联系人、公司、商谈...');
      fireEvent.change(input, { target: { value: '张' } });

      // 等待防抖和搜索完成
      await waitFor(() => {
        expect(mockElectronAPI.db.getContacts).toHaveBeenCalled();
        expect(mockElectronAPI.db.getCompanies).toHaveBeenCalled();
        expect(mockElectronAPI.db.getDeals).toHaveBeenCalled();
      }, { timeout: 500 });
    });

    test('搜索时应该显示加载中状态', async () => {
      // 模拟延迟的 API 调用
      let resolvePromise;
      const delayedPromise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      mockElectronAPI.db.getContacts.mockImplementation(() => delayedPromise);
      mockElectronAPI.db.getCompanies.mockImplementation(() => delayedPromise);
      mockElectronAPI.db.getDeals.mockImplementation(() => delayedPromise);

      render(<GlobalSearch />);

      // 打开搜索框
      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      // 输入查询
      const input = screen.getByPlaceholderText('搜索联系人、公司、商谈...');
      fireEvent.change(input, { target: { value: '科技' } });

      // 应该很快显示加载中（在 200ms 防抖后）
      await waitFor(() => {
        const loadingText = screen.queryByText('搜索中...');
        expect(loadingText).toBeInTheDocument();
      }, { timeout: 300 });

      // 解决 Promise
      resolvePromise(mockContacts);
    });

    test('搜索结果应该正确显示', async () => {
      render(<GlobalSearch />);

      // 打开搜索框
      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      // 输入查询
      const input = screen.getByPlaceholderText('搜索联系人、公司、商谈...');
      fireEvent.change(input, { target: { value: '张' } });

      // 等待搜索完成
      await waitFor(() => {
        expect(screen.getByText('张三')).toBeInTheDocument();
      }, { timeout: 500 });

      // 检查搜索结果显示（只显示有结果的部分）
      expect(screen.getByText('联系人')).toBeInTheDocument();
    });

    test('无搜索结果应该显示空状态', async () => {
      // 模拟空结果
      mockElectronAPI.db.getContacts.mockResolvedValue([]);
      mockElectronAPI.db.getCompanies.mockResolvedValue([]);
      mockElectronAPI.db.getDeals.mockResolvedValue([]);

      render(<GlobalSearch />);

      // 打开搜索框
      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      // 输入查询
      const input = screen.getByPlaceholderText('搜索联系人、公司、商谈...');
      fireEvent.change(input, { target: { value: '不存在的结果' } });

      // 等待搜索完成并检查空状态
      await waitFor(() => {
        expect(screen.getByText(/未找到匹配/)).toBeInTheDocument();
      }, { timeout: 500 });
    });

    test('空查询不应该触发搜索', () => {
      render(<GlobalSearch />);

      // 打开搜索框
      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      // 输入空查询
      const input = screen.getByPlaceholderText('搜索联系人、公司、商谈...');
      fireEvent.change(input, { target: { value: '' } });

      // 不应该调用 API
      expect(mockElectronAPI.db.getContacts).not.toHaveBeenCalled();
      expect(mockElectronAPI.db.getCompanies).not.toHaveBeenCalled();
      expect(mockElectronAPI.db.getDeals).not.toHaveBeenCalled();
    });
  });

  describe('搜索历史功能', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test('回车应该保存搜索历史', async () => {
      render(<GlobalSearch />);

      // 打开搜索框
      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      // 输入查询
      const input = screen.getByPlaceholderText('搜索联系人、公司、商谈...');
      fireEvent.change(input, { target: { value: '测试搜索' } });

      // 按回车保存历史
      fireEvent.keyDown(document, { key: 'Enter' });

      // 等待历史保存
      await waitFor(() => {
        const savedHistory = localStorage.getItem('solo-crm-search-history');
        expect(savedHistory).toBeTruthy();
      }, { timeout: 100 });
    });

    test('打开搜索框应该显示搜索历史', () => {
      // 预先设置历史
      const history = ['历史搜索 1', '历史搜索 2'];
      localStorage.setItem('solo-crm-search-history', JSON.stringify(history));

      render(<GlobalSearch />);

      // 打开搜索框
      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      // 应该显示历史记录
      expect(screen.getByText('最近搜索')).toBeInTheDocument();
      expect(screen.getByText('历史搜索 1')).toBeInTheDocument();
      expect(screen.getByText('历史搜索 2')).toBeInTheDocument();
    });

    test('没有历史时应该显示提示', () => {
      localStorage.clear();

      render(<GlobalSearch />);

      // 打开搜索框
      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      // 应该显示提示文本
      expect(screen.getByText(/输入关键词搜索/)).toBeInTheDocument();
    });

    test('点击历史项应该填充查询', () => {
      // 预先设置历史
      const history = ['点击测试'];
      localStorage.setItem('solo-crm-search-history', JSON.stringify(history));

      render(<GlobalSearch />);

      // 打开搜索框
      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      // 点击历史项
      const historyItem = screen.getByText('点击测试');
      fireEvent.click(historyItem);

      // 输入框应该填充历史值
      const input = screen.getByPlaceholderText('搜索联系人、公司、商谈...');
      expect(input.value).toBe('点击测试');
    });

    test('清空按钮应该清除所有历史记录', () => {
      // 预先设置历史
      const history = ['历史 1', '历史 2'];
      localStorage.setItem('solo-crm-search-history', JSON.stringify(history));

      render(<GlobalSearch />);

      // 打开搜索框
      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      // 点击清空按钮
      const clearButton = screen.getByText('清空');
      fireEvent.click(clearButton);

      // 历史记录应该被清除
      expect(screen.queryByText('历史 1')).not.toBeInTheDocument();
      expect(screen.queryByText('历史 2')).not.toBeInTheDocument();
      expect(screen.getByText(/输入关键词搜索/)).toBeInTheDocument();
    });

    test('新搜索应该添加到历史开头', async () => {
      // 预先设置历史
      const history = ['旧搜索'];
      localStorage.setItem('solo-crm-search-history', JSON.stringify(history));

      render(<GlobalSearch />);

      // 打开搜索框
      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      // 输入新查询
      const input = screen.getByPlaceholderText('搜索联系人、公司、商谈...');
      fireEvent.change(input, { target: { value: '新搜索' } });

      // 按回车保存
      fireEvent.keyDown(document, { key: 'Enter' });

      // 等待保存完成
      await waitFor(() => {
        const saved = localStorage.getItem('solo-crm-search-history');
        const parsed = saved ? JSON.parse(saved) : [];
        expect(parsed[0]).toBe('新搜索');
      }, { timeout: 100 });
    });

    test('重复搜索应该移到历史开头', async () => {
      // 预先设置历史，包含重复项
      const history = ['搜索 A', '搜索 B', '搜索 A'];
      localStorage.setItem('solo-crm-search-history', JSON.stringify(history));

      render(<GlobalSearch />);

      // 打开搜索框
      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      // 输入重复查询
      const input = screen.getByPlaceholderText('搜索联系人、公司、商谈...');
      fireEvent.change(input, { target: { value: '搜索 B' } });

      // 按回车保存
      fireEvent.keyDown(document, { key: 'Enter' });

      // 等待保存完成，重复项应该被去重并移到开头
      await waitFor(() => {
        const saved = localStorage.getItem('solo-crm-search-history');
        const parsed = saved ? JSON.parse(saved) : [];
        expect(parsed[0]).toBe('搜索 B');
        expect(parsed.filter(x => x === '搜索 B').length).toBe(1);
      }, { timeout: 100 });
    });

    test('历史记录不应该超过最大数量', async () => {
      localStorage.clear();

      render(<GlobalSearch />);

      // 打开搜索框
      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      // 添加超过最大数量的搜索
      for (let i = 0; i < 15; i++) {
        const input = screen.getByPlaceholderText('搜索联系人、公司、商谈...');
        fireEvent.change(input, { target: { value: `搜索${i}` } });
        fireEvent.keyDown(document, { key: 'Enter' });
        // 等待一点时间让历史保存
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 50));
        });
        // 关闭再打开以刷新历史显示
        fireEvent.keyDown(document, { key: 'k', metaKey: true });
        fireEvent.keyDown(document, { key: 'k', metaKey: true });
      }

      // 等待所有异步操作完成
      await waitFor(() => {
        const saved = localStorage.getItem('solo-crm-search-history');
        const parsed = saved ? JSON.parse(saved) : [];
        expect(parsed.length).toBeLessThanOrEqual(10); // MAX_HISTORY = 10
      }, { timeout: 1000 });
    });
  });

  describe('ESC 关闭搜索框', () => {
    // 注意：当前组件没有实现 ESC 关闭功能，只有 UI 提示
    // 这是一个待实现的功能
    test('组件显示 ESC 提示但暂不支持 ESC 关闭', () => {
      render(<GlobalSearch />);

      // 打开搜索框
      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      // 应该显示 ESC 提示
      expect(screen.getByText('ESC')).toBeInTheDocument();
    });
  });
});
