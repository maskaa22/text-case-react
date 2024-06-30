import "./App.css";
import Transaction from "./components/transactions/Transaction";
import Nav from "./components/nav/Nav"
import { QueryClient, QueryClientProvider } from "react-query";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Nav/>
        <Transaction />
    </QueryClientProvider>
  );
}

export default App;
