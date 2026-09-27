import { useEffect, useState } from "react";
import api from "../services/api";

function EmployeeForm({ employee, onSuccess, onCancel }) {
  const isEditMode = Boolean(employee);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    country: "India",
    department: "Engineering",
    designation: "Software Engineer",
    date_of_joining: "",
    status: "active",
  });

  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        first_name: employee.first_name || "",
        last_name: employee.last_name || "",
        email: employee.email || "",
        country: employee.country || "India",
        department: employee.department || "Engineering",
        designation: employee.designation || "Software Engineer",
        date_of_joining: employee.date_of_joining || "",
        status: employee.status || "active",
      });
    }
  }, [employee]);

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
      if (isEditMode) {
        await api.patch(`/employees/${employee.id}`, {
          employee: formData,
        });
      } else {
        await api.post("/employees", {
          employee: formData,
        });
      }

      onSuccess();
    } catch (error) {
      const apiErrors = error.response?.data?.errors;

      setErrors(
        apiErrors || [
          `Unable to ${isEditMode ? "update" : "create"} employee. Please try again.`,
        ]
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-section">
      <h2>{isEditMode ? "Edit Employee" : "Add Employee"}</h2>

      {errors.length > 0 && (
        <div className="form-errors">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}

      <form className="employee-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Germany">Germany</option>
            <option value="Canada">Canada</option>
          </select>
        </div>

        <div className="form-group">
          <label>Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="Engineering">Engineering</option>
            <option value="Finance">Finance</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
          </select>
        </div>

        <div className="form-group">
          <label>Designation</label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
          >
            <option value="Software Engineer">Software Engineer</option>
            <option value="Senior Software Engineer">
              Senior Software Engineer
            </option>
            <option value="Engineering Manager">
              Engineering Manager
            </option>
            <option value="Finance Manager">Finance Manager</option>
            <option value="HR Manager">HR Manager</option>
            <option value="Sales Manager">Sales Manager</option>
            <option value="Marketing Manager">Marketing Manager</option>
            <option value="Operations Manager">Operations Manager</option>
          </select>
        </div>

        <div className="form-group">
          <label>Date of Joining</label>
          <input
            type="date"
            name="date_of_joining"
            value={formData.date_of_joining}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : isEditMode
                ? "Update Employee"
                : "Create Employee"}
          </button>

          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;