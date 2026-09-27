require "test_helper"

class Api::V1::DashboardControllerTest < ActionDispatch::IntegrationTest
  setup do
    @employee = Employee.create!(
      first_name: "Test",
      last_name: "Employee",
      email: "test.employee@example.com",
      country: "India",
      department: "Engineering",
      designation: "Software Engineer",
      date_of_joining: "2024-01-01",
      status: "active"
    )

    Salary.create!(
      employee: @employee,
      base_salary: 100_000,
      bonus: 10_000,
      currency: "INR",
      effective_from: "2024-01-01"
    )
  end

  test "should get index" do
    get api_v1_dashboard_url

    assert_response :success

    response_data = JSON.parse(response.body)

    assert_equal 1, response_data["total_employees"]
    assert_equal 1, response_data["total_salary_records"]
    assert_equal "110000.0", response_data["salary_by_currency"].first["total_salary"]

    assert response_data.key?("salary_by_currency")
    assert response_data.key?("salary_by_country")
    assert response_data.key?("salary_by_department")
  end
end