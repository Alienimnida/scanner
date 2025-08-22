import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface Recommendation {
  category: string;
  priority: 'high' | 'medium' | 'low';
  issue: string;
  recommendation: string;
}

interface SEORecommendationsProps {
  recommendations: Recommendation[];
}

export function SEORecommendations({ recommendations }: SEORecommendationsProps) {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'medium':
        return <Info className="w-5 h-5 text-yellow-400" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-blue-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-400 bg-red-900/20';
      case 'medium':
        return 'border-yellow-400 bg-yellow-900/20';
      default:
        return 'border-blue-400 bg-blue-900/20';
    }
  };

  const groupedRecommendations = recommendations.reduce((acc, rec) => {
    if (!acc[rec.priority]) acc[rec.priority] = [];
    acc[rec.priority].push(rec);
    return acc;
  }, {} as Record<string, Recommendation[]>);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">
        SEO Recommendations ({recommendations.length})
      </h3>

      {['high', 'medium', 'low'].map(priority => {
        const recs = groupedRecommendations[priority] || [];
        if (recs.length === 0) return null;

        return (
          <div key={priority} className="space-y-3">
            <h4 className="text-lg font-medium text-gray-200 capitalize flex items-center gap-2">
              {getPriorityIcon(priority)}
              {priority} Priority ({recs.length})
            </h4>
            
            <div className="space-y-3">
              {recs.map((rec, index) => (
                <div 
                  key={index}
                  className={`border-l-4 p-4 rounded-r-lg ${getPriorityColor(rec.priority)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-300 bg-gray-700 px-2 py-1 rounded">
                      {rec.category}
                    </span>
                  </div>
                  <h5 className="font-medium text-gray-100 mb-2">{rec.issue}</h5>
                  <p className="text-gray-300 text-sm leading-relaxed">{rec.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {recommendations.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-100 mb-2">Great SEO!</h4>
          <p className="text-gray-400">No major SEO issues found. Your page is well optimized.</p>
        </div>
      )}
    </div>
  );
}
