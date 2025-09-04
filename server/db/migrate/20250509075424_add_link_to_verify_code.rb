class AddLinkToVerifyCode < ActiveRecord::Migration[7.1]
  def change
    change_table :verify_codes do |t|
      t.string :link
    end
  end
end
