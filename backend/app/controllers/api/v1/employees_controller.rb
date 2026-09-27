class Api::V1::EmployeesController < ApplicationController
  before_action :set_employee, only: %i[show update destroy]

  def index
    employees = Employee.all

    if params[:search].present?
      search = "%#{params[:search]}%"

      employees = employees.where(
        "first_name LIKE :search OR last_name LIKE :search OR email LIKE :search",
        search: search
      )
    end

    employees = employees.where(country: params[:country]) if params[:country].present?
    employees = employees.where(department: params[:department]) if params[:department].present?
    employees = employees.where(status: params[:status]) if params[:status].present?

    employees = employees.order(:id)

    page = [params.fetch(:page, 1).to_i, 1].max
    per_page = [[params.fetch(:per_page, 20).to_i, 1].max, 100].min

    total_count = employees.count
    total_pages = (total_count.to_f / per_page).ceil

    employees = employees.offset((page - 1) * per_page).limit(per_page)

    render json: {
      data: employees.map { |employee| employee_json(employee) },
      pagination: {
        page: page,
        per_page: per_page,
        total_count: total_count,
        total_pages: total_pages
      }
    }
  end

  def show
    render json: employee_json(@employee)
  end

  def create
    employee = Employee.new(employee_params)

    if employee.save
      render json: employee_json(employee), status: :created
    else
      render json: { errors: employee.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @employee.update(employee_params)
      render json: employee_json(@employee)
    else
      render json: { errors: @employee.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @employee.destroy
    head :no_content
  end

  private

  def set_employee
    @employee = Employee.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Employee not found" }, status: :not_found
  end

  def employee_params
    params.require(:employee).permit(
      :first_name,
      :last_name,
      :email,
      :country,
      :department,
      :designation,
      :date_of_joining,
      :status
    )
  end

  def employee_json(employee)
    latest_salary = employee.salaries.order(effective_from: :desc).first

    {
      id: employee.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      full_name: employee.full_name,
      email: employee.email,
      country: employee.country,
      department: employee.department,
      designation: employee.designation,
      date_of_joining: employee.date_of_joining,
      status: employee.status,
      latest_salary: latest_salary && {
        base_salary: latest_salary.base_salary,
        bonus: latest_salary.bonus,
        total_compensation: latest_salary.total_compensation,
        currency: latest_salary.currency,
        effective_from: latest_salary.effective_from,
        effective_to: latest_salary.effective_to
      }
    }
  end
end