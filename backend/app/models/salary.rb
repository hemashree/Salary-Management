class Salary < ApplicationRecord
  belongs_to :employee

  validates :base_salary, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :bonus, numericality: { greater_than_or_equal_to: 0 }
  validates :currency, presence: true
  validates :effective_from, presence: true

  validate :effective_to_after_effective_from

  def total_compensation
    base_salary + bonus
  end

  private

  def effective_to_after_effective_from
    return if effective_to.blank? || effective_from.blank?

    if effective_to < effective_from
      errors.add(:effective_to, "must be after effective_from")
    end
  end
end