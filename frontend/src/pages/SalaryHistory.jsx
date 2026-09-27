import { useEffect, useState } from "react";
import api from "../services/api";

function SalaryHistory({ employee, onBack }) {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const response = await api.get(
          `/employees/${employee.id}/salaries`
        );

        setSalaries(response.data);
      } catch (err) {
        setError("Unable to load salary history.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalaries();
  }, [employee.id]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <button onClick={onBack}>← Back to Employees</button>

        <h1>Salary History</h1>
        <p>
          {employee.full_name} — {employee.designation}
        </p>
      </div>

      <div className="dashboard-section">
        {loading && <p>Loading salary history...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && salaries.length === 0 && (
          <p>No salary records found.</p>
        )}

        {!loading && !error && salaries.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table width="100%" cellPadding="12">
              <thead>
                <tr>
                  <th>Base Salary</th>
                  <th>Bonus</th>
                  <th>Total Compensation</th>
                  <th>Currency</th>
                  <th>Effective From</th>
                  <th>Effective To</th>
                </tr>
              </thead>

              <tbody>
                {salaries.map((salary) => (
                  <tr key={salary.id}>
                    <td>
                      {Number(salary.base_salary).toLocaleString()}
                    </td>
                    <td>
                      {Number(salary.bonus).toLocaleString()}
                    </td>
                    <td>
                      <strong>
                        {Number(
                          salary.total_compensation
                        ).toLocaleString()}
                      </strong>
                    </td>
                    <td>{salary.currency}</td>
                    <td>{salary.effective_from}</td>
                    <td>{salary.effective_to || "Current"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SalaryHistory;