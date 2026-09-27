require "test_helper"

class Api::V1::SalariesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @employee = Employee.create!(
      first_name: "Jane",
      last_name: "Smith",
      email: "jane-#{SecureRandom.hex(4)}@example.com",
      country: "USA",
      department: "Finance",
      designation: "Finance Manager",
      date_of_joining: "2023-06-01",
      status: "active"
    )
  end

  def salary_attributes
    {
      base_salary: 90_000,
      bonus: 10_000,
      currency: "USD",
      effective_from: "2025-01-01"
    }
  end

  test "creates a salary record" do
    assert_difference("Salary.count", 1) do
      post "/api/v1/employees/#{@employee.id}/salaries",
           params: { salary: salary_attributes },
           as: :json
    end

    assert_response :created

    response_body = JSON.parse(response.body)

    assert_equal "90000.0", response_body["base_salary"]
    assert_equal "10000.0", response_body["bonus"]
    assert_equal "100000.0", response_body["total_compensation"]
  end

  test "lists salary history" do
    @employee.salaries.create!(salary_attributes)

    get "/api/v1/employees/#{@employee.id}/salaries"

    assert_response :success

    response_body = JSON.parse(response.body)

    assert_equal 1, response_body.length
    assert_equal "USD", response_body.first["currency"]
  end

  test "updates a salary record" do
    salary = @employee.salaries.create!(salary_attributes)

    patch "/api/v1/employees/#{@employee.id}/salaries/#{salary.id}",
          params: { salary: { bonus: 20_000 } },
          as: :json

    assert_response :success

    response_body = JSON.parse(response.body)

    assert_equal "20000.0", response_body["bonus"]
    assert_equal "110000.0", response_body["total_compensation"]
  end

  test "rejects negative salary" do
    post "/api/v1/employees/#{@employee.id}/salaries",
         params: {
           salary: salary_attributes.merge(base_salary: -5_000)
         },
         as: :json

    assert_response :unprocessable_entity

    response_body = JSON.parse(response.body)

    assert_includes response_body["errors"],
                    "Base salary must be greater than or equal to 0"
  end

  test "deletes a salary record" do
    salary = @employee.salaries.create!(salary_attributes)

    assert_difference("Salary.count", -1) do
      delete "/api/v1/employees/#{@employee.id}/salaries/#{salary.id}"
    end

    assert_response :no_content
  end
end