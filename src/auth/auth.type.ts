import { User } from "src/user/user.entity";

export type IAccessTokenPayload = {
  sub: number;
  identifier: string;
};

export type IJwtConfig = {
  secret: string;
  expiresIn: string;
};

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthTokensAndUser extends IAuthTokens {
  user: Omit<User, 'password'>
  accessToken: string
  refreshToken: string
}