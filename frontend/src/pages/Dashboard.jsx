import { useEffect, useState } from "react";
import api from "../services/api";

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

        <div className="summary-card">
          <h3>Total Salary</h3>
          <p>₹{Number(dashboard.total_salary).toLocaleString()}</p>
        </div>

        <div className="summary-card">
          <h3>Average Salary</h3>
          <p>₹{Number(dashboard.average_salary).toLocaleString()}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Salary by Country</h2>

        <div className="data-grid">
          {dashboard.salary_by_country.map((item) => (
            <div className="data-card" key={item.country}>
              <strong>{item.country}</strong>
              <p>
                Total Salary: ₹
                {Number(item.total_salary).toLocaleString()}
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
                Total Salary: ₹
                {Number(item.total_salary).toLocaleString()}
              </p>
              <p>
                Employees: {item.employee_count.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;