class Api::V1::ChatRoomsController < Api::V1::BaseController
  before_action :find_chat_room, only: :members
  def members
    pagy, members = pagy(@chat_room.users.select(:id, :username), limit: Settings.digit_10)
    render json: {
      chat_room_id: @chat_room.id,
      chat_room_name: @chat_room.room_name,
      isJoined: user_joined?(members),
      members: members,
      pagy: {
        page: pagy.page,
        items: pagy.limit,
        count: pagy.count,
        pages: pagy.pages,
        next: pagy.next,
        prev: pagy.prev
      }
    }
  end

  private

  def find_chat_room
    render json: { message: "Chat room ID is missing" }, status: :bad_request and return if params[:id].blank?

    @chat_room = ChatRoom.find_by(id: params[:id])

    return if @chat_room

    render json: { message: "Chat room not found" }, status: :not_found and return
  end

  def user_joined?(members)
    members.any? { |m| m[:id] == current_user.id }
  end
end
