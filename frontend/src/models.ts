export type ILoginCredentials = {
    username: string;
    password: string;
}

export type IRegisterCredentials = {
    username: string;
    password1: string;
    password2: string;
    email: string;
}

export type ITodo = {
    text: string;
    id: string;
}

export type ISession = {
  userId: number;
  username: string;
  isAuthenticated: boolean;
}
export interface IAxiosErrorResponse {
    response?: {
      data?: {
        error?: string;
      };
    };
  }