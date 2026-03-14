import React, { useState } from 'react';
import { Modal } from './Modal';
import { useToast } from './Toast';
import { useTranslation } from '../i18n';

export function ImportDialog({ isOpen, onClose, type }) {
  const toast = useToast();
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('select'); // 'select' | 'preview' | 'importing'

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setLoading(true);

    try {
      const result = await window.electronAPI.import.parseFile(selectedFile.path);
      if (result.success) {
        setPreview(result.data);
        setStep('preview');
      } else {
        toast.error(`解析失败：${result.error}`);
        setStep('select');
        setFile(null);
      }
    } catch (error) {
      toast.error(`解析失败：${error.message}`);
      setStep('select');
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (preview.length === 0) return;

    setLoading(true);
    setStep('importing');

    try {
      const dbMethod = type === 'contacts' ? 'createContact' : 'createCompany';
      let successCount = 0;
      let errorCount = 0;

      for (const item of preview) {
        try {
          await window.electronAPI.db[dbMethod](item);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Failed to import ${item.name || item.title}:`, error);
        }
      }

      toast.success(`导入完成：成功 ${successCount} 条，失败 ${errorCount} 条`);
      onClose();
      setStep('select');
      setFile(null);
      setPreview([]);
    } catch (error) {
      toast.error(`导入失败：${error.message}`);
      setStep('preview');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setStep('select');
    setFile(null);
    setPreview([]);
    onClose();
  };

  const getFieldMappings = () => {
    if (type === 'contacts') {
      return {
        name: '姓名',
        email: '邮箱',
        phone: '电话',
        company_name: '公司',
        tags: '标签',
        notes: '备注',
      };
    } else {
      return {
        name: '公司名称',
        website: '网站',
        industry: '行业',
        phone: '电话',
        address: '地址',
        notes: '备注',
      };
    }
  };

  const renderFileInput = () => (
    <div className="import-file-select">
      <p className="import-instruction">
        选择要导入的文件（支持 Excel .xlsx/.xls 或 CSV 格式）
      </p>
      <div className="import-upload-area">
        <input
          type="file"
          id="file-upload"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          disabled={loading}
        />
        <label htmlFor="file-upload" className="upload-btn">
          {loading ? '解析中...' : '选择文件'}
        </label>
        {file && <span className="file-name">{file.name}</span>}
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="import-preview">
      <p className="import-instruction">
        预览数据（共 {preview.length} 条记录）
      </p>
      <div className="import-preview-table">
        <table>
          <thead>
            <tr>
              {Object.keys(getFieldMappings()).map(field => (
                <th key={field}>{getFieldMappings()[field]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.slice(0, 10).map((row, idx) => (
              <tr key={idx}>
                {Object.keys(getFieldMappings()).map(field => (
                  <td key={field}>{row[field] || '-'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {preview.length > 10 && (
          <p className="preview-note">仅显示前 10 条，共 {preview.length} 条</p>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={`导入${type === 'contacts' ? '联系人' : '公司'}`}
      size="lg"
    >
      <div className="import-dialog">
        {step === 'select' && renderFileInput()}
        {step === 'preview' && renderPreview()}
        {step === 'importing' && (
          <div className="import-progress">
            <div className="import-spinner"></div>
            <p>正在导入数据，请稍候...</p>
          </div>
        )}

        <div className="import-actions">
          {step === 'select' && (
            <button className="btn btn-secondary" onClick={handleCancel}>
              {t('buttons.cancel')}
            </button>
          )}
          {step === 'preview' && (
            <>
              <button className="btn btn-secondary" onClick={handleCancel}>
                取消
              </button>
              <button
                className="btn btn-primary"
                onClick={handleImport}
                disabled={loading}
              >
                {loading ? '导入中...' : '确认导入'}
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
