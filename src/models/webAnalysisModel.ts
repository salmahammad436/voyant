import mongoose, { Schema, Document, Model } from "mongoose";

export interface IwebAnalisis extends Document {
  seoScore: number;
  performanceScore: number;
  accessibilityScore: number;
  bestPracticeScore: number;
  analysisDate?: Date;
}

const WebsiteAnalysisSchema = new Schema<IwebAnalisis>({

  seoScore: { type: Number, required: true },
  performanceScore: { type: Number, required: true },
  accessibilityScore: { type: Number, required: true },
  bestPracticeScore: { type: Number, required: true },
  analysisDate: { type: Date, default: Date.now },
});

const WebsiteAnalysis: Model<IwebAnalisis> = mongoose.model<IwebAnalisis>(
  "WebsiteAnalysis",
  WebsiteAnalysisSchema
);

export default WebsiteAnalysis;
