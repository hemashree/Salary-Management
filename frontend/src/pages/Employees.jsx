import { useEffect, useState } from "react";
import api from "../services/api";
import EmployeeForm from "./EmployeeForm";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/employees", {
        params: {
          search: search || undefined,
          country: country || undefined,
          department: department || undefined,
          status: status || undefined,
          page,
          per_page: 10,
        },
      });

      setEmployees(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError("Unable to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, country, department, status]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    fetchEmployees();
  };

  const clearFilters = () => {
    setSearch("");
    setCountry("");
    setDepartment("");
    setStatus("");
    setPage(1);
  };

  const handleEmployeeCreated = () => {
    setShowForm(false);
    setPage(1);
    fetchEmployees();
  };

  if (showForm) {
    return (
      <div className="dashboard">
        <EmployeeForm
          onSuccess={handleEmployeeCreated}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Employee Management</h1>
          <p>Search, filter and manage employees</p>
        </div>

        <button onClick={() => setShowForm(true)}>
          + Add Employee
        </button>
      </div>

      <div className="dashboard-section">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={country}
            onChange={(event) => {
              setCountry(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All Countries</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Germany">Germany</option>
            <option value="Canada">Canada</option>
          </select>

          <select
            value={department}
            onChange={(event) => {
              setDepartment(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Finance">Finance</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
          </select>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button type="submit">Search</button>

          <button type="button" onClick={clearFilters}>
            Clear
          </button>
        </form>
      </div>

      <div className="dashboard-section">
        {loading && <p>Loading employees...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && (
          <>
            <h2>
              Employees ({pagination.total_count?.toLocaleString() || 0})
            </h2>

            <div style={{ overflowX: "auto" }}>
              <table width="100%" cellPadding="12">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Country</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.full_name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.country}</td>
                      <td>{employee.department}</td>
                      <td>{employee.designation}</td>
                      <td>{employee.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <button
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
              >
                Previous
              </button>

              <span style={{ margin: "0 15px" }}>
                Page {pagination.page || page} of{" "}
                {pagination.total_pages || 1}
              </span>

              <button
                disabled={page >= (pagination.total_pages || 1)}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Employees;