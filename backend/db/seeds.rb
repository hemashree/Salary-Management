# Clear existing seed data so the seed can be safely re-run.
Salary.delete_all
Employee.delete_all

COUNTRIES = {
  "India" => "INR",
  "USA" => "USD",
  "UK" => "GBP",
  "Germany" => "EUR",
  "Canada" => "CAD"
}.freeze

DEPARTMENTS = [
  "Engineering",
  "Finance",
  "Human Resources",
  "Sales",
  "Marketing",
  "Operations"
].freeze

DESIGNATIONS = [
  "Software Engineer",
  "Senior Software Engineer",
  "Engineering Manager",
  "Finance Manager",
  "HR Manager",
  "Sales Manager",
  "Marketing Manager",
  "Operations Manager"
].freeze

FIRST_NAMES = [
  "Aarav", "Ananya", "Rahul", "Priya", "Arjun",
  "Sneha", "Vikram", "Neha", "Rohan", "Kavya"
].freeze

LAST_NAMES = [
  "Sharma", "Patel", "Kumar", "Singh", "Gupta",
  "Reddy", "Mehta", "Nair", "Joshi", "Iyer"
].freeze

employees = []

10_000.times do |index|
  country = COUNTRIES.keys[index % COUNTRIES.length]

  employees << {
    first_name: FIRST_NAMES[index % FIRST_NAMES.length],
    last_name: LAST_NAMES[index % LAST_NAMES.length],
    email: "employee#{index + 1}@example.com",
    country: country,
    department: DEPARTMENTS[index % DEPARTMENTS.length],
    designation: DESIGNATIONS[index % DESIGNATIONS.length],
    date_of_joining: Date.new(
      2018 + (index % 8),
      (index % 12) + 1,
      (index % 28) + 1
    ),
    status: index % 10 == 0 ? "inactive" : "active",
    created_at: Time.current,
    updated_at: Time.current
  }
end

Employee.insert_all!(employees)

puts "Created #{Employee.count} employees"

salaries = Employee.find_each.map do |employee|
  base_salary =
    case employee.country
    when "India"
      800_000 + (employee.id % 10) * 100_000
    when "USA"
      80_000 + (employee.id % 10) * 5_000
    when "UK"
      55_000 + (employee.id % 10) * 4_000
    when "Germany"
      60_000 + (employee.id % 10) * 4_000
    when "Canada"
      70_000 + (employee.id % 10) * 4_000
    end

  {
    employee_id: employee.id,
    base_salary: base_salary,
    bonus: (base_salary * 0.10).round(2),
    currency: COUNTRIES[employee.country],
    effective_from: Date.new(2025, 1, 1),
    effective_to: nil,
    created_at: Time.current,
    updated_at: Time.current
  }
end

Salary.insert_all!(salaries)

puts "Created #{Salary.count} salary records"
puts "Seed completed successfully"