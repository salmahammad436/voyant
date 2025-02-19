import Website from "../models/webModel";
import WebsiteAnalysis from "../models/webAnalysisModel";
import  Voyant  from "voyant";
import type { AnyARecord } from "dns";

// Get all websites
const getAllWebsites = async (req:Request) => {
  try {
    const websites = await Website.find();
    return websites;
  } catch (error) {
    console.error("Error fetching websites", error);
    return { message: "Error fetching websites" };
  }
};

// Get one website by ID
const getOneById = async (req:Request) => {
  const { id } = req.params;
  try {
    const website = await Website.findById(id);
    if (!website) {
      return { message: "Website not found" };
    }
    return website;
  } catch (error) {
    console.error(`Error fetching website with id ${id}`, error);
    return { message: "Error fetching website" };
  }
};

// Create new analysis for a website
const createNewAnalysis = async (req:Request) => {
  const { id } = req.params;
  const { url, name} = req.body;
  try {
    const website = await Website.findById(id);
    if (!website) {
      return { message: "Website not found" };
    }

    const analysisResults = await runVoyantAnalysis(url);
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
    return JSON.stringify(analysis);
  } catch (error) {
    console.error("Error creating new analysis", error);
    return { message: "Error creating analysis" };
  }
};

// Function to run Voyant analysis
const runVoyantAnalysis = async (url) => {
  try {
    const analysis =  Voyant(url);
    const result = await analysis.run();
    return result;
  } catch (error) {
    console.error("Error running Voyant analysis", error);
    throw new Error("Voyant analysis failed");
  }
};

export { getAllWebsites, getOneById, createNewAnalysis };
