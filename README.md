# Salary Management System

A full-stack web application for managing employee information and
salary records across multiple countries.

## Live Application

-   **Frontend:** https://salary-management-two-chi.vercel.app
-   **Backend API:** https://salary-management-api-itz3.onrender.com
-   **Source code:** https://github.com/hemashree/Salary-Management
-   **Git branch:** `feature/backend`

## Technology Stack

  Layer                 Technology
  --------------------- -------------------------
  Frontend              React, Vite, JavaScript
  Backend               Ruby on Rails API
  Local database        SQLite
  Production database   PostgreSQL
  Frontend hosting      Vercel
  Backend hosting       Render

## Main Features

-   Dashboard with employee and salary-record counts.
-   Salary insights grouped by currency and country.
-   Employee counts grouped by department.
-   Employee listing with pagination.
-   Search by employee name or email.
-   Filters for country, department, and employment status.
-   Create, view, update, and delete employee records.
-   Salary history for each employee.
-   Create, update, and delete salary records.
-   Salary records include base salary, bonus, currency, and effective
    dates.
-   Seed data for 10,000 employees and 10,000 salary records.

## Local Setup

Prerequisites: Ruby, Bundler, Node.js, npm, and SQLite.

### Backend

``` bash
cd backend
bundle install
bin/rails db:prepare
bin/rails server
```

The Rails API runs at `http://localhost:3000`.

### Frontend

In a separate terminal:

``` bash
cd frontend
npm install
```

Create or update `frontend/.env`:

``` env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Then start Vite:

``` bash
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Tests

From the `backend` directory:

``` bash
bin/rails test
```

At the time of documentation, the suite passed **15 tests and 47
assertions**, with no failures or errors.

## Production Notes

The frontend is deployed on Vercel and the Rails API on Render.
Production uses PostgreSQL through `DATABASE_URL`. The Render build
command should run migrations, but should **not** run `db:seed` on every
deployment. Seed the production database only when intentionally
initializing it, to avoid duplicate records.

## Salary and Currency Handling

Salary totals are grouped by currency. Amounts in different currencies
are not added together or converted, because the application does not
implement foreign-exchange conversion.

## Repository Structure

``` text
salary-management/
├── backend/   # Rails API, models, migrations, tests, seeds
└── frontend/  # React + Vite application
```
