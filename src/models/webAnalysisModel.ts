import mongoose, { Schema } from "mongoose";

const WebsiteAnalysisSchema = new Schema({
	websiteId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Website",
		required: true,
	},
	seoScore: { type: Number, required: true },
	performanceScore: { type: Number, required: true },
	accessibilityScore: { type: Number, required: true },
	bestPracticeScore: { type: Number, required: true },
	analysisDate: { type: Date, default: Date.now },
});

const WebsiteAnalysis = mongoose.model(
	"WebsiteAnalysis",
	WebsiteAnalysisSchema,
);

export default WebsiteAnalysis;
