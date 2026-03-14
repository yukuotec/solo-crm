/**
 * Toast 组件测试
 * 测试 Toast 通知组件的功能
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ToastProvider, useToast, ToastItem } from 'src/renderer/components/Toast';

// 测试用组件
function TestComponent({ action }) {
  const toast = useToast();

  React.useEffect(() => {
    if (action) {
      action(toast);
    }
  }, [action]);

  return <div data-testid="test-component">Test</div>;
}

describe('Toast', () => {
  describe('ToastProvider', () => {
    test('应该渲染 ToastProvider', () => {
      render(
        <ToastProvider>
          <div>Children</div>
        </ToastProvider>
      );

      expect(screen.getByText('Children')).toBeInTheDocument();
    });

    test('应该提供 toast context', () => {
      const mockCallback = jest.fn();

      render(
        <ToastProvider>
          <TestComponent action={(toast) => {
            mockCallback(toast);
          }} />
        </ToastProvider>
      );

      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          success: expect.any(Function),
          error: expect.any(Function),
          info: expect.any(Function),
          warning: expect.any(Function),
          remove: expect.any(Function),
        })
      );
    });

    test('useToast 在 ToastProvider 外使用应该抛出错误', () => {
      // 创建一个不在 provider 内使用 useToast 的组件
      function BrokenComponent() {
        try {
          useToast();
          return <div>OK</div>;
        } catch (e) {
          return <div>Error</div>;
        }
      }

      render(<BrokenComponent />);
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });

  describe('toast 方法', () => {
    test('toast.success 应该添加成功类型的 toast', () => {
      render(
        <ToastProvider>
          <TestComponent action={(toast) => {
            toast.success('操作成功');
          }} />
        </ToastProvider>
      );

      expect(screen.getByText('操作成功')).toBeInTheDocument();
      expect(document.querySelector('.toast-success')).toBeInTheDocument();
    });

    test('toast.error 应该添加错误类型的 toast', () => {
      render(
        <ToastProvider>
          <TestComponent action={(toast) => {
            toast.error('操作失败');
          }} />
        </ToastProvider>
      );

      expect(screen.getByText('操作失败')).toBeInTheDocument();
      expect(document.querySelector('.toast-error')).toBeInTheDocument();
    });

    test('toast.info 应该添加信息类型的 toast', () => {
      render(
        <ToastProvider>
          <TestComponent action={(toast) => {
            toast.info('提示信息');
          }} />
        </ToastProvider>
      );

      expect(screen.getByText('提示信息')).toBeInTheDocument();
      expect(document.querySelector('.toast-info')).toBeInTheDocument();
    });

    test('toast.warning 应该添加警告类型的 toast', () => {
      render(
        <ToastProvider>
          <TestComponent action={(toast) => {
            toast.warning('警告信息');
          }} />
        </ToastProvider>
      );

      expect(screen.getByText('警告信息')).toBeInTheDocument();
      expect(document.querySelector('.toast-warning')).toBeInTheDocument();
    });

    test('toast 应该在指定时间后自动消失', async () => {
      render(
        <ToastProvider>
          <TestComponent action={(toast) => {
            toast.info('自动消失', 100);
          }} />
        </ToastProvider>
      );

      expect(screen.getByText('自动消失')).toBeInTheDocument();

      // 等待 toast 消失
      await waitFor(() => {
        expect(screen.queryByText('自动消失')).not.toBeInTheDocument();
      }, { timeout: 500 });
    });

    test('toast 可以设置不自动消失', () => {
      render(
        <ToastProvider>
          <TestComponent action={(toast) => {
            toast.info('不自动消失', 0);
          }} />
        </ToastProvider>
      );

      expect(screen.getByText('不自动消失')).toBeInTheDocument();
    });
  });


});

