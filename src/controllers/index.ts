import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import WebsiteAnalysis from "../models/webAnalysisModel";
import Website from "../models/webModel";


// Get all websites
const getAllWebsites = async (req: Request): Promise<Response> => {
  try {
    const websites = await WebsiteAnalysis.find();
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
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return new Response(JSON.stringify({ message: "Missing ID" }), {
      status: 400,
    });
  }

  try {
    // const objectId = new Types.ObjectId(id);
    const websiteAnalysis = await WebsiteAnalysis.findOne({ websiteId: id });

    if (!websiteAnalysis) {
      console.error(
        `Error with websiteId ${id}`,
      );
      return new Response(
        JSON.stringify({ message: "Website Analysis not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(websiteAnalysis), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(
      `Error fetching website analysis with websiteId ${id}`,
      error
    );
    return new Response(
      JSON.stringify({ message: "Error fetching website analysis" }),
      {
        status: 500,
      }
    );
  }
};

// Create new analysis for a website
const createNewAnalysis = async (req: Request): Promise<Response> => {
  try {
    const urlObj = new URL(req.url);
    const id = urlObj.pathname.split("/").pop();

    const body = await req.json();
    const { url, name } = body;

    let website;

    if (id) {
      website = await Website.findById(id);
    }

    if (!website) {
      if (!name || !url) {
        return new Response(
          JSON.stringify({ message: "Name and URL are required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      website = new Website({ name, url });
      await website.save();
    }

    const analysisResults = await runLighthouseAnalysis(website.url);
    const {
      seoScore,
      performanceScore,
      accessibilityScore,
      bestPracticeScore,
    } = analysisResults;

    const analysis = new WebsiteAnalysis({
      websiteId: website._id,
      seoScore,
      performanceScore,
      accessibilityScore,
      bestPracticeScore,
    });

    await analysis.save();

    return new Response(JSON.stringify(analysis), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating new analysis", error);
    return new Response(
      JSON.stringify({ message: "Error creating analysis" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

const runLighthouseAnalysis = async (url: string) => {
  try {
    const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });

    const options = { logLevel: "info", output: "json", port: chrome.port };
    const result = await lighthouse(url, options);

    await chrome.kill();

    return {
      seoScore: result.lhr.categories.seo.score * 100,
      performanceScore: result.lhr.categories.performance.score * 100,
      accessibilityScore: result.lhr.categories.accessibility.score * 100,
      bestPracticeScore: result.lhr.categories["best-practices"].score * 100,
      fullReport: result.lhr,
    };
  } catch (error) {
    console.error("Error running Lighthouse analysis:", error);
    throw new Error("Lighthouse analysis failed");
  }
};

export { createNewAnalysis, getAllWebsites, getOneById };
