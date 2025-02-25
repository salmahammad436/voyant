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
      
        if (req.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            });
        }

        let response;
        switch (`${req.method} ${path}`) {
            case "GET /api/websites":
                response = await getAllWebsites(req);
                break;
            case `GET ${urlPath()}`:
                response = await getOneById(req);
                break;
            case `POST /api/websites/`:
                response = await createNewAnalysis(req);
                break;
            default:
                response = new Response("Not Found", { status: 404 });
        }
	   const headersObject: Record<string, string> = {};
	   response.headers.forEach((value, key) => {
		headersObject[key] = value;
	   });
	   console.log(headersObject);
        return new Response(response.body, {
            status: response.status,
            headers: {
                ...headersObject,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    },
    port: process.env.PORT || 3001,
});

connectDB();
