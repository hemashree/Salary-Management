# Requirements and Scope

## 1. Project Objective

Build a web-based Salary Management System that supports employee and
salary administration for a workforce of 10,000 employees across
multiple countries.

## 2. Functional Requirements

### Employee Management

-   Display employee records in a paginated list.
-   Search employees by name or email.
-   Filter employees by country, department, and status.
-   Create employee records.
-   View and edit employee information.
-   Delete employee records.

### Salary Management

-   Associate salary records with employees.
-   Store base salary, bonus, currency, effective-from date, and
    optional effective-to date.
-   View an employee's salary history.
-   Create, edit, and delete salary records.
-   Calculate total compensation as base salary plus bonus.
-   Validate that salary amounts are non-negative.
-   Validate salary effective dates.

### Dashboard and Insights

-   Display the total number of employees.
-   Display the total number of salary records.
-   Summarize salary amounts by currency.
-   Summarize salary amounts by country.
-   Display employee counts by department.

### Data and Scale

-   Provide seed data for 10,000 employees and 10,000 salary records.
-   Support multiple countries and currencies.
-   Use pagination to avoid returning the full employee dataset in one
    response.

## 3. Non-Functional Requirements

-   **Maintainability:** Separate frontend and backend responsibilities.
-   **Data integrity:** Use model validations, database constraints, and
    employee--salary associations.
-   **Performance:** Add database indexes for commonly filtered and
    joined fields.
-   **Usability:** Provide clear forms, search, filters, and pagination.
-   **Testability:** Include automated backend tests.
-   **Deployability:** Support a production PostgreSQL database and
    separately hosted frontend and API.
-   **Security basics:** Use Rails strong parameters and server-side
    validation.

## 4. Technology Requirements

-   Frontend: React with Vite.
-   Backend: Ruby on Rails API.
-   Development database: SQLite.
-   Production database: PostgreSQL.
-   Hosting: Vercel for the frontend and Render for the backend.

## 5. Acceptance Checklist

-   [x] Dashboard loads and displays summary information.
-   [x] Employee list supports search, filters, and pagination.
-   [x] Employee create, edit, and delete operations work.
-   [x] Salary history can be viewed and managed.
-   [x] Seed data contains 10,000 employees and 10,000 salary records.
-   [x] Backend automated tests pass.
-   [x] Frontend and backend are deployed.
-   [x] Production frontend can communicate with the API.

## 6. Scope Notes

-   Currency totals are reported separately; no exchange-rate conversion
    is performed.
-   Authentication and role-based access control are not included in the
    documented feature set.
-   The application is an assessment/demo implementation and may require
    additional hardening before use with real employee or payroll data.
