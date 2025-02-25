import Home from "./components/home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App() {
	return (
	<QueryClientProvider client={new QueryClient()}>
	<Home />
	</QueryClientProvider>)
}
