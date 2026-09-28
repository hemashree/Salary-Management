# System Architecture

## 1. Overview

The application uses a separate React frontend and Ruby on Rails API
backend. The browser sends HTTP requests to the Rails API. The API
validates requests, reads or writes PostgreSQL records, and returns JSON
responses.

``` text
User's Browser
      |
      v
React + Vite frontend
Hosted on Vercel
      |
      | HTTPS / JSON API requests
      v
Ruby on Rails API
Hosted on Render
      |
      | Active Record
      v
PostgreSQL
Hosted on Render
```

For local development, the Rails application uses SQLite. Production
uses PostgreSQL through the `DATABASE_URL` environment variable.

## 2. Frontend

The frontend is built with React and Vite.

Responsibilities: - Render the dashboard and employee-management
screens. - Collect search and filter inputs. - Display paginated
employee results. - Submit employee and salary create/update/delete
requests. - Display salary history. - Call the backend through a shared
Axios API client.

The API base URL is configured with `VITE_API_BASE_URL`. In production,
it points to the deployed Rails API.

## 3. Backend

The backend is a Rails API organized under `/api/v1`.

Main resources: - `GET /api/v1/dashboard` - `GET /api/v1/employees` -
`GET /api/v1/employees/:id` - `POST /api/v1/employees` -
`PATCH /api/v1/employees/:id` - `DELETE /api/v1/employees/:id` - Nested
salary endpoints under `/api/v1/employees/:employee_id/salaries`

The employee index endpoint supports search, filters, and pagination.
Rails strong parameters restrict which fields can be changed through API
requests. Model validations protect required fields and salary values.

## 4. Data Model

### Employee

Stores: - First and last name - Email - Country - Department -
Designation - Date of joining - Employment status

Email is unique. Indexes support lookups and common filters.

### Salary

Stores: - Employee reference - Base salary - Bonus - Currency -
Effective-from date - Optional effective-to date

Each salary belongs to an employee. An employee can have multiple salary
records, enabling salary history. Total compensation is calculated as
base salary plus bonus.

### Relationship

``` text
Employee 1 -------- * Salary
```

## 5. Dashboard Aggregation

Dashboard data includes: - Total employee count - Total salary-record
count - Salary totals and averages grouped by currency - Salary totals
grouped by country - Employee counts grouped by department

Currencies are kept separate. For example, USD and INR totals are not
combined into one amount.

## 6. Data Volume and Query Design

The application is seeded with 10,000 employees and 10,000 salary
records. The employee API uses pagination, with a bounded page size.
Database indexes support email uniqueness and common country,
department, status, currency, and date queries.

## 7. Cross-Origin Requests

The Rails CORS initializer allows the local Vite origin and the deployed
Vercel frontend origin. The production frontend origin must match the
deployed domain.

## 8. Deployment

-   **Frontend:** Vercel, with root directory `frontend`, build command
    `npm run build`, and output directory `dist`.
-   **Backend:** Render, with root directory `backend`.
-   **Production database:** Render PostgreSQL.
-   **Environment:** `DATABASE_URL`, `RAILS_ENV=production`, and
    `RAILS_MASTER_KEY` are configured in the backend service
    environment.

The backend build runs dependency installation and database migrations.
Seeding is a one-time initialization step and should not run on every
deployment.

## 9. Current Limitations / Future Improvements

-   Add authentication and authorization.
-   Add audit logging for employee and salary changes.
-   Add stricter protection against deleting records needed for payroll
    history.
-   Add background jobs and monitoring if workload grows.
-   Add database-backed pagination/aggregation optimizations if dataset
    size increases substantially.
-   Add explicit API versioning and API contract documentation.
-   Add production backup and recovery procedures.
-   Add currency conversion only if supported by a defined exchange-rate
    source and reporting requirement.
