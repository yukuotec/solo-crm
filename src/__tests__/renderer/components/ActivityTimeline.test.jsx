/**
 * ActivityTimeline 组件测试
 * 测试活动时间线组件的功能
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ActivityTimeline } from 'src/renderer/components/ActivityTimeline';

describe('ActivityTimeline', () => {
  const mockActivities = [
    {
      id: 1,
      type: 'call',
      date: '2026-03-15T02:00:00.000Z',
      notes: '与客户讨论项目需求',
      contact_name: '张三',
      deal_title: 'CRM 系统开发',
    },
    {
      id: 2,
      type: 'meeting',
      date: '2026-03-15T06:00:00.000Z',
      notes: '产品评审会议',
      contact_name: '李四',
      deal_title: '网站重构',
    },
    {
      id: 3,
      type: 'email',
      date: '2026-03-14T09:00:00.000Z',
      notes: '发送报价单',
      contact_name: '王五',
    },
    {
      id: 4,
      type: 'note',
      date: '2026-03-14T16:00:00.000Z',
      notes: '记录客户反馈',
      deal_title: '年度维护合同',
    },
    {
      id: 5,
      type: 'other',
      date: '2026-03-13T11:00:00.000Z',
      notes: '其他活动',
      contact_name: '赵六',
      deal_title: '咨询项目',
    },
  ];

  describe('基础渲染', () => {
    test('应该渲染活动列表', () => {
      render(<ActivityTimeline activities={mockActivities} />);

      // 检查活动类型翻译键（实际渲染的是翻译后的文本）
      expect(screen.getByText('通话')).toBeInTheDocument();
      expect(screen.getByText('会议')).toBeInTheDocument();
      expect(screen.getByText('邮件')).toBeInTheDocument();
      expect(screen.getByText('备注')).toBeInTheDocument();

      // 检查活动备注
      expect(screen.getByText('与客户讨论项目需求')).toBeInTheDocument();
      expect(screen.getByText('产品评审会议')).toBeInTheDocument();
      expect(screen.getByText('发送报价单')).toBeInTheDocument();
      expect(screen.getByText('记录客户反馈')).toBeInTheDocument();
      expect(screen.getByText('其他活动')).toBeInTheDocument();
    });

    test('应该显示时间信息', () => {
      render(<ActivityTimeline activities={mockActivities} />);

      // 检查日期分组标题（使用 toLocaleDateString 格式）
      expect(screen.getByText('3/15/2026')).toBeInTheDocument();
      expect(screen.getByText('3/14/2026')).toBeInTheDocument();
      expect(screen.getByText('3/13/2026')).toBeInTheDocument();

      // 检查时间显示（toLocaleTimeString 格式）
      expect(screen.getByText('10:00 AM')).toBeInTheDocument();
      expect(screen.getByText('02:00 PM')).toBeInTheDocument();
      expect(screen.getByText('05:00 PM')).toBeInTheDocument();
      expect(screen.getByText('12:00 AM')).toBeInTheDocument();
      expect(screen.getByText('07:00 PM')).toBeInTheDocument();
    });
  });

  describe('活动类型图标', () => {
    test('应该显示通话图标 📞', () => {
      const callActivity = [
        { id: 1, type: 'call', date: '2026-03-15T02:00:00.000Z' },
      ];
      render(<ActivityTimeline activities={callActivity} />);

      expect(screen.getByText('📞')).toBeInTheDocument();
    });

    test('应该显示会议图标 🤝', () => {
      const meetingActivity = [
        { id: 1, type: 'meeting', date: '2026-03-15T02:00:00.000Z' },
      ];
      render(<ActivityTimeline activities={meetingActivity} />);

      expect(screen.getByText('🤝')).toBeInTheDocument();
    });

    test('应该显示邮件图标 📧', () => {
      const emailActivity = [
        { id: 1, type: 'email', date: '2026-03-15T02:00:00.000Z' },
      ];
      render(<ActivityTimeline activities={emailActivity} />);

      expect(screen.getByText('📧')).toBeInTheDocument();
    });

    test('应该显示备注图标 📝', () => {
      const noteActivity = [
        { id: 1, type: 'note', date: '2026-03-15T02:00:00.000Z' },
      ];
      render(<ActivityTimeline activities={noteActivity} />);

      expect(screen.getByText('📝')).toBeInTheDocument();
    });

    test('应该显示其他图标 📌', () => {
      const otherActivity = [
        { id: 1, type: 'other', date: '2026-03-15T02:00:00.000Z' },
      ];
      render(<ActivityTimeline activities={otherActivity} />);

      expect(screen.getByText('📌')).toBeInTheDocument();
    });
  });

  describe('按日期分组', () => {
    test('应该按日期分组活动', () => {
      const { container } = render(<ActivityTimeline activities={mockActivities} />);

      // 获取所有日期标题（使用 container.querySelector）
      const dateHeaders = container.querySelectorAll('.timeline-date-header');

      // 应该有三个不同的日期
      expect(dateHeaders.length).toBe(3);

      // 检查日期顺序（应该是从新到旧）
      expect(dateHeaders[0]).toHaveTextContent('3/15/2026');
      expect(dateHeaders[1]).toHaveTextContent('3/14/2026');
      expect(dateHeaders[2]).toHaveTextContent('3/13/2026');
    });

    test('同一日期的活动应该在一组', () => {
      const sameDayActivities = [
        { id: 1, type: 'call', date: '2026-03-15T02:00:00.000Z', notes: '上午通话' },
        { id: 2, type: 'meeting', date: '2026-03-15T06:00:00.000Z', notes: '下午会议' },
        { id: 3, type: 'email', date: '2026-03-15T08:00:00.000Z', notes: '傍晚邮件' },
      ];
      const { container } = render(<ActivityTimeline activities={sameDayActivities} />);

      // 应该只有一个日期标题
      const dateHeaders = container.querySelectorAll('.timeline-date-header');
      expect(dateHeaders.length).toBe(1);
      expect(dateHeaders[0]).toHaveTextContent('3/15/2026');

      // 所有三个活动备注都应该显示
      expect(screen.getByText('上午通话')).toBeInTheDocument();
      expect(screen.getByText('下午会议')).toBeInTheDocument();
      expect(screen.getByText('傍晚邮件')).toBeInTheDocument();
    });
  });

  describe('空状态', () => {
    test('空活动数组应该显示空状态', () => {
      render(<ActivityTimeline activities={[]} />);

      expect(screen.getByText('暂无活动记录，添加第一条记录吧！')).toBeInTheDocument();
    });

    test('null 活动应该显示空状态', () => {
      render(<ActivityTimeline activities={null} />);

      expect(screen.getByText('暂无活动记录，添加第一条记录吧！')).toBeInTheDocument();
    });

    test('空状态应该有正确的类名', () => {
      const { container } = render(<ActivityTimeline activities={[]} />);

      expect(container.querySelector('.empty-state')).toBeInTheDocument();
    });
  });

  describe('联系人姓名和商谈标题', () => {
    test('应该显示联系人姓名', () => {
      const activityWithContact = [
        {
          id: 1,
          type: 'call',
          date: '2026-03-15T02:00:00.000Z',
          contact_name: '张三',
        },
      ];
      render(<ActivityTimeline activities={activityWithContact} />);

      expect(screen.getByText('👤 张三')).toBeInTheDocument();
    });

    test('应该显示商谈标题', () => {
      const activityWithDeal = [
        {
          id: 1,
          type: 'meeting',
          date: '2026-03-15T02:00:00.000Z',
          deal_title: 'CRM 系统开发',
        },
      ];
      render(<ActivityTimeline activities={activityWithDeal} />);

      expect(screen.getByText('💰 CRM 系统开发')).toBeInTheDocument();
    });

    test('应该同时显示联系人姓名和商谈标题', () => {
      const activityWithBoth = [
        {
          id: 1,
          type: 'call',
          date: '2026-03-15T02:00:00.000Z',
          contact_name: '张三',
          deal_title: 'CRM 系统开发',
        },
      ];
      render(<ActivityTimeline activities={activityWithBoth} />);

      expect(screen.getByText('👤 张三')).toBeInTheDocument();
      expect(screen.getByText('💰 CRM 系统开发')).toBeInTheDocument();
    });

    test('没有联系人姓名时不应该显示联系人部分', () => {
      const activityWithoutContact = [
        {
          id: 1,
          type: 'call',
          date: '2026-03-15T02:00:00.000Z',
          deal_title: 'CRM 系统开发',
        },
      ];
      render(<ActivityTimeline activities={activityWithoutContact} />);

      expect(screen.queryByText('👤')).not.toBeInTheDocument();
    });

    test('没有商谈标题时不应该显示商谈部分', () => {
      const activityWithoutDeal = [
        {
          id: 1,
          type: 'call',
          date: '2026-03-15T02:00:00.000Z',
          contact_name: '张三',
        },
      ];
      render(<ActivityTimeline activities={activityWithoutDeal} />);

      expect(screen.queryByText('💰')).not.toBeInTheDocument();
    });
  });

  describe('DOM 结构', () => {
    test('应该有正确的容器类名', () => {
      const { container } = render(<ActivityTimeline activities={mockActivities} />);

      expect(container.querySelector('.activity-timeline')).toBeInTheDocument();
    });

    test('每个活动应该有正确的类名结构', () => {
      const { container } = render(<ActivityTimeline activities={mockActivities} />);

      expect(container.querySelectorAll('.timeline-day')).toHaveLength(3);
      expect(container.querySelectorAll('.timeline-item')).toHaveLength(5);
      expect(container.querySelectorAll('.timeline-marker')).toHaveLength(5);
      expect(container.querySelectorAll('.timeline-content')).toHaveLength(5);
    });
  });
});
