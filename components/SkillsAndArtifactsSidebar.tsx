'use client';

interface SkillsAndArtifactsSidebarProps {
  skills: any[];
  onPlaybookClick: (skill: any) => void;
}

// Skills to hide (including background skills)
const HIDDEN_SKILLS = [
  'content-writer',
  'blog-writer',
  'landing-page-writer',
  'comparison-writer',
  'guide-writer',
  'listicle-writer',
  'library-manager',
  'topic-brainstorm',
  'seo-auditor',
  'geo-auditor',
  'tech-checker',
  'link-optimizer',
  'site-context',
  'offsite-context',
  'meta-tags',
  'schema-generator',
  'alert-manager',
  'content-gap-analysis',
  'serp-analysis',
  'backlinks',
  'competitor-growth-engine-audit',
  'web-research',
  'brand-assets-collector',
];

export default function SkillsAndArtifactsSidebar({
  skills,
  onPlaybookClick,
}: SkillsAndArtifactsSidebarProps) {

  // Filter skills: exclude system skills and hidden skills
  const visibleSkills = skills.filter(s => {
    if (s.metadata?.category === 'system') return false;
    const skillId = s.id?.toLowerCase() || '';
    return !HIDDEN_SKILLS.some(hidden => skillId.includes(hidden));
  });

  // Sort skills by priority
  visibleSkills.sort((a, b) => {
    const aPriority = parseInt(a.metadata?.priority || '99');
    const bPriority = parseInt(b.metadata?.priority || '99');
    if (aPriority !== bPriority) return aPriority - bPriority;
    return a.name.localeCompare(b.name);
  });

  return (
    <aside className="w-80 bg-white border border-[#E5E5E5] rounded-lg shadow-sm flex flex-col h-full overflow-hidden">
      
      {/* Skills Section */}
      <div className="flex flex-col h-full min-h-0">
        <div className="px-4 py-1.5 text-xs font-bold text-[#111827] uppercase tracking-wider shrink-0 border-b border-[#E5E5E5] h-10 flex items-center justify-between">
          <span>What You Can Do</span>
          <span className="bg-[#F3F4F6] text-[#6B7280] px-1.5 py-0.5 rounded text-[11px] font-medium">
            {visibleSkills.length}
          </span>
        </div>

        {/* Skills List - Flat */}
        <div className="flex-1 overflow-y-auto thin-scrollbar px-2 py-2">
          <div className="space-y-1">
            {visibleSkills.map((skill) => {
              const isAvailable = !!skill.metadata?.playbook?.trigger;
              
              return (
                <button
                  key={skill.id}
                  onClick={() => {
                    if (isAvailable) {
                      onPlaybookClick(skill);
                    }
                  }}
                  disabled={!isAvailable}
                  className={`w-full group flex items-start gap-2 p-2.5 rounded-lg transition-all text-left ${
                    isAvailable
                      ? 'hover:bg-[#FAFAFA] cursor-pointer'
                      : 'opacity-40 cursor-not-allowed'
                  }`}
                  title={skill.description}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`text-[11px] font-bold truncate ${
                        isAvailable ? 'text-[#374151]' : 'text-[#9CA3AF]'
                      }`}>
                        {skill.name.split(': ')[1] || skill.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#9CA3AF] line-clamp-2 leading-relaxed">
                      {skill.description}
                    </span>
                  </div>
                  {!isAvailable ? (
                    <span className="text-[8px] font-black text-[#D1D5DB] uppercase tracking-tighter bg-[#FAFAFA] px-1.5 py-0.5 rounded border border-[#F5F5F5] shrink-0 mt-0.5">Soon</span>
                  ) : (
                    <svg className="w-3 h-3 text-[#E5E5E5] group-hover:text-[#111827] transition-colors shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              );
            })}
            {visibleSkills.length === 0 && (
              <div className="px-3 py-4 text-[11px] text-[#9CA3AF] italic text-center">
                No skills available
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
