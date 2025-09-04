module Entities
  class EmailVerification < Grape::Entity
    expose :message, documentation: { type: String, desc: "Verification success message" }
    expose :email, documentation: { type: String, desc: "Verified user email" }
  end
end
