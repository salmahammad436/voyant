import { useState } from "react";
import axios from "axios";
import Input from "./inputs";



const AnalysisForm: React.FC = () => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error' | null}>({text: "", type: null});

  const handleAnalyze = async () => {
    if (!url || !name) {
      setMessage({text: "Please enter both the website name and URL😒", type: 'error'});
      return;
    }
    try {
      await axios.post("/api/websites/", { name, url });
      setMessage({text: "Analysis completed successfully! Website added to the list👌", type: 'success'});
      setName("");
      setUrl("");
    } catch (error: any) {
      setMessage({text: "Failed to analyze website😥", type: 'error'});
    }
  };
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Website Analysis</h2>
      
      <div className="flex flex-col gap-6">
        <Input
          label="Website URL"
          name="url"
          value={url}
          placeholder="https://example.com"
          onChange={(e) => setUrl(e.target.value)}
        />
        <Input
          label="Website Name"
          name="website-name"
          value={name}
          placeholder="your Website"
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="button"
          className="bg-orange-800 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded border transition-colors"
          onClick={handleAnalyze}
        >
          Analyze Website
        </button>
        
        {message.text && (
          <div className={`p-4 rounded-lg mt-4 ${
            message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
            message.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' : ''
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisForm;