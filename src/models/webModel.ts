import mongoose, { Schema } from "mongoose";

const WebsiteSchema = new Schema({
	url: { type: String, required: true },
	name: { type: String, required: true },
});

const Website = mongoose.model("Website", WebsiteSchema);

export type WebsiteType = typeof Website;

export default Website;
