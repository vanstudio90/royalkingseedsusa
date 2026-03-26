'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-fetch';

interface Review {
  id: number;
  product_name: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  title: string;
  body: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-600',
  approved: 'bg-emerald-50 text-emerald-600',
  rejected: 'bg-red-50 text-red-500',
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchReviews = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.set('status', statusFilter);
    const res = await adminFetch(`/api/admin/reviews?${params}`);
    const data = await res.json();
    setReviews(data.reviews || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const updateStatus = async (id: number, status: string) => {
    await adminFetch(`/api/admin/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchReviews();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-amber-400' : 'text-[#192026]/10'}>
        ★
      </span>
    ));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#192026]" style={{ fontFamily: 'var(--font-patua)' }}>Reviews</h1>
        <p className="text-[#192026]/40 text-sm mt-1">{reviews.length} reviews</p>
      </div>

      {/* Status Filters */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 p-4 mb-4 flex items-center gap-2 flex-wrap">
        {['all', 'pending', 'approved', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-2 rounded-lg text-[11px] uppercase tracking-[1px] font-semibold transition-colors cursor-pointer ${
              statusFilter === s
                ? 'bg-[#275C53] text-white'
                : 'bg-[#f5f0ea] text-[#192026]/40 hover:text-[#192026]/70'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#192026]/30 text-sm">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-[#192026]/30 text-sm">No reviews found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#192026]/5">
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Product</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Customer</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Rating</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Title</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Status</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id} className="border-b border-[#192026]/5 hover:bg-[#f5f0ea]/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-[#192026]">{r.product_name}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-[#192026]/60">{r.customer_name || r.customer_email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex text-sm">{renderStars(r.rating)}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#192026]/60 max-w-[200px] truncate">{r.title}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase tracking-[1px] font-semibold px-2.5 py-1 rounded-full ${
                      statusColors[r.status] || 'bg-gray-50 text-gray-500'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {r.status !== 'approved' && (
                        <button
                          onClick={() => updateStatus(r.id, 'approved')}
                          className="px-3 py-1.5 bg-emerald-50 rounded-lg text-[11px] font-semibold text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      {r.status !== 'rejected' && (
                        <button
                          onClick={() => updateStatus(r.id, 'rejected')}
                          className="px-3 py-1.5 bg-red-50 rounded-lg text-[11px] font-semibold text-red-400 hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
