import "./App.css";
import Transaction from "./components/transactions/Transaction";
import { QueryClient, QueryClientProvider } from "react-query";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex-between">
        <div className="name-table-box">asx</div>
        <div className="table-container"><Transaction /></div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
