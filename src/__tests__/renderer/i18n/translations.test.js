/**
 * i18n 国际化测试
 * 测试翻译模块的功能
 */

const {
  translations,
  defaultLocale,
  currentLocale,
  t,
  setLocale,
  getLocale,
  getSupportedLocales,
} = require('../../renderer/i18n/translations');

// 保存原始 locale 用于恢复
const originalLocale = currentLocale;

describe('i18n translations', () => {
  describe('translations 结构', () => {
    test('应该支持中文和英文', () => {
      expect(translations).toHaveProperty('zh');
      expect(translations).toHaveProperty('en');
    });

    test('中文翻译应该包含所有必要的模块', () => {
      const zhKeys = Object.keys(translations.zh);
      expect(zhKeys).toContain('app');
      expect(zhKeys).toContain('nav');
      expect(zhKeys).toContain('dashboard');
      expect(zhKeys).toContain('contacts');
      expect(zhKeys).toContain('companies');
      expect(zhKeys).toContain('deals');
      expect(zhKeys).toContain('tasks');
    });

    test('英文翻译应该包含所有必要的模块', () => {
      const enKeys = Object.keys(translations.en);
      expect(enKeys).toContain('app');
      expect(enKeys).toContain('nav');
      expect(enKeys).toContain('dashboard');
      expect(enKeys).toContain('contacts');
      expect(enKeys).toContain('companies');
      expect(enKeys).toContain('deals');
      expect(enKeys).toContain('tasks');
    });

    test('中英文翻译结构应该一致', () => {
      const zhKeys = Object.keys(translations.zh).sort();
      const enKeys = Object.keys(translations.en).sort();
      expect(zhKeys).toEqual(enKeys);
    });
  });

  describe('defaultLocale', () => {
    test('默认语言应该是中文', () => {
      expect(defaultLocale).toBe('zh');
    });
  });

  describe('t 函数', () => {
    beforeEach(() => {
      // 重置为默认 locale
      setLocale('zh');
    });

    afterEach(() => {
      // 恢复原始 locale
      setLocale(originalLocale || 'zh');
    });

    test('应该能获取中文翻译', () => {
      expect(t('nav.dashboard')).toBe('仪表盘');
      expect(t('nav.contacts')).toBe('联系人');
    });

    test('应该能获取英文翻译', () => {
      setLocale('en');
      expect(t('nav.dashboard')).toBe('Dashboard');
      expect(t('nav.contacts')).toBe('Contacts');
    });

    test('应该支持嵌套键的翻译', () => {
      expect(t('deals.stages.lead')).toBe('潜在客户');
      expect(t('deals.stages.qualified')).toBe('已确认');
    });

    test('找不到翻译时应该回退到英文', () => {
      // 切换到英文再测试不存在的键
      setLocale('en');
      expect(t('non.existent.key')).toBe('non.existent.key');
    });

    test('应该支持通过参数覆盖语言', () => {
      expect(t('nav.dashboard', 'en')).toBe('Dashboard');
      expect(t('nav.dashboard', 'zh')).toBe('仪表盘');
    });

    test('键名不存在时应该返回键名本身', () => {
      const result = t('invalid.key.path');
      expect(result).toBe('invalid.key.path');
    });
  });

  describe('setLocale / getLocale', () => {
    afterEach(() => {
      setLocale(originalLocale || 'zh');
    });

    test('应该能设置和获取当前语言', () => {
      setLocale('en');
      expect(getLocale()).toBe('en');

      setLocale('zh');
      expect(getLocale()).toBe('zh');
    });

    test('设置不支持的语言不应该改变当前语言', () => {
      setLocale('zh');
      setLocale('invalid');
      expect(getLocale()).toBe('zh');
    });

    test('切换到英文后翻译应该改变', () => {
      setLocale('zh');
      expect(t('app.loading')).toBe('加载中...');

      setLocale('en');
      expect(t('app.loading')).toBe('Loading...');
    });
  });

  describe('getSupportedLocales', () => {
    test('应该返回所有支持的语言列表', () => {
      const locales = getSupportedLocales();
      expect(locales).toContain('zh');
      expect(locales).toContain('en');
      expect(locales).toHaveLength(2);
    });
  });

  describe('特定模块翻译', () => {
    beforeEach(() => {
      setLocale('zh');
    });

    afterEach(() => {
      setLocale(originalLocale || 'zh');
    });

    describe('导航翻译', () => {
      test('导航应该包含所有必要的翻译', () => {
        expect(t('nav.dashboard')).toBe('仪表盘');
        expect(t('nav.contacts')).toBe('联系人');
        expect(t('nav.companies')).toBe('公司');
        expect(t('nav.deals')).toBe('销售机会');
        expect(t('nav.tasks')).toBe('任务');
      });
    });

    describe('联系人翻译', () => {
      test('联系人模块应该包含所有必要的翻译', () => {
        expect(t('contacts.title')).toBe('联系人');
        expect(t('contacts.addContact')).toBe('+ 新增联系人');
        expect(t('contacts.name')).toBe('姓名');
        expect(t('contacts.email')).toBe('邮箱');
        expect(t('contacts.createdSuccess')).toBe('联系人创建成功');
      });
    });

    describe('销售机会翻译', () => {
      test('销售机会阶段应该有完整的翻译', () => {
        expect(t('deals.stages.lead')).toBe('潜在客户');
        expect(t('deals.stages.qualified')).toBe('已确认');
        expect(t('deals.stages.proposal')).toBe('方案报价');
        expect(t('deals.stages.negotiation')).toBe('谈判中');
        expect(t('deals.stages.closed_won')).toBe('已成交');
        expect(t('deals.stages.closed_lost')).toBe('已流失');
      });
    });

    describe('任务翻译', () => {
      test('任务优先级应该有完整的翻译', () => {
        expect(t('tasks.priorities.low')).toBe('低');
        expect(t('tasks.priorities.medium')).toBe('中');
        expect(t('tasks.priorities.high')).toBe('高');
      });

      test('任务状态应该有完整的翻译', () => {
        expect(t('tasks.statuses.pending')).toBe('待办');
        expect(t('tasks.statuses.completed')).toBe('已完成');
      });
    });
  });

  describe('边界情况', () => {
    test('应该能处理空键', () => {
      expect(t('')).toBe('');
    });

    test('应该能处理单层键', () => {
      // 不存在单层键，应该返回键名
      expect(t('app')).toEqual(translations.zh.app);
    });
  });
});
