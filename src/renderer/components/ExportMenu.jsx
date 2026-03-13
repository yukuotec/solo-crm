import { useToast } from './Toast';

export function ExportMenu() {
  const toast = useToast();

  const handleExport = async (type) => {
    const getData = {
      contacts: () => window.electronAPI.db.getContacts(),
      companies: () => window.electronAPI.db.getCompanies(),
      deals: () => window.electronAPI.db.getDeals(),
      tasks: () => window.electronAPI.db.getTasks(),
    };

    const data = await getData[type]?.() || [];
    if (data.length === 0) {
      toast.warning(`No ${type} to export`);
      return;
    }

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            if (value === null || value === undefined) return '';
            const escaped = String(value).replace(/"/g, '""');
            return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')
              ? `"${escaped}"`
              : escaped;
          })
          .join(',')
      ),
    ].join('\n');

    try {
      // Use browser download for simplicity
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${type}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      toast.success(`Exported ${data.length} ${type}`);
    } catch (error) {
      toast.error(`Export failed: ${error.message}`);
    }
  };

  return (
    <div className="export-menu">
      <button className="btn btn-secondary btn-sm" onClick={() => {
        const dropdown = document.querySelector('.export-dropdown');
        dropdown?.classList.toggle('show');
      }}>
        Export
      </button>
      <div className="export-dropdown">
        <button onClick={() => handleExport('contacts')}>Contacts</button>
        <button onClick={() => handleExport('companies')}>Companies</button>
        <button onClick={() => handleExport('deals')}>Deals</button>
        <button onClick={() => handleExport('tasks')}>Tasks</button>
      </div>
    </div>
  );
}

export async function exportToCSV(type) {
  const getData = {
    contacts: () => window.electronAPI.db.getContacts(),
    companies: () => window.electronAPI.db.getCompanies(),
    deals: () => window.electronAPI.db.getDeals(),
    tasks: () => window.electronAPI.db.getTasks(),
  };

  const data = await getData[type]?.() || [];
  if (data.length === 0) return false;

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          const escaped = String(value).replace(/"/g, '""');
          return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')
            ? `"${escaped}"`
            : escaped;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${type}-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  return true;
}
