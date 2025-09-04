class PushNotificationService
	def self.send_new_member_notification(chat_room:, new_user:)
		chat_room.users.where.not(id: new_user.id).each do |user|
			user.push_subscriptions.each do |subscription|
				begin
					WebPush.payload_send(
						message: {
							title: "#{chat_room.room_name}チャットルーム",
							body: "新メンバーが参加しました。"
						}.to_json,
						endpoint: subscription.endpoint,
						p256dh: subscription.p256dh,
						auth: subscription.auth,
						vapid: {
							subject: "mailto:sender@example.com",
							public_key: ENV['VAPID_PUBLIC_KEY'],
							private_key: ENV['VAPID_PRIVATE_KEY']
						}
					)
				rescue => e
					Rails.logger.error("Webpush error for user #{user.id}: #{e.message}")
				end
			end
		end
	end
end
  