export enum TokenType {
  OAUTH,
  OTHER
}

export class Token {
  token: string;
  refreshToken?: string;
  start: Date;
  end: Date;
  time: number;
  tokenType: TokenType;
}

export class IdentityUser {
  mongoId?: string;
  name?: string;
  username: string;
  token: Token;
  roles: Array<string>;
}
