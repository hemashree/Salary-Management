import { useState } from "react";
import api from "../services/api";

function SalaryForm({ employee, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    base_salary: "",
    bonus: "0",
    currency: employee.latest_salary?.currency || "INR",
    effective_from: "",
    effective_to: "",
  });

  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setErrors([]);

    try {
      await api.post(`/employees/${employee.id}/salaries`, {
        salary: {
          ...formData,
          effective_to: formData.effective_to || null,
        },
      });

      onSuccess();
    } catch (error) {
      const apiErrors = error.response?.data?.errors;

      setErrors(
        apiErrors || ["Unable to create salary. Please try again."]
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-section">
      <h2>Add Salary</h2>

      <p>
        Employee: <strong>{employee.full_name}</strong>
      </p>

      {errors.length > 0 && (
        <div className="form-errors">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}

      <form className="employee-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Base Salary</label>
          <input
            type="number"
            name="base_salary"
            min="0"
            step="0.01"
            value={formData.base_salary}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Bonus</label>
          <input
            type="number"
            name="bonus"
            min="0"
            step="0.01"
            value={formData.bonus}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Currency</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
            <option value="CAD">CAD</option>
          </select>
        </div>

        <div className="form-group">
          <label>Effective From</label>
          <input
            type="date"
            name="effective_from"
            value={formData.effective_from}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Effective To</label>
          <input
            type="date"
            name="effective_to"
            value={formData.effective_to}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Create Salary"}
          </button>

          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default SalaryForm;