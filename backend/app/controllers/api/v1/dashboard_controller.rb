class Api::V1::DashboardController < ApplicationController
  def index
    salaries = Salary.includes(:employee)

    total_employees = Employee.count
    total_salary_records = Salary.count
    total_salary = salaries.sum(&:total_compensation)
    average_salary = total_salary_records.zero? ? 0 : total_salary.to_f / total_salary_records

    salary_by_country = salaries.group_by { |salary| salary.employee.country }.map do |country, country_salaries|
      {
        country: country,
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
      total_salary: total_salary,
      average_salary: average_salary.round(2),
      salary_by_country: salary_by_country,
      salary_by_department: salary_by_department
    }
  end
end