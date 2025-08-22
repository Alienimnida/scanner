import { Globe, Image, Link, FileText, Smartphone, BarChart3 } from 'lucide-react';

interface SEODetailsProps {
  seoData: any;
}

export function SEODetails({ seoData }: SEODetailsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">SEO Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-blue-400" />
            <h4 className="font-medium text-gray-100">Title & Meta</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-400">Title:</span>
              <p className="text-gray-200 mt-1 break-words">{seoData.title || 'Not found'}</p>
              <span className="text-xs text-gray-500">({seoData.title?.length || 0} characters)</span>
            </div>
            <div>
              <span className="text-gray-400">Description:</span>
              <p className="text-gray-200 mt-1 break-words">{seoData.metaDescription || 'Not found'}</p>
              <span className="text-xs text-gray-500">({seoData.metaDescription?.length || 0} characters)</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-green-400" />
            <h4 className="font-medium text-gray-100">Headings</h4>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Word Count:</span>
              <span className="text-gray-200">{seoData.content.wordCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Load Time:</span>
              <span className={seoData.performance.loadTime > 3000 ? 'text-red-400' : 'text-green-400'}>
                {(seoData.performance.loadTime / 1000).toFixed(1)}s
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Structured Data:</span>
              <span className={seoData.structuredData.length > 0 ? 'text-green-400' : 'text-red-400'}>
                {seoData.structuredData.length} items
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h4 className="font-medium text-gray-100 mb-3">Social Media Tags</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-sm font-medium text-gray-300 mb-2">Open Graph</h5>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Title:</span>
                <p className="text-gray-200 break-words">{seoData.openGraph.title || 'Not set'}</p>
              </div>
              <div>
                <span className="text-gray-400">Description:</span>
                <p className="text-gray-200 break-words">{seoData.openGraph.description || 'Not set'}</p>
              </div>
              <div>
                <span className="text-gray-400">Image:</span>
                <p className="text-gray-200 break-words">{seoData.openGraph.image || 'Not set'}</p>
              </div>
              <div>
                <span className="text-gray-400">Type:</span>
                <p className="text-gray-200">{seoData.openGraph.type || 'Not set'}</p>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-medium text-gray-300 mb-2">Twitter Card</h5>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Card:</span>
                <p className="text-gray-200">{seoData.twitterCard.card || 'Not set'}</p>
              </div>
              <div>
                <span className="text-gray-400">Title:</span>
                <p className="text-gray-200 break-words">{seoData.twitterCard.title || 'Not set'}</p>
              </div>
              <div>
                <span className="text-gray-400">Description:</span>
                <p className="text-gray-200 break-words">{seoData.twitterCard.description || 'Not set'}</p>
              </div>
              <div>
                <span className="text-gray-400">Image:</span>
                <p className="text-gray-200 break-words">{seoData.twitterCard.image || 'Not set'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
