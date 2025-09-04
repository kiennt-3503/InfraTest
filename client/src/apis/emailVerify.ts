import { POST } from "@/lib/api";
import { EmailVerifyBody, EmailVerifyResponse } from "@/types/verifyEmail";

export const verifyEmail = (body: EmailVerifyBody) =>
  POST<EmailVerifyResponse, EmailVerifyBody>(
    "/api/v1/email_verification",
    body
  );
