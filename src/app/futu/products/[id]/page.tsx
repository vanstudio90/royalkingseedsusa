'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminFetch } from '@/lib/admin-fetch';

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  short_description: string;
  categories: string[];
  strain_type: string;
  thc_content: string;
  indica_percent: number;
  sativa_percent: number;
  effects: string[];
  flavors: string[];
  best_use: string;
  price: number;
  sale_price: number | null;
  feminized: boolean;
  autoflower: boolean;
  in_stock: boolean;
  status: string;
  flowering_time: string;
  plant_height: string;
  indoor_yield: string;
  outdoor_yield: string;
  difficulty: string;
  image_url: string;
  stock_quantity: number;
  low_stock_threshold: number;
  sku: string;
  meta_title: string;
  meta_description: string;
  weight: number;
  gallery_images: string[];
  seed_options: { label: string; price: number }[];
}

const emptyForm: ProductForm = {
  name: '', slug: '', description: '', short_description: '', categories: [],
  strain_type: 'hybrid', thc_content: '', indica_percent: 50, sativa_percent: 50,
  effects: [], flavors: [], best_use: '', price: 0, sale_price: null,
  feminized: true, autoflower: false, in_stock: true, status: 'draft',
  flowering_time: '', plant_height: '', indoor_yield: '', outdoor_yield: '',
  difficulty: 'intermediate', image_url: '', stock_quantity: 100,
  low_stock_threshold: 10, sku: '', meta_title: '', meta_description: '', weight: 0,
  gallery_images: [],
  seed_options: [{ label: '1 Seed', price: 0 }, { label: '3 Seeds', price: 0 }, { label: '5 Seeds', price: 0 }],
};

