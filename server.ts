import * as dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db';
import { getAllWebsites, getOneById, createNewAnalysis } from './controllers/index';
import { serve } from "bun";
import { readFile } from "fs/promises";



Bun.serve({
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;

  
    if (path === "/") {
      try {
        const html = await readFile("public/index.html", "utf-8");
        return new Response(html, { headers: { "Content-Type": "text/html" } });
      } catch (error) {
        console.error("Error loading index.html:", error);
        return new Response("Internal Server Error", { status: 500 });
      }
    }

  
    if (path.endsWith(".tsx")) {
      return new Response(Bun.file(`src${path}`));
    }

    if (path.startsWith('/api')) {
      try {
        if (path === '/api/websites' && req.method === 'GET') {
          return await getAllWebsites(req);
        }

        const websiteMatch = path.match(/^\/api\/websites\/([^\/]+)$/);
        if (websiteMatch && req.method === 'GET') {
          return await getOneById(req);
        }

        const analysisMatch = path.match(/^\/api\/websites\/([^\/]+)\/analyze$/);
        if (analysisMatch && req.method === 'POST') {
          return await createNewAnalysis(req);
        }

        return new Response(
          JSON.stringify({ message: 'Endpoint not found' }),
          { status: 404 }
        );

      } catch (error) {
        console.error('Server error:', error);
        return new Response(
          JSON.stringify({ message: 'Internal server error' }),
          { status: 500 }
        );
      }
    }


    return new Response('Not Found', { status: 404 });
  },
  port: process.env.PORT || 3000
});


connectDB()
  .then(() => {
    console.log(`Server & Database running on port ${process.env.PORT || 3000}`);
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });