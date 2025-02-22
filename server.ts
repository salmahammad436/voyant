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
		const urlPath = () => {
			return `/api/websites/${url.pathname.split("/").slice(3).join("/")}`;
		};

		// API routes
		switch (`${req.method} ${path}`) {
			case "GET /api/websites":
				return await getAllWebsites(req);

			case `GET ${urlPath()}`:
				return await getOneById(req);
			case `POST ${urlPath()}`:
				return await createNewAnalysis(req);
			default:
				return new Response("Not Found", { status: 404 });
		}
	},
	port: process.env.PORT || 3000,
});

connectDB();