import lighthouse from "lighthouse";
import puppeteer from "puppeteer";
import type { AnalysisData } from "../../interfaces/anaResult";
import WebsiteAnalysis,{type IwebAnalisis} from "../models/webAnalysisModel";
import Website, { type IWebsite } from "../models/webModel";
import crypto from "crypto";
import { Types } from "mongoose";

// Get all websites
const getAllWebsites = async (req: Request): Promise<Response> => {
  try {
    const websites = await Website.find().populate({path:'AnalysisData',select:'seoScore performanceScore accessibilityScore bestPracticeScore analysisDate'})
    return new Response(JSON.stringify(websites), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching websites", error);
    return new Response(
      JSON.stringify({ message: "Error fetching websites" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// Get one website by ID
const getOneById = async (req: Request): Promise<Response> => {
  try {
    const urlObj = new URL(req.url);

    const pathParts = urlObj.pathname.split('/');
    const id = pathParts[3];
    if (!id) {
      return new Response(JSON.stringify({ message: "id is required" }), {
        status: 400,
      });
    }
    const websiteAnalysis = await Website.findOne({_id:id }).populate({
      path: 'AnalysisData',
      select: 'seoScore performanceScore accessibilityScore bestPracticeScore analysisDate'
    });
    if (!websiteAnalysis) {
      return new Response(
        JSON.stringify({ message: "Website Analysis not found" }),
        { status: 404 }
      );
    }
    return new Response(JSON.stringify(websiteAnalysis), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Error fetching website analysis`, error);
    return new Response(
      JSON.stringify({ message: "Error fetching website analysis" }),
      { status: 500 }
    );
  }
};

const createNewAnalysis = async (req: Request): Promise<Response> => {
  try {
    const body = await req.json();
    const { url, name } = body;
    if (!name || !url) {
      return new Response(
        JSON.stringify({ message: "Name and URL are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const hashedUrl = crypto.createHash("sha256").update(url).digest("hex");
    let website: IWebsite | null = await Website.findOne({ hashedUrl });
    const analysisResults = await runLighthouseAnalysis(url);
    const { seoScore, performanceScore, accessibilityScore, bestPracticeScore } = analysisResults;
    const analysis = new WebsiteAnalysis({
      websiteId: website?._id,
      seoScore,
      performanceScore,
      accessibilityScore,
      bestPracticeScore,
    });
    await analysis.save(); 
    if (!website) {
      website = new Website({ name, url,hashedUrl, AnalysisData: [analysis._id] });
    } else {
      website.AnalysisData.push(analysis._id as Types.ObjectId);
    }
    await website.save(); 
    return new Response(JSON.stringify(analysis), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error creating new analysis", error);
    return new Response(
      JSON.stringify({ message: "Error creating analysis" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const runLighthouseAnalysis = async (url: string): Promise<AnalysisData> => {
  let browser;
  try{
  //  browser = await puppeteer.launch({
  //   // executablePath: "/usr/bin/chromium",
  //   headless: true,
  //   args: ["--no-sandbox", "--disable-setuid-sandbox"],
  //   dumpio: true,
  // });
  browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
    dumpio: true,
  })

    const { port } = new URL(browser.wsEndpoint());
    const options = { logLevel: "info", output: "json", port };
    // @ts-ignore: lighthouse types might be incorrect
    const result = await lighthouse(url, options);

    if (!result || !result.lhr) {
      throw new Error("Lighthouse result is undefined or invalid.");
    }

    return {
      seoScore: result.lhr.categories?.seo?.score
        ? result.lhr.categories.seo.score * 100
        : 0,
      performanceScore: result.lhr.categories?.performance?.score
        ? result.lhr.categories.performance.score * 100
        : 0,
      accessibilityScore: result.lhr.categories?.accessibility?.score
        ? result.lhr.categories.accessibility.score * 100
        : 0,
      bestPracticeScore: result.lhr.categories?.["best-practices"]?.score
        ? result.lhr.categories["best-practices"].score * 100
        : 0,
      fullReport: result.lhr,
    } as AnalysisData;
  } catch (error) {
    console.error("Error running Lighthouse analysis:", error);
    throw new Error("Lighthouse analysis failed");
  }
};


export { createNewAnalysis, getAllWebsites, getOneById };
