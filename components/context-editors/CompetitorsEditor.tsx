'use client';

import { useState, useEffect } from 'react';

interface Competitor {
  name: string;
  url: string;
}

interface CompetitorsEditorProps {
  initialContent?: string;
  onContentChange: (content: string) => void;
}

export default function CompetitorsEditor({
  initialContent,
  onContentChange,
}: CompetitorsEditorProps) {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);

  useEffect(() => {
    if (initialContent) {
      try {
        const parsed = JSON.parse(initialContent);
        if (Array.isArray(parsed)) {
          setCompetitors(parsed);
        }
      } catch {
        setCompetitors([]);
      }
    }
  }, [initialContent]);

  const updateCompetitors = (newCompetitors: Competitor[]) => {
    setCompetitors(newCompetitors);
    onContentChange(JSON.stringify(newCompetitors));
  };

  const addCompetitor = () => {
    updateCompetitors([...competitors, { name: '', url: '' }]);
  };

  const updateCompetitor = (index: number, field: 'name' | 'url', value: string) => {
    const updated = [...competitors];
    updated[index] = { ...updated[index], [field]: value };
    updateCompetitors(updated);
  };

  const removeCompetitor = (index: number) => {
    updateCompetitors(competitors.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {competitors.length === 0 ? (
        <p className="text-sm text-[#9CA3AF] py-4 text-center">No competitors added yet</p>
      ) : (
        <div className="space-y-2">
          {competitors.map((competitor, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={competitor.name}
                onChange={(e) => updateCompetitor(index, 'name', e.target.value)}
                placeholder="Competitor name"
                className="flex-1 px-3 py-2 text-sm bg-white text-[#111827] placeholder:text-[#9CA3AF] border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9AD6FF]"
              />
              <input
                type="url"
                value={competitor.url}
                onChange={(e) => updateCompetitor(index, 'url', e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 text-sm bg-white text-[#111827] placeholder:text-[#9CA3AF] border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9AD6FF]"
              />
              <button
                type="button"
                onClick={() => removeCompetitor(index)}
                className="p-2 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      <button
        type="button"
        onClick={addCompetitor}
        className="flex items-center gap-2 px-3 py-2 text-sm text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add Competitor
      </button>
    </div>
  );
}
