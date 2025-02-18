import * as dotenv from 'dotenv';
dotenv.config();
import type { BunRequest } from 'bun';
import connectDB from './backend/config/db';
import { getAllWebsites, getOneById, createNewAnalysis } from './backend/controllers/index';



Bun.serve({
  async fetch(req: Request) {
    const url = new URL(req.url);
    const path = url.pathname;
    
    if (!path.startsWith('/api')) {
      return new Response('Not Found', { status: 404 });
    }

    const params: Record<string, string> = {};
  

    try {
      // Match /api/websites
      if (path === '/api/websites' && req.method === 'GET') {
        return await getAllWebsites(req);
      }

      // Match /api/websites/:id
      const websiteMatch = path.match(/^\/api\/websites\/([^\/]+)$/);
      if (websiteMatch && req.method === 'GET') {
        params.id = websiteMatch[1];
        return await getOneById(req);
      }

      // Match /api/websites/:id/analyze
      const analysisMatch = path.match(/^\/api\/websites\/([^\/]+)\/analyze$/);
      if (analysisMatch && req.method === 'POST') {
        params.id = analysisMatch[1];
        const body = await req.json();
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