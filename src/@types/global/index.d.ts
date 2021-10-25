export {};

declare global {
  namespace Express {
    export interface Request {
      user?: {
        sub: string;
      };
    }
  }
}
