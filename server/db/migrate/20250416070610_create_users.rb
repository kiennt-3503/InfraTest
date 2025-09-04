class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :username, null: false
      t.string :email, null: true
      t.string :password_digest, null: false

      t.timestamps
    end
  end
end
