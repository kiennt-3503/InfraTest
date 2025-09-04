require 'net/http'
require 'uri'
require 'json'

class SlackNotifier
  def self.send(message)
    uri = URI("https://slack.com/api/chat.postMessage")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    req = Net::HTTP::Post.new(uri.path, {
      "Content-Type" => "application/json",
      "Authorization" => "Bearer #{ENV['SLACK_BOT_TOKEN']}"
    })

    req.body = {
      channel: ENV['SLACK_CHANNEL_ID'],
      text: message
    }.to_json

    response = http.request(req)
    Rails.logger.info("[SlackNotifier] Sent message successfully")
		body = JSON.parse(response.body)
  	body["ok"] == true
  rescue => e
    Rails.logger.error("[SlackNotifier] Error: #{e.message}")
  end

  def self.send_verification_code
    code = generate_code

		message = <<~TEXT
      🎉ようこそMAPAPPへ！

      アカウント登録のため、以下の認証コードをご利用ください：

      🔐 認証コード: #{code}

      ご不明な点がございましたら、お気軽にお問い合わせください。
    TEXT


		if send(message)
      VerifyCode.where("expired_at > ?", Time.current).find_each do |verify_code|
        verify_code.update(expired_at: Time.current)
      end
			VerifyCode.create!(
				code: code,
			)

   		Rails.logger.info("[SlackNotifier] New code saved")
		end
  end

	def self.generate_code(length = 6)
		charset = [('A'..'Z'), ('a'..'z'), ('0'..'9')].map(&:to_a).flatten
		Array.new(length) { charset.sample }.join
	end
end
