import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWebsite extends Document {
  name: string;
  url: string;
  hashedUrl:string;
  AnalysisData: mongoose.Types.ObjectId[];
}
const WebsiteSchema: Schema<IWebsite> = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  hashedUrl:{type:String},
  AnalysisData: [{ type: mongoose.Schema.Types.ObjectId, ref: "WebsiteAnalysis" }],
});

const Website: Model<IWebsite> = mongoose.model<IWebsite>("Website", WebsiteSchema);
export default Website;
