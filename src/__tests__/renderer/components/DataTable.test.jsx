/**
 * DataTable 组件测试
 * 测试 DataTable 表格组件的功能
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from 'src/renderer/components/DataTable';

describe('DataTable', () => {
  const mockColumns = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: '姓名' },
    { key: 'email', title: '邮箱' },
  ];

  const mockData = [
    { id: 1, name: '张三', email: 'zhangsan@example.com' },
    { id: 2, name: '李四', email: 'lisi@example.com' },
    { id: 3, name: '王五', email: 'wangwu@example.com' },
  ];

  describe('基础渲染', () => {
    test('应该渲染基础表格', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);

      // 检查表头
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('姓名')).toBeInTheDocument();
      expect(screen.getByText('邮箱')).toBeInTheDocument();

      // 检查数据行
      expect(screen.getByText('张三')).toBeInTheDocument();
      expect(screen.getByText('李四')).toBeInTheDocument();
      expect(screen.getByText('王五')).toBeInTheDocument();

      // 检查邮箱
      expect(screen.getByText('zhangsan@example.com')).toBeInTheDocument();
      expect(screen.getByText('lisi@example.com')).toBeInTheDocument();
      expect(screen.getByText('wangwu@example.com')).toBeInTheDocument();
    });

    test('应该使用 render 函数渲染单元格', () => {
      const columnsWithRender = [
        {
          key: 'name',
          title: '姓名',
          render: (row) => `${row.name} (${row.id})`,
        },
      ];

      render(<DataTable columns={columnsWithRender} data={mockData} />);

      expect(screen.getByText('张三 (1)')).toBeInTheDocument();
      expect(screen.getByText('李四 (2)')).toBeInTheDocument();
      expect(screen.getByText('王五 (3)')).toBeInTheDocument();
    });
  });

  describe('排序功能', () => {
    test('点击列标题应该切换排序方向（升序→降序）', () => {
      render(
        <DataTable columns={mockColumns} data={mockData} sortable={true} />
      );

      const nameHeader = screen.getByText('姓名');

      // 初始点击，升序
      fireEvent.click(nameHeader);
      expect(nameHeader).toContainElement(screen.getByText('↑'));

      // 再次点击，降序
      fireEvent.click(nameHeader);
      expect(nameHeader).toContainElement(screen.getByText('↓'));

      // 再次点击，回到升序
      fireEvent.click(nameHeader);
      expect(nameHeader).toContainElement(screen.getByText('↑'));
    });

    test('排序后数据应该正确排列', () => {
      const unsortedData = [
        { id: 1, name: '王五', email: 'wangwu@example.com' },
        { id: 2, name: '张三', email: 'zhangsan@example.com' },
        { id: 3, name: '李四', email: 'lisi@example.com' },
      ];

      render(<DataTable columns={mockColumns} data={unsortedData} />);

      const nameHeader = screen.getByText('姓名');

      // 点击按姓名升序
      fireEvent.click(nameHeader);

      // 检查表格内容顺序（升序应该是：张三、李四、王五）
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('张三');
      expect(rows[2]).toHaveTextContent('李四');
      expect(rows[3]).toHaveTextContent('王五');
    });

    test('不可排序的列点击不应该触发排序', () => {
      const columnsWithUnsortable = [
        { key: 'id', title: 'ID', sortable: false },
        { key: 'name', title: '姓名' },
      ];

      render(
        <DataTable columns={columnsWithUnsortable} data={mockData} sortable={true} />
      );

      const idHeader = screen.getByText('ID');
      const nameHeader = screen.getByText('姓名');

      // 点击不可排序的列
      fireEvent.click(idHeader);
      // 不应该有排序指示器
      expect(idHeader.querySelector('.sort-indicator')).not.toBeInTheDocument();

      // 点击可排序的列
      fireEvent.click(nameHeader);
      expect(nameHeader).toContainElement(screen.getByText('↑'));
    });

    test('sortable=false 时点击列标题不应该排序', () => {
      render(
        <DataTable columns={mockColumns} data={mockData} sortable={false} />
      );

      const nameHeader = screen.getByText('姓名');
      fireEvent.click(nameHeader);

      // 不应该有排序指示器
      expect(nameHeader.querySelector('.sort-indicator')).not.toBeInTheDocument();
    });
  });

  describe('分页功能', () => {
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `用户 ${i + 1}`,
      email: `user${i + 1}@example.com`,
    }));

    test('下一页按钮应该切换到下一页', () => {
      render(
        <DataTable columns={mockColumns} data={largeData} pageSize={10} paginate={true} />
      );

      // 检查当前页显示
      expect(screen.getByText('第 1 / 3 页（共 25 条）')).toBeInTheDocument();
      expect(screen.getByText('用户 1')).toBeInTheDocument();

      // 点击下一页
      fireEvent.click(screen.getByText('下一页'));

      expect(screen.getByText('第 2 / 3 页（共 25 条）')).toBeInTheDocument();
      expect(screen.getByText('用户 11')).toBeInTheDocument();
    });

    test('上一页按钮应该切换到上一页', () => {
      render(
        <DataTable columns={mockColumns} data={largeData} pageSize={10} paginate={true} />
      );

      // 先切换到第 2 页
      fireEvent.click(screen.getByText('下一页'));
      expect(screen.getByText('第 2 / 3 页（共 25 条）')).toBeInTheDocument();

      // 点击上一页
      fireEvent.click(screen.getByText('上一页'));

      expect(screen.getByText('第 1 / 3 页（共 25 条）')).toBeInTheDocument();
    });

    test('第一页时上一页按钮应该被禁用', () => {
      render(
        <DataTable columns={mockColumns} data={largeData} pageSize={10} paginate={true} />
      );

      const prevButton = screen.getByText('上一页');
      expect(prevButton).toBeDisabled();
    });

    test('最后一页时下一页按钮应该被禁用', () => {
      render(
        <DataTable columns={mockColumns} data={largeData} pageSize={10} paginate={true} />
      );

      // 切换到最后一页
      fireEvent.click(screen.getByText('下一页'));
      fireEvent.click(screen.getByText('下一页'));

      const nextButton = screen.getByText('下一页');
      expect(nextButton).toBeDisabled();
    });

    test('paginate=false 时不应该渲染分页控件', () => {
      render(
        <DataTable columns={mockColumns} data={largeData} paginate={false} />
      );

      expect(screen.queryByText('下一页')).not.toBeInTheDocument();
      expect(screen.queryByText('上一页')).not.toBeInTheDocument();
    });

    test('数据不足一页时不应该渲染分页控件', () => {
      render(
        <DataTable columns={mockColumns} data={mockData} pageSize={10} paginate={true} />
      );

      expect(screen.queryByText('下一页')).not.toBeInTheDocument();
      expect(screen.queryByText('上一页')).not.toBeInTheDocument();
    });
  });

  describe('空状态', () => {
    test('空数据应该显示空状态', () => {
      render(<DataTable columns={mockColumns} data={[]} />);

      expect(screen.getByText('暂无数据')).toBeInTheDocument();
    });

    test('空状态应该有正确的类名', () => {
      const { container } = render(
        <DataTable columns={mockColumns} data={[]} />
      );

      expect(container.querySelector('.empty-state')).toBeInTheDocument();
    });
  });
});
