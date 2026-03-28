'use client';

const suggestions = [
  { icon: '🌙', label: 'Best for sleep', query: 'What are your best strains for sleep and relaxation?' },
  { icon: '🎨', label: 'Creative strains', query: 'I want something creative and uplifting for daytime use' },
  { icon: '🌱', label: 'Beginner grower', query: "I'm a first-time grower, what's the easiest strain to start with?" },
  { icon: '🍇', label: 'Fruity flavors', query: 'Show me your most fruity and sweet-tasting strains' },
  { icon: '⚡', label: 'Highest THC', query: 'What are your most potent high-THC strains?' },
  { icon: '💚', label: 'CBD / Medical', query: 'I need a high-CBD strain for medical use with low THC' },
];

export function ChatSuggestions({ onSelect }: { onSelect: (query: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {suggestions.map((s) => (
        <button
          key={s.label}
          onClick={() => onSelect(s.query)}
          className="flex items-center gap-1.5 px-2.5 py-2 bg-[#275C53]/5 border border-[#275C53]/10 rounded-xl hover:bg-[#275C53]/10 hover:border-[#275C53]/25 transition-all text-left cursor-pointer"
        >
          <span className="text-sm">{s.icon}</span>
          <span className="text-xs text-[#192026]/60">{s.label}</span>
        </button>
      ))}
    </div>
  );
}
