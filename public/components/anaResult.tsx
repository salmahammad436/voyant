import axios from "axios";
import { useState } from "react";
//TODO
import type { AnalysisData } from "../../interfaces/anaResult"

const AnalysisCard: React.FC = () => {
	const [analysisData, setAnalysisData] = useState<AnalysisData[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchAnalysis = async () => {
		setLoading(true);
		try {
			const response = await axios.get<AnalysisData[]>("/api/websites");
			setAnalysisData(response.data);
		} catch (error) {
			console.error("Error fetching analysis data:", error);
			alert("Failed to fetch analysis data.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6 bg-white rounded-lg shadow-md mt-5">
			<button
				type="button"
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded border"
				onClick={fetchAnalysis}
				disabled={loading}
			>
				{loading ? "Loading..." : "show my websites "}
			</button>
			{analysisData.length === 0 ? (
				<p className="text-center text-gray-500 mt-4">
					No analysis data available.
				</p>
			) : (
				<div className="mt-5">
					{analysisData.map((data) => (
						<div key={data._id} className="border p-4 rounded-lg mb-4">
							<h2 className="text-xl font-semibold">
								Website ID: {data.websiteId}
							</h2>
							<p className="text-gray-500">
								Analysis Date: {new Date(data.analysisDate).toLocaleString()}
							</p>
							<div className="grid grid-cols-4 gap-4 mt-4">
								<div className="border p-4 rounded-lg">
									<p>Performance</p>
									<p className="text-red-500 text-xl font-bold">
										{data.performanceScore}%
									</p>
								</div>
								<div className="border p-4 rounded-lg">
									<p>SEO</p>
									<p className="text-green-500 text-xl font-bold">
										{data.seoScore}%
									</p>
								</div>
								<div className="border p-4 rounded-lg">
									<p>Accessibility</p>
									<p className="text-yellow-500 text-xl font-bold">
										{data.accessibilityScore}%
									</p>
								</div>
								<div className="border p-4 rounded-lg">
									<p>Best Practices</p>
									<p className="text-gray-500 text-xl font-bold">
										{data.bestPracticeScore}%
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default AnalysisCard;
