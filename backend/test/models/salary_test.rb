require "test_helper"

class SalaryTest < ActiveSupport::TestCase
  def create_employee(email = "john-#{SecureRandom.hex(4)}@example.com")
    Employee.create!(
      first_name: "John",
      last_name: "Doe",
      email: email,
      country: "India",
      department: "Engineering",
      designation: "Software Engineer",
      date_of_joining: Date.new(2024, 1, 1),
      status: "active"
    )
  end

  test "valid salary" do
    salary = Salary.new(
      employee: create_employee,
      base_salary: 100_000,
      bonus: 10_000,
      currency: "USD",
      effective_from: Date.new(2025, 1, 1)
    )

    assert salary.valid?
  end

  test "calculates total compensation" do
    salary = Salary.new(
      base_salary: 100_000,
      bonus: 10_000
    )

    assert_equal 110_000, salary.total_compensation
  end

  test "rejects negative base salary" do
    salary = Salary.new(
      base_salary: -100,
      bonus: 0,
      currency: "USD",
      effective_from: Date.current
    )

    assert_not salary.valid?
    assert_includes salary.errors[:base_salary],
                    "must be greater than or equal to 0"
  end

  test "rejects effective_to before effective_from" do
    salary = Salary.new(
      base_salary: 100_000,
      bonus: 0,
      currency: "USD",
      effective_from: Date.new(2025, 6, 1),
      effective_to: Date.new(2025, 1, 1)
    )

    assert_not salary.valid?
    assert_includes salary.errors[:effective_to],
                    "must be after effective_from"
  end
end