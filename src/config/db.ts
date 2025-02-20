import { config } from "dotenv";
import mongoose from "mongoose";
config();
const connectDB = async () => {
	try {
		const dbUrl = process.env.DB_URL;
		if (!dbUrl) {
			console.error("DB_URL not found");
			throw new Error("Database connection failed");
		}
		await mongoose.connect(
			dbUrl, //TODO
		);
		console.log("DB connected");
	} catch (error) {
		console.error("Database connection failed", error);
		throw new Error("Database connection failed");
	}
};

export default connectDB;
