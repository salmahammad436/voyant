import { config } from "dotenv";
import index from "./public/index.html";
import connectDB from "./src/config/db";
import {
	createNewAnalysis,
	getAllWebsites,
	getOneById,
} from "./src/controllers";
config();


Bun.serve({
	static: {
		"/": index,
	},

	async fetch(req: Request): Promise<Response> {
		const url = new URL(req.url);
		const path = url.pathname;

		// API routes
		switch (`${req.method} ${path}`) {
			case "GET /api/websites":
				return await getAllWebsites(req);
			//TODO: Explain the code below
			case `GET /api/websites/${url.pathname.split("/").slice(3).join("/")}`:
				return await getOneById(req);
			case `POST /api/websites/${url.pathname.split("/").slice(3).join("/")}`:
				return await createNewAnalysis(req);
			//END TODO
			default:
				return new Response("Not Found", { status: 404 });
		}
	},
	port: process.env.PORT || 3000,
});


connectDB()
  .then(() => {
    console.log(`Server & Database running on port ${process.env.PORT || 3000}`);
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  })