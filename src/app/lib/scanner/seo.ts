// /app/lib/scanner/seo.ts

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

export function calculateSEOScore(seoData: SEOData): number {
  let score = 0;
  const maxScore = 100;
  
  // Title (15 points)
  if (seoData.title) {
    if (seoData.title.length >= 30 && seoData.title.length <= 60) {
      score += 15;
    } else if (seoData.title.length > 0) {
      score += 8;
    }
  }
  
  // Meta description (15 points)
  if (seoData.metaDescription) {
    if (seoData.metaDescription.length >= 120 && seoData.metaDescription.length <= 160) {
      score += 15;
    } else if (seoData.metaDescription.length > 0) {
      score += 8;
    }
  }
  
  // H1 tags (10 points)
  if (seoData.headings.h1.length === 1) {
    score += 10;
  } else if (seoData.headings.h1.length > 0) {
    score += 5;
  }
  
  // Image alt tags (10 points)
  if (seoData.images.total > 0) {
    const altRatio = (seoData.images.total - seoData.images.withoutAlt) / seoData.images.total;
    score += Math.floor(altRatio * 10);
  } else {
    score += 5; // No images is better than images without alt
  }
  
  // Viewport meta tag (5 points)
  if (seoData.viewport.includes('width=device-width')) {
    score += 5;
  }
  
  // Canonical URL (5 points)
  if (seoData.canonical) {
    score += 5;
  }
  
  // Open Graph tags (10 points)
  let ogScore = 0;
  if (seoData.openGraph.title) ogScore += 3;
  if (seoData.openGraph.description) ogScore += 3;
  if (seoData.openGraph.image) ogScore += 2;
  if (seoData.openGraph.type) ogScore += 2;
  score += ogScore;
  
  // Content length (10 points)
  if (seoData.content.wordCount >= 300) {
    score += 10;
  } else if (seoData.content.wordCount >= 100) {
    score += 5;
  }
  
  // Robots.txt (5 points)
  if (seoData.robotsTxt) {
    score += 5;
  }
  
  // Sitemap (5 points)
  if (seoData.sitemapExists) {
    score += 5;
  }
  
  // Structured data (10 points)
  if (seoData.structuredData.length > 0) {
    score += 10;
  }
  
  // Performance (5 points)
  if (seoData.performance.loadTime < 3000) {
    score += 5;
  } else if (seoData.performance.loadTime < 5000) {
    score += 3;
  }
  
  return Math.min(score, maxScore);
}

