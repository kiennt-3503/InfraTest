# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_07_24_162712) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "addresses", force: :cascade do |t|
    t.string "address_line"
    t.float "latitude"
    t.float "longitude"
    t.string "building_name"
    t.string "floor"
    t.string "note"
    t.bigint "district_id", null: false
    t.bigint "town_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["district_id"], name: "index_addresses_on_district_id"
    t.index ["town_id"], name: "index_addresses_on_town_id"
  end

  create_table "chat_room_members", force: :cascade do |t|
    t.bigint "chat_room_id", null: false
    t.bigint "user_id", null: false
    t.datetime "joined_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "last_read_message_id"
    t.datetime "last_read_at"
    t.index ["chat_room_id"], name: "index_chat_room_members_on_chat_room_id"
    t.index ["last_read_message_id"], name: "index_chat_room_members_on_last_read_message_id"
    t.index ["user_id"], name: "index_chat_room_members_on_user_id"
  end

  create_table "chat_rooms", force: :cascade do |t|
    t.string "room_name"
    t.integer "room_type"
    t.string "chatroom_location_type"
    t.integer "chatroom_location_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "members_count", default: 0, null: false
  end

  create_table "districts", force: :cascade do |t|
    t.bigint "section_id"
    t.string "district_name"
    t.float "latitude"
    t.float "longitude"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "interests", force: :cascade do |t|
    t.bigint "category_id", null: false
    t.string "interest_name"
    t.boolean "custom_interest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_interests_on_category_id"
  end

  create_table "interests_categories", force: :cascade do |t|
    t.string "category_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "line_companies", force: :cascade do |t|
    t.string "name"
    t.string "name_K"
    t.string "name_H"
    t.string "name_R"
    t.string "url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "messages", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "chat_room_id", null: false
    t.text "content", null: false
    t.integer "message_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["chat_room_id"], name: "index_messages_on_chat_room_id"
    t.index ["user_id"], name: "index_messages_on_user_id"
  end

  create_table "prefectures", force: :cascade do |t|
    t.bigint "region_id"
    t.string "prefecture_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "profiles", primary_key: "user_id", force: :cascade do |t|
    t.text "bio"
    t.integer "gender"
    t.date "birthday"
    t.integer "mbti"
    t.integer "zodiac"
    t.text "language_proficiency"
    t.string "profile_picture_url"
    t.text "fullname"
    t.text "fullname_kana"
    t.string "phone"
    t.jsonb "avatar_settings", default: {}
    t.index ["user_id"], name: "index_profiles_on_user_id"
  end

  create_table "push_subscriptions", force: :cascade do |t|
    t.string "endpoint"
    t.string "p256dh"
    t.string "auth"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_push_subscriptions_on_user_id"
  end

  create_table "regions", force: :cascade do |t|
    t.string "region_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "sections", force: :cascade do |t|
    t.bigint "prefecture_id"
    t.string "section_name"
    t.float "latitude"
    t.float "longitude"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "stations", force: :cascade do |t|
    t.bigint "prefecture_id", null: false
    t.string "station_name"
    t.string "station_code"
    t.float "latitude"
    t.float "longitude"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "address"
    t.string "post"
    t.index ["post"], name: "index_stations_on_post"
    t.index ["prefecture_id", "post"], name: "index_stations_on_prefecture_id_and_post"
    t.index ["prefecture_id"], name: "index_stations_on_prefecture_id"
  end

  create_table "towns", force: :cascade do |t|
    t.bigint "district_id"
    t.string "town_name"
    t.float "latitude"
    t.float "longitude"
    t.string "postalCode"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "train_line_stations", force: :cascade do |t|
    t.bigint "train_line_id", null: false
    t.bigint "station_id", null: false
    t.integer "station_order"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["station_id"], name: "index_train_line_stations_on_station_id"
    t.index ["train_line_id"], name: "index_train_line_stations_on_train_line_id"
  end

  create_table "train_lines", force: :cascade do |t|
    t.string "line_name"
    t.string "color"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name_K"
    t.string "name_H"
    t.float "latitude"
    t.float "longitude"
    t.bigint "operator_id"
    t.index ["operator_id"], name: "index_train_lines_on_operator_id"
  end

  create_table "user_interests", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "interest_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["interest_id"], name: "index_user_interests_on_interest_id"
    t.index ["user_id"], name: "index_user_interests_on_user_id"
  end

  create_table "user_locations", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "user_location_type"
    t.integer "user_location_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_live", default: false
    t.index ["user_id"], name: "index_user_locations_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username", null: false
    t.string "email"
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  create_table "verify_codes", force: :cascade do |t|
    t.string "code"
    t.datetime "expired_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "link"
    t.index ["code"], name: "index_verify_codes_on_code", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "addresses", "districts"
  add_foreign_key "addresses", "towns"
  add_foreign_key "chat_room_members", "chat_rooms"
  add_foreign_key "chat_room_members", "users"
  add_foreign_key "districts", "sections"
  add_foreign_key "interests", "interests_categories", column: "category_id"
  add_foreign_key "messages", "chat_rooms"
  add_foreign_key "messages", "users"
  add_foreign_key "prefectures", "regions"
  add_foreign_key "profiles", "users"
  add_foreign_key "push_subscriptions", "users"
  add_foreign_key "sections", "prefectures"
  add_foreign_key "stations", "prefectures"
  add_foreign_key "towns", "districts"
  add_foreign_key "train_line_stations", "stations"
  add_foreign_key "train_line_stations", "train_lines"
  add_foreign_key "train_lines", "line_companies", column: "operator_id"
  add_foreign_key "user_interests", "interests"
  add_foreign_key "user_interests", "users"
  add_foreign_key "user_locations", "users"
end
