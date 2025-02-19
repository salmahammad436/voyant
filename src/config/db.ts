import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const connectDB = async () => {
	try {
		await mongoose.connect(
			process.env.DB_URL
		);
		console.log("DB connected");
	} catch (error) {
		console.error("Database connection failed", error);
		process.exit(1);
	}
};

export default connectDB;
