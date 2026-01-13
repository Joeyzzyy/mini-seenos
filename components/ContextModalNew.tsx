'use client';

import { useState, useEffect, useRef } from 'react';
import type { SiteContext } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { generateHeaderHTML } from '@/lib/templates/default-header';
import { generateFooterHTML } from '@/lib/templates/default-footer';
import {
  BrandSiteSection,
  BusinessContextSection,
  TrustCompanySection,
  KnowledgeSection,
} from './context-modal';
import CompetitorsEditor from './context-editors/CompetitorsEditor';

interface ContextModalNewProps {
  isOpen: boolean;
  onClose: () => void;
  siteContexts: SiteContext[];
  onSave: (data: {
    type: SiteContext['type'];
    content?: string;
    fileUrl?: string;
  }) => Promise<void>;
  projectId?: string;
  initialTab?: 'onsite' | 'knowledge';
}

type TabType = 'onsite' | 'knowledge';

export default function ContextModalNew({
  isOpen,
  onClose,
  siteContexts,
  onSave,
  projectId,
  initialTab = 'onsite',
}: ContextModalNewProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [isSaving, setIsSaving] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // Sync activeTab with initialTab when modal opens
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Navigation expand states
  const [expandedNavCompetitors, setExpandedNavCompetitors] = useState(true);
  const [expandedNavBrandAssets, setExpandedNavBrandAssets] = useState(false);
  const [expandedNavBusinessContext, setExpandedNavBusinessContext] = useState(false);
  const [expandedNavTrustCompany, setExpandedNavTrustCompany] = useState(false);
  
  // File states
  const [logoLightFile, setLogoLightFile] = useState<File | null>(null);
  const [logoDarkFile, setLogoDarkFile] = useState<File | null>(null);
  const [faviconLightFile, setFaviconLightFile] = useState<File | null>(null);
  const [faviconDarkFile, setFaviconDarkFile] = useState<File | null>(null);
  
  const [logoLightPreview, setLogoLightPreview] = useState<string | null>(null);
  const [logoDarkPreview, setLogoDarkPreview] = useState<string | null>(null);
  const [faviconLightPreview, setFaviconLightPreview] = useState<string | null>(null);
  const [faviconDarkPreview, setFaviconDarkPreview] = useState<string | null>(null);
  const [ogImageFile, setOgImageFile] = useState<File | null>(null);
  const [ogImagePreview, setOgImagePreview] = useState<string | null>(null);
  
  // Brand & Site states
  const [brandName, setBrandName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [domainName, setDomainName] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [logoLightUrl, setLogoLightUrl] = useState('');
  const [logoDarkUrl, setLogoDarkUrl] = useState('');
  const [faviconLightUrl, setFaviconLightUrl] = useState('');
  const [faviconDarkUrl, setFaviconDarkUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#9A8FEA');
  const [secondaryColor, setSecondaryColor] = useState('#FF5733');
  const [headingFont, setHeadingFont] = useState('');
  const [bodyFont, setBodyFont] = useState('');
  const [tone, setTone] = useState('');
  const [languages, setLanguages] = useState('');
  const [headerConfig, setHeaderConfig] = useState<any>(null);
  const [footerConfig, setFooterConfig] = useState<any>(null);
  
  // Content states
  const [problemStatementContent, setProblemStatementContent] = useState('');
  const [whoWeServeContent, setWhoWeServeContent] = useState('');
  const [useCasesContent, setUseCasesContent] = useState('');
  const [industriesContent, setIndustriesContent] = useState('');
  const [productsServicesContent, setProductsServicesContent] = useState('');
  const [socialProofContent, setSocialProofContent] = useState('');
  const [leadershipTeamContent, setLeadershipTeamContent] = useState('');
  const [aboutUsContent, setAboutUsContent] = useState('');
  const [faqContent, setFaqContent] = useState('');
  const [contactInfoContent, setContactInfoContent] = useState('');
  const [competitorsContent, setCompetitorsContent] = useState('');

  // Refs for scrolling
  const brandAssetsRef = useRef<HTMLDivElement>(null);
  const colorsRef = useRef<HTMLDivElement>(null);
  const typographyRef = useRef<HTMLDivElement>(null);
  const toneRef = useRef<HTMLDivElement>(null);
  const languagesRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const sitemapRef = useRef<HTMLDivElement>(null);
  const problemStatementRef = useRef<HTMLDivElement>(null);
  const whoWeServeRef = useRef<HTMLDivElement>(null);
  const useCasesRef = useRef<HTMLDivElement>(null);
  const industriesRef = useRef<HTMLDivElement>(null);
  const productsServicesRef = useRef<HTMLDivElement>(null);
  const socialProofRef = useRef<HTMLDivElement>(null);
  const leadershipTeamRef = useRef<HTMLDivElement>(null);
  const aboutUsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);
  const competitorsRef = useRef<HTMLDivElement>(null);

  // Get contexts
  const logoContext = siteContexts.find(c => c.type === 'logo');
  const userLogoUrl = logoContext?.logo_light_url || logoContext?.file_url || null;

  // Initialize states when modal opens
  useEffect(() => {
    if (isOpen) {
      if (logoContext) {
        const ctx = logoContext as any;
        
        // Parse content JSON for additional fields
        let contentData: any = {};
        try {
          if (ctx.content) {
            contentData = JSON.parse(ctx.content);
          }
        } catch (e) {
          // Content is not valid JSON, ignore
        }
        
        setBrandName(ctx.brand_name || '');
        setSubtitle(ctx.subtitle || '');
        setMetaDescription(ctx.meta_description || '');
        setOgImage(ctx.og_image || '');
        setLogoLightUrl(ctx.logo_light_url || ctx.logo_light || '');
        setLogoDarkUrl(ctx.logo_dark_url || ctx.logo_dark || '');
        setFaviconLightUrl(ctx.favicon_light_url || ctx.icon_light || ctx.favicon || '');
        setFaviconDarkUrl(ctx.favicon_dark_url || ctx.icon_dark || '');
        
        // Read metaTitle and metaKeywords from content JSON
        setMetaTitle(contentData.metaTitle || '');
        setMetaKeywords(contentData.metaKeywords || '');
        // Domain name can be inferred from logo URL or set manually
        if (contentData.logo) {
          try {
            const logoUrl = new URL(contentData.logo);
            setDomainName(logoUrl.origin);
          } catch (e) {
            // Invalid URL, ignore
          }
        }
        
        setLogoLightFile(null);
        setLogoDarkFile(null);
        setFaviconLightFile(null);
        setFaviconDarkFile(null);
        setLogoLightPreview(null);
        setLogoDarkPreview(null);
        setFaviconLightPreview(null);
        setFaviconDarkPreview(null);

        setPrimaryColor(ctx.primary_color || '#9A8FEA');
        setSecondaryColor(ctx.secondary_color || '#FF5733');
        setHeadingFont(ctx.heading_font || '');
        setBodyFont(ctx.body_font || '');
        setTone(ctx.tone || '');
        setLanguages(ctx.languages || '');
      }
      
      // Initialize content from contexts
      const problemStatementContext = siteContexts.find(c => c.type === 'problem-statement');
      const whoWeServeContext = siteContexts.find(c => c.type === 'who-we-serve');
      const useCasesContext = siteContexts.find(c => c.type === 'use-cases');
      const industriesContext = siteContexts.find(c => c.type === 'industries');
      const productsServicesContext = siteContexts.find(c => c.type === 'products-services');
      const socialProofContext = siteContexts.find(c => c.type === 'social-proof-trust');
      const leadershipTeamContext = siteContexts.find(c => c.type === 'leadership-team');
      const aboutUsContext = siteContexts.find(c => c.type === 'about-us');
      const faqContext = siteContexts.find(c => c.type === 'faq');
      const contactInfoContext = siteContexts.find(c => c.type === 'contact-information');
      const competitorsContext = siteContexts.find(c => c.type === 'competitors');
      
      setProblemStatementContent(problemStatementContext?.content || '');
      setWhoWeServeContent(whoWeServeContext?.content || '');
      setUseCasesContent(useCasesContext?.content || '');
      setIndustriesContent(industriesContext?.content || '');
      setProductsServicesContent(productsServicesContext?.content || '');
      setSocialProofContent(socialProofContext?.content || '');
      setLeadershipTeamContent(leadershipTeamContext?.content || '');
      setAboutUsContent(aboutUsContext?.content || '');
      setFaqContent(faqContext?.content || '');
      setContactInfoContent(contactInfoContext?.content || '');
      setCompetitorsContent(competitorsContext?.content || '');
    }
  }, [isOpen, siteContexts, logoContext]);

  // File preview handlers
  const handleLogoLightFileChange = (file: File | null) => {
    setLogoLightFile(file);
    if (file) setLogoLightPreview(URL.createObjectURL(file));
  };
  const handleLogoDarkFileChange = (file: File | null) => {
    setLogoDarkFile(file);
    if (file) setLogoDarkPreview(URL.createObjectURL(file));
  };
  const handleFaviconLightFileChange = (file: File | null) => {
    setFaviconLightFile(file);
    if (file) setFaviconLightPreview(URL.createObjectURL(file));
  };
  const handleFaviconDarkFileChange = (file: File | null) => {
    setFaviconDarkFile(file);
    if (file) setFaviconDarkPreview(URL.createObjectURL(file));
  };
  const handleOgImageFileChange = (file: File | null) => {
    setOgImageFile(file);
    if (file) setOgImagePreview(URL.createObjectURL(file));
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
        const { data: { session } } = await supabase.auth.getSession();
      const authHeaders: HeadersInit = {};
        if (session?.access_token) {
        authHeaders['Authorization'] = `Bearer ${session.access_token}`;
        }

      const uploadFile = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/upload-logo', {
          method: 'POST',
          body: formData,
          headers: authHeaders,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.details || 'Failed to upload file');
        }

        const uploadData = await uploadResponse.json();
        return uploadData.url;
      };

      let finalLogoLightUrl = logoLightUrl;
      let finalLogoDarkUrl = logoDarkUrl;
      let finalFaviconLightUrl = faviconLightUrl;
      let finalFaviconDarkUrl = faviconDarkUrl;
      let finalOgImage = ogImage;

      if (logoLightFile) finalLogoLightUrl = await uploadFile(logoLightFile);
      if (logoDarkFile) finalLogoDarkUrl = await uploadFile(logoDarkFile);
      if (faviconLightFile) finalFaviconLightUrl = await uploadFile(faviconLightFile);
      if (faviconDarkFile) finalFaviconDarkUrl = await uploadFile(faviconDarkFile);
      if (ogImageFile) finalOgImage = await uploadFile(ogImageFile);

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...authHeaders,
      };

      await fetch('/api/site-contexts', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: 'logo',
          brandName,
          subtitle,
          metaDescription,
          ogImage: finalOgImage,
          logoLightUrl: finalLogoLightUrl,
          logoDarkUrl: finalLogoDarkUrl,
          faviconLightUrl: finalFaviconLightUrl,
          faviconDarkUrl: finalFaviconDarkUrl,
          primaryColor,
          secondaryColor,
          headingFont,
          bodyFont,
          tone,
          languages,
        }),
      });

      if (headerConfig) {
        await onSave({
          type: 'header',
          content: generateHeaderHTML(headerConfig),
        });
      }

      if (footerConfig) {
        await onSave({
          type: 'footer',
          content: generateFooterHTML(footerConfig),
        });
      }

      const saveContentIfChanged = async (type: SiteContext['type'], content: string) => {
        if (content && content.trim()) {
          await onSave({ type, content });
        }
      };
      
      await saveContentIfChanged('problem-statement', problemStatementContent);
      await saveContentIfChanged('who-we-serve', whoWeServeContent);
      await saveContentIfChanged('use-cases', useCasesContent);
      await saveContentIfChanged('industries', industriesContent);
      await saveContentIfChanged('products-services', productsServicesContent);
      await saveContentIfChanged('social-proof-trust', socialProofContent);
      await saveContentIfChanged('leadership-team', leadershipTeamContent);
      await saveContentIfChanged('about-us', aboutUsContent);
      await saveContentIfChanged('faq', faqContent);
      await saveContentIfChanged('contact-information', contactInfoContent);
      await saveContentIfChanged('competitors', competitorsContent);

      onClose();
    } catch (error) {
      console.error('Error saving context:', error);
      alert(error instanceof Error ? error.message : 'Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  // Red Dot component for empty fields
  const RedDot = () => (
    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" title="Not filled"></span>
  );

  // Helper function to check if a context field has value
  const hasContextValue = (field: string): boolean => {
    // Default values list - these don't count as "having value"
    const defaultValues = ['#9A8FEA', '#FF5733'];
    
    const hasStringValue = (value: string | null | undefined): boolean => {
      if (!value || !value.trim()) return false;
      // Exclude default values
      if (defaultValues.includes(value.trim())) return false;
      return true;
    };
    
    const hasJsonContent = (content: string | null | undefined): boolean => {
      if (!content || !content.trim()) return false;
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          // Check if array has actual content
          if (parsed.length === 0) return false;
          return parsed.some(item => {
            if (typeof item === 'object' && item !== null) {
              return Object.values(item).some(v => 
                typeof v === 'string' ? v.trim().length > 0 : !!v
              );
            }
            return typeof item === 'string' ? item.trim().length > 0 : !!item;
          });
        }
        if (typeof parsed === 'object' && parsed !== null) {
          return Object.values(parsed).some(v => 
            typeof v === 'string' ? v.trim().length > 0 : !!v
          );
        }
        return !!parsed;
      } catch {
        return content.trim().length > 0;
      }
    };

    const hasSpecificJsonField = (content: string | null | undefined, fieldName: string): boolean => {
      if (!content || !content.trim()) return false;
      try {
        const parsed = JSON.parse(content);
        if (typeof parsed === 'object' && parsed !== null) {
          const v = (parsed as any)[fieldName];
          return typeof v === 'string' ? v.trim().length > 0 : !!v;
        }
        return false;
      } catch {
        return false;
      }
    };

    const context = siteContexts.find(ctx => {
      const typeMap: Record<string, string> = {
        'meta-info': 'logo',
        'logo': 'logo',
        'colors': 'logo',
        'typography': 'logo',
        'tone': 'logo',
        'languages': 'logo',
        'header': 'header',
        'footer': 'footer',
        'sitemap': 'sitemap',
        'problem-statement': 'problem-statement',
        'who-we-serve': 'who-we-serve',
        'use-cases': 'use-cases',
        'industries': 'industries',
        'products-services': 'products-services',
        'social-proof': 'social-proof-trust',
        'leadership-team': 'leadership-team',
        'about-us': 'about-us',
        'faq': 'faq',
        'contact-info': 'contact-information',
        'competitors': 'competitors',
      };
      return ctx.type === typeMap[field];
    });

    if (!context) return false;
    
    switch (field) {
      case 'meta-info':
        return hasStringValue(logoContext?.meta_description) || 
               hasStringValue((logoContext as any)?.og_image);
      case 'logo':
        return hasStringValue(logoContext?.logo_light_url) || 
               hasStringValue(logoContext?.logo_dark_url) ||
               hasStringValue(logoContext?.file_url);
      case 'colors':
        // Only show green dot when color is not default value
        const pColor = logoContext?.primary_color;
        const sColor = logoContext?.secondary_color;
        return (hasStringValue(pColor) && !defaultValues.includes(pColor || '')) ||
               (hasStringValue(sColor) && !defaultValues.includes(sColor || ''));
      case 'typography':
        return hasStringValue(logoContext?.heading_font);
      case 'tone':
        return hasStringValue(logoContext?.tone);
      case 'languages':
        return hasStringValue(logoContext?.languages);
      case 'header':
      case 'footer':
      case 'sitemap':
        return hasJsonContent(context.content);
      default:
        return hasJsonContent(context.content);
    }
  };

  // Count acquired fields for each group
  const countAcquiredFields = (checkKeys: string[]) => {
    return checkKeys.filter(key => hasContextValue(key)).length;
  };

  // Navigation groups
  const navigationGroups = [
    {
      label: 'Competitors',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
      expanded: expandedNavCompetitors,
      setExpanded: setExpandedNavCompetitors,
      fieldKeys: ['competitors'],
      children: [
        { label: 'Competitor List', ref: competitorsRef, checkKey: 'competitors' },
      ]
    },
    {
      label: 'Brand & Site',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
      expanded: expandedNavBrandAssets,
      setExpanded: setExpandedNavBrandAssets,
      fieldKeys: ['meta-info', 'logo', 'colors', 'typography', 'tone', 'languages', 'header', 'footer', 'sitemap'],
      children: [
        { label: 'Meta Info', ref: brandAssetsRef, checkKey: 'meta-info' },
        { label: 'Logo & Favicon', ref: brandAssetsRef, checkKey: 'logo' },
        { label: 'Colors', ref: colorsRef, checkKey: 'colors' },
        { label: 'Typography', ref: typographyRef, checkKey: 'typography' },
        { label: 'Tone', ref: toneRef, checkKey: 'tone' },
        { label: 'Languages', ref: languagesRef, checkKey: 'languages' },
        { label: 'Header', ref: headerRef, checkKey: 'header' },
        { label: 'Footer', ref: footerRef, checkKey: 'footer' },
        { label: 'Sitemap', ref: sitemapRef, checkKey: 'sitemap' },
      ]
    },
    {
      label: 'Business Context',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
      expanded: expandedNavBusinessContext,
      setExpanded: setExpandedNavBusinessContext,
      fieldKeys: ['problem-statement', 'who-we-serve', 'use-cases', 'industries', 'products-services'],
      children: [
        { label: 'Problem Statement', ref: problemStatementRef, checkKey: 'problem-statement' },
        { label: 'Who We Serve', ref: whoWeServeRef, checkKey: 'who-we-serve' },
        { label: 'Use Cases', ref: useCasesRef, checkKey: 'use-cases' },
        { label: 'Industries', ref: industriesRef, checkKey: 'industries' },
        { label: 'Products & Services', ref: productsServicesRef, checkKey: 'products-services' },
      ]
    },
    {
      label: 'Trust & Company',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
      expanded: expandedNavTrustCompany,
      setExpanded: setExpandedNavTrustCompany,
      fieldKeys: ['social-proof', 'leadership-team', 'about-us', 'faq', 'contact-info'],
      children: [
        { label: 'Social Proof', ref: socialProofRef, checkKey: 'social-proof' },
        { label: 'Leadership Team', ref: leadershipTeamRef, checkKey: 'leadership-team' },
        { label: 'About Us', ref: aboutUsRef, checkKey: 'about-us' },
        { label: 'FAQ', ref: faqRef, checkKey: 'faq' },
        { label: 'Contact Info', ref: contactInfoRef, checkKey: 'contact-info' },
      ]
    },
  ];

  const tabs = [
    { id: 'onsite' as TabType, label: 'On Site' },
    { id: 'knowledge' as TabType, label: 'Knowledge' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[95vw] max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-[#111827]">Brand Assets</h2>
            <button
              onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-colors"
            >
              <svg className="w-5 h-5 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
        </div>

        <form onSubmit={handleSaveAll} className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-64 border-r border-[#E5E5E5] bg-[#FAFAFA] flex flex-col shrink-0">
        {/* Tabs */}
            <div className="p-3 border-b border-[#E5E5E5]">
              <div className="flex gap-1 bg-[#F3F4F6] p-1 rounded-lg">
                {tabs.map((tab) => (
          <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-[#111827] shadow-sm'
                        : 'text-[#6B7280] hover:text-[#374151]'
                    }`}
                  >
                    {tab.label}
          </button>
                ))}
              </div>
        </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-3 thin-scrollbar">
              {activeTab === 'onsite' && (
                <div className="space-y-1">
              {navigationGroups.map((group, index) => {
                const acquiredCount = group.fieldKeys ? countAcquiredFields(group.fieldKeys) : 0;
                const totalCount = group.fieldKeys ? group.fieldKeys.length : 0;
                
                return (
                <div key={index}>
                      <button
                            type="button"
                        onClick={() => group.setExpanded?.(!group.expanded)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-xs transition-colors hover:bg-[#F3F4F6] font-medium text-[#374151]"
                      >
                        <svg 
                          className={`w-3 h-3 text-[#9CA3AF] transition-transform ${group.expanded ? 'rotate-90' : ''}`} 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                              strokeWidth="2"
                        >
                              <path d="M9 18l6-6-6-6"/>
                        </svg>
                        {group.icon}
                            <span className="flex-1">{group.label}</span>
                            {totalCount > 0 && (
                              <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                                acquiredCount === totalCount 
                                  ? 'bg-green-100 text-green-700' 
                                  : acquiredCount > 0 
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-500'
                              }`}>
                                {acquiredCount}/{totalCount}
                              </span>
                            )}
                      </button>
                      {group.expanded && (
                            <div className="ml-5 mt-1 space-y-0.5">
                          {group.children.map((child, childIndex) => (
                            <button
                              key={childIndex}
                                  type="button"
                              onClick={() => child.ref && scrollToSection(child.ref)}
                              className="w-full flex items-center gap-2 px-2 py-1 rounded-lg text-left text-xs transition-colors hover:bg-[#F3F4F6] text-[#6B7280]"
                            >
                                  <span className="flex-1">{child.label}</span>
                                  {child.checkKey && !hasContextValue(child.checkKey) && <RedDot />}
                            </button>
                          ))}
                        </div>
                  )}
                </div>
                );
              })}
                </div>
              )}
              
              {/* Knowledge Navigation */}
              {activeTab === 'knowledge' && (
                <div className="space-y-1">
                  <div className="px-2 py-1.5 text-xs text-[#6B7280]">
                    Upload and manage knowledge files for AI reference.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto p-6 thin-scrollbar">
              {activeTab === 'onsite' && (
                <div className="space-y-8 max-w-4xl">
                  {/* Competitors Section */}
                  <div ref={competitorsRef} className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-4 h-4 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                      </svg>
                      <h3 className="text-base font-bold text-[#111827]">Competitors</h3>
                    </div>
                    <p className="text-xs text-[#6B7280] pl-6">
                      Add your main competitors with their names and URLs.
                    </p>
                    <div className="pl-6">
                      <CompetitorsEditor
                        initialContent={competitorsContent}
                        onContentChange={setCompetitorsContent}
                      />
                    </div>
                  </div>

                  <BrandSiteSection
                    siteContexts={siteContexts}
                    showDebugInfo={showDebugInfo}
                    metaTitle={metaTitle}
                    setMetaTitle={setMetaTitle}
                    metaDescription={metaDescription}
                    setMetaDescription={setMetaDescription}
                    metaKeywords={metaKeywords}
                    setMetaKeywords={setMetaKeywords}
                    domainName={domainName}
                    setDomainName={setDomainName}
                    ogImage={ogImage}
                    setOgImage={setOgImage}
                    onOgImageFileChange={handleOgImageFileChange}
                    ogImagePreview={ogImagePreview}
                    logoLightUrl={logoLightUrl}
                    setLogoLightUrl={setLogoLightUrl}
                    logoDarkUrl={logoDarkUrl}
                    setLogoDarkUrl={setLogoDarkUrl}
                    faviconLightUrl={faviconLightUrl}
                    setFaviconLightUrl={setFaviconLightUrl}
                    faviconDarkUrl={faviconDarkUrl}
                    setFaviconDarkUrl={setFaviconDarkUrl}
                    onLogoLightFileChange={handleLogoLightFileChange}
                    onLogoDarkFileChange={handleLogoDarkFileChange}
                    onFaviconLightFileChange={handleFaviconLightFileChange}
                    onFaviconDarkFileChange={handleFaviconDarkFileChange}
                    logoLightPreview={logoLightPreview}
                    logoDarkPreview={logoDarkPreview}
                    faviconLightPreview={faviconLightPreview}
                    faviconDarkPreview={faviconDarkPreview}
                    primaryColor={primaryColor}
                    setPrimaryColor={setPrimaryColor}
                    secondaryColor={secondaryColor}
                    setSecondaryColor={setSecondaryColor}
                    headingFont={headingFont}
                    setHeadingFont={setHeadingFont}
                    bodyFont={bodyFont}
                    setBodyFont={setBodyFont}
                    tone={tone}
                    setTone={setTone}
                    languages={languages}
                    setLanguages={setLanguages}
                    userLogoUrl={userLogoUrl}
                    setHeaderConfig={setHeaderConfig}
                    setFooterConfig={setFooterConfig}
                    brandAssetsRef={brandAssetsRef}
                    colorsRef={colorsRef}
                    typographyRef={typographyRef}
                    toneRef={toneRef}
                    languagesRef={languagesRef}
                    headerRef={headerRef}
                    footerRef={footerRef}
                    sitemapRef={sitemapRef}
                  />

                  <BusinessContextSection
                    siteContexts={siteContexts}
                    showDebugInfo={showDebugInfo}
                    problemStatementContent={problemStatementContent}
                    setProblemStatementContent={setProblemStatementContent}
                    whoWeServeContent={whoWeServeContent}
                    setWhoWeServeContent={setWhoWeServeContent}
                    useCasesContent={useCasesContent}
                    setUseCasesContent={setUseCasesContent}
                    industriesContent={industriesContent}
                    setIndustriesContent={setIndustriesContent}
                    productsServicesContent={productsServicesContent}
                    setProductsServicesContent={setProductsServicesContent}
                    problemStatementRef={problemStatementRef}
                    whoWeServeRef={whoWeServeRef}
                    useCasesRef={useCasesRef}
                    industriesRef={industriesRef}
                    productsServicesRef={productsServicesRef}
                  />

                  <TrustCompanySection
                    siteContexts={siteContexts}
                    showDebugInfo={showDebugInfo}
                    socialProofContent={socialProofContent}
                    setSocialProofContent={setSocialProofContent}
                    leadershipTeamContent={leadershipTeamContent}
                    setLeadershipTeamContent={setLeadershipTeamContent}
                    aboutUsContent={aboutUsContent}
                    setAboutUsContent={setAboutUsContent}
                    faqContent={faqContent}
                    setFaqContent={setFaqContent}
                    contactInfoContent={contactInfoContent}
                    setContactInfoContent={setContactInfoContent}
                    socialProofRef={socialProofRef}
                    leadershipTeamRef={leadershipTeamRef}
                    aboutUsRef={aboutUsRef}
                    faqRef={faqRef}
                    contactInfoRef={contactInfoRef}
                  />
                </div>
              )}

              {activeTab === 'knowledge' && (
                <div className="max-w-2xl">
                  <KnowledgeSection projectId={projectId || null} />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#E5E5E5] flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#374151] hover:bg-[#F3F4F6] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 text-sm font-medium text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(80deg, rgb(255, 175, 64) -21.49%, rgb(209, 148, 236) 18.44%, rgb(154, 143, 234) 61.08%, rgb(101, 180, 255) 107.78%)',
                }}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
            </div>
          </form>
      </div>
    </div>
  );
}
