class CreateEmployees < ActiveRecord::Migration[8.1]
  def change
    create_table :employees do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :email, null: false
      t.string :country, null: false
      t.string :department, null: false
      t.string :designation, null: false
      t.date :date_of_joining, null: false
      t.string :status, null: false, default: "active"

      t.timestamps
    end

    add_index :employees, :email, unique: true
    add_index :employees, :country
    add_index :employees, :department
    add_index :employees, :status
    add_index :employees, [:country, :department]
  end
end