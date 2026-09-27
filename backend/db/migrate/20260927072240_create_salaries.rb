class CreateSalaries < ActiveRecord::Migration[8.1]
  def change
    create_table :salaries do |t|
      t.references :employee, null: false, foreign_key: true
      t.decimal :base_salary, precision: 15, scale: 2, null: false
      t.decimal :bonus, precision: 15, scale: 2, null: false, default: 0
      t.string :currency, null: false
      t.date :effective_from, null: false
      t.date :effective_to

      t.timestamps
    end

    add_index :salaries, [:employee_id, :effective_from]
    add_index :salaries, :currency
    add_index :salaries, :effective_from
  end
end