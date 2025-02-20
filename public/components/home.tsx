import axios from "axios";
import { useState } from "react";
import Input from "./inputs";

const Home: React.FC = () => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const handleAnalyze = async () => {
    if (!url || !name) {
      alert("Please enter both the website name and URL.");
      return;
    }

    try {
      const response = await axios.post("/api/websites/", { name, url });
      console.log("Analysis started:", response.data);
      alert("Analysis started successfully!");
    } catch (error: any) {
      console.error("Error analyzing website:", error.response?.data || error);
      alert("Failed to analyze website.");
    }
  };
  
  return (
			<div className="flex flex-col items-start mt-5 ml-5">
				<header className="text-2xl mb-10">
					You can analyze your website here:
				</header>
				<div className="flex gap-3">
					<Input
						label="Enter a URL"
						name="url"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
					/>
					<Input
						label="Enter the website name"
						name="website-name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<div className="flex justify-center items-center">
						<button
							type="button"
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded border mt-9"
							onClick={handleAnalyze}
						>
							Analyze
						</button>
					</div>
				</div>
			</div>
		);
};

export default Home;
