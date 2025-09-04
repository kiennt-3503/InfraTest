# app/api/v1/chat_rooms/create.rb
module V1
  module ChatRooms
    class Create < Grape::API
      desc 'Create a new chat room'
      params do
        requires :room_type, type: String, values: %w[direct group]
        requires :chatroom_location_type, type: String, values: %w[User District Town Station]
        optional :chatroom_location_id, type: Integer
        optional :user_ids, type: Array[Integer]
      end

      post '/create' do
        location_object = nil
        if params[:chatroom_location_id].present?
          location_class  = params[:chatroom_location_type].constantize
          location_object = location_class.find(params[:chatroom_location_id])
        end

        # ------------------------
        # TÌM PHÒNG CHAT TỒN TẠI
        # ------------------------
        existing_chat_room = nil

        if params[:room_type] == 'direct'
          other_user_id = (params[:user_ids] || []).first
          if other_user_id
            # Lấy tất cả phòng direct có 2 thành viên
            candidate_rooms = ChatRoom
              .where(room_type: 'direct')
              .joins(:chat_room_members)
              .group('chat_rooms.id')
              .having('COUNT(chat_room_members.user_id) = 2')

            existing_chat_room = candidate_rooms.detect do |room|
              member_ids = room.chat_room_members.pluck(:user_id).sort
              member_ids == [current_user.id, other_user_id.to_i].sort
            end
          end

        elsif params[:room_type] == 'group' && location_object.present?
          existing_chat_room = ChatRoom.find_by(
            room_type: 'group',
            chatroom_location: location_object
          )
        end

        if existing_chat_room
          # Nếu đã tồn tại, trả về luôn
          present existing_chat_room, with: Entities::ChatRooms::ChatRoom
          return
        end

        # ------------------------
        # TẠO PHÒNG CHAT MỚI
        # ------------------------
        chat_room = nil
        ActiveRecord::Base.transaction do
          chat_room = ChatRoom.create!(
            room_type: params[:room_type],
            chatroom_location: location_object
          )

          # Xử lý member theo room_type
          user_ids =
            if params[:room_type] == 'direct'
              other_user_id = (params[:user_ids] || []).first
              error!({ message: 'A direct chat requires one other user_id' }, 422) unless other_user_id
              [current_user.id, other_user_id.to_i]
            else
              (params[:user_ids] || []) << current_user.id
            end

          user_ids = user_ids.compact.uniq

          # Kiểm tra user có tồn tại không
          existing_ids = User.where(id: user_ids).pluck(:id)
          missing_ids  = user_ids - existing_ids
          error!({ message: "Users not found: #{missing_ids.join(', ')}" }, 422) if missing_ids.any?

          # Tạo member
          user_ids.each do |uid|
            chat_room.chat_room_members.create!(user_id: uid)
          end
        end

        present chat_room, with: Entities::ChatRooms::ChatRoom
      rescue NameError, ActiveRecord::RecordNotFound => e
        error!({ message: "ERROR: #{e.class} - #{e.message}" }, 422)
      rescue ActiveRecord::RecordInvalid => e
        error!({ message: e.record.errors.full_messages.join(', ') }, 422)
      end
    end
  end
end
