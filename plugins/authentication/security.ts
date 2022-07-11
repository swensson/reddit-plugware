import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'

/**
 * Security utils
 */

if (!process.env.JWT_SECRET) {
  throw new Error('process.env.JWT_SECRET is not provided')
}

if (!process.env.HASH_FUNC) {
  throw new Error('process.env.HASH_FUNC is not provided')
}

export const createJWT = <T extends object>(data: T) => {
  return jwt.sign(data, process.env.JWT_SECRET as string);
};

export const readJWT = <T extends object>(token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as T;
};

export const createUUID = () => {
  return uuid();
};

export const generateSalt = () => {
  return crypto.randomBytes(128).toString('base64');
};

export const getPasswordHash = async (password: string, salt: string, iterations: number) => {
  return crypto.pbkdf2Sync(password, salt, iterations, 512, process.env.HASH_FUNC as string).toString('hex');
};
