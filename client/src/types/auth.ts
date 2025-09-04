export interface LoginBody {
  username: string;
  password: string;
}

export interface SignUpBody {
  username: string;
  email?: string;
  password: string;
  password_confirmation: string;
  verify_code: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  profile: {
    avatar_settings: {
      avatar_content: string;
      bg_color: string;
      text_color: string;
    } | null;
  }
}

export interface UserInfo {
  user: UserResponse;
  token: string;
  is_verify: boolean;
}

export interface AuthResponse extends UserInfo {
  token: string;
}
