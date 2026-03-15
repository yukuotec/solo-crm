import { useToast } from '../components';

/**
 * API Toast Hook - 统一处理 API 调用的 Toast 反馈
 * @returns {Function} wrap - 包装函数，接收 async fn 和 messages 对象
 *
 * @example
 * const apiToast = useApiToast();
 * const result = await apiToast(
 *   () => window.electronAPI.db.createContact(data),
 *   { success: '创建成功', error: '创建失败' }
 * );
 */
export function useApiToast() {
  const toast = useToast();

  const wrap = async (fn, messages = {}) => {
    try {
      const result = await fn();
      if (messages.success) {
        toast.success(messages.success);
      }
      return result;
    } catch (error) {
      const errorMsg = messages.error || '操作失败';
      toast.error(`${errorMsg}: ${error.message}`);
      throw error;
    }
  };

  const wrapWithConfirm = async (fn, messages = {}) => {
    try {
      const result = await fn();
      if (messages.success) {
        toast.success(messages.success);
      }
      return { success: true, data: result };
    } catch (error) {
      const errorMsg = messages.error || '操作失败';
      toast.error(`${errorMsg}: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  return {
    wrap,
    wrapWithConfirm,
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    info: (message) => toast.info(message),
    warning: (message) => toast.warning(message),
  };
}
