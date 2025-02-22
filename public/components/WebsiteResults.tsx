import type { WebsiteResultsProps } from "../../interfaces/anaResult";
import WebsiteScoreCard from "./card";

const WebsiteResults: React.FC<WebsiteResultsProps> = ({ analysisData, loading }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Website Analysis Results</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : analysisData.length === 0 ? (
        <p className="text-center text-gray-500 p-6 bg-gray-50 rounded-lg">
          No analysis data available yet.
        </p>
      ) : (
        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
          {analysisData.map((data) => (
            <WebsiteScoreCard key={data._id} data={data} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WebsiteResults;
