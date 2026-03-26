'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-fetch';

interface Activity {
  id: number;
  user_email: string;
  action: string;
  entity_type: string;
  entity_name: string;
  created_at: string;
}

const ENTITY_TYPES = ['all', 'product', 'order', 'page', 'setting'];

const entityColors: Record<string, string> = {
  product: 'bg-emerald-50 text-emerald-600',
  order: 'bg-blue-50 text-blue-600',
  page: 'bg-purple-50 text-purple-600',
  setting: 'bg-amber-50 text-amber-600',
};

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchActivities = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== 'all') params.set('entity_type', filter);
    const res = await adminFetch(`/api/admin/activity?${params}`);
    const data = await res.json();
    setActivities(data.activities || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchActivities();
  }, [filter]);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#192026]" style={{ fontFamily: 'var(--font-patua)' }}>Activity Log</h1>
        <p className="text-[#192026]/40 text-sm mt-1">Recent actions across the admin panel</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 p-4 mb-4 flex items-center gap-2 flex-wrap">
        {ENTITY_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-2 rounded-lg text-[11px] uppercase tracking-[1px] font-semibold transition-colors cursor-pointer ${
              filter === t
                ? 'bg-[#275C53] text-white'
                : 'bg-[#f5f0ea] text-[#192026]/40 hover:text-[#192026]/70'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#192026]/30 text-sm">Loading activity...</div>
        ) : activities.length === 0 ? (
          <div className="p-12 text-center text-[#192026]/30 text-sm">No activity found</div>
        ) : (
          <div className="divide-y divide-[#192026]/5">
            {activities.map((a) => (
              <div key={a.id} className="flex items-start gap-4 p-4 hover:bg-[#f5f0ea]/30 transition-colors">
                <div className="w-2 h-2 rounded-full bg-[#275C53] mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-[#192026]">{a.user_email}</span>
                    <span className="text-sm text-[#192026]/40">{a.action}</span>
                    <span className={`text-[10px] uppercase tracking-[1px] font-semibold px-2 py-0.5 rounded-full ${
                      entityColors[a.entity_type] || 'bg-gray-50 text-gray-500'
                    }`}>
                      {a.entity_type}
                    </span>
                  </div>
                  <div className="text-sm text-[#192026]/60 mt-0.5">{a.entity_name}</div>
                </div>
                <span className="text-[11px] text-[#192026]/30 shrink-0">{formatTime(a.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
