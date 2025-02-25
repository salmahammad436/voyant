export interface AnalysisData {
  _id?: string;
  websiteId?: string | any;
  seoScore: number;
  performanceScore: number;
  accessibilityScore: number;
  bestPracticeScore: number;
  analysisDate: string;
  fullReport?: any;
}


export interface WebsiteScoreCardProps {
  data: AnalysisData;
}

export interface WebsiteResultsProps {
  analysisData: { _id: string; name?: string; AnalysisData: AnalysisData[] }[];
  loading: boolean;
}
