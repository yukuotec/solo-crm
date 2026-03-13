import React, { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { useToast } from './Toast';

export function ContactDetail({ contact, onClose, onDelete }) {
  const toast = useToast();
  const [relatedData, setRelatedData] = useState({ deals: [], tasks: [], activities: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRelated = async () => {
      try {
        const [deals, tasks, activities] = await Promise.all([
          window.electronAPI.db.getDeals().then(all => all.filter(d => d.contact_id === contact.id)),
          window.electronAPI.db.getTasks().then(all => all.filter(t => t.contact_id === contact.id)),
          window.electronAPI.db.getActivities().then(all => all.filter(a => a.contact_id === contact.id)),
        ]);
        setRelatedData({ deals, tasks, activities });
      } catch (error) {
        toast.error('Failed to load related data');
      } finally {
        setLoading(false);
      }
    };

    if (contact) loadRelated();
  }, [contact]);

  if (!contact) return null;

  return (
    <Modal isOpen={!!contact} onClose={onClose} title={contact.name} size="lg">
      <div className="detail-view">
        <div className="detail-section">
          <h4>Contact Information</h4>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">{contact.email || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{contact.phone || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Company</span>
              <span className="detail-value">{contact.company_name || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Tags</span>
              <span className="detail-value">{contact.tags || '-'}</span>
            </div>
          </div>
          {contact.notes && (
            <div className="detail-notes">
              <span className="detail-label">Notes</span>
              <p>{contact.notes}</p>
            </div>
          )}
        </div>

        {!loading && (
          <>
            <div className="detail-section">
              <h4>Linked Deals ({relatedData.deals.length})</h4>
              {relatedData.deals.length > 0 ? (
                <div className="related-list">
                  {relatedData.deals.map(deal => (
                    <div key={deal.id} className="related-item">
                      <span className="related-name">{deal.title}</span>
                      <span className="related-meta">${deal.value?.toLocaleString()} • {deal.stage}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-related">No linked deals</p>
              )}
            </div>

            <div className="detail-section">
              <h4>Tasks ({relatedData.tasks.length})</h4>
              {relatedData.tasks.length > 0 ? (
                <div className="related-list">
                  {relatedData.tasks.map(task => (
                    <div key={task.id} className="related-item">
                      <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                      <span className="related-name">{task.title}</span>
                      <span className="related-meta">{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-related">No tasks</p>
              )}
            </div>

            <div className="detail-section">
              <h4>Activities ({relatedData.activities.length})</h4>
              {relatedData.activities.length > 0 ? (
                <div className="related-list">
                  {relatedData.activities.map(activity => (
                    <div key={activity.id} className="related-item">
                      <span className="activity-type">{activity.type}</span>
                      <span className="related-name">{activity.notes || 'No notes'}</span>
                      <span className="related-meta">{new Date(activity.date).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-related">No activities</p>
              )}
            </div>
          </>
        )}

        <div className="detail-actions">
          <button className="btn btn-danger" onClick={onDelete}>Delete Contact</button>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </Modal>
  );
}

export function CompanyDetail({ company, onClose, onDelete }) {
  const toast = useToast();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContacts = async () => {
      if (!company) return;
      try {
        const allContacts = await window.electronAPI.db.getContacts();
        setContacts(allContacts.filter(c => c.company_id === company.id));
      } catch (error) {
        toast.error('Failed to load contacts');
      } finally {
        setLoading(false);
      }
    };
    loadContacts();
  }, [company]);

  if (!company) return null;

  return (
    <Modal isOpen={!!company} onClose={onClose} title={company.name} size="lg">
      <div className="detail-view">
        <div className="detail-section">
          <h4>Company Information</h4>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Website</span>
              <span className="detail-value">
                {company.website ? <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a> : '-'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Industry</span>
              <span className="detail-value">{company.industry || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{company.phone || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Address</span>
              <span className="detail-value">{company.address || '-'}</span>
            </div>
          </div>
          {company.notes && (
            <div className="detail-notes">
              <span className="detail-label">Notes</span>
              <p>{company.notes}</p>
            </div>
          )}
        </div>

        {!loading && (
          <div className="detail-section">
            <h4>Contacts ({contacts.length})</h4>
            {contacts.length > 0 ? (
              <div className="related-list">
                {contacts.map(contact => (
                  <div key={contact.id} className="related-item">
                    <span className="related-name">{contact.name}</span>
                    <span className="related-meta">{contact.email}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-related">No contacts linked</p>
            )}
          </div>
        )}

        <div className="detail-actions">
          <button className="btn btn-danger" onClick={onDelete}>Delete Company</button>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </Modal>
  );
}

export function DealDetail({ deal, onClose, onDelete }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadActivities = async () => {
      if (!deal) return;
      const all = await window.electronAPI.db.getActivities();
      setActivities(all.filter(a => a.deal_id === deal.id));
    };
    loadActivities();
  }, [deal]);

  if (!deal) return null;

  return (
    <Modal isOpen={!!deal} onClose={onClose} title={deal.title} size="lg">
      <div className="detail-view">
        <div className="detail-section">
          <h4>Deal Information</h4>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Value</span>
              <span className="detail-value">${deal.value?.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Stage</span>
              <span className="detail-value">{deal.stage}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Probability</span>
              <span className="detail-value">{deal.probability}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Weighted Value</span>
              <span className="detail-value">${(deal.value * deal.probability / 100)?.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Close Date</span>
              <span className="detail-value">{deal.close_date ? new Date(deal.close_date).toLocaleDateString() : '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Contact</span>
              <span className="detail-value">{deal.contact_name || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Company</span>
              <span className="detail-value">{deal.company_name || '-'}</span>
            </div>
          </div>
          {deal.notes && (
            <div className="detail-notes">
              <span className="detail-label">Notes</span>
              <p>{deal.notes}</p>
            </div>
          )}
        </div>

        <div className="detail-section">
          <h4>Activities ({activities.length})</h4>
          {activities.length > 0 ? (
            <div className="related-list">
              {activities.map(activity => (
                <div key={activity.id} className="related-item">
                  <span className="activity-type">{activity.type}</span>
                  <span className="related-meta">{new Date(activity.date).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-related">No activities</p>
          )}
        </div>

        <div className="detail-actions">
          <button className="btn btn-danger" onClick={onDelete}>Delete Deal</button>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </Modal>
  );
}
