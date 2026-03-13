import React, { useEffect, useState } from 'react';
import { logger } from './logger';
import { ToastProvider, useToast, GlobalSearch, Modal, ErrorBoundary } from './components';
import { useContactStore, useCompanyStore, useDealStore, useTaskStore } from '../shared/store';

function AppContent() {
  const [appInfo, setAppInfo] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const toast = useToast();

  // Load stores
  const { contacts, loadContacts, createContact: storeCreateContact } = useContactStore();
  const { companies, loadCompanies, createCompany: storeCreateCompany } = useCompanyStore();
  const { deals, loadDeals, loadPipelineSummary, pipelineSummary } = useDealStore();
  const { tasks, loadTasks, upcomingTasks, loadUpcomingTasks } = useTaskStore();

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

    // Load all data
    loadContacts();
    loadCompanies();
    loadDeals();
    loadPipelineSummary();
    loadTasks();
    loadUpcomingTasks(7);
  }, []);

  if (error) {
    return (
      <div className="app-error">
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!appInfo) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading Solo CRM...</p>
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} stats={stats} appInfo={appInfo} />

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
          />
        )}

        {activeTab === 'contacts' && (
          <ContactsView contacts={contacts} onLoad={loadContacts} toast={toast} />
        )}

        {activeTab === 'companies' && (
          <CompaniesView companies={companies} onLoad={loadCompanies} toast={toast} />
        )}

        {activeTab === 'deals' && (
          <DealsView deals={deals} onLoad={loadDeals} toast={toast} />
        )}

        {activeTab === 'tasks' && (
          <TasksView tasks={tasks} onLoad={loadTasks} toast={toast} />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}

function Sidebar({ activeTab, setActiveTab, stats, appInfo }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'contacts', label: 'Contacts', icon: '👥' },
    { id: 'companies', label: 'Companies', icon: '🏢' },
    { id: 'deals', label: 'Deals', icon: '💰' },
    { id: 'tasks', label: 'Tasks', icon: '✅' },
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
        <span className="version">v{appInfo?.version || '0.1.0'}</span>
      </div>
    </aside>
  );
}

