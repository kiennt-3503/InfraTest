class CreateVerifyCode < ActiveRecord::Migration[7.1]
  def change
    create_table :verify_codes do |t|
      t.string :code
      t.datetime :expired_at

      t.timestamps
    end
  end
end
