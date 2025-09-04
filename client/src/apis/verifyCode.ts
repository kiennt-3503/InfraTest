import { GET } from "@/lib/api";
import { LinkVerifyCodeResponse } from "@/types/verifyCode";

export const getLinkVerifyCode = () =>
  GET<LinkVerifyCodeResponse>("/api/v1/verify_codes/link_verify_code");
