import { useEffect, useState } from "react";
import api from "../services/api";
import SalaryForm from "./SalaryForm";

function SalaryHistory({ employee, onBack }) {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSalary, setEditingSalary] = useState(null);

  const fetchSalaries = async () => {
    setLoading(true);
    setError("");

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

  useEffect(() => {
    fetchSalaries();
  }, [employee.id]);

  const handleSalarySaved = () => {
    setShowForm(false);
    setEditingSalary(null);
    fetchSalaries();
  };

  const handleEdit = (salary) => {
    setEditingSalary(salary);
    setShowForm(true);
  };

  const handleDelete = async (salary) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this salary record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/employees/${employee.id}/salaries/${salary.id}`
      );

      fetchSalaries();
    } catch (err) {
      setError("Unable to delete salary record.");
    }
  };

  if (showForm) {
    return (
      <div className="dashboard">
        <SalaryForm
          employee={employee}
          salary={editingSalary}
          onSuccess={handleSalarySaved}
          onCancel={() => {
            setShowForm(false);
            setEditingSalary(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <button onClick={onBack}>← Back to Employees</button>

        <h1>Salary History</h1>

        <p>
          {employee.full_name} — {employee.designation}
        </p>

        <button
          onClick={() => {
            setEditingSalary(null);
            setShowForm(true);
          }}
        >
          + Add Salary
        </button>
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
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {salaries.map((salary) => (
                  <tr key={salary.id}>
                    <td>
                      {Number(
                        salary.base_salary
                      ).toLocaleString()}
                    </td>

                    <td>
                      {Number(
                        salary.bonus
                      ).toLocaleString()}
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

                    <td>
                      {salary.effective_to || "Current"}
                    </td>

                    <td>
                      <button
                        onClick={() => handleEdit(salary)}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(salary)}
                        style={{ marginLeft: "8px" }}
                      >
                        Delete
                      </button>
                    </td>
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