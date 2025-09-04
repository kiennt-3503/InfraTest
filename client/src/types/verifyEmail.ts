export type EmailVerifyBody = {
  id_token: string;
  username: string;
};

export type EmailVerifyResponse = {
  user: {
    id: number;
    email: string;
    name?: string;
  };
  token: string;
};
