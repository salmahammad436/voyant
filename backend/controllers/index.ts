import Website from "../models/webModel";
import WebsiteAnalysis from "../models/webAnalysisModel";
import { Request, Response } from "express";
import { Voyant } from "voyant";
// 1. Get all websites from the database
const getAllWebsites = async (req: Request, res: Response) => {
  try {
    const websites = await Website.find();
    return res.status(200).json(websites);
  } catch (error) {
    console.error("Error fetching websites", error);
    return res.status(500).json({ message: "Error fetching websites" });
  }
};

// 2. Get one website by ID
const getOneById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const website = await Website.findById(id);
    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }
    return res.status(200).json(website);
  } catch (error) {
    console.error(`Error fetching website with id ${id}`, error);
    return res.status(500).json({ message: "Error fetching website" });
  }
};

const createNewAnalysis = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { url, name } = req.body;

  try {
    const website = await Website.findById(id);
    if (!website) {
      return res.status(404).json({ message: "Website not found" });
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
    return res.status(200).json(analysis);
  } catch (error) {
    console.error("Error creating new analysis", error);
    return res.status(500).json({ message: "Error creating analysis" });
  }
};

// Function to run Voyant analysis
const runVoyantAnalysis = async (url: string) => {
  const analysis = new Voyant(url);
  const result = await analysis.run();
  return result;
};

export { getAllWebsites, getOneById, createNewAnalysis };
