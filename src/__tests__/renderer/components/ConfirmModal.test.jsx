/**
 * ConfirmModal 组件测试
 * 测试确认对话框组件的功能
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConfirmModal } from 'src/renderer/components/ConfirmModal';

describe('ConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    title: '确认删除',
    message: '确定要删除这个项目吗？此操作无法撤销。',
    confirmText: '确定',
    cancelText: '取消',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  describe('渲染', () => {
    test('应该渲染确认对话框', () => {
      render(<ConfirmModal {...defaultProps} />);

      expect(screen.getByText('确认删除')).toBeInTheDocument();
      expect(screen.getByText('确定要删除这个项目吗？此操作无法撤销。')).toBeInTheDocument();
    });

    test('当 isOpen 为 false 时不应该渲染对话框', () => {
      render(<ConfirmModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByText('确认删除')).not.toBeInTheDocument();
    });

    test('应该渲染取消按钮', () => {
      render(<ConfirmModal {...defaultProps} />);

      expect(screen.getByText('取消')).toBeInTheDocument();
    });

    test('应该渲染确认按钮', () => {
      render(<ConfirmModal {...defaultProps} />);

      expect(screen.getByText('确定')).toBeInTheDocument();
    });

    test('未提供标题时应该使用默认标题', () => {
      render(<ConfirmModal {...defaultProps} title={undefined} />);

      expect(screen.getByText('确认')).toBeInTheDocument();
    });

    test('未提供取消按钮文本时应该使用默认文本', () => {
      render(<ConfirmModal {...defaultProps} cancelText={undefined} />);

      expect(screen.getByText('取消')).toBeInTheDocument();
    });

    test('未提供确认按钮文本时应该使用默认文本', () => {
      render(<ConfirmModal {...defaultProps} confirmText={undefined} />);

      expect(screen.getByText('删除')).toBeInTheDocument();
    });

    test('对话框应该有正确的 role 属性', () => {
      render(<ConfirmModal {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('按钮交互', () => {
    test('点击取消按钮应该触发 onCancel', () => {
      const onCancel = jest.fn();
      render(<ConfirmModal {...defaultProps} onCancel={onCancel} />);

      fireEvent.click(screen.getByText('取消'));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    test('点击确认按钮应该触发 onConfirm', () => {
      const onConfirm = jest.fn();
      render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} />);

      fireEvent.click(screen.getByText('确定'));

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    test('点击确认按钮后 onConfirm 应该只触发一次', () => {
      const onConfirm = jest.fn();
      render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} />);

      fireEvent.click(screen.getByText('确定'));
      fireEvent.click(screen.getByText('确定'));

      expect(onConfirm).toHaveBeenCalledTimes(2);
    });

    test('关闭按钮（×）点击应该触发 onCancel', () => {
      const onCancel = jest.fn();
      render(<ConfirmModal {...defaultProps} onCancel={onCancel} />);

      fireEvent.click(screen.getByText('×'));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('键盘交互', () => {
    test('按 ESC 键应该触发 onCancel', () => {
      const onCancel = jest.fn();
      render(<ConfirmModal {...defaultProps} onCancel={onCancel} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    test('对话框关闭后 ESC 键不应该触发事件', () => {
      const onCancel = jest.fn();
      const { rerender } = render(
        <ConfirmModal {...defaultProps} isOpen={false} onCancel={onCancel} />
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onCancel).not.toHaveBeenCalled();
    });

    test('多个 ESC 键按下应该每次都触发 onCancel', () => {
      const onCancel = jest.fn();
      render(<ConfirmModal {...defaultProps} onCancel={onCancel} />);

      fireEvent.keyDown(document, { key: 'Escape' });
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onCancel).toHaveBeenCalledTimes(2);
    });
  });

  describe('遮罩层交互', () => {
    test('点击遮罩层应该触发 onCancel', () => {
      const onCancel = jest.fn();
      render(<ConfirmModal {...defaultProps} onCancel={onCancel} />);

      const overlay = document.querySelector('.modal-overlay');
      fireEvent.click(overlay);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    test('点击 Modal 内容不应该触发 onCancel', () => {
      const onCancel = jest.fn();
      render(<ConfirmModal {...defaultProps} onCancel={onCancel} />);

      const modal = document.querySelector('.modal');
      fireEvent.click(modal);

      expect(onCancel).not.toHaveBeenCalled();
    });

    test('点击对话框头部不应该触发 onCancel', () => {
      const onCancel = jest.fn();
      render(<ConfirmModal {...defaultProps} onCancel={onCancel} />);

      const header = document.querySelector('.modal-header');
      fireEvent.click(header);

      expect(onCancel).not.toHaveBeenCalled();
    });

    test('点击对话框主体不应该触发 onCancel', () => {
      const onCancel = jest.fn();
      render(<ConfirmModal {...defaultProps} onCancel={onCancel} />);

      const body = document.querySelector('.modal-body');
      fireEvent.click(body);

      expect(onCancel).not.toHaveBeenCalled();
    });

    test('点击对话框底部不应该触发 onCancel', () => {
      const onCancel = jest.fn();
      render(<ConfirmModal {...defaultProps} onCancel={onCancel} />);

      const footer = document.querySelector('.modal-footer');
      fireEvent.click(footer);

      expect(onCancel).not.toHaveBeenCalled();
    });
  });

  describe('自定义文本', () => {
    test('应该支持自定义确认按钮文本', () => {
      render(<ConfirmModal {...defaultProps} confirmText="立即删除" />);

      expect(screen.getByText('立即删除')).toBeInTheDocument();
    });

    test('应该支持自定义取消按钮文本', () => {
      render(<ConfirmModal {...defaultProps} cancelText="稍后再说" />);

      expect(screen.getByText('稍后再说')).toBeInTheDocument();
    });

    test('应该支持自定义消息内容', () => {
      render(
        <ConfirmModal
          {...defaultProps}
          message="这是一条自定义消息"
        />
      );

      expect(screen.getByText('这是一条自定义消息')).toBeInTheDocument();
    });
  });

  describe('无障碍功能', () => {
    test('对话框应该具有 aria-modal 属性', () => {
      render(<ConfirmModal {...defaultProps} />);

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });
  });
});
