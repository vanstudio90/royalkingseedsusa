'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Product } from '@/lib/products/types';
import { ProductCard } from './ProductCard';
import { ProductSidebar } from '@/components/filters/ProductSidebar';

interface ProductGridProps {
  products: Product[];
  activeCategory?: string;
  initialQuery?: string;
}

export function ProductGrid({ products, activeCategory, initialQuery }: ProductGridProps) {
  const [search, setSearch] = useState(initialQuery || '');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const perPage = 24;

  const handleFilterChange = useCallback((filterType: string, value: string) => {
    setFilters((prev) => {
      const current = prev[filterType] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [filterType]: updated };
    });
    setPage(1);
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.effects.some((e) => e.toLowerCase().includes(q)) ||
          p.categories.some((c) => c.toLowerCase().includes(q))
      );
    }

    if (filters.strainType?.length) {
      result = result.filter((p) => filters.strainType.includes(p.strainType));
    }

    if (filters.floweringType?.length) {
      result = result.filter((p) => {
        if (filters.floweringType.includes('autoflower') && p.autoflower) return true;
        if (filters.floweringType.includes('feminized') && p.feminized && !p.autoflower) return true;
        if (filters.floweringType.includes('photoperiod') && !p.autoflower) return true;
        return false;
      });
    }

    if (filters.thc?.length) {
      result = result.filter((p) => {
        const thc = parseFloat(p.thcContent) || 0;
        return filters.thc.some((range) => {
          if (range === '0-10') return thc <= 10;
          if (range === '10-20') return thc > 10 && thc <= 20;
          if (range === '20-25') return thc > 20 && thc <= 25;
          if (range === '25+') return thc > 25;
          return false;
        });
      });
    }

    if (filters.effects?.length) {
      result = result.filter((p) =>
        filters.effects.some((e) =>
          p.effects.some((pe) => pe.toLowerCase().includes(e))
        )
      );
    }

    if (filters.flavor?.length) {
      result = result.filter((p) =>
        filters.flavor.some((f) =>
          p.description.toLowerCase().includes(f) ||
          p.name.toLowerCase().includes(f)
        )
      );
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, search, filters, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const activeFilterCount = Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="flex gap-8 items-start">
      <ProductSidebar activeFilters={filters} onFilterChange={handleFilterChange} />

      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-[300px] bg-[#F5F0EA] z-50 overflow-y-auto p-4 lg:hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#275C53]">Filters</h3>
              <button onClick={() => setSidebarOpen(false)} className="text-[#192026]/40 hover:text-[#275C53] cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <ProductSidebar activeFilters={filters} onFilterChange={handleFilterChange} mobile />
          </div>
        </>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#192026]/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search strains..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#275C53]/15 rounded-full text-[#192026] placeholder:text-[#192026]/30 text-sm focus:outline-none focus:border-[#275C53]/40 transition-colors"
            />
          </div>

          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-[#275C53]/15 rounded-full text-[13px] text-[#275C53] font-medium cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="16" y2="12" /><line x1="4" y1="18" x2="12" y2="18" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#275C53] text-white text-[10px] flex items-center justify-center">{activeFilterCount}</span>
            )}
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2.5 text-[13px] bg-white border border-[#275C53]/15 rounded-full text-[#192026]/60 cursor-pointer focus:outline-none"
          >
            <option value="name">Sort: A-Z</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          <span className="text-sm text-[#192026]/40 ml-auto">{filtered.length} {filtered.length === 1 ? 'strain' : 'strains'}</span>
        </div>

        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(filters).map(([type, values]) =>
              values.map((v) => (
                <button key={`${type}-${v}`} onClick={() => handleFilterChange(type, v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#275C53]/10 rounded-full text-[11px] text-[#275C53] font-medium cursor-pointer hover:bg-[#275C53]/20 transition-colors">
                  {v}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              ))
            )}
            <button onClick={() => setFilters({})} className="px-3 py-1.5 text-[11px] text-[#192026]/40 hover:text-[#275C53] cursor-pointer">Clear all</button>
          </div>
        )}

        {paginated.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-[#192026]/50">No strains match your filters</p>
            <button onClick={() => { setSearch(''); setFilters({}); }} className="mt-4 text-sm text-[#275C53] hover:text-[#D7B65D] cursor-pointer font-medium">Clear all filters</button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="btn-second !min-w-0 !px-6 !py-2.5 disabled:opacity-30 disabled:cursor-not-allowed">Previous</button>
            <span className="text-sm text-[#192026]/50 px-4">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="btn-second !min-w-0 !px-6 !py-2.5 disabled:opacity-30 disabled:cursor-not-allowed">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
