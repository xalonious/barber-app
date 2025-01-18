import jwt from 'jsonwebtoken';
import type { Secret, SignOptions, VerifyOptions, JwtPayload } from 'jsonwebtoken';
import config from 'config';
import type { Customer } from '@prisma/client'; 

const JWT_SECRET = config.get<string>('auth.jwt.secret');
const JWT_AUDIENCE = config.get<string>('auth.jwt.audience');
const JWT_ISSUER = config.get<string>('auth.jwt.issuer');
const JWT_EXPIRATION_INTERVAL = config.get<number>('auth.jwt.expirationInterval');

const signJWT = (payload: object, secretOrPrivateKey: Secret, options?: SignOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretOrPrivateKey, options || {}, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token as string);
      }
    });
  });
};

const verifyJWT = (token: string, secretOrPublicKey: Secret, options?: VerifyOptions): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, options || {}, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as JwtPayload);
      }
    });
  });
};

export const generateJWT = async (customer: Customer): Promise<string> => {
  const payload = {
    id: customer.customerId,
    email: customer.email,
    name: customer.name,
  };

  const options: SignOptions = {
    expiresIn: JWT_EXPIRATION_INTERVAL,
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
    subject: customer.customerId.toString(),
  };

  return signJWT(payload, JWT_SECRET, options);
};

export const verifyJWTToken = async (token: string): Promise<JwtPayload> => {
  const options: VerifyOptions = {
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
  };

  return verifyJWT(token, JWT_SECRET, options);
};
