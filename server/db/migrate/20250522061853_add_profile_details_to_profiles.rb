class AddProfileDetailsToProfiles < ActiveRecord::Migration[7.1]
  def change
    add_column :profiles, :fullname, :text
    add_column :profiles, :fullname_kana, :text
    add_column :profiles, :phone, :bigint
  end
end
