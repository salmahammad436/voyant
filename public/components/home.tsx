import axios from "axios";
import { useEffect, useState } from "react";
import type { AnalysisData } from "../../interfaces/anaResult";
import AnalysisForm from "./AnalysisForm";
import WebsiteResults from "./WebsiteResults";

const Home: React.FC = () => {
	const [analysisData, setAnalysisData] = useState<AnalysisData[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchAnalysis();
	}, []);

	const fetchAnalysis = async () => {
		setLoading(true);
		try {
			const response = await axios.get<AnalysisData[]>("/api/websites");
			setAnalysisData(response.data);
		} catch (error) {
			console.error("Error fetching analysis data:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="container mx-auto p-4 mt-10">
				<h1 className="text-orange-800 text-4xl p-1.5">
					welcome to your website 😍
				</h1>
				<div className="flex flex-col md:flex-row gap-8">
					<div className="md:w-1/2">
						<AnalysisForm />
					</div>
					<div className="md:w-1/2">
						<WebsiteResults analysisData={analysisData} loading={loading} />
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;
