'use client';

import { useState, useRef } from 'react';
import { adminFetch } from '@/lib/admin-fetch';

export default function AdminExportPage() {
  const [exporting, setExporting] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async (type: string) => {
    setExporting(type);
    try {
      const res = await adminFetch(`/api/admin/export?type=${type}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
    setExporting(null);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'products');

      const res = await adminFetch('/api/admin/import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setImportMessage(`Successfully imported ${data.count || 0} products`);
      } else {
        setImportMessage(data.error || 'Import failed');
      }
    } catch {
      setImportMessage('Import failed');
    }

    setImporting(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#192026]" style={{ fontFamily: 'var(--font-patua)' }}>Export / Import</h1>
        <p className="text-[#192026]/40 text-sm mt-1">Export data as CSV or import products</p>
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 p-6 mb-6">
        <h2 className="text-lg font-bold text-[#192026] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Export Data</h2>
        <p className="text-sm text-[#192026]/40 mb-4">Download your store data as CSV files</p>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => handleExport('products')}
            disabled={exporting === 'products'}
            className="flex flex-col items-center gap-3 p-6 bg-[#f5f0ea] rounded-xl hover:bg-[#275C53] hover:text-white text-[#192026]/70 transition-colors cursor-pointer group disabled:opacity-50"
          >
            <span className="text-3xl">🌱</span>
            <span className="text-sm font-semibold">
              {exporting === 'products' ? 'Exporting...' : 'Products CSV'}
            </span>
          </button>
          <button
            onClick={() => handleExport('orders')}
            disabled={exporting === 'orders'}
            className="flex flex-col items-center gap-3 p-6 bg-[#f5f0ea] rounded-xl hover:bg-[#275C53] hover:text-white text-[#192026]/70 transition-colors cursor-pointer group disabled:opacity-50"
          >
            <span className="text-3xl">📦</span>
            <span className="text-sm font-semibold">
              {exporting === 'orders' ? 'Exporting...' : 'Orders CSV'}
            </span>
          </button>
          <button
            onClick={() => handleExport('customers')}
            disabled={exporting === 'customers'}
            className="flex flex-col items-center gap-3 p-6 bg-[#f5f0ea] rounded-xl hover:bg-[#275C53] hover:text-white text-[#192026]/70 transition-colors cursor-pointer group disabled:opacity-50"
          >
            <span className="text-3xl">👤</span>
            <span className="text-sm font-semibold">
              {exporting === 'customers' ? 'Exporting...' : 'Customers CSV'}
            </span>
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 p-6">
        <h2 className="text-lg font-bold text-[#192026] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Import Products</h2>
        <p className="text-sm text-[#192026]/40 mb-4">Upload a CSV file to import products. The CSV should match the export format.</p>

        {importMessage && (
          <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${
            importMessage.includes('fail') || importMessage.includes('Error')
              ? 'bg-red-50 text-red-600'
              : 'bg-emerald-50 text-emerald-600'
          }`}>
            {importMessage}
          </div>
        )}

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-3 px-6 py-4 bg-[#f5f0ea] rounded-xl hover:bg-[#275C53] hover:text-white text-[#192026]/70 transition-colors cursor-pointer">
            <span className="text-xl">📄</span>
            <span className="text-sm font-semibold">
              {importing ? 'Importing...' : 'Choose CSV File'}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleImport}
              disabled={importing}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
