class Api::V1::SalariesController < ApplicationController
  before_action :set_employee
  before_action :set_salary, only: %i[show update destroy]

  def index
    salaries = @employee.salaries.order(effective_from: :desc)

    render json: salaries.map { |salary| salary_json(salary) }
  end

  def show
    render json: salary_json(@salary)
  end

  def create
    salary = @employee.salaries.new(salary_params)

    if salary.save
      render json: salary_json(salary), status: :created
    else
      render json: { errors: salary.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  def update
    if @salary.update(salary_params)
      render json: salary_json(@salary)
    else
      render json: { errors: @salary.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  def destroy
    @salary.destroy
    head :no_content
  end

  private

  def set_employee
    @employee = Employee.find(params[:employee_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Employee not found" }, status: :not_found
  end

  def set_salary
    @salary = @employee.salaries.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Salary record not found" }, status: :not_found
  end

  def salary_params
    params.require(:salary).permit(
      :base_salary,
      :bonus,
      :currency,
      :effective_from,
      :effective_to
    )
  end

  def salary_json(salary)
    {
      id: salary.id,
      employee_id: salary.employee_id,
      base_salary: salary.base_salary,
      bonus: salary.bonus,
      total_compensation: salary.total_compensation,
      currency: salary.currency,
      effective_from: salary.effective_from,
      effective_to: salary.effective_to
    }
  end
end
