import React, { useEffect, useState } from 'react';
import { logger } from './logger';
import { ToastProvider, useToast, GlobalSearch, Modal, ErrorBoundary, useTranslation, LanguageSwitcher, LocaleProvider, ImportDialog, AISearchInput, ActivityList, ConfirmModal } from './components';
import { useContactStore, useCompanyStore, useDealStore, useTaskStore, useActivityStore } from '../shared/store';

function AppContent() {
  const { t } = useTranslation();
  const [appInfo, setAppInfo] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [companyViewMode, setCompanyViewMode] = useState('table');
  const toast = useToast();

  const { contacts, loadContacts, createContact: storeCreateContact } = useContactStore();
  const { companies, loadCompanies, createCompany: storeCreateCompany } = useCompanyStore();
  const { deals, loadDeals, loadPipelineSummary, pipelineSummary } = useDealStore();
  const { tasks, loadTasks, upcomingTasks, loadUpcomingTasks } = useTaskStore();
  const { activities, loadActivities, createActivity, deleteActivity } = useActivityStore();

  useEffect(() => {
    logger.info('App mounted, fetching app info...');

    window.electronAPI
      .getAppInfo()
      .then((info) => {
        logger.info('App info received', info);
        setAppInfo(info);
      })
      .catch((err) => {
        logger.error('Failed to get app info', err);
        setError(err.message);
      });

    loadContacts();
    loadCompanies();
    loadDeals();
    loadPipelineSummary();
    loadTasks();
    loadUpcomingTasks(7);
    loadActivities();
  }, []);

  if (error) {
    return (
      <div className="app-error">
        <h1>{t('app.error')}</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!appInfo) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>{t('app.loading')}</p>
      </div>
    );
  }

  const stats = {
    totalContacts: contacts.length,
    totalCompanies: companies.length,
    totalDeals: deals.length,
    totalTasks: tasks.filter((t) => t.status === 'pending').length,
  };

  const totalPipelineValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} stats={stats} appInfo={appInfo} t={t} />

      <main className="app-main">
        <div className="module-header" style={{ marginBottom: '1rem' }}>
          <GlobalSearch />
        </div>

        {activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            pipelineSummary={pipelineSummary}
            upcomingTasks={upcomingTasks}
            totalPipelineValue={totalPipelineValue}
            deals={deals}
            t={t}
          />
        )}

        {activeTab === 'contacts' && (
          <ContactsView contacts={contacts} onLoad={loadContacts} toast={toast} t={t} />
        )}

        {activeTab === 'companies' && (
          <CompaniesView
            companies={companies}
            onLoad={loadCompanies}
            toast={toast}
            t={t}
            viewMode={companyViewMode}
            onViewModeChange={setCompanyViewMode}
          />
        )}

        {activeTab === 'deals' && (
          <DealsView deals={deals} onLoad={loadDeals} toast={toast} t={t} />
        )}

        {activeTab === 'tasks' && (
          <TasksView tasks={tasks} onLoad={loadTasks} toast={toast} t={t} />
        )}
        {activeTab === 'activities' && (
          <ActivitiesView activities={activities} onLoad={loadActivities} toast={toast} t={t} />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LocaleProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </LocaleProvider>
    </ErrorBoundary>
  );
}

function Sidebar({ activeTab, setActiveTab, stats, appInfo, t }) {
  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: '📊' },
    { id: 'contacts', label: t('nav.contacts'), icon: '👥' },
    { id: 'companies', label: t('nav.companies'), icon: '🏢' },
    { id: 'deals', label: t('nav.deals'), icon: '💰' },
    { id: 'tasks', label: t('nav.tasks'), icon: '✅' },
    { id: 'activities', label: t('nav.activities'), icon: '📋' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Solo CRM</h1>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.id === 'contacts' && stats.totalContacts > 0 && (
              <span className="nav-count">{stats.totalContacts}</span>
            )}
            {item.id === 'tasks' && stats.totalTasks > 0 && (
              <span className="nav-count">{stats.totalTasks}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="footer-content">
          <LanguageSwitcher />
          <span className="version">v{appInfo?.version || '0.1.0'}</span>
        </div>
      </div>
    </aside>
  );
}

