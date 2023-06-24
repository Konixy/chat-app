export type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export interface CreateUsernameVariables {
  username: string;
}
