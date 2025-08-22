export interface CredentialMatch {
  type: string;
  value: string;
  line: number;
  context: string;
}

export interface NetworkCall {
  url: string;
  method: string;
  status: number;
  size: number;
  type: string;
  secure: boolean;
  domain: string;
  timing: number;
}

export interface ScannedScript {
  url: string;
  type: 'external' | 'inline';
  content?: string;
  size?: number;
  credentials?: CredentialMatch[];
}

export interface ScanResult {
  id?: string;
  url: string;
  scripts: ScannedScript[];
  networkCalls: NetworkCall[];
  timestamp: string;
  totalScripts: number;
  totalCredentials: number;
  totalNetworkCalls: number;
  credentialsSummary: { [key: string]: number };
  networkSummary: {
    secure: number;
    insecure: number;
    totalSize: number;
    domains: string[];
  };
  seoAnalysis: SEOAnalysis; 
  userId?: string;
}

export interface SecurityScore {
  score: number;
  label: string;
  color: string;
  icon: React.ReactNode;
}

export type TabType = 'scripts' | 'network' | 'seo';

export interface DomainVerificationResult {
  verified: boolean;
  method?: string;
  error?: string;
}

export interface VerificationToken {
  domain: string;
  token: string;
  expiresAt: Date;
  userId?: string;
}

export interface SEOData {
  title: string;
  metaDescription: string;
  metaKeywords: string;
  canonical: string;
  viewport: string;
  charset: string;
  openGraph: {
    title: string;
    description: string;
    image: string;
    type: string;
  };
  twitterCard: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
  structuredData: any[];
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
    h4: string[];
    h5: string[];
    h6: string[];
  };
  images: {
    total: number;
    withoutAlt: number;
  };
  links: {
    internal: number;
    external: number;
  };
  content: {
    wordCount: number;
    textLength: number;
  };
  performance: {
    loadTime: number;
  };
  robotsTxt: string;
  sitemapExists: boolean;
  url: string;
}

export interface SEORecommendation {
  category: string;
  priority: 'high' | 'medium' | 'low';
  issue: string;
  recommendation: string;
}

export interface SEOAnalysis {
  data: SEOData;
  score: number;
  recommendations: SEORecommendation[];
}

interface SEOAnalysisData {
  data: SEOData;
  score: number;
  recommendations: SEORecommendation[];
}

interface SEOAnalysisProps {
  seoAnalysis: SEOAnalysisData;
}

export interface ScanHistoryItem {
  id: string;
  url: string;
  timestamp: string;
  totalScripts: number;
  totalCredentials: number;
  seoScore: number;
  userId?: string;
  title?: string; // Page title from SEO data
  status: 'completed' | 'failed' | 'in-progress';
}