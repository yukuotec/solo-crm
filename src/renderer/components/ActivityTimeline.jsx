import React from 'react';
import { useTranslation } from '../i18n';

const typeIcons = {
  call: '📞',
  meeting: '🤝',
  email: '📧',
  note: '📝',
  other: '📌'
};

export function ActivityTimeline({ activities }) {
  const { t } = useTranslation();

  if (!activities || activities.length === 0) {
    return <div className="empty-state">{t('activities.noActivities')}</div>;
  }

  // Group by date
  const groupedByDate = activities.reduce((acc, activity) => {
    const date = new Date(activity.date).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(activity);
    return acc;
  }, {});

  return (
    <div className="activity-timeline">
      {Object.entries(groupedByDate).map(([date, dayActivities]) => (
        <div key={date} className="timeline-day">
          <div className="timeline-date-header">{date}</div>
          <div className="timeline-items">
            {dayActivities.map(activity => (
              <div key={activity.id} className="timeline-item">
                <div className="timeline-marker">
                  <span className="timeline-icon">{typeIcons[activity.type]}</span>
                </div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="timeline-type">{t(`activities.types.${activity.type}`)}</span>
                    <span className="timeline-time">
                      {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {activity.notes && <p className="timeline-notes">{activity.notes}</p>}
                  {activity.contact_name && (
                    <span className="timeline-meta">👤 {activity.contact_name}</span>
                  )}
                  {activity.deal_title && (
                    <span className="timeline-meta">💰 {activity.deal_title}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
