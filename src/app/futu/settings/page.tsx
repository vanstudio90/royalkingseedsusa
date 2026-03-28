'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-fetch';

interface StoreInfo {
  name: string;
  tagline: string;
  email: string;
  phone: string;
}

interface AnnouncementBar {
  enabled: boolean;
  text: string;
  link: string;
  bg_color: string;
}

interface SocialLinks {
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
}

interface SEODefaults {
  title_suffix: string;
  homepage_title: string;
  homepage_description: string;
}

export default function AdminSettingsPage() {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({ name: '', tagline: '', email: '', phone: '' });
  const [announcement, setAnnouncement] = useState<AnnouncementBar>({ enabled: false, text: '', link: '', bg_color: '#275C53' });
  const [social, setSocial] = useState<SocialLinks>({ instagram: '', facebook: '', twitter: '', youtube: '' });
  const [seo, setSeo] = useState<SEODefaults>({ title_suffix: '', homepage_title: '', homepage_description: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    adminFetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        const settings = data.settings || {};
        if (settings.store_info) setStoreInfo(settings.store_info);
        if (settings.announcement_bar) setAnnouncement(settings.announcement_bar);
        if (settings.social_links) setSocial(settings.social_links);
        if (settings.seo_defaults) setSeo(settings.seo_defaults);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await Promise.all([
        adminFetch('/api/admin/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'store_info', value: storeInfo }),
        }),
        adminFetch('/api/admin/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'announcement_bar', value: announcement }),
        }),
        adminFetch('/api/admin/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'social_links', value: social }),
        }),
        adminFetch('/api/admin/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'seo_defaults', value: seo }),
        }),
      ]);
      setMessage('Settings saved successfully');
    } catch {
      setMessage('Error saving settings');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[#192026] mb-6" style={{ fontFamily: 'var(--font-patua)' }}>Settings</h1>
        <div className="p-12 text-center text-[#192026]/30 text-sm">Loading settings...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#192026]" style={{ fontFamily: 'var(--font-patua)' }}>Settings</h1>
          <p className="text-[#192026]/40 text-sm mt-1">Global store configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-[#275C53] text-white rounded-xl text-sm font-semibold hover:bg-[#1e4a42] transition-colors disabled:opacity-50 cursor-pointer"
        >
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${
          message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* Cache Management */}
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-6">
          <h2 className="text-lg font-bold text-[#192026] mb-2" style={{ fontFamily: 'var(--font-patua)' }}>Cache Management</h2>
          <p className="text-[#192026]/40 text-sm mb-4">Clear the server-side page cache so all pages load fresh data. Cart and favorites are stored in your browser and will not be affected.</p>
          <button
            onClick={async () => {
              setClearing(true);
              setMessage('');
              try {
                const res = await adminFetch('/api/admin/clear-cache', { method: 'POST' });
                const data = await res.json();
                setMessage(data.success ? 'Cache cleared successfully. All pages will reload with fresh data.' : (data.error || 'Failed to clear cache'));
              } catch {
                setMessage('Error clearing cache');
              }
              setClearing(false);
            }}
            disabled={clearing}
            className="px-6 py-2.5 bg-[#D7B65D] text-[#1a3d36] rounded-xl text-sm font-semibold hover:bg-[#c9a84e] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {clearing ? 'Clearing...' : 'Clear Site Cache'}
          </button>
        </div>

        {/* Store Info */}
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-6">
          <h2 className="text-lg font-bold text-[#192026] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Store Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Store Name</label>
              <input
                type="text"
                value={storeInfo.name}
                onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Tagline</label>
              <input
                type="text"
                value={storeInfo.tagline}
                onChange={(e) => setStoreInfo({ ...storeInfo, tagline: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Email</label>
              <input
                type="email"
                value={storeInfo.email}
                onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Phone</label>
              <input
                type="text"
                value={storeInfo.phone}
                onChange={(e) => setStoreInfo({ ...storeInfo, phone: e.target.value })}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-6">
          <h2 className="text-lg font-bold text-[#192026] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Announcement Bar</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={announcement.enabled}
                onChange={(e) => setAnnouncement({ ...announcement, enabled: e.target.checked })}
                className="w-4 h-4 rounded accent-[#275C53]"
              />
              <span className="text-sm text-[#192026]/60">Enabled</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Text</label>
                <input
                  type="text"
                  value={announcement.text}
                  onChange={(e) => setAnnouncement({ ...announcement, text: e.target.value })}
                  className="input"
                  placeholder="Free shipping on orders over $100!"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Link (optional)</label>
                <input
                  type="text"
                  value={announcement.link}
                  onChange={(e) => setAnnouncement({ ...announcement, link: e.target.value })}
                  className="input"
                  placeholder="/shop"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={announcement.bg_color}
                    onChange={(e) => setAnnouncement({ ...announcement, bg_color: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-[#192026]/10 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={announcement.bg_color}
                    onChange={(e) => setAnnouncement({ ...announcement, bg_color: e.target.value })}
                    className="input flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-6">
          <h2 className="text-lg font-bold text-[#192026] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Social Links</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Instagram</label>
              <input
                type="text"
                value={social.instagram}
                onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
                className="input"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Facebook</label>
              <input
                type="text"
                value={social.facebook}
                onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
                className="input"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Twitter / X</label>
              <input
                type="text"
                value={social.twitter}
                onChange={(e) => setSocial({ ...social, twitter: e.target.value })}
                className="input"
                placeholder="https://x.com/..."
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">YouTube</label>
              <input
                type="text"
                value={social.youtube}
                onChange={(e) => setSocial({ ...social, youtube: e.target.value })}
                className="input"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </div>

        {/* SEO Defaults */}
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-6">
          <h2 className="text-lg font-bold text-[#192026] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>SEO Defaults</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Title Suffix</label>
              <input
                type="text"
                value={seo.title_suffix}
                onChange={(e) => setSeo({ ...seo, title_suffix: e.target.value })}
                className="input"
                placeholder="| Royal King Seeds"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Homepage Title</label>
              <input
                type="text"
                value={seo.homepage_title}
                onChange={(e) => setSeo({ ...seo, homepage_title: e.target.value })}
                className="input"
                placeholder="Royal King Seeds - Premium Cannabis Seeds"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Homepage Description</label>
              <textarea
                value={seo.homepage_description}
                onChange={(e) => setSeo({ ...seo, homepage_description: e.target.value })}
                className="input min-h-[80px] resize-y"
                placeholder="Shop premium cannabis seeds..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
