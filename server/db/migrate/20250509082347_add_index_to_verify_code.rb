class AddIndexToVerifyCode < ActiveRecord::Migration[7.1]
  def change
    add_index :verify_codes, :code, unique: true
  end
end
