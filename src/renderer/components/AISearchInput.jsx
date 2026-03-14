import React, { useState } from 'react';
import { useToast } from './Toast';
import { useTranslation } from '../i18n';

export function AISearchInput({ value, onChange, placeholder, type = 'company' }) {
  const toast = useToast();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const result = await window.electronAPI.ai.search({
        query: searchQuery,
        type: type,
      });

      if (result.success && result.data) {
        setSearchResults([result.data]);
        setShowResults(true);
      } else {
        toast.info('未找到相关信息');
        setSearchResults([]);
      }
    } catch (error) {
      toast.error(`搜索失败：${error.message}`);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResult = (result) => {
    onChange(result);
    setShowResults(false);
    setSearchQuery('');
    setSearchResults([]);
    toast.success('已填充数据');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="ai-search-input">
      <div className="ai-search-box">
        <input
          type="text"
          className="ai-search-field"
          placeholder={placeholder || (type === 'company' ? '输入公司名搜索...' : '输入姓名搜索...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => searchResults.length > 0 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
        <button
          className="ai-search-btn"
          onClick={handleSearch}
          disabled={loading || !searchQuery.trim()}
        >
          {loading ? '搜索中...' : '🔍 AI 搜索'}
        </button>
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="ai-search-results">
          {searchResults.map((result, idx) => (
            <div key={idx} className="ai-search-result-item">
              <div className="result-header">
                <span className="result-name">{result.name || result.company_name}</span>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleSelectResult(result)}
                >
                  填充
                </button>
              </div>
              <div className="result-details">
                {result.website && (
                  <div className="result-row">
                    <span className="result-label">网站:</span>
                    <span className="result-value">{result.website}</span>
                  </div>
                )}
                {result.phone && (
                  <div className="result-row">
                    <span className="result-label">电话:</span>
                    <span className="result-value">{result.phone}</span>
                  </div>
                )}
                {result.email && (
                  <div className="result-row">
                    <span className="result-label">邮箱:</span>
                    <span className="result-value">{result.email}</span>
                  </div>
                )}
                {result.industry && (
                  <div className="result-row">
                    <span className="result-label">行业:</span>
                    <span className="result-value">{result.industry}</span>
                  </div>
                )}
                {result.address && (
                  <div className="result-row">
                    <span className="result-label">地址:</span>
                    <span className="result-value">{result.address}</span>
                  </div>
                )}
                {result.notes && (
                  <div className="result-row">
                    <span className="result-label">简介:</span>
                    <span className="result-value">{result.notes}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
