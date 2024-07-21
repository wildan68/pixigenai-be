import { UsersAttributes } from './types.d.js';
export {}

declare global {
  namespace Express {
    interface Request {
      user: UsersAttributes;
    }
  }
}