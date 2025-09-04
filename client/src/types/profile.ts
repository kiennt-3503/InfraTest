export interface BasicInfoBody {
  profile: {
    fullname?: string | undefined;
    fullname_kana?: string | undefined;
    phone?: string | undefined;
    bio?: string | undefined;
    gender?: number | undefined;
    birthday?: string | undefined;
    avatar_settings?: {
      avatar_content: string | undefined;
      bg_color: string | undefined;
      text_color: string | undefined;
    };
  };
}

export interface BasicInfoResponse {
  id: string;
  username?: string;
  email?: string;
  fullname?: string;
  fullname_kana?: string;
  phone?: string;
  bio?: string;
  mbti?: string;
  gender?: number;
  birthday?: string;
  avatar_settings?: {
    avatar_content: string;
    bg_color: string;
    text_color: string;
  };
}
