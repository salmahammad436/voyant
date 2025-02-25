import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AnalysisForm from "./AnalysisForm";
import WebsiteResults from "./WebsiteResults";

const fetchAnalysis = async () => {
  const {data}  = await axios.get("/api/websites");
  console.log("Fetched Data:", data); 
  return data;
};

const Home: React.FC = () => {
  const { data: analysisData = [], isLoading } = useQuery({
    queryKey: ["analysisData"],
    queryFn: fetchAnalysis,
  });
  return (
    <div className="container mx-auto p-4 mt-10">
      <h1 className="text-orange-800 text-4xl p-1.5">
        Welcome to your website 😍
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <AnalysisForm />
        </div>
        <div className="md:w-1/2">
          <WebsiteResults analysisData={analysisData} loading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Home;