function Dashboard({ stats, pipelineSummary, upcomingTasks, totalPipelineValue, deals, t }) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const newDealsThisMonth = deals.filter((deal) => {
    const dealDate = new Date(deal.created_at || deal.close_date);
    return dealDate.getMonth() === currentMonth && dealDate.getFullYear() === currentYear;
  });
  const newDealsValue = newDealsThisMonth.reduce((sum, deal) => sum + (deal.value || 0), 0);

  const closedWon = deals.filter((d) => d.stage === 'closed_won').length;
  const closedLost = deals.filter((d) => d.stage === 'closed_lost').length;
  const totalClosed = closedWon + closedLost;
  const winRate = totalClosed > 0 ? Math.round((closedWon / totalClosed) * 100) : 0;

  const avgDealSize = deals.length > 0
    ? Math.round(deals.reduce((sum, d) => sum + (d.value || 0), 0) / deals.length)
    : 0;

  const alerts = [];
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const staleDeals = deals.filter((deal) => {
    const updatedAt = new Date(deal.updated_at || deal.created_at || now);
    return updatedAt < sevenDaysAgo && !['closed_won', 'closed_lost'].includes(deal.stage);
  });

  if (staleDeals.length > 0) {
    alerts.push({
      type: 'warning',
      message: t('dashboard.staleDealsAlert', { count: staleDeals.length })
    });
  }

  const weekEnd = new Date();
  weekEnd.setDate(weekEnd.getDate() + (7 - weekEnd.getDay()) % 7);
  const closingSoon = deals.filter((deal) => {
    if (!deal.close_date) return false;
    const closeDate = new Date(deal.close_date);
    return closeDate <= weekEnd && !['closed_won', 'closed_lost'].includes(deal.stage);
  });

  if (closingSoon.length > 0) {
    alerts.push({
      type: 'info',
      message: t('dashboard.closingSoonAlert', { count: closingSoon.length })
    });
  }

  const maxValue = Math.max(...pipelineSummary.map((s) => s.count), 1);

  return (
    <div className="dashboard">
      <h2>{t('dashboard.title')}</h2>

      {alerts.length > 0 && (
        <div className="alerts-container" style={{ marginBottom: '1.5rem' }}>
          {alerts.map((alert, index) => (
            <div key={index} className={`alert alert-${alert.type}`} role="alert">
              <span className="alert-icon">{alert.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
              <span className="alert-message">{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      <div className="quick-stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="quick-stat">
          <span className="quick-stat-label">{t('dashboard.newDealsThisMonth')}</span>
          <span className="quick-stat-value">{newDealsValue > 0 ? `¥${(newDealsValue / 10000).toFixed(0)} 万` : '¥0 万'}</span>
        </div>
        <div className="quick-stat">
          <span className="quick-stat-label">{t('dashboard.winRate')}</span>
          <span className="quick-stat-value">{winRate}%</span>
        </div>
        <div className="quick-stat">
          <span className="quick-stat-label">{t('dashboard.avgDealSize')}</span>
          <span className="quick-stat-value">{avgDealSize > 0 ? `¥${(avgDealSize / 10000).toFixed(0)} 万` : '¥0 万'}</span>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title={t('dashboard.totalContacts')} value={stats.totalContacts} icon="👥" color="#3b82f6" />
        <StatCard title={t('dashboard.totalCompanies')} value={stats.totalCompanies} icon="🏢" color="#22c55e" />
        <StatCard title={t('dashboard.pipelineValue')} value={`¥${totalPipelineValue.toLocaleString()}`} icon="💰" color="#f59e0b" featured />
        <StatCard title={t('dashboard.pendingTasks')} value={stats.totalTasks} icon="✅" color="#8b5cf6" />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>{t('dashboard.funnelView')}</h3>
          {pipelineSummary.length > 0 ? (
            <div className="funnel-container">
              {pipelineSummary.map((stage) => {
                const percentage = Math.round((stage.count / maxValue) * 100);
                return (
                  <div key={stage.stage} className="funnel-item">
                    <div className="funnel-label">
                      <span className="funnel-stage-name">{translateStage(stage.stage, t)}</span>
                    </div>
                    <div className="funnel-bar-container">
                      <div
                        className="funnel-bar-fill"
                        style={{ width: `${percentage}%` }}
                        role="progressbar"
                        aria-valuenow={stage.count}
                        aria-valuemin={0}
                        aria-valuemax={maxValue}
                      />
                    </div>
                    <div className="funnel-meta">
                      <span className="funnel-count">{stage.count}</span>
                      <span className="funnel-value">¥{stage.total_value?.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState message={t('dashboard.noDeals')} />
          )}
        </div>

        <div className="dashboard-card">
          <h3>{t('dashboard.upcomingTasks')}</h3>
          {upcomingTasks.length > 0 ? (
            <div className="upcoming-tasks">
              {upcomingTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="task-item">
                  <span className={`priority-indicator priority-${task.priority}`}></span>
                  <span className="task-title">{task.title}</span>
                  <span className="task-due">{new Date(task.due_date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message={t('dashboard.noUpcomingTasks')} />
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-icon" style={{ color }}>{icon}</div>
      <div className="stat-info">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
}

function translateStage(stage, t) {
  const stageMap = {
    'lead': 'deals.stages.lead',
    'qualified': 'deals.stages.qualified',
    'proposal': 'deals.stages.proposal',
    'negotiation': 'deals.stages.negotiation',
    'closed_won': 'deals.stages.closed_won',
    'closed_lost': 'deals.stages.closed_lost',
  };
  const key = stageMap[stage];
  return key ? t(key) : stage.replace('_', ' ');
}

function ContactsView({ contacts, onLoad, toast, t }) {
  const [showModal, setShowModal] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', notes: '' });

  const handleDelete = (contact) => {
    setContactToDelete(contact);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await window.electronAPI.db.deleteContact(contactToDelete.id);
      toast.success(t('contacts.deletedSuccess'));
      setShowConfirmModal(false);
      setContactToDelete(null);
      onLoad();
    } catch (error) {
      toast.error(`${t('contacts.deleteFailed')}: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await window.electronAPI.db.createContact(formData);
      toast.success(t('contacts.createdSuccess'));
      setFormData({ name: '', email: '', phone: '', notes: '' });
      setShowModal(false);
      onLoad();
    } catch (error) {
      toast.error(`${t('contacts.createFailed')}: ${error.message}`);
    }
  };

  return (
    <div className="module-view">
      <div className="module-header">
        <h2>{t('contacts.title')}</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={() => setShowImportDialog(true)}>
            导入
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            {t('contacts.addContact')}
          </button>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={t('contacts.addContact')}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>AI 搜索</label>
            <AISearchInput
              value={formData.name}
              onChange={(result) => setFormData({ ...formData, ...result })}
              type="contact"
              placeholder="输入姓名，点击 AI 搜索自动填充..."
            />
          </div>
          <div className="form-group">
            <label>{t('contacts.name')} *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>{t('contacts.email')}</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t('contacts.phone')}</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t('contacts.notes')}</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>{t('contacts.cancel')}</button>
            <button type="submit" className="btn btn-primary">{t('contacts.saveContact')}</button>
          </div>
        </form>
      </Modal>

      <ImportDialog
        isOpen={showImportDialog}
        onClose={() => { setShowImportDialog(false); onLoad(); }}
        type="contacts"
      />

      <div className="table-container">
        {contacts.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr><th>{t('contacts.name')}</th><th>{t('contacts.email')}</th><th>{t('contacts.phone')}</th><th>{t('contacts.notes')}</th><th>操作</th></tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="font-medium">{contact.name}</td>
                  <td>{contact.email || '-'}</td>
                  <td>{contact.phone || '-'}</td>
                  <td>{contact.notes ? contact.notes.slice(0, 50) + (contact.notes.length > 50 ? '...' : '') : '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(contact)}>{t('buttons.delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState message={t('contacts.noContacts')} />
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        title={t('confirmModal.deleteTitle')}
        message={t('contacts.confirmDelete')}
        confirmText={t('buttons.delete')}
        cancelText={t('buttons.cancel')}
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
}

function CompaniesView({ companies, onLoad, toast, t, viewMode, onViewModeChange }) {
  const [showModal, setShowModal] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [formData, setFormData] = useState({ name: '', website: '', industry: '', phone: '', address: '', notes: '' });

  const handleDelete = (company) => {
    setCompanyToDelete(company);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await window.electronAPI.db.deleteCompany(companyToDelete.id);
      toast.success(t('companies.deletedSuccess'));
      setShowConfirmModal(false);
      setCompanyToDelete(null);
      onLoad();
    } catch (error) {
      toast.error(`${t('companies.deleteFailed')}: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await window.electronAPI.db.createCompany(formData);
      toast.success(t('companies.createdSuccess'));
      setFormData({ name: '', website: '', industry: '', phone: '', address: '', notes: '' });
      setShowModal(false);
      onLoad();
    } catch (error) {
      toast.error(`${t('companies.createFailed')}: ${error.message}`);
    }
  };

  return (
    <div className="module-view">
      <div className="module-header">
        <h2>{t('companies.title')}</h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => onViewModeChange('table')}
            >
              {t('companies.tableView')}
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
              onClick={() => onViewModeChange('card')}
            >
              {t('companies.cardView')}
            </button>
          </div>
          <button className="btn btn-secondary" onClick={() => setShowImportDialog(true)}>
            导入
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            {t('companies.addCompany')}
          </button>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={t('companies.addCompany')}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>AI 搜索</label>
            <AISearchInput
              value={formData.name}
              onChange={(result) => setFormData({ ...formData, ...result })}
              type="company"
              placeholder="输入公司名，点击 AI 搜索自动填充..."
            />
          </div>
          <div className="form-group">
            <label>{t('companies.name')} *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>{t('companies.website')}</label>
            <input type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t('companies.industry')}</label>
            <input type="text" value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t('companies.phone')}</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t('companies.address')}</label>
            <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t('companies.notes')}</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>{t('companies.cancel')}</button>
            <button type="submit" className="btn btn-primary">{t('companies.saveCompany')}</button>
          </div>
        </form>
      </Modal>

      <ImportDialog
        isOpen={showImportDialog}
        onClose={() => { setShowImportDialog(false); onLoad(); }}
        type="companies"
      />

      {viewMode === 'card' ? (
        <div className="company-card-grid">
          {companies.map((company) => (
            <div key={company.id} className="company-card">
              <div className="company-card-header">
                <span className="company-card-icon">🏢</span>
                <h4 className="company-card-name">{company.name}</h4>
              </div>
              <div className="company-card-meta">
                {company.industry && (
                  <span className="company-card-info">
                    <span>💼</span> {company.industry}
                  </span>
                )}
                {company.address && (
                  <span className="company-card-info">
                    <span>📍</span> {company.address.slice(0, 20)}{company.address.length > 20 ? '...' : ''}
                  </span>
                )}
              </div>
              <div className="company-card-stats">
                <div className="company-card-stat">
                  <span className="company-card-stat-label">{t('dashboard.contactsCount', { count: company.contact_count || 0 })}</span>
                  <span className="company-card-stat-value">{company.contact_count || 0}</span>
                </div>
                <div className="company-card-stat">
                  <span className="company-card-stat-label">{t('companies.dealValue')}</span>
                  <span className="company-card-stat-value" style={{ color: 'var(--success)' }}>
                    ¥{(company.total_deal_value || 0).toLocaleString()}
                  </span>
                </div>
              </div>
              {company.active_deal && (
                <div className="company-card-deal">
                  <span>💰</span>
                  <span>{t('dashboard.activeDeal')}: <strong>{company.active_deal}</strong></span>
                </div>
              )}
              <div className="company-card-actions">
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(company)}>{t('buttons.delete')}</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-container">
          {companies.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('companies.name')}</th>
                  <th>{t('companies.website')}</th>
                  <th>{t('companies.industry')}</th>
                  <th>{t('companies.phone')}</th>
                  <th>{t('companies.address')}</th>
                  <th>{t('companies.notes')}</th>
                  <th>{t('companies.contacts')}</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => {
                  const addressTruncated = company.address ? company.address.slice(0, 20) + (company.address.length > 20 ? '...' : '') : '-';
                  const notesTruncated = company.notes ? company.notes.slice(0, 30) + (company.notes.length > 30 ? '...' : '') : '-';
                  return (
                    <tr key={company.id}>
                      <td className="font-medium">{company.name}</td>
                      <td>
                        {company.website ? (
                          <a href={company.website} target="_blank" rel="noopener noreferrer" title={company.website}>
                            {company.website.length > 25 ? company.website.slice(0, 25) + '...' : company.website}
                          </a>
                        ) : '-'}
                      </td>
                      <td>{company.industry || '-'}</td>
                      <td>{company.phone || '-'}</td>
                      <td title={company.address || ''}>{addressTruncated}</td>
                      <td title={company.notes || ''}>{notesTruncated}</td>
                      <td>{company.contact_count || 0}</td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(company)}>{t('buttons.delete')}</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <EmptyState message={t('companies.noCompanies')} />
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        title={t('confirmModal.deleteTitle')}
        message={t('companies.confirmDelete')}
        confirmText={t('buttons.delete')}
        cancelText={t('buttons.cancel')}
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
}

function DealsView({ deals, onLoad, toast, t }) {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '', stage: 'lead', value: '', probability: 0, close_date: '', notes: '',
  });
  const [draggedDeal, setDraggedDeal] = useState(null);

  const handleDelete = (deal) => {
    setDealToDelete(deal);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await window.electronAPI.db.deleteDeal(dealToDelete.id);
      toast.success(t('deals.deletedSuccess'));
      setShowConfirmModal(false);
      setDealToDelete(null);
      onLoad();
    } catch (error) {
      toast.error(`${t('deals.deleteFailed')}: ${error.message}`);
    }
  };

  const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', deal.id.toString());
    e.target.style.opacity = '0.5';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    if (!draggedDeal || draggedDeal.stage === targetStage) return;
    
    try {
      await window.electronAPI.db.updateDeal(draggedDeal.id, { stage: targetStage });
      toast.success(`商谈已移动到 ${t(`deals.stages.${targetStage}`)}`);
      setDraggedDeal(null);
      onLoad();
    } catch (error) {
      toast.error(`更新失败：${error.message}`);
    }
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedDeal(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await window.electronAPI.db.createDeal({
        ...formData,
        value: parseFloat(formData.value) || 0,
        probability: parseInt(formData.probability) || 0,
        contact_id: null,
        company_id: null,
      });
      toast.success(t('deals.createdSuccess'));
      setFormData({ title: '', stage: 'lead', value: '', probability: 0, close_date: '', notes: '' });
      setShowModal(false);
      onLoad();
    } catch (error) {
      toast.error(`${t('deals.createFailed')}: ${error.message}`);
    }
  };

  const dealsByStage = {};
  stages.forEach((stage) => {
    dealsByStage[stage] = deals.filter((d) => d.stage === stage);
  });

  return (
    <div className="module-view">
      <div className="module-header">
        <h2>{t('deals.title')}</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>{t('deals.addDeal')}</button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={t('deals.addDeal')}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('deals.title')} *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>{t('deals.value')}</label>
            <input type="number" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t('deals.stage')}</label>
            <select value={formData.stage} onChange={(e) => setFormData({ ...formData, stage: e.target.value })}>
              {stages.map((s) => <option key={s} value={s}>{t(`deals.stages.${s}`)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>{t('deals.probability')}</label>
            <input type="number" min="0" max="100" value={formData.probability} onChange={(e) => setFormData({ ...formData, probability: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t('deals.closeDate')}</label>
            <input type="date" value={formData.close_date} onChange={(e) => setFormData({ ...formData, close_date: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t('deals.notes')}</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>{t('deals.cancel')}</button>
            <button type="submit" className="btn btn-primary">{t('deals.saveDeal')}</button>
          </div>
        </form>
      </Modal>

      <div className="pipeline-board">
        {stages.map((stage) => (
          <div 
            key={stage} 
            className="pipeline-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage)}
          >
            <div className="pipeline-column-header">
              <h4>{t(`deals.stages.${stage}`)}</h4>
              <span className="column-count">{dealsByStage[stage].length}</span>
            </div>
            <div className="pipeline-column-content">
              {dealsByStage[stage].map((deal) => (
                <div 
                  key={deal.id} 
                  className="deal-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, deal)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="deal-title">{deal.title}</div>
                  <div className="deal-value">¥{deal.value?.toLocaleString()}</div>
                  <button className="btn btn-sm btn-danger deal-delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(deal); }}>{t('buttons.delete')}</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        title={t('confirmModal.deleteTitle')}
        message={t('deals.confirmDelete')}
        confirmText={t('buttons.delete')}
        cancelText={t('buttons.cancel')}
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
}

function TasksView({ tasks, onLoad, toast, t }) {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', due_date: '', priority: 'medium', status: 'pending',
  });

  const handleDelete = (task) => {
    setTaskToDelete(task);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await window.electronAPI.db.deleteTask(taskToDelete.id);
      toast.success(t('tasks.deletedSuccess'));
      setShowConfirmModal(false);
      setTaskToDelete(null);
      onLoad();
    } catch (error) {
      toast.error(`${t('tasks.deleteFailed')}: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await window.electronAPI.db.createTask(formData);
      toast.success(t('tasks.createdSuccess'));
      setFormData({ title: '', description: '', due_date: '', priority: 'medium', status: 'pending' });
      setShowModal(false);
      onLoad();
    } catch (error) {
      toast.error(`${t('tasks.createFailed')}: ${error.message}`);
    }
  };

  const toggleTaskStatus = async (task) => {
    try {
      await window.electronAPI.db.updateTask(task.id, {
        status: task.status === 'pending' ? 'completed' : 'pending',
      });
      onLoad();
    } catch (error) {
      toast.error(`${t('tasks.updateFailed')}: ${error.message}`);
    }
  };

  return (
    <div className="module-view">
      <div className="module-header">
        <h2>{t('tasks.title')}</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>{t('tasks.addTask')}</button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={t('tasks.addTask')}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('tasks.title')} *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>{t('tasks.description')}</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t('tasks.dueDate')}</label>
            <input type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t('tasks.priority')}</label>
            <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
              <option value="low">{t('tasks.priorities.low')}</option>
              <option value="medium">{t('tasks.priorities.medium')}</option>
              <option value="high">{t('tasks.priorities.high')}</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>{t('tasks.cancel')}</button>
            <button type="submit" className="btn btn-primary">{t('tasks.saveTask')}</button>
          </div>
        </form>
      </Modal>

      <div className="tasks-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className={`task-row ${task.status === 'completed' ? 'completed' : ''}`}>
              <button className={`task-checkbox ${task.status === 'completed' ? 'checked' : ''}`} onClick={() => toggleTaskStatus(task)}>
                {task.status === 'completed' ? '✓' : ''}
              </button>
              <div className="task-info">
                <div className="task-title">{task.title}</div>
                {task.description && <div className="task-description">{task.description}</div>}
                <div className="task-meta">
                  <span className={`priority-badge priority-${task.priority}`}>{t(`tasks.priorities.${task.priority}`)}</span>
                  {task.due_date && <span className="task-due">{t('tasks.due')}: {new Date(task.due_date).toLocaleDateString()}</span>}
                </div>
              </div>
              <span className="task-status">{t(`tasks.statuses.${task.status}`)}</span>
              <button className="btn btn-sm btn-danger task-delete-btn" onClick={() => handleDelete(task)}>{t('buttons.delete')}</button>
            </div>
          ))
        ) : (
          <EmptyState message={t('tasks.noTasks')} />
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        title={t('confirmModal.deleteTitle')}
        message={t('tasks.confirmDelete')}
        confirmText={t('buttons.delete')}
        cancelText={t('buttons.cancel')}
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
}

function ActivitiesView({ activities, onLoad, toast, t }) {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [formData, setFormData] = useState({
    type: 'note',
    date: new Date().toISOString().slice(0, 16),
    contact_id: '',
    deal_id: '',
    notes: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await window.electronAPI.db.createActivity({
        ...formData,
        contact_id: formData.contact_id || null,
        deal_id: formData.deal_id || null,
      });
      toast.success(t('activities.createdSuccess'));
      setFormData({
        type: 'note',
        date: new Date().toISOString().slice(0, 16),
        contact_id: '',
        deal_id: '',
        notes: '',
      });
      setShowModal(false);
      onLoad();
    } catch (error) {
      toast.error(`${t('activities.createFailed')}: ${error.message}`);
    }
  };

  const handleDelete = (activity) => {
    setActivityToDelete(activity);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await window.electronAPI.db.deleteActivity(activityToDelete.id);
      toast.success(t('activities.deletedSuccess'));
      setShowConfirmModal(false);
      setActivityToDelete(null);
      onLoad();
    } catch (error) {
      toast.error(`${t('activities.deleteFailed')}: ${error.message}`);
    }
  };

  return (
    <div className="module-view">
      <div className="module-header">
        <h2>{t('activities.title')}</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          {t('activities.addActivity')}
        </button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={t('activities.addActivity')}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('activities.types.title')}</label>
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
              <option value="call">{t('activities.types.call')}</option>
              <option value="meeting">{t('activities.types.meeting')}</option>
              <option value="email">{t('activities.types.email')}</option>
              <option value="note">{t('activities.types.note')}</option>
              <option value="other">{t('activities.types.other')}</option>
            </select>
          </div>
          <div className="form-group">
            <label>{t('activities.date')}</label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>{t('activities.notes')}</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
              {t('activities.cancel')}
            </button>
            <button type="submit" className="btn btn-primary">
              {t('activities.save')}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={showConfirmModal}
        title={t('confirmModal.deleteTitle')}
        message={t('activities.confirmDelete')}
        confirmText={t('buttons.delete')}
        cancelText={t('buttons.cancel')}
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmModal(false)}
      />

      <ActivityList activities={activities} onDelete={handleDelete} />
    </div>
  );
}

function EmptyState({ message }) {
  return <div className="empty-state"><p>{message}</p></div>;
}

export default App;
