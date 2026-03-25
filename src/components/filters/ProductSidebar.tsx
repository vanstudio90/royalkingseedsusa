'use client';

import { useState } from 'react';

interface FilterOption {
  label: string;
  value: string;
}

const floweringTypes: FilterOption[] = [
  { label: 'Autoflower', value: 'autoflower' },
  { label: 'Feminized', value: 'feminized' },
  { label: 'Photoperiod', value: 'photoperiod' },
];

const strainTypes: FilterOption[] = [
  { label: 'Indica', value: 'indica' },
  { label: 'Sativa', value: 'sativa' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'CBD', value: 'cbd' },
];

const thcRanges: FilterOption[] = [
  { label: 'High (20%+)', value: '20-25' },
  { label: 'Medium (15-20%)', value: '10-20' },
  { label: 'Low (<15%)', value: '0-10' },
];

const effects: FilterOption[] = [
  { label: 'Relaxed', value: 'relaxed' },
  { label: 'Euphoric', value: 'euphoric' },
  { label: 'Happy', value: 'happy' },
  { label: 'Sleepy', value: 'sleepy' },
  { label: 'Creative', value: 'creative' },
  { label: 'Uplifted', value: 'uplifted' },
  { label: 'Energetic', value: 'energetic' },
  { label: 'Focused', value: 'focused' },
  { label: 'Calm', value: 'calm' },
];

const suitableFor: FilterOption[] = [
  { label: 'Daytime', value: 'daytime' },
  { label: 'Nighttime', value: 'nighttime' },
  { label: 'Pain Relief', value: 'pain' },
  { label: 'Anxiety', value: 'anxiety' },
  { label: 'Insomnia', value: 'insomnia' },
  { label: 'Stress Relief', value: 'stress' },
  { label: 'Beginners', value: 'beginners' },
];

const flavors: FilterOption[] = [
  { label: 'Earthy', value: 'earthy' },
  { label: 'Citrus', value: 'citrus' },
  { label: 'Berry', value: 'berry' },
  { label: 'Sweet', value: 'sweet' },
  { label: 'Pine', value: 'pine' },
  { label: 'Diesel', value: 'diesel' },
  { label: 'Fruity', value: 'fruity' },
  { label: 'Skunk', value: 'skunk' },
  { label: 'Spicy', value: 'spicy' },
];

const difficulty: FilterOption[] = [
  { label: 'Beginner', value: 'easy' },
  { label: 'Intermediate', value: 'moderate' },
  { label: 'Advanced', value: 'advanced' },
];

const floweringTime: FilterOption[] = [
  { label: 'Fast (< 9 weeks)', value: '6-8' },
  { label: 'Medium (9-10 weeks)', value: '8-10' },
  { label: 'Long (10+ weeks)', value: '10-12' },
];

interface ProductSidebarProps {
  activeFilters: Record<string, string[]>;
  onFilterChange: (filterType: string, value: string) => void;
  mobile?: boolean;
}

function FilterSection({
  title,
  options,
  filterType,
  activeFilters,
  onFilterChange,
  defaultOpen = true,
}: {
  title: string;
  options: FilterOption[];
  filterType: string;
  activeFilters: Record<string, string[]>;
  onFilterChange: (filterType: string, value: string) => void;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const active = activeFilters[filterType] || [];

  return (
    <div className="border-b border-[#275C53]/10 pb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 text-sm font-semibold text-[#275C53] hover:text-[#D7B65D] transition-colors cursor-pointer"
      >
        {title}
        <svg
          className={`w-4 h-4 text-[#275C53]/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-1 space-y-1.5">
          {options.map((opt) => {
            const checked = active.includes(opt.value);
            return (
              <label
                key={opt.value}
                className="flex items-center gap-2.5 text-sm text-[#192026]/70 hover:text-[#275C53] transition-colors cursor-pointer group"
              >
                <span
                  className={`flex-shrink-0 w-4 h-4 rounded border transition-all duration-150 flex items-center justify-center ${
                    checked
                      ? 'border-[#275C53] bg-[#275C53]'
                      : 'border-[#275C53]/20 bg-[#275C53]/[0.03] group-hover:border-[#275C53]/40'
                  }`}
                >
                  {checked && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <input
                  className="sr-only"
                  type="checkbox"
                  checked={checked}
                  onChange={() => onFilterChange(filterType, opt.value)}
                />
                <span className="flex-1">{opt.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ProductSidebar({ activeFilters, onFilterChange, mobile }: ProductSidebarProps) {
  return (
    <aside className={mobile ? 'w-full' : 'hidden lg:block w-[260px] shrink-0 sticky top-24 self-start max-h-[calc(100vh-120px)] overflow-y-auto overscroll-contain bg-white rounded-2xl border border-[#275C53]/5 p-5'}>
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-bold text-[#275C53] uppercase tracking-wider">Filters</h3>
          </div>

          <FilterSection title="Grow Type" options={floweringTypes} filterType="floweringType" activeFilters={activeFilters} onFilterChange={onFilterChange} />
          <FilterSection title="THC Level" options={thcRanges} filterType="thc" activeFilters={activeFilters} onFilterChange={onFilterChange} />
          <FilterSection title="Strain Type" options={strainTypes} filterType="strainType" activeFilters={activeFilters} onFilterChange={onFilterChange} />
          <FilterSection title="Difficulty" options={difficulty} filterType="difficulty" activeFilters={activeFilters} onFilterChange={onFilterChange} />
          <FilterSection title="Flowering Time" options={floweringTime} filterType="floweringTime" activeFilters={activeFilters} onFilterChange={onFilterChange} />
          <FilterSection title="Effects" options={effects} filterType="effects" activeFilters={activeFilters} onFilterChange={onFilterChange} />
          <FilterSection title="Flavors" options={flavors} filterType="flavor" activeFilters={activeFilters} onFilterChange={onFilterChange} />
          <FilterSection title="Suitable For" options={suitableFor} filterType="suitableFor" activeFilters={activeFilters} onFilterChange={onFilterChange} defaultOpen={false} />
        </div>
    </aside>
  );
}