function Dashboard({ stats, pipelineSummary, upcomingTasks, totalPipelineValue }) {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="stats-grid">
        <StatCard title="Contacts" value={stats.totalContacts} icon="👥" color="#3b82f6" />
        <StatCard title="Companies" value={stats.totalCompanies} icon="🏢" color="#22c55e" />
        <StatCard title="Pipeline Value" value={`$${totalPipelineValue.toLocaleString()}`} icon="💰" color="#f59e0b" />
        <StatCard title="Pending Tasks" value={stats.totalTasks} icon="✅" color="#8b5cf6" />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Pipeline by Stage</h3>
          {pipelineSummary.length > 0 ? (
            <div className="pipeline-summary">
              {pipelineSummary.map((stage) => (
                <div key={stage.stage} className="pipeline-stage">
                  <div className="pipeline-stage-name">{stage.stage.replace('_', ' ')}</div>
                  <div className="pipeline-stage-info">
                    <span className="count">{stage.count} deals</span>
                    <span className="value">${stage.total_value?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No deals in pipeline" />
          )}
        </div>

        <div className="dashboard-card">
          <h3>Upcoming Tasks (7 days)</h3>
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
            <EmptyState message="No upcoming tasks" />
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

function ContactsView({ contacts, onLoad, toast }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', notes: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await window.electronAPI.db.createContact(formData);
      toast.success('Contact created successfully');
      setFormData({ name: '', email: '', phone: '', notes: '' });
      setShowModal(false);
      onLoad();
    } catch (error) {
      toast.error(`Failed to create contact: ${error.message}`);
    }
  };

  return (
    <div className="module-view">
      <div className="module-header">
        <h2>Contacts</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Contact
        </button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Contact">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Contact</button>
          </div>
        </form>
      </Modal>

      <div className="table-container">
        {contacts.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Notes</th></tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="font-medium">{contact.name}</td>
                  <td>{contact.email || '-'}</td>
                  <td>{contact.phone || '-'}</td>
                  <td>{contact.notes ? contact.notes.slice(0, 50) + (contact.notes.length > 50 ? '...' : '') : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState message="No contacts yet. Add your first contact!" />
        )}
      </div>
    </div>
  );
}

function CompaniesView({ companies, onLoad, toast }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', website: '', industry: '', phone: '', notes: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await window.electronAPI.db.createCompany(formData);
      toast.success('Company created successfully');
      setFormData({ name: '', website: '', industry: '', phone: '', notes: '' });
      setShowModal(false);
      onLoad();
    } catch (error) {
      toast.error(`Failed to create company: ${error.message}`);
    }
  };

  return (
    <div className="module-view">
      <div className="module-header">
        <h2>Companies</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Company</button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Company">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Industry</label>
            <input type="text" value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Company</button>
          </div>
        </form>
      </Modal>

      <div className="table-container">
        {companies.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Website</th><th>Industry</th><th>Phone</th><th>Contacts</th></tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <td className="font-medium">{company.name}</td>
                  <td>{company.website ? <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a> : '-'}</td>
                  <td>{company.industry || '-'}</td>
                  <td>{company.phone || '-'}</td>
                  <td>{company.contact_count || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState message="No companies yet. Add your first company!" />
        )}
      </div>
    </div>
  );
}

function DealsView({ deals, onLoad, toast }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', stage: 'lead', value: '', probability: 0, close_date: '', notes: '',
  });

  const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];

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
      toast.success('Deal created successfully');
      setFormData({ title: '', stage: 'lead', value: '', probability: 0, close_date: '', notes: '' });
      setShowModal(false);
      onLoad();
    } catch (error) {
      toast.error(`Failed to create deal: ${error.message}`);
    }
  };

  const dealsByStage = {};
  stages.forEach((stage) => {
    dealsByStage[stage] = deals.filter((d) => d.stage === stage);
  });

  return (
    <div className="module-view">
      <div className="module-header">
        <h2>Deals Pipeline</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Deal</button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Deal">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Value ($)</label>
            <input type="number" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Stage</label>
            <select value={formData.stage} onChange={(e) => setFormData({ ...formData, stage: e.target.value })}>
              {stages.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Probability (%)</label>
            <input type="number" min="0" max="100" value={formData.probability} onChange={(e) => setFormData({ ...formData, probability: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Close Date</label>
            <input type="date" value={formData.close_date} onChange={(e) => setFormData({ ...formData, close_date: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Deal</button>
          </div>
        </form>
      </Modal>

      <div className="pipeline-board">
        {stages.map((stage) => (
          <div key={stage} className="pipeline-column">
            <div className="pipeline-column-header">
              <h4>{stage.replace('_', ' ')}</h4>
              <span className="column-count">{dealsByStage[stage].length}</span>
            </div>
            <div className="pipeline-column-content">
              {dealsByStage[stage].map((deal) => (
                <div key={deal.id} className="deal-card">
                  <div className="deal-title">{deal.title}</div>
                  <div className="deal-value">${deal.value?.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TasksView({ tasks, onLoad, toast }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', due_date: '', priority: 'medium', status: 'pending',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await window.electronAPI.db.createTask(formData);
      toast.success('Task created successfully');
      setFormData({ title: '', description: '', due_date: '', priority: 'medium', status: 'pending' });
      setShowModal(false);
      onLoad();
    } catch (error) {
      toast.error(`Failed to create task: ${error.message}`);
    }
  };

  const toggleTaskStatus = async (task) => {
    try {
      await window.electronAPI.db.updateTask(task.id, {
        status: task.status === 'pending' ? 'completed' : 'pending',
      });
      onLoad();
    } catch (error) {
      toast.error(`Failed to update task: ${error.message}`);
    }
  };

  return (
    <div className="module-view">
      <div className="module-header">
        <h2>Tasks</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Task</button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Task">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Task</button>
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
                  <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                  {task.due_date && <span className="task-due">Due: {new Date(task.due_date).toLocaleDateString()}</span>}
                </div>
              </div>
              <span className="task-status">{task.status}</span>
            </div>
          ))
        ) : (
          <EmptyState message="No tasks yet. Add your first task!" />
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return <div className="empty-state"><p>{message}</p></div>;
}

export default App;
