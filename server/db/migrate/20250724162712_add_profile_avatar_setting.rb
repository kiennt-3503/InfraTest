class AddProfileAvatarSetting < ActiveRecord::Migration[7.1]
  def change
    add_column :profiles, :avatar_settings, :jsonb, default: {}
  end
end
