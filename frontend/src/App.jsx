import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import "./index.css";

function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">Salary Management</div>

        <div className="nav-links">
          <button
            className={page === "dashboard" ? "nav-button active" : "nav-button"}
            onClick={() => setPage("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={page === "employees" ? "nav-button active" : "nav-button"}
            onClick={() => setPage("employees")}
          >
            Employees
          </button>
        </div>
      </nav>

      {page === "dashboard" ? <Dashboard /> : <Employees />}
    </>
  );
}

export default App;