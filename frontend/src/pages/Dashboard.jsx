import { useEffect, useState } from "react";
import api from "../services/api";

const currencySymbols = {
  INR: "₹",
  USD: "$",
  GBP: "£",
  EUR: "€",
  CAD: "C$",
};

function formatSalary(amount, currency) {
  const symbol = currencySymbols[currency] || currency;

  return `${symbol}${Number(amount).toLocaleString()}`;
}

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboard");
        setDashboard(response.data);
      } catch (err) {
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="dashboard">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Salary Management Dashboard</h1>
        <p>Overview of employees and salary information</p>
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total Employees</h3>
          <p>{dashboard.total_employees.toLocaleString()}</p>
        </div>

        <div className="summary-card">
          <h3>Salary Records</h3>
          <p>{dashboard.total_salary_records.toLocaleString()}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Salary by Currency</h2>

        <div className="data-grid">
          {dashboard.salary_by_currency.map((item) => (
            <div className="data-card" key={item.currency}>
              <strong>{item.currency}</strong>

              <p>
                Total Salary:{" "}
                {formatSalary(item.total_salary, item.currency)}
              </p>

              <p>
                Average Salary:{" "}
                {formatSalary(item.average_salary, item.currency)}
              </p>

              <p>
                Employees: {item.employee_count.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Salary by Country</h2>

        <div className="data-grid">
          {dashboard.salary_by_country.map((item) => (
            <div className="data-card" key={item.country}>
              <strong>{item.country}</strong>

              <p>
                Total Salary:{" "}
                {formatSalary(item.total_salary, item.currency)}
              </p>

              <p>
                Employees: {item.employee_count.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Salary by Department</h2>

        <div className="data-grid">
          {dashboard.salary_by_department.map((item) => (
            <div className="data-card" key={item.department}>
              <strong>{item.department}</strong>

              <p>
                Employee Count:{" "}
                {item.employee_count.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;