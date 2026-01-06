'use client';

import { useMemo } from 'react';
import TextContentEditor from '../context-editors/TextContentEditor';
import type { BusinessContextSectionProps } from './types';

// Helper function to extract text from JSON content
function extractTextFromJSON(jsonString: string | null | undefined): string {
  if (!jsonString) return '';
  
  // If it's already a plain string without JSON, return it
  const trimmed = jsonString.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[') && !trimmed.startsWith('"')) {
    return jsonString;
  }
  
  try {
    const parsed = JSON.parse(jsonString);
    
    // Handle different JSON structures
    if (typeof parsed === 'string') return parsed;
    
    // Handle null or undefined
    if (parsed === null || parsed === undefined) return '';
    
    // For problem_statement or single field objects (check and return immediately)
    if (parsed.problem_statement && typeof parsed.problem_statement === 'string') {
      return parsed.problem_statement.trim();
    }
    if (parsed.audience && typeof parsed.audience === 'string') {
      return parsed.audience.trim();
    }
    if (parsed.content && typeof parsed.content === 'string') {
      return parsed.content.trim();
    }
    if (parsed.text && typeof parsed.text === 'string') {
      return parsed.text.trim();
    }
    if (parsed.description && typeof parsed.description === 'string') {
      return parsed.description.trim();
    }
    
    // For about-us format: { companyStory, missionVision, coreValues }
    if (parsed.companyStory || parsed.missionVision || parsed.coreValues) {
      const sections: string[] = [];
      
      if (parsed.companyStory) {
        sections.push(`Company Story:\n${parsed.companyStory}`);
      }
      if (parsed.missionVision) {
        sections.push(`Mission & Vision:\n${parsed.missionVision}`);
      }
      if (parsed.coreValues && Array.isArray(parsed.coreValues)) {
        sections.push(`Core Values:\n${parsed.coreValues.map((v: string, i: number) => `${i + 1}. ${v}`).join('\n')}`);
      }
      
      return sections.join('\n\n');
    }
    
    // For arrays (like industries, use cases)
    if (Array.isArray(parsed)) {
      return parsed.map((item, index) => {
        if (typeof item === 'string') return `${index + 1}. ${item}`;
        if (typeof item === 'object' && item !== null) {
          // Handle industry format: { Industry: "...", Description: "..." }
          if (item.Industry && item.Description) {
            return `${item.Industry}: ${item.Description}`;
          }
          // Handle use case format: { name: "...", description: "..." }
          if (item.name && item.description) {
            return `${index + 1}. ${item.name}: ${item.description}`;
          }
          // Handle single-key objects like: { "Education": "description..." }
          const keys = Object.keys(item);
          if (keys.length === 1) {
            const key = keys[0];
            const value = item[key];
            if (typeof value === 'string') {
              return `${key}:\n${value}`;
            }
          }
          // Handle simple objects with multiple fields
          const entries = Object.entries(item).filter(([k, v]) => typeof v === 'string');
          if (entries.length > 0) {
            if (entries.length === 1) {
              return `${index + 1}. ${entries[0][1]}`;
            }
            return `${index + 1}. ${entries.map(([k, v]) => v).join(' - ')}`;
          }
        }
        return JSON.stringify(item);
      }).join('\n\n');
    }
    
    // For use_cases object with arrays
    if (parsed.use_cases) {
      if (Array.isArray(parsed.use_cases)) {
        return parsed.use_cases.map((useCase: any, index: number) => {
          if (typeof useCase === 'string') return `${index + 1}. ${useCase}`;
          if (typeof useCase === 'object' && useCase !== null) {
            if (useCase.name && useCase.description) {
              return `${index + 1}. ${useCase.name}: ${useCase.description}`;
            }
            const values = Object.values(useCase).filter(v => typeof v === 'string');
            if (values.length > 0) {
              return `${index + 1}. ${values.join(' - ')}`;
            }
          }
          return `${index + 1}. ${JSON.stringify(useCase)}`;
        }).join('\n\n');
      } else if (typeof parsed.use_cases === 'string') {
        return parsed.use_cases;
      }
    }
    
    // For industries object
    if (parsed.industries) {
      if (Array.isArray(parsed.industries)) {
        return parsed.industries.map((industry: any, index: number) => {
          if (typeof industry === 'string') return `${index + 1}. ${industry}`;
          if (typeof industry === 'object' && industry !== null) {
            const values = Object.values(industry).filter(v => typeof v === 'string');
            if (values.length > 0) {
              return `${index + 1}. ${values.join(' - ')}`;
            }
          }
          return `${index + 1}. ${JSON.stringify(industry)}`;
        }).join('\n\n');
      } else if (typeof parsed.industries === 'string') {
        return parsed.industries;
      }
    }
    
    // Fallback: try to extract all string values from object
    if (typeof parsed === 'object' && !Array.isArray(parsed)) {
      const stringValues = Object.values(parsed)
        .filter(v => typeof v === 'string' && v.trim().length > 0);
      
      if (stringValues.length > 0) {
        // If there's only one string value, return it directly
        if (stringValues.length === 1) {
          return stringValues[0] as string;
        }
        // Otherwise, join them with line breaks
        return stringValues.join('\n\n');
      }
    }
    
    // Last resort: return pretty-printed JSON
    return JSON.stringify(parsed, null, 2);
  } catch {
    // If not valid JSON, return as is
    return jsonString;
  }
}

