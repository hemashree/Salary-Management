class Api::V1::DashboardController < ApplicationController
  def index
    salaries = Salary.includes(:employee)

    total_employees = Employee.count
    total_salary_records = Salary.count

    salary_by_currency = salaries.group_by(&:currency).map do |currency, currency_salaries|
      total = currency_salaries.sum(&:total_compensation)

      {
        currency: currency,
        total_salary: total,
        average_salary: currency_salaries.empty? ? 0 : (total.to_f / currency_salaries.size).round(2),
        employee_count: currency_salaries.map(&:employee_id).uniq.count
      }
    end

    salary_by_country = salaries.group_by { |salary| salary.employee.country }.map do |country, country_salaries|
      {
        country: country,
        currency: country_salaries.first.currency,
        total_salary: country_salaries.sum(&:total_compensation),
        employee_count: country_salaries.map(&:employee_id).uniq.count
      }
    end

    salary_by_department = salaries.group_by { |salary| salary.employee.department }.map do |department, department_salaries|
      {
        department: department,
        total_salary: department_salaries.sum(&:total_compensation),
        employee_count: department_salaries.map(&:employee_id).uniq.count
      }
    end

    render json: {
      total_employees: total_employees,
      total_salary_records: total_salary_records,
      salary_by_currency: salary_by_currency,
      salary_by_country: salary_by_country,
      salary_by_department: salary_by_department
    }
  end
end