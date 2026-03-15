import { useState, useEffect, useRef, useCallback } from 'react';

const SEARCH_HISTORY_KEY = 'solo-crm-search-history';
const MAX_HISTORY = 10;

function getSearchHistory() {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToHistory(query) {
  try {
    const history = getSearchHistory().filter(h => h !== query);
    history.unshift(query);
    if (history.length > MAX_HISTORY) history.pop();
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Ignore localStorage errors
  }
}

function clearSearchHistory() {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * 搜索 Hook - 提供带防抖的搜索功能和历史记录管理
 * @param {Function} searchFn - 搜索函数，接收查询字符串返回 Promise
 * @param {Object} options - 配置选项
 * @param {number} options.debounceMs - 防抖毫秒数 (默认 200)
 * @param {boolean} options.enableHistory - 是否启用历史记录 (默认 true)
 * @returns {Object} - query, setQuery, results, loading, history, handleClearHistory, handleAddToHistory
 */
export function useSearch(searchFn, options = {}) {
  const { debounceMs = 200, enableHistory = true } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(enableHistory ? getSearchHistory() : []);

  const debounceRef = useRef(null);
  const queryRef = useRef(query);
  queryRef.current = query;

  const handleClearHistory = useCallback(() => {
    if (!enableHistory) return;
    clearSearchHistory();
    setHistory([]);
  }, [enableHistory]);

  const handleAddToHistory = useCallback(() => {
    if (!enableHistory) return;
    const trimmedQuery = queryRef.current.trim();
    if (trimmedQuery) {
      saveToHistory(trimmedQuery);
      setHistory(getSearchHistory());
    }
  }, [enableHistory]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const searchResults = await searchFn(query);
        setResults(searchResults);

        // 自动保存到历史记录
        if (enableHistory && query.trim()) {
          saveToHistory(query.trim());
          setHistory(getSearchHistory());
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, debounceMs, searchFn, enableHistory]);

  const resetQuery = () => {
    setQuery('');
    setResults([]);
  };

  return {
    query,
    setQuery,
    results,
    loading,
    history,
    handleClearHistory,
    handleAddToHistory,
    resetQuery,
  };
}
