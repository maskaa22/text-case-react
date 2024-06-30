import "./App.css";
import Transaction from "./components/transactions/Transaction";
import { QueryClient, QueryClientProvider } from "react-query";

function App() {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <Transaction />
    </QueryClientProvider>
  );
}

export default App;