export default function ProductEditorPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [effectInput, setEffectInput] = useState('');
  const [flavorInput, setFlavorInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<'general' | 'details' | 'seo' | 'inventory'>('general');

  useEffect(() => {
    if (!isNew) {
      adminFetch(`/api/admin/products/${params.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.error && !data.error.includes('gallery_images')) { router.push('/futu/products'); return; }
          setForm({ ...emptyForm, ...data, sale_price: data.sale_price || null, gallery_images: data.gallery_images || [] });
          setLoading(false);
        });
    }
  }, [params.id, isNew, router]);

  const updateForm = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const autoSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const handleSave = async () => {
    setSaving(true);
    const url = isNew ? '/api/admin/products' : `/api/admin/products/${params.id}`;
    const method = isNew ? 'POST' : 'PUT';

    // Strip fields that may not exist in DB yet
    const { gallery_images, ...saveData } = form as any;
    void gallery_images;

    const res = await adminFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saveData),
    });

    if (res.ok) {
      if (isNew) {
        const data = await res.json();
        router.push(`/futu/products/${data.id}`);
      } else {
        setSaved(true);
        setSaving(false);
        setTimeout(() => setSaved(false), 3000);
      }
    } else {
      const err = await res.json();
      alert(err.error || 'Save failed');
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('slug', form.slug || 'product');

    const res = await adminFetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const { url } = await res.json();
      updateForm('image_url', url);
    }
    setUploading(false);
  };

  const addTag = (field: 'effects' | 'flavors' | 'categories', value: string, setter: (v: string) => void) => {
    if (!value.trim()) return;
    updateForm(field, [...(form[field] || []), value.trim()]);
    setter('');
  };

  const removeTag = (field: 'effects' | 'flavors' | 'categories', index: number) => {
    updateForm(field, (form[field] || []).filter((_: string, i: number) => i !== index));
  };

  if (loading) return <div className="p-12 text-center text-[#192026]/30">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => router.push('/futu/products')} className="text-[#192026]/30 text-sm hover:text-[#275C53] mb-1 cursor-pointer">&larr; Back to Products</button>
          <h1 className="text-2xl font-bold text-[#192026]" style={{ fontFamily: 'var(--font-patua)' }}>
            {isNew ? 'New Product' : `Edit: ${form.name}`}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-emerald-600 text-sm font-medium">Saved!</span>}
          <select value={form.status} onChange={e => updateForm('status', e.target.value)}
            className={`px-3 py-2 rounded-xl text-sm font-semibold border-0 cursor-pointer ${form.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-500'}`}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button onClick={handleSave} disabled={saving}
            className="px-5 py-2.5 bg-[#275C53] text-white rounded-xl text-sm font-semibold hover:bg-[#1e4a42] disabled:opacity-50 cursor-pointer">
            {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {(['general', 'details', 'inventory', 'seo'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${tab === t ? 'bg-[#275C53] text-white' : 'bg-white text-[#192026]/40 hover:text-[#192026]/70'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Main Form */}
        <div className="flex-1 space-y-4">
          {tab === 'general' && (
            <>
              <Section title="Basic Info">
                <Field label="Product Name">
                  <input value={form.name} onChange={e => { updateForm('name', e.target.value); if (isNew) updateForm('slug', autoSlug(e.target.value)); }}
                    className="input" placeholder="e.g. OG Kush Feminized" />
                </Field>
                <Field label="Slug (URL)">
                  <input value={form.slug} onChange={e => updateForm('slug', e.target.value)} className="input font-mono text-[13px]" />
                </Field>
                <Field label="Short Description">
                  <textarea value={form.short_description} onChange={e => updateForm('short_description', e.target.value)}
                    className="input min-h-[80px]" />
                </Field>
                <Field label="Full Description">
                  <textarea value={form.description} onChange={e => updateForm('description', e.target.value)}
                    className="input min-h-[200px]" />
                </Field>
              </Section>

              <Section title="Pricing & Pack Sizes">
                <p className="text-[11px] text-[#192026]/30 mb-3">Set prices for each pack size. The lowest price is used as the display price.</p>
                <div className="space-y-2 mb-4">
                  {(form.seed_options || []).map((opt: { label: string; price: number }, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <input value={opt.label} onChange={e => {
                        const updated = [...(form.seed_options || [])];
                        updated[i] = { ...updated[i], label: e.target.value };
                        updateForm('seed_options', updated);
                      }} className="input flex-1" placeholder="e.g. 3 Seeds" />
                      <div className="flex items-center gap-1">
                        <span className="text-[#192026]/30 text-sm">$</span>
                        <input type="number" step="0.01" value={opt.price} onChange={e => {
                          const updated = [...(form.seed_options || [])];
                          updated[i] = { ...updated[i], price: parseFloat(e.target.value) || 0 };
                          updateForm('seed_options', updated);
                          if (i === 0) updateForm('price', parseFloat(e.target.value) || 0);
                        }} className="input w-28" placeholder="0.00" />
                        <span className="text-[#192026]/30 text-[11px]">USD</span>
                      </div>
                      <button onClick={() => {
                        const updated = [...(form.seed_options || [])];
                        updated.splice(i, 1);
                        updateForm('seed_options', updated);
                      }} className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:text-red-600 flex items-center justify-center cursor-pointer text-sm">x</button>
                    </div>
                  ))}
                </div>
                <button onClick={() => {
                  updateForm('seed_options', [...(form.seed_options || []), { label: '', price: 0 }]);
                }} className="px-4 py-2 bg-[#f5f0ea] rounded-xl text-[12px] font-semibold text-[#275C53] hover:bg-[#275C53]/10 cursor-pointer">+ Add Pack Size</button>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-[#192026]/5">
                  <Field label="Base Price (USD)">
                    <input type="number" step="0.01" value={form.price} onChange={e => updateForm('price', parseFloat(e.target.value) || 0)} className="input" />
                  </Field>
                  <Field label="Sale Price">
                    <input type="number" step="0.01" value={form.sale_price || ''} onChange={e => updateForm('sale_price', e.target.value ? parseFloat(e.target.value) : null)} className="input" placeholder="Leave empty for no sale" />
                  </Field>
                  <Field label="Weight (g)">
                    <input type="number" step="0.01" value={form.weight} onChange={e => updateForm('weight', parseFloat(e.target.value) || 0)} className="input" />
                  </Field>
                </div>
              </Section>

              <Section title="Image">
                <div className="flex gap-4 items-start">
                  {form.image_url && (
                    <div className="w-32 h-32 rounded-xl bg-[#f5f0ea] overflow-hidden shrink-0">
                      <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
                    {uploading && <p className="text-[12px] text-[#192026]/30 mt-1">Uploading...</p>}
                    <Field label="Or paste image URL">
                      <input value={form.image_url} onChange={e => updateForm('image_url', e.target.value)} className="input" placeholder="https://..." />
                    </Field>
                  </div>
                </div>
              </Section>

              <Section title="Product Gallery">
                <p className="text-[11px] text-[#192026]/30 mb-3">Add additional product images. Paste image URLs below.</p>
                <div className="grid grid-cols-4 gap-3 mb-3">
                  {(form.gallery_images || []).map((url: string, i: number) => (
                    <div key={i} className="relative group">
                      <div className="aspect-square rounded-xl bg-[#f5f0ea] overflow-hidden">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <button onClick={() => {
                        const updated = [...(form.gallery_images || [])];
                        updated.splice(i, 1);
                        updateForm('gallery_images', updated);
                      }} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">x</button>
                    </div>
                  ))}
                  <button onClick={() => {
                    const url = prompt('Enter image URL:');
                    if (url) updateForm('gallery_images', [...(form.gallery_images || []), url]);
                  }} className="aspect-square rounded-xl border-2 border-dashed border-[#275C53]/15 flex items-center justify-center cursor-pointer hover:border-[#275C53]/30 transition-colors">
                    <span className="text-[#275C53]/30 text-2xl">+</span>
                  </button>
                </div>
              </Section>

              <Section title="Categories">
                <TagInput tags={form.categories} input={categoryInput} setInput={setCategoryInput}
                  onAdd={() => addTag('categories', categoryInput, setCategoryInput)}
                  onRemove={(i) => removeTag('categories', i)} placeholder="Add category..." />
              </Section>
            </>
          )}

          {tab === 'details' && (
            <>
              <Section title="Strain Info">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Strain Type">
                    <select value={form.strain_type} onChange={e => updateForm('strain_type', e.target.value)} className="input">
                      <option value="indica">Indica</option>
                      <option value="sativa">Sativa</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="cbd">CBD</option>
                    </select>
                  </Field>
                  <Field label="THC Content">
                    <input value={form.thc_content} onChange={e => updateForm('thc_content', e.target.value)} className="input" placeholder="e.g. 20-25%" />
                  </Field>
                  <Field label="Indica %">
                    <input type="number" value={form.indica_percent} onChange={e => updateForm('indica_percent', parseInt(e.target.value) || 0)} className="input" />
                  </Field>
                  <Field label="Sativa %">
                    <input type="number" value={form.sativa_percent} onChange={e => updateForm('sativa_percent', parseInt(e.target.value) || 0)} className="input" />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Field label="Difficulty">
                    <select value={form.difficulty} onChange={e => updateForm('difficulty', e.target.value)} className="input">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </Field>
                  <Field label="Best Use">
                    <input value={form.best_use} onChange={e => updateForm('best_use', e.target.value)} className="input" placeholder="e.g. Evening, Relaxation" />
                  </Field>
                </div>
                <div className="flex gap-4 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.feminized} onChange={e => updateForm('feminized', e.target.checked)} />
                    <span className="text-sm">Feminized</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.autoflower} onChange={e => updateForm('autoflower', e.target.checked)} />
                    <span className="text-sm">Autoflower</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.in_stock} onChange={e => updateForm('in_stock', e.target.checked)} />
                    <span className="text-sm">In Stock</span>
                  </label>
                </div>
              </Section>

              <Section title="Growing Info">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Flowering Time"><input value={form.flowering_time} onChange={e => updateForm('flowering_time', e.target.value)} className="input" placeholder="e.g. 8-10 weeks" /></Field>
                  <Field label="Plant Height"><input value={form.plant_height} onChange={e => updateForm('plant_height', e.target.value)} className="input" placeholder="e.g. 90-140cm" /></Field>
                  <Field label="Indoor Yield"><input value={form.indoor_yield} onChange={e => updateForm('indoor_yield', e.target.value)} className="input" placeholder="e.g. 400-500g/m2" /></Field>
                  <Field label="Outdoor Yield"><input value={form.outdoor_yield} onChange={e => updateForm('outdoor_yield', e.target.value)} className="input" placeholder="e.g. 500-600g/plant" /></Field>
                </div>
              </Section>

              <Section title="Effects">
                <TagInput tags={form.effects} input={effectInput} setInput={setEffectInput}
                  onAdd={() => addTag('effects', effectInput, setEffectInput)}
                  onRemove={(i) => removeTag('effects', i)} placeholder="Add effect..." />
              </Section>

              <Section title="Flavors">
                <TagInput tags={form.flavors} input={flavorInput} setInput={setFlavorInput}
                  onAdd={() => addTag('flavors', flavorInput, setFlavorInput)}
                  onRemove={(i) => removeTag('flavors', i)} placeholder="Add flavor..." />
              </Section>
            </>
          )}

          {tab === 'inventory' && (
            <Section title="Inventory">
              <div className="grid grid-cols-3 gap-4">
                <Field label="SKU"><input value={form.sku} onChange={e => updateForm('sku', e.target.value)} className="input" placeholder="RKS-001" /></Field>
                <Field label="Stock Quantity"><input type="number" value={form.stock_quantity} onChange={e => updateForm('stock_quantity', parseInt(e.target.value) || 0)} className="input" /></Field>
                <Field label="Low Stock Alert"><input type="number" value={form.low_stock_threshold} onChange={e => updateForm('low_stock_threshold', parseInt(e.target.value) || 0)} className="input" /></Field>
              </div>
              {form.stock_quantity <= form.low_stock_threshold && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">Low stock warning: Only {form.stock_quantity} units remaining</div>
              )}
            </Section>
          )}

          {tab === 'seo' && (
            <Section title="SEO Settings">
              <Field label="Meta Title"><input value={form.meta_title} onChange={e => updateForm('meta_title', e.target.value)} className="input" placeholder="Auto-generated if empty" /></Field>
              <Field label="Meta Description">
                <textarea value={form.meta_description} onChange={e => updateForm('meta_description', e.target.value)} className="input min-h-[100px]" placeholder="Auto-generated if empty" />
                <p className="text-[11px] text-[#192026]/30 mt-1">{(form.meta_description || '').length}/160 characters</p>
              </Field>
              <div className="mt-4 p-4 bg-white rounded-xl border border-[#192026]/5">
                <p className="text-[11px] text-[#192026]/30 mb-1">Search Preview</p>
                <p className="text-blue-700 text-[15px]">{form.meta_title || `Buy ${form.name} | Royal King Seeds Canada`}</p>
                <p className="text-green-700 text-[12px]">royalkingseeds.ca/{form.slug}</p>
                <p className="text-[13px] text-[#192026]/50">{form.meta_description || form.short_description || form.description?.slice(0, 160)}</p>
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
      <h3 className="text-sm font-bold text-[#192026] uppercase tracking-[1px] mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] uppercase tracking-[1px] text-[#192026]/40 font-semibold mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function TagInput({ tags, input, setInput, onAdd, onRemove, placeholder }: {
  tags: string[]; input: string; setInput: (v: string) => void; onAdd: () => void; onRemove: (i: number) => void; placeholder: string;
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {(tags || []).map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#275C53]/10 text-[#275C53] rounded-full text-[12px] font-medium">
            {tag}
            <button onClick={() => onRemove(i)} className="text-[#275C53]/50 hover:text-red-500 cursor-pointer">&times;</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), onAdd())}
          className="input flex-1" placeholder={placeholder} />
        <button onClick={onAdd} className="px-3 py-2 bg-[#f5f0ea] rounded-xl text-sm font-semibold text-[#192026]/50 hover:text-[#275C53] cursor-pointer">Add</button>
      </div>
    </div>
  );
}
