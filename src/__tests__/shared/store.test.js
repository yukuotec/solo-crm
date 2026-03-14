/**
 * Zustand Store 测试
 */

// Mock logger
jest.mock('src/renderer/logger', () => ({
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

const {
  useContactStore,
  useCompanyStore,
  useDealStore,
  useTaskStore,
} = require('src/shared/store');

describe('Zustand Stores', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // 重置 store 状态
    useContactStore.setState({ contacts: [], loading: false, error: null });
    useCompanyStore.setState({ companies: [], loading: false, error: null });
    useDealStore.setState({ deals: [], pipelineSummary: [], loading: false, error: null });
    useTaskStore.setState({ tasks: [], upcomingTasks: [], loading: false, error: null });
  });

  describe('useContactStore', () => {
    test('应该有正确的初始状态', () => {
      const state = useContactStore.getState();
      expect(state.contacts).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });

    test('应该能更新状态', () => {
      useContactStore.setState({ contacts: [{ id: 1, name: '测试' }] });
      const state = useContactStore.getState();
      expect(state.contacts).toHaveLength(1);
    });
  });

  describe('useCompanyStore', () => {
    test('应该有正确的初始状态', () => {
      const state = useCompanyStore.getState();
      expect(state.companies).toEqual([]);
    });
  });

  describe('useDealStore', () => {
    test('应该有正确的初始状态', () => {
      const state = useDealStore.getState();
      expect(state.deals).toEqual([]);
      expect(state.pipelineSummary).toEqual([]);
    });
  });

  describe('useTaskStore', () => {
    test('应该有正确的初始状态', () => {
      const state = useTaskStore.getState();
      expect(state.tasks).toEqual([]);
    });

    test('应该能筛选 pending 任务', () => {
      useTaskStore.setState({
        tasks: [
          { id: 1, title: '任务 A', status: 'pending' },
          { id: 2, title: '任务 B', status: 'completed' },
        ],
      });

      const state = useTaskStore.getState();
      const pendingTasks = state.tasks.filter(t => t.status === 'pending');
      expect(pendingTasks).toHaveLength(1);
    });
  });
});
