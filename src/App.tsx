import "./App.css";
import Transaction from "./components/transactions/Transaction";
import Nav from "./components/nav/Nav";
import { QueryClient, QueryClientProvider } from "react-query";
import { Route, Routes, Navigate } from "react-router-dom";
import LoginForm from "./components/login/LoginForm";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Nav />
      
      <Routes>
        <Route path={`/transaction/:token`} element={<Transaction />} />
        <Route path={"/login"} element={<LoginForm />} />
        <Route path={"*"} element={<Navigate to={"/login"} replace />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