export default function BusinessContextSection({
  siteContexts,
  showDebugInfo = false,
  problemStatementContent,
  setProblemStatementContent,
  whoWeServeContent,
  setWhoWeServeContent,
  useCasesContent,
  setUseCasesContent,
  industriesContent,
  setIndustriesContent,
  productsServicesContent,
  setProductsServicesContent,
  problemStatementRef,
  whoWeServeRef,
  useCasesRef,
  industriesRef,
  productsServicesRef,
}: BusinessContextSectionProps) {
  const problemStatementContext = siteContexts.find(c => c.type === 'problem-statement');
  const whoWeServeContext = siteContexts.find(c => c.type === 'who-we-serve');
  const useCasesContext = siteContexts.find(c => c.type === 'use-cases');
  const industriesContext = siteContexts.find(c => c.type === 'industries');
  const productsServicesContext = siteContexts.find(c => c.type === 'products-services');

  // Extract readable text from JSON
  const problemStatementText = useMemo(() => 
    extractTextFromJSON(problemStatementContext?.content), 
    [problemStatementContext?.content]
  );
  
  const whoWeServeText = useMemo(() => 
    extractTextFromJSON(whoWeServeContext?.content), 
    [whoWeServeContext?.content]
  );
  
  const useCasesText = useMemo(() => 
    extractTextFromJSON(useCasesContext?.content), 
    [useCasesContext?.content]
  );
  
  const industriesText = useMemo(() => 
    extractTextFromJSON(industriesContext?.content), 
    [industriesContext?.content]
  );
  
  const productsServicesText = useMemo(() => 
    extractTextFromJSON(productsServicesContext?.content), 
    [productsServicesContext?.content]
  );

  return (
    <div className="border-t border-[#E5E5E5] pt-8">
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <h3 className="text-base font-bold text-[#111827]">Business Context</h3>
      </div>

      {/* Problem Statement */}
      <div ref={problemStatementRef} className="space-y-4 pl-7 mb-6">
        <h4 className="text-sm font-semibold text-[#111827]">Problem Statement</h4>
        <TextContentEditor
          initialContent={problemStatementText || undefined}
          onContentChange={setProblemStatementContent}
          placeholder="What problem does your product/service solve?"
          rows={6}
        />
      </div>

      {/* Who We Serve */}
      <div ref={whoWeServeRef} className="space-y-4 pl-7 mb-6 pt-6 border-t border-[#F3F4F6]">
        <h4 className="text-sm font-semibold text-[#111827]">Who We Serve</h4>
        <TextContentEditor
          initialContent={whoWeServeText || undefined}
          onContentChange={setWhoWeServeContent}
          placeholder="Describe your target audience and customer segments"
          rows={6}
        />
      </div>

      {/* Use Cases */}
      <div ref={useCasesRef} className="space-y-4 pl-7 mb-6 pt-6 border-t border-[#F3F4F6]">
        <h4 className="text-sm font-semibold text-[#111827]">Use Cases</h4>
        <TextContentEditor
          initialContent={useCasesText || undefined}
          onContentChange={setUseCasesContent}
          placeholder="List your primary use cases and applications"
          rows={8}
        />
      </div>

      {/* Industries */}
      <div ref={industriesRef} className="space-y-4 pl-7 mb-6 pt-6 border-t border-[#F3F4F6]">
        <h4 className="text-sm font-semibold text-[#111827]">Industries</h4>
        <TextContentEditor
          initialContent={industriesText || undefined}
          onContentChange={setIndustriesContent}
          placeholder="Industries you serve"
          rows={8}
        />
      </div>

      {/* Products & Services */}
      <div ref={productsServicesRef} className="space-y-4 pl-7 mb-6 pt-6 border-t border-[#F3F4F6]">
        <h4 className="text-sm font-semibold text-[#111827]">Products & Services</h4>
        <TextContentEditor
          initialContent={productsServicesText || undefined}
          onContentChange={setProductsServicesContent}
          placeholder="Describe your products and services"
          rows={8}
        />
      </div>
    </div>
  );
}

