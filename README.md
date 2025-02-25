**Website Analysis Tool**
This project is a Website Analysis Tool that allows users to analyze websites and view their performance metrics, including SEO, accessibility, best practices, and performance scores. The tool is built using Bun as the runtime, React for the frontend, and MongoDB for the database. It also uses Lighthouse and Puppeteer for website analysis.

**Features**
Analyze Websites: Users can input a website URL and name to analyze its performance.

View Analysis History: Users can view the analysis history of all websites.

Performance Metrics: Detailed metrics for SEO, accessibility, best practices, and performance.

Real-Time Updates: The UI updates in real-time when new analyses are added.

**Technologies Used**
**Frontend:**
React
TailwindCSS (for styling)
React Query (for data fetching and state management)

**Backend:**
Bun (runtime)
MongoDB (database)
Mongoose (ODM for MongoDB)
Lighthouse (for website analysis)
Puppeteer (for browser automation)

**Other Tools:**
Axios (for HTTP requests)
Dotenv (for environment variables)

**Setup Instructions**
1. Prerequisites
Install Bun: Bun Installation Guide

Install MongoDB: MongoDB Installation Guide

Install Node.js (optional, for frontend tools): Node.js Installation Guide

2. Clone the Repository
git clone https://github.com/salmahammad436/voyant.git
bun install
4. Set Up Environment Variables
Create a .env file in the root directory and add the following variables:

env
PORT=3001
MONGODB_URI=mongodb:"mongodb://localhost:27017/voyant"

 Start the Server
 bun run server.ts

**API Endpoints**
GET /api/websites Fetch all websites and their analysis data.

GET /api/websites/:id Fetch analysis data for a specific website by ID.

POST /api/websites/  Analyze a new website and save the results.