import React, { useEffect } from 'react';
import { useTranslation } from '../i18n';

export function ConfirmModal({ isOpen, title, message, confirmText, cancelText, onConfirm, onCancel }) {
  const { t } = useTranslation();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel && onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h3>{title || t('confirmModal.title')}</h3>
          <button className="modal-close" onClick={onCancel}>&times;</button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelText || t('buttons.cancel')}
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            {confirmText || t('buttons.delete')}
          </button>
        </div>
      </div>
    </div>
  );
}
