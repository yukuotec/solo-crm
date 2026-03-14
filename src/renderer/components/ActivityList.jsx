import React from 'react';
import { useTranslation } from '../i18n';

const typeIcons = {
  call: '📞',
  meeting: '🤝',
  email: '📧',
  note: '📝',
  other: '📌'
};

export function ActivityList({ activities, onEdit, onDelete }) {
  const { t } = useTranslation();

  if (!activities || activities.length === 0) {
    return <div className="empty-state">{t('activities.noActivities')}</div>;
  }

  return (
    <div className="activity-list">
      {activities.map(activity => (
        <div key={activity.id} className="activity-item">
          <div className="activity-header">
            <span className="activity-type-icon">{typeIcons[activity.type]}</span>
            <span className="activity-type">{t(`activities.types.${activity.type}`)}</span>
            <span className="activity-date">{new Date(activity.date).toLocaleString()}</span>
          </div>
          <div className="activity-content">
            {activity.notes && <p className="activity-notes">{activity.notes}</p>}
            {activity.contact_name && (
              <span className="activity-contact">👤 {activity.contact_name}</span>
            )}
            {activity.deal_title && (
              <span className="activity-deal">💰 {activity.deal_title}</span>
            )}
          </div>
          <div className="activity-actions">
            {onEdit && (
              <button className="btn btn-sm btn-secondary" onClick={() => onEdit(activity)}>
                {t('buttons.edit')}
              </button>
            )}
            {onDelete && (
              <button className="btn btn-sm btn-danger" onClick={() => onDelete(activity)}>
                {t('buttons.delete')}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