export function generateSEORecommendations(seoData: SEOData): SEORecommendation[] {
  const recommendations: SEORecommendation[] = [];
  
  // Title issues
  if (!seoData.title) {
    recommendations.push({
      category: 'Title',
      priority: 'high',
      issue: 'Missing page title',
      recommendation: 'Add a descriptive title tag to your page. Keep it between 30-60 characters.'
    });
  } else if (seoData.title.length > 60) {
    recommendations.push({
      category: 'Title',
      priority: 'medium',
      issue: 'Title tag too long',
      recommendation: `Your title is ${seoData.title.length} characters. Shorten it to under 60 characters to prevent truncation in search results.`
    });
  } else if (seoData.title.length < 30) {
    recommendations.push({
      category: 'Title',
      priority: 'medium',
      issue: 'Title tag too short',
      recommendation: 'Consider expanding your title to be more descriptive (30-60 characters optimal).'
    });
  }
  
  // Meta description issues
  if (!seoData.metaDescription) {
    recommendations.push({
      category: 'Meta Description',
      priority: 'high',
      issue: 'Missing meta description',
      recommendation: 'Add a meta description tag. Keep it between 120-160 characters to improve click-through rates.'
    });
  } else if (seoData.metaDescription.length > 160) {
    recommendations.push({
      category: 'Meta Description',
      priority: 'medium',
      issue: 'Meta description too long',
      recommendation: `Your meta description is ${seoData.metaDescription.length} characters. Shorten it to under 160 characters.`
    });
  } else if (seoData.metaDescription.length < 120) {
    recommendations.push({
      category: 'Meta Description',
      priority: 'low',
      issue: 'Meta description could be longer',
      recommendation: 'Consider expanding your meta description to 120-160 characters for better search result visibility.'
    });
  }
  
  // H1 issues
  if (seoData.headings.h1.length === 0) {
    recommendations.push({
      category: 'Headings',
      priority: 'high',
      issue: 'Missing H1 tag',
      recommendation: 'Add exactly one H1 tag that describes the main topic of your page.'
    });
  } else if (seoData.headings.h1.length > 1) {
    recommendations.push({
      category: 'Headings',
      priority: 'medium',
      issue: 'Multiple H1 tags',
      recommendation: `You have ${seoData.headings.h1.length} H1 tags. Use only one H1 per page for better SEO.`
    });
  }
  
  // Heading hierarchy
  const totalHeadings = Object.values(seoData.headings).reduce((sum, headings) => sum + headings.length, 0);
  if (totalHeadings < 3 && seoData.content.wordCount > 500) {
    recommendations.push({
      category: 'Headings',
      priority: 'low',
      issue: 'Few heading tags for content length',
      recommendation: 'Consider adding more headings (H2, H3, etc.) to structure your content better.'
    });
  }
  
  // Image alt text issues
  if (seoData.images.withoutAlt > 0) {
    recommendations.push({
      category: 'Images',
      priority: 'medium',
      issue: 'Images missing alt text',
      recommendation: `${seoData.images.withoutAlt} out of ${seoData.images.total} images are missing alt text. Add descriptive alt attributes for accessibility and SEO.`
    });
  }
  
  // Mobile optimization
  if (!seoData.viewport) {
    recommendations.push({
      category: 'Mobile',
      priority: 'high',
      issue: 'Missing viewport meta tag',
      recommendation: 'Add a viewport meta tag: <meta name="viewport" content="width=device-width, initial-scale=1.0">'
    });
  } else if (!seoData.viewport.includes('width=device-width')) {
    recommendations.push({
      category: 'Mobile',
      priority: 'medium',
      issue: 'Viewport not optimized for mobile',
      recommendation: 'Update your viewport meta tag to include "width=device-width" for better mobile experience.'
    });
  }
  
  // Open Graph
  if (!seoData.openGraph.title && !seoData.openGraph.description) {
    recommendations.push({
      category: 'Social Media',
      priority: 'medium',
      issue: 'Missing Open Graph tags',
      recommendation: 'Add Open Graph tags (og:title, og:description, og:image) to improve social media sharing.'
    });
  } else if (!seoData.openGraph.image) {
    recommendations.push({
      category: 'Social Media',
      priority: 'low',
      issue: 'Missing Open Graph image',
      recommendation: 'Add an og:image tag to display a preview image when your page is shared on social media.'
    });
  }
  
  // Twitter Card
  if (!seoData.twitterCard.card) {
    recommendations.push({
      category: 'Social Media',
      priority: 'low',
      issue: 'Missing Twitter Card tags',
      recommendation: 'Add Twitter Card meta tags to optimize how your content appears when shared on Twitter.'
    });
  }
  
  // Content length
  if (seoData.content.wordCount < 300) {
    recommendations.push({
      category: 'Content',
      priority: 'medium',
      issue: 'Thin content',
      recommendation: `Your page has only ${seoData.content.wordCount} words. Consider adding more valuable content (300+ words recommended).`
    });
  } else if (seoData.content.wordCount < 100) {
    recommendations.push({
      category: 'Content',
      priority: 'high',
      issue: 'Very thin content',
      recommendation: `Your page has only ${seoData.content.wordCount} words. This is considered thin content by search engines. Add substantial, valuable content.`
    });
  }
  
  // Technical SEO
  if (!seoData.robotsTxt) {
    recommendations.push({
      category: 'Technical SEO',
      priority: 'low',
      issue: 'Missing robots.txt',
      recommendation: 'Create a robots.txt file to guide search engine crawlers.'
    });
  }
  
  if (!seoData.sitemapExists) {
    recommendations.push({
      category: 'Technical SEO',
      priority: 'low',
      issue: 'Missing sitemap',
      recommendation: 'Create an XML sitemap to help search engines discover your pages.'
    });
  }
  
  if (!seoData.canonical) {
    recommendations.push({
      category: 'Technical SEO',
      priority: 'medium',
      issue: 'Missing canonical URL',
      recommendation: 'Add a canonical link tag to prevent duplicate content issues.'
    });
  }
  
  if (!seoData.charset) {
    recommendations.push({
      category: 'Technical SEO',
      priority: 'medium',
      issue: 'Missing charset declaration',
      recommendation: 'Add a charset meta tag (e.g., <meta charset="utf-8">) to ensure proper text encoding.'
    });
  }
  
  // Structured data
  if (seoData.structuredData.length === 0) {
    recommendations.push({
      category: 'Structured Data',
      priority: 'low',
      issue: 'No structured data found',
      recommendation: 'Add JSON-LD structured data to help search engines understand your content better.'
    });
  }
  
  // Performance
  if (seoData.performance.loadTime > 5000) {
    recommendations.push({
      category: 'Performance',
      priority: 'high',
      issue: 'Slow page load time',
      recommendation: `Page loads in ${(seoData.performance.loadTime / 1000).toFixed(1)}s. Optimize images, minimize CSS/JS, and improve server response time.`
    });
  } else if (seoData.performance.loadTime > 3000) {
    recommendations.push({
      category: 'Performance',
      priority: 'medium',
      issue: 'Page load time could be improved',
      recommendation: `Page loads in ${(seoData.performance.loadTime / 1000).toFixed(1)}s. Consider optimizing for faster loading (under 3s recommended).`
    });
  }
  
  // Link analysis
  if (seoData.links.internal === 0 && seoData.content.wordCount > 200) {
    recommendations.push({
      category: 'Internal Linking',
      priority: 'low',
      issue: 'No internal links found',
      recommendation: 'Add internal links to help users navigate and improve SEO authority distribution.'
    });
  }
  
  if (seoData.links.external > 10) {
    recommendations.push({
      category: 'External Links',
      priority: 'low',
      issue: 'Many external links',
      recommendation: `You have ${seoData.links.external} external links. Consider if all are necessary and ensure they add value to users.`
    });
  }
  
  return recommendations;
}

// Helper function to analyze SEO data (you can expand this)
export function analyzeSEO(seoData: SEOData) {
  const score = calculateSEOScore(seoData);
  const recommendations = generateSEORecommendations(seoData);
  
  return {
    data: seoData,
    score,
    recommendations
  };
}