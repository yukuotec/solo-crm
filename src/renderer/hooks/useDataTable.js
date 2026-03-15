import { useState, useMemo } from 'react';

/**
 * 数据表格 Hook - 提供排序和分页功能
 * @param {Array} data - 原始数据数组
 * @param {Object} options - 配置选项
 * @param {boolean} options.sortable - 是否启用排序 (默认 true)
 * @param {boolean} options.paginate - 是否启用分页 (默认 true)
 * @param {number} options.pageSize - 每页大小 (默认 10)
 * @returns {Object} - sortedData, paginatedData, sortConfig, currentPage, totalPages, handleSort, nextPage, prevPage
 */
export function useDataTable(data, options = {}) {
  const { sortable = true, paginate = true, pageSize = 10 } = options;

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    if (!paginate) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, paginate]);

  const totalPages = useMemo(() => {
    return Math.ceil(data.length / pageSize);
  }, [data.length, pageSize]);

  const handleSort = (key) => {
    if (!sortable) return;
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const nextPage = () => {
    if (!paginate) return;
    setCurrentPage(p => Math.min(p + 1, totalPages));
  };

  const prevPage = () => {
    if (!paginate) return;
    setCurrentPage(p => Math.max(p - 1, 1));
  };

  const resetPage = () => setCurrentPage(1);

  return {
    sortedData,
    paginatedData,
    sortConfig,
    currentPage,
    totalPages,
    handleSort,
    nextPage,
    prevPage,
    resetPage,
    setSortConfig,
    setCurrentPage,
  };
}
