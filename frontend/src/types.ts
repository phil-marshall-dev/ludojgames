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

export type ISession = {
  userId: number;
  username: string;
  isAuthenticated: boolean;
}

export type IUser = {
  id: number;
  username: string;
}

export type IChallenge = {
  id: number;
  createdAt: string;
  userId: number;
  username: string;
}

export interface IAxiosErrorResponse {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export type IProfileDetail = {
  user: {
    id: number
    username: string
  };
  recentGames: IGameDetail[];
}

export interface IChatMessage {
  id: number;
  text: string;
  author: IUser;
  createdAt: string;
}

// game stuff
export interface IGameDetailMove {
  value: string;
  number: number;
  player: '1' | '2';
}

export interface IGameDetail {
  id: string;
  player_1: IUser;
  player_2: IUser;
  creator: IUser;
  createdAt: string;
  inProgress: boolean;
  result: string;
  moves: IGameDetailMove[]
}

export type ICellValue = 'X' | 'O' | null;

export type IMove = 'A1' | 'A2' | 'A3' | 'B1' | 'B2' | 'B3' | 'C1' | 'C2' | 'C3' | null;

export type IGameStatus = '1' | '2' | '1+' | '2+' | '1R' | '2R' | 'D';

export type IGameResult = '1+' | '2+' | '1R' | '2R' | 'D'

export interface IGameState {
  board: ICellValue[];
  move: IMove;
  turn: number;
  status: IGameStatus;
} 

export type IGame = {
  gameStateList: IGameState[];
  gameResult: IGameResult;
}