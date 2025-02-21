import type { AnalysisData,WebsiteScoreCardProps } from "../../interfaces/anaResult";

const WebsiteScoreCard: React.FC<WebsiteScoreCardProps> = ({ data }) => {
  const getColorClass = (score: number) => {
    if (score >= 90) return 'text-green-700';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-700';
  };

  const handelNums = (num: number) => Math.round(num / 10) * 10;
  return (
    <div className="border border-gray-200 p-5 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
      <h3 className="text-xl font-semibold">
  {data.websiteId ? data.websiteId.name : "( has no name)"}
</h3>

        <span className="text-sm text-gray-500">
          {new Date(data.analysisDate).toLocaleString()}
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">Performance</p>
          <p className={`text-xl font-bold ${getColorClass(data.performanceScore)}`}>
            {handelNums(data.performanceScore)}%
          </p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">SEO</p>
          <p className={`text-xl font-bold ${getColorClass(data.seoScore)}`}>
            {handelNums(data.seoScore)}%
          </p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">Accessibility</p>
          <p className={`text-xl font-bold ${getColorClass(data.accessibilityScore)}`}>
            {handelNums(data.accessibilityScore)}%
          </p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">Best Practices</p>
          <p className={`text-xl font-bold ${getColorClass(data.bestPracticeScore)}`}>
            {handelNums(data.bestPracticeScore)}%
          </p>
        </div>
      </div>
    </div>
  );
};
export default WebsiteScoreCard;