class Employee < ApplicationRecord
  has_many :salaries, dependent: :destroy

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :country, presence: true
  validates :department, presence: true
  validates :designation, presence: true
  validates :date_of_joining, presence: true
  validates :status, presence: true, inclusion: { in: %w[active inactive] }

  def full_name
    "#{first_name} #{last_name}"
  end
end