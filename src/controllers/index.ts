import lighthouse from "lighthouse";
import puppeteer from "puppeteer";
import type { AnalysisData } from "../../interfaces/anaResult";
import WebsiteAnalysis from "../models/webAnalysisModel";
import Website, { type WebsiteType } from "../models/webModel";

// Get all websites
const getAllWebsites = async (req: Request): Promise<Response> => {
	try {
		//here I am trying to populate the name of website from websiIte
		const websites = await WebsiteAnalysis.find().populate("websiteId", "name");
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
			},
		);
	}
};

// Get one website by ID
const getOneById = async (req: Request): Promise<Response> => {
	const url = new URL(req.url);
	const id = url.pathname.match(/\/api\/websites\/([^\/]+)/)?.[1];
	if (!id) {
		return new Response(JSON.stringify({ message: "Missing ID" }), {
			status: 400,
		});
	}

	try {
		const websiteAnalysis = await WebsiteAnalysis.findOne({ websiteId: id });

		if (!websiteAnalysis) {
			console.error(`Error with websiteId ${id}`);
			return new Response(
				JSON.stringify({ message: "Website Analysis not found" }),
				{ status: 404 },
			);
		}

		return new Response(JSON.stringify(websiteAnalysis), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error(
			`Error fetching website analysis with websiteId ${id}`,
			error,
		);
		return new Response(
			JSON.stringify({ message: "Error fetching website analysis" }),
			{
				status: 500,
			},
		);
	}
};

// Create new analysis for a website
const createNewAnalysis = async (req: Request): Promise<Response> => {
	try {
		const urlObj = new URL(req.url);
		const id = urlObj.pathname.match(/\/api\/websites\/([^\/]+)/)?.[1];
		const body = await req.json();
		const { url, name } = body;

		let website: WebsiteType | null = null;

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
					},
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
			},
		);
	}
};

const runLighthouseAnalysis = async (url: string): Promise<AnalysisData> => {
	let browser; //TODO

	try {
		const browser = await puppeteer.launch({
			headless: true,
			args: [
				"--no-sandbox",
				"--disable-setuid-sandbox",
				"--disable-dev-shm-usage",
			],
			dumpio: true,
			executablePath: process.env.CHROME_PATH, // Set Chrome path from environment variable
		});

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
