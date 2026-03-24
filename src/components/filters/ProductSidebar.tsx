'use client';

interface ProductSidebarProps {
  activeFilters: Record<string, string[]>;
  onFilterChange: (type: string, value: string) => void;
  mobile?: boolean;
}

const filterGroups = [
  {
    key: 'strainType',
    label: 'Strain Type',
    options: [
      { value: 'indica', label: 'Indica' },
      { value: 'sativa', label: 'Sativa' },
      { value: 'hybrid', label: 'Hybrid' },
      { value: 'cbd', label: 'CBD' },
    ],
  },
  {
    key: 'floweringType',
    label: 'Flowering Type',
    options: [
      { value: 'autoflower', label: 'Autoflower' },
      { value: 'feminized', label: 'Feminized' },
      { value: 'photoperiod', label: 'Photoperiod' },
    ],
  },
  {
    key: 'thc',
    label: 'THC Content',
    options: [
      { value: '0-10', label: '0-10%' },
      { value: '10-20', label: '10-20%' },
      { value: '20-25', label: '20-25%' },
      { value: '25+', label: '25%+' },
    ],
  },
  {
    key: 'effects',
    label: 'Effects',
    options: [
      { value: 'relax', label: 'Relaxing' },
      { value: 'euphori', label: 'Euphoric' },
      { value: 'energy', label: 'Energizing' },
      { value: 'creative', label: 'Creative' },
      { value: 'sleep', label: 'Sleepy' },
      { value: 'focus', label: 'Focused' },
      { value: 'pain', label: 'Pain Relief' },
    ],
  },
  {
    key: 'flavor',
    label: 'Flavor',
    options: [
      { value: 'citrus', label: 'Citrus' },
      { value: 'berry', label: 'Berry' },
      { value: 'earthy', label: 'Earthy' },
      { value: 'pine', label: 'Pine' },
      { value: 'diesel', label: 'Diesel' },
      { value: 'sweet', label: 'Sweet' },
      { value: 'skunk', label: 'Skunk' },
    ],
  },
];

export function ProductSidebar({ activeFilters, onFilterChange, mobile }: ProductSidebarProps) {
  return (
    <aside className={`${mobile ? '' : 'hidden lg:block w-[240px] shrink-0 sticky top-[100px]'}`}>
      <div className="space-y-6">
        {filterGroups.map((group) => (
          <details key={group.key} className="filter-section" open>
            <summary className="text-[12px] uppercase tracking-[1.5px] font-semibold text-[#275C53] cursor-pointer flex items-center justify-between pb-3">
              {group.label}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#275C53]/40">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <div className="space-y-2 pb-4 border-b border-[#275C53]/10">
              {group.options.map((opt) => {
                const isActive = (activeFilters[group.key] || []).includes(opt.value);
                return (
                  <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => onFilterChange(group.key, opt.value)}
                      className="filter-checkbox w-4 h-4 rounded border-[#275C53]/20"
                    />
                    <span className={`text-[13px] transition-colors ${isActive ? 'text-[#275C53] font-medium' : 'text-[#192026]/60 group-hover:text-[#275C53]'}`}>
                      {opt.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </details>
        ))}
      </div>
    </aside>
  );
}
