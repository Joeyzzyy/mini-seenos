import type { SiteContext } from '@/lib/supabase';

export interface SectionProps {
  siteContexts: SiteContext[];
}

// Brand & Site Section - Simplified (single logo/favicon)
export interface BrandSiteSectionProps extends SectionProps {
  // Domain & OG Image
  domainName: string;
  setDomainName: (v: string) => void;
  ogImage: string;
  setOgImage: (v: string) => void;
  onOgImageFileChange: (file: File | null) => void;
  ogImagePreview: string | null;
  
  // Logo & Favicon URLs (simplified - single field each)
  logoUrl: string;
  setLogoUrl: (v: string) => void;
  faviconUrl: string;
  setFaviconUrl: (v: string) => void;
  
  // File uploads
  onLogoFileChange: (file: File | null) => void;
  onFaviconFileChange: (file: File | null) => void;
  
  // Previews
  logoPreview: string | null;
  faviconPreview: string | null;
  
  // Colors
  primaryColor: string;
  setPrimaryColor: (v: string) => void;
  secondaryColor: string;
  setSecondaryColor: (v: string) => void;
  
  // Typography
  headingFont: string;
  setHeadingFont: (v: string) => void;
  bodyFont: string;
  setBodyFont: (v: string) => void;
  
  // Languages
  languages: string;
  setLanguages: (v: string) => void;
  
  // Header & Footer
  userLogoUrl: string | null;
  setHeaderConfig: (config: any) => void;
  setFooterConfig: (config: any) => void;
  
  // Refs
  brandAssetsRef: React.RefObject<HTMLDivElement | null>;
  colorsRef: React.RefObject<HTMLDivElement | null>;
  typographyRef: React.RefObject<HTMLDivElement | null>;
  languagesRef: React.RefObject<HTMLDivElement | null>;
  headerRef: React.RefObject<HTMLDivElement | null>;
  footerRef: React.RefObject<HTMLDivElement | null>;
}
