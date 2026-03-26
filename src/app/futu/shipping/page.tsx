'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-fetch';

const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
];

interface ShippingSettings {
  free_threshold: number;
  flat_rate: number;
  express_rate: number;
  zones: string[];
}

export default function AdminShippingPage() {
  const [shipping, setShipping] = useState<ShippingSettings>({
    free_threshold: 150,
    flat_rate: 9.99,
    express_rate: 19.99,
    zones: [...STATES],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    adminFetch('/api/admin/settings?key=shipping')
      .then((r) => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then((data) => {
        if (data.value) {
          const v = data.value;
          // Normalize zones: could be an object { AL: true } or an array ["Alabama"]
          let zones: string[] = [];
          if (Array.isArray(v.zones)) {
            zones = v.zones;
          } else if (v.zones && typeof v.zones === 'object') {
            // Convert state code map to full names
            const codeToName: Record<string, string> = {
              AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas',
              CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware',
              FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho',
              IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas',
              KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
              MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
              MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
              NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
              NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma',
              OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
              SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah',
              VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia',
              WI: 'Wisconsin', WY: 'Wyoming',
            };
            zones = Object.entries(v.zones)
              .filter(([, enabled]) => enabled)
              .map(([code]) => codeToName[code] || code);
          }
          setShipping({
            free_threshold: v.free_threshold ?? 150,
            flat_rate: v.flat_rate ?? 9.99,
            express_rate: v.express_rate ?? 0,
            zones,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await adminFetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'shipping', value: shipping }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setMessage('Shipping settings saved successfully');
    } catch {
      setMessage('Error saving settings');
    }
    setSaving(false);
  };

  const toggleZone = (state: string) => {
    setShipping((prev) => ({
      ...prev,
      zones: prev.zones.includes(state)
        ? prev.zones.filter((z) => z !== state)
        : [...prev.zones, state],
    }));
  };

  const selectAllZones = () => {
    setShipping((prev) => ({ ...prev, zones: [...STATES] }));
  };

  const clearAllZones = () => {
    setShipping((prev) => ({ ...prev, zones: [] }));
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[#192026] mb-6" style={{ fontFamily: 'var(--font-patua)' }}>Shipping</h1>
        <div className="p-12 text-center text-[#192026]/30 text-sm">Loading settings...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#192026]" style={{ fontFamily: 'var(--font-patua)' }}>Shipping</h1>
          <p className="text-[#192026]/40 text-sm mt-1">Manage shipping rates and zones</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-[#275C53] text-white rounded-xl text-sm font-semibold hover:bg-[#1e4a42] transition-colors disabled:opacity-50 cursor-pointer"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${
          message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
        }`}>
          {message}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Shipping Rates */}
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-6">
          <h2 className="text-lg font-bold text-[#192026] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Shipping Rates</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Free Shipping Threshold ($)</label>
              <input
                type="number"
                value={shipping.free_threshold}
                onChange={(e) => setShipping({ ...shipping, free_threshold: Number(e.target.value) })}
                className="input"
                min={0}
                step="0.01"
              />
              <p className="text-xs text-[#192026]/30 mt-1">Orders above this amount get free shipping. Set to 0 for always free.</p>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Standard Flat Rate ($)</label>
              <input
                type="number"
                value={shipping.flat_rate}
                onChange={(e) => setShipping({ ...shipping, flat_rate: Number(e.target.value) })}
                className="input"
                min={0}
                step="0.01"
              />
              <p className="text-xs text-[#192026]/30 mt-1">Charged when order is below the free shipping threshold.</p>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Express Rate ($)</label>
              <input
                type="number"
                value={shipping.express_rate}
                onChange={(e) => setShipping({ ...shipping, express_rate: Number(e.target.value) })}
                className="input"
                min={0}
                step="0.01"
              />
              <p className="text-xs text-[#192026]/30 mt-1">Optional express shipping rate. Set to 0 to disable.</p>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 bg-[#f5f0ea]/50 rounded-xl">
            <h3 className="text-xs font-semibold text-[#192026]/40 uppercase tracking-[1px] mb-3">Preview</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#192026]/60">Orders under ${shipping.free_threshold.toFixed(2)}</span>
                <span className="font-semibold text-[#192026]">${shipping.flat_rate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#192026]/60">Orders ${shipping.free_threshold.toFixed(2)}+</span>
                <span className="font-semibold text-emerald-600">Free</span>
              </div>
              {shipping.express_rate > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#192026]/60">Express shipping</span>
                  <span className="font-semibold text-[#192026]">${shipping.express_rate.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shipping Zones */}
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#192026]" style={{ fontFamily: 'var(--font-patua)' }}>Shipping Zones</h2>
            <div className="flex gap-2">
              <button onClick={selectAllZones} className="text-xs text-[#275C53] hover:underline cursor-pointer">Select All</button>
              <span className="text-[#192026]/20">|</span>
              <button onClick={clearAllZones} className="text-xs text-red-400 hover:underline cursor-pointer">Clear All</button>
            </div>
          </div>
          <p className="text-sm text-[#192026]/40 mb-3">Select states you ship to ({shipping.zones.length} of {STATES.length} selected)</p>
          <div className="grid grid-cols-1 gap-1.5">
            {STATES.map((p) => (
              <label key={p} className={`flex items-center gap-3 cursor-pointer p-2.5 rounded-lg transition-colors ${
                shipping.zones.includes(p) ? 'bg-[#275C53]/5' : 'hover:bg-[#f5f0ea]/50'
              }`}>
                <input
                  type="checkbox"
                  checked={shipping.zones.includes(p)}
                  onChange={() => toggleZone(p)}
                  className="w-4 h-4 rounded accent-[#275C53]"
                />
                <span className={`text-sm ${shipping.zones.includes(p) ? 'text-[#192026] font-medium' : 'text-[#192026]/50'}`}>{p}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
