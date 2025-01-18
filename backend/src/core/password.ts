import argon2 from 'argon2';
import config from 'config';

export const hashPassword = async (password: string): Promise<string> => {
  return argon2.hash(password, {
    type: argon2.argon2id,
    hashLength: config.get<number>('auth.argon.hashLength'),
    timeCost: config.get<number>('auth.argon.timeCost'),
    memoryCost: config.get<number>('auth.argon.memoryCost'),
  });
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  if (!hash || typeof hash !== 'string') {
    throw new Error('Password hash is missing or invalid');
  }

  return argon2.verify(hash, password);
};
