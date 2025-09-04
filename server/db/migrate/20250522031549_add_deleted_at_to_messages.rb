class AddDeletedAtToMessages < ActiveRecord::Migration[7.1]
  def change
    add_column :messages, :deleted_at, :datetime
  end
end
