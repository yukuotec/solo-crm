import React, { useState, useEffect, useRef } from 'react';

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ contacts: [], companies: [], deals: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setResults({ contacts: [], companies: [], deals: [] });
        return;
      }

      setLoading(true);
      try {
        const [contacts, companies, deals] = await Promise.all([
          window.electronAPI.db.getContacts().then(all =>
            all.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) ||
                          c.email?.toLowerCase().includes(query.toLowerCase()))
          ),
          window.electronAPI.db.getCompanies().then(all =>
            all.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) ||
                          c.website?.toLowerCase().includes(query.toLowerCase()))
          ),
          window.electronAPI.db.getDeals().then(all =>
            all.filter(d => d.title.toLowerCase().includes(query.toLowerCase()))
          ),
        ]);

        setResults({
          contacts: contacts.slice(0, 5),
          companies: companies.slice(0, 5),
          deals: deals.slice(0, 5),
        });
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(search, 200);
    return () => clearTimeout(debounce);
  }, [query]);

  const totalResults = results.contacts.length + results.companies.length + results.deals.length;

  return (
    <>
      <button className="global-search-trigger" onClick={() => setIsOpen(true)}>
        <span className="search-icon">🔍</span>
        <span className="search-text">Search</span>
        <kbd className="search-shortcut">⌘K</kbd>
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="global-search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                ref={inputRef}
                type="text"
                className="search-input"
                placeholder="Search contacts, companies, deals..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <kbd className="escape-hint">ESC</kbd>
            </div>

            <div className="search-results">
              {loading && <div className="search-loading">Searching...</div>}

              {!loading && query && totalResults === 0 && (
                <div className="search-empty">No results found for "{query}"</div>
              )}

              {!loading && !query && (
                <div className="search-hint">
                  <p>Type to search across contacts, companies, and deals</p>
                </div>
              )}

              {!loading && results.contacts.length > 0 && (
                <div className="search-section">
                  <div className="search-section-title">Contacts</div>
                  {results.contacts.map((contact) => (
                    <div key={contact.id} className="search-result-item">
                      <span className="result-icon">👤</span>
                      <div className="result-info">
                        <span className="result-name">{contact.name}</span>
                        {contact.email && <span className="result-meta">{contact.email}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && results.companies.length > 0 && (
                <div className="search-section">
                  <div className="search-section-title">Companies</div>
                  {results.companies.map((company) => (
                    <div key={company.id} className="search-result-item">
                      <span className="result-icon">🏢</span>
                      <div className="result-info">
                        <span className="result-name">{company.name}</span>
                        {company.website && <span className="result-meta">{company.website}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && results.deals.length > 0 && (
                <div className="search-section">
                  <div className="search-section-title">Deals</div>
                  {results.deals.map((deal) => (
                    <div key={deal.id} className="search-result-item">
                      <span className="result-icon">💰</span>
                      <div className="result-info">
                        <span className="result-name">{deal.title}</span>
                        <span className="result-meta">
                          ${deal.value?.toLocaleString()} • {deal.stage}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
