import { useState, useCallback } from 'react';
import { useToast } from '../components';

/**
 * 删除确认 Hook - 统一处理删除确认逻辑和 Toast 反馈
 * @param {Function} deleteFn - 删除函数，接收 id 参数
 * @param {Object} options - 配置选项
 * @param {string} options.successMessage - 成功消息
 * @param {string} options.errorMessage - 错误消息前缀
 * @param {Function} options.onReload - 删除成功后的回调（如重新加载数据）
 * @returns {Object} - showConfirmModal, selectedId, handleDelete, confirmDelete, CancelModal, ConfirmModalComponent
 */
export function useDeleteConfirmation(deleteFn, options = {}) {
  const { successMessage = '删除成功', errorMessage = '删除失败', onReload } = options;

  const toast = useToast();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [pendingData, setPendingData] = useState(null);

  const handleDelete = useCallback((id, data = null) => {
    setSelectedId(id);
    setPendingData(data);
    setShowConfirmModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!selectedId) return;

    try {
      await deleteFn(selectedId, pendingData);
      toast.success(successMessage);
      setShowConfirmModal(false);
      setSelectedId(null);
      setPendingData(null);
      onReload?.();
    } catch (error) {
      toast.error(`${errorMessage}: ${error.message}`);
      throw error;
    }
  }, [selectedId, pendingData, deleteFn, successMessage, errorMessage, onReload, toast]);

  const cancelDelete = useCallback(() => {
    setShowConfirmModal(false);
    setSelectedId(null);
    setPendingData(null);
  }, []);

  const ConfirmModalComponent = useCallback(({ title, message, confirmText, cancelText }) => (
    <ConfirmModal
      isOpen={showConfirmModal}
      title={title}
      message={message}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={confirmDelete}
      onCancel={cancelDelete}
    />
  ), [showConfirmModal, confirmDelete, cancelDelete]);

  return {
    showConfirmModal,
    selectedId,
    handleDelete,
    confirmDelete,
    cancelDelete,
    ConfirmModalComponent,
  };
}
