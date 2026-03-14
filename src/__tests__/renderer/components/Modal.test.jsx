/**
 * Modal 组件测试
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal, ConfirmModal } from 'src/renderer/components/Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: '测试标题',
    children: <div data-testid="modal-content">测试内容</div>,
  };

  describe('渲染', () => {
    test('当 isOpen 为 true 时应该渲染 Modal', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByText('测试标题')).toBeInTheDocument();
    });

    test('当 isOpen 为 false 时不应该渲染 Modal', () => {
      render(<Modal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('测试标题')).not.toBeInTheDocument();
    });

    test('应该渲染关闭按钮', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByText('×')).toBeInTheDocument();
    });
  });

  describe('交互', () => {
    test('点击关闭按钮应该调用 onClose', () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      screen.getByText('×').click();
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('点击遮罩层应该调用 onClose', () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} onClose={onClose} />);
      const overlay = document.querySelector('.modal-overlay');
      fireEvent.click(overlay);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('点击 Modal 内容不应该调用 onClose', () => {
      const onClose = jest.fn();
      render(<Modal {...defaultProps} />);
      const content = screen.getByTestId('modal-content');
      fireEvent.click(content);
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('尺寸', () => {
    test('应该支持小尺寸', () => {
      render(<Modal {...defaultProps} size="sm" />);
      expect(document.querySelector('.modal-sm')).toBeInTheDocument();
    });

    test('应该支持大尺寸', () => {
      render(<Modal {...defaultProps} size="lg" />);
      expect(document.querySelector('.modal-lg')).toBeInTheDocument();
    });
  });
});

describe('ConfirmModal', () => {
  const defaultConfirmProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: '确认删除',
    message: '确定要删除吗？',
  };

  describe('渲染', () => {
    test('应该渲染确认对话框', () => {
      render(<ConfirmModal {...defaultConfirmProps} />);
      expect(screen.getByText('确认删除')).toBeInTheDocument();
    });

    test('应该渲染取消按钮', () => {
      render(<ConfirmModal {...defaultConfirmProps} />);
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    test('应该渲染确认按钮', () => {
      render(<ConfirmModal {...defaultConfirmProps} confirmText="确定" />);
      expect(screen.getByText('确定')).toBeInTheDocument();
    });
  });

  describe('交互', () => {
    test('点击取消按钮应该调用 onClose', () => {
      const onClose = jest.fn();
      render(<ConfirmModal {...defaultConfirmProps} onClose={onClose} />);
      screen.getByText('Cancel').click();
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('点击确认按钮应该调用 onConfirm 和 onClose', () => {
      const onConfirm = jest.fn();
      const onClose = jest.fn();
      render(<ConfirmModal {...defaultConfirmProps} onConfirm={onConfirm} onClose={onClose} />);
      screen.getByText('Confirm').click();
      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
