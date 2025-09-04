export interface User {
  id: number;
  username: string;
  email: string;
  profile: {
    avatarSettings: {
      avatarContent: string;
      bgColor: string;
      textColor: string;
    } | null;
  }
}
