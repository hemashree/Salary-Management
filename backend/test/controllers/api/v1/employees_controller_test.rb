require "test_helper"

class Api::V1::EmployeesControllerTest < ActionDispatch::IntegrationTest
  def employee_attributes(email = "test-#{SecureRandom.hex(4)}@example.com")
    {
      first_name: "Test",
      last_name: "Employee",
      email: email,
      country: "India",
      department: "Engineering",
      designation: "Software Engineer",
      date_of_joining: "2024-01-01",
      status: "active"
    }
  end

  test "lists employees with pagination" do
    Employee.create!(employee_attributes)

    get "/api/v1/employees"

    assert_response :success

    response_body = JSON.parse(response.body)

    assert_equal 1, response_body["pagination"]["total_count"]
    assert_equal 1, response_body["data"].length
  end

  test "creates an employee" do
    assert_difference("Employee.count", 1) do
      post "/api/v1/employees",
           params: { employee: employee_attributes },
           as: :json
    end

    assert_response :created

    response_body = JSON.parse(response.body)

    assert_equal "Test Employee", response_body["full_name"]
  end

  test "searches employees by name" do
    Employee.create!(employee_attributes)

    get "/api/v1/employees?search=Test"

    assert_response :success

    response_body = JSON.parse(response.body)

    assert_equal 1, response_body["data"].length
  end

  test "filters employees by country" do
    Employee.create!(employee_attributes)

    get "/api/v1/employees?country=India"

    assert_response :success

    response_body = JSON.parse(response.body)

    assert_equal 1, response_body["data"].length
  end

  test "rejects invalid employee" do
    assert_no_difference("Employee.count") do
      post "/api/v1/employees",
           params: {
             employee: {
               first_name: "",
               last_name: "Employee",
               email: "invalid@example.com"
             }
           },
           as: :json
    end

    assert_response :unprocessable_entity
  end
end