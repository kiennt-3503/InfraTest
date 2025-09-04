module V1
  class Messages < V1::Base
    helpers V1::Base.helpers

    before { authenticate! }

    resource :messages do
      desc 'Send a message between users'
      params do
        optional :receiver_id, type: Integer, desc: 'ID of the receiver'
        requires :content, type: String, desc: 'Message content'
        optional :message_type, type: Integer, values: [1, 2, 3], desc: 'Type of message (1=text, 2=image, 3=file)'
        optional :chat_room_id, type: Integer, desc: 'ID of the chat room'
      end

      post do
        sender = current_user

        chat_room = nil

        ActiveRecord::Base.transaction do
          if params[:chat_room_id]
            chat_room = ChatRoom.find_by(id: params[:chat_room_id])
            error!({ message: 'Chat room not found' }, 404) unless chat_room

            error!({ message: 'You are not a member of this chat room' }, 403) unless chat_room.chat_room_members.exists?(user_id: sender.id)
          else
            receiver = User.find_by(id: params[:receiver_id])
            error!({ message: 'Receiver not found' }, 404) unless receiver

            chat_room = ChatRoom
                        .joins(:chat_room_members)
                        .where(room_type: :direct)
                        .where(chat_room_members: { user_id: [sender.id, receiver.id] })
                        .group('chat_rooms.id')
                        .having('COUNT(DISTINCT chat_room_members.user_id) = 2')
                        .first

            unless chat_room
              chat_room = ChatRoom.create!(
                room_type: :direct,
                chatroom_location: sender
              )
              chat_room.chat_room_members.create!(user_id: sender.id)
              chat_room.chat_room_members.create!(user_id: receiver.id)
            end
          end

          message = chat_room.messages.create!(
            user: sender,
            content: params[:content],
            message_type: params[:message_type] || 1
          )

          present_response(data_payload: message, data_entity: Entities::Message)
        end
      rescue ActiveRecord::RecordInvalid => e
        error!({ message: e.record.errors.full_messages.join(', ') }, 422)
      end

      desc 'Soft delete a message'
      params do
        requires :id, type: Integer, desc: 'ID of the message to delete'
      end
      delete ':id' do
        message = Message.find_by(id: params[:id])
        error!({ message: I18n.t('messages.not_found') }, 404) unless message
        error!({ message: I18n.t('messages.already_deleted') }, 400) if message.deleted?
        error!({ message: I18n.t('messages.unauthorized') }, 403) unless message.user_id == current_user.id

        message.soft_delete

        present_response(message: I18n.t('messages.deleted_success'))
      rescue StandardError => e
        error!({ message: I18n.t("shared.messages.internal_server_error"), detail: e.message }, 500)
      end

      desc I18n.t('messages.get_all.desc')
      params do
        requires :chat_room_id, type: Integer, desc: I18n.t('messages.get_all.params.chat_room_id')
      end

      get do
        chat_room = ChatRoom.find_by(id: params[:chat_room_id])
        error!({ message: I18n.t('chat_rooms.not_found') }, 404) unless chat_room
        error!({ message: I18n.t('chat_rooms.unauthorized_access') }, 403) unless chat_room.chat_room_members.exists?(user_id: current_user.id)

        messages = chat_room.messages
                .preload(user: :profile)
                .order(created_at: :asc)

        present_response(
          data_payload: messages,
          data_entity: Entities::Message,
          options: { current_user_id: current_user.id }
        )
      rescue StandardError => e
        error!({ message: I18n.t("shared.messages.internal_server_error"), detail: e.message }, 500)
      end
    end
  end
end
